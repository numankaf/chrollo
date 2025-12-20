import { useEffect, useRef, useState } from 'react';
import { TIME_FORMAT_HH_MM_SS_MMM } from '@/constants/date-constants';
import ConnectionStatusBadge from '@/features/connections/components/common/connection-status-badge';
import { useAppConfigStore } from '@/store/app-config-store';
import useConnectionStatusStore from '@/store/connection-status-store';
import useSocketMessageStatusStore from '@/store/socket-message-store';
import { getConnectionButtonVariant } from '@/utils/connection-util';
import { formatCode } from '@/utils/editor-util';
import { applyTextSearch } from '@/utils/search-util';
import { getMessageContentType } from '@/utils/socket-message-util';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Trash2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { REQUEST_BODY_TYPE, type RequestBodyType } from '@/types/collection';
import { COMMANDS } from '@/types/command';
import { SOCKET_MESSAGE_TYPE, type SocketMessage } from '@/types/socket';
import { commandBus } from '@/lib/command-bus';
import { deepParseJson } from '@/lib/utils';
import { useActiveItem } from '@/hooks/app/use-active-item';
import useDebouncedValue from '@/hooks/common/use-debounced-value';
import { useConnectionMessages } from '@/hooks/socket/use-connection-messages';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/common/accordion';
import { Button } from '@/components/common/button';
import { ScrollArea } from '@/components/common/scroll-area';
import { SearchBar } from '@/components/common/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/select';
import CodeEditor from '@/components/app/editor/code-editor';
import NoActiveConnectionFound from '@/components/app/empty/no-active-connection-found';
import NoResultsFound from '@/components/app/empty/no-results-found';
import NoSocketMessageFound from '@/components/app/empty/no-socket-message-found';
import { SocketConsoleMessageIcon } from '@/components/icon/socket-console-message-icon';

function SentAndReceivedMessageContent({ message }: { message: SocketMessage }) {
  const { applicationSettings } = useAppConfigStore(
    useShallow((state) => ({
      applicationSettings: state.applicationSettings,
    }))
  );
  const [bodyType, setBodyType] = useState<RequestBodyType>(getMessageContentType(message.meta?.headers));

  const parsedStringResponse = JSON.stringify(deepParseJson(message.data, applicationSettings.formatResponses));
  return (
    <div className="mt-1">
      <div>
        <Select
          value={bodyType}
          onValueChange={(value) => {
            setBodyType(value as RequestBodyType);
          }}
        >
          <SelectTrigger size="sm" className="text-sm h-6! w-22 ">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(REQUEST_BODY_TYPE).map((value) => (
              <SelectItem className="text-sm h-6 rounded-md" key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="mt-1 border rounded-lg" style={{ height: '12rem' }}>
        <CodeEditor bodyType={bodyType} value={formatCode(bodyType, parsedStringResponse)} readOnly />
      </ScrollArea>
    </div>
  );
}

function ConsoleMessageContent({ message }: { message: SocketMessage }) {
  switch (message.type) {
    case SOCKET_MESSAGE_TYPE.SENT:
    case SOCKET_MESSAGE_TYPE.RECEIVED:
      return <SentAndReceivedMessageContent message={message} />;

    case SOCKET_MESSAGE_TYPE.EVENT:
      return (
        <ScrollArea className="mt-1 border rounded-lg" style={{ height: '12rem' }}>
          <CodeEditor
            bodyType={REQUEST_BODY_TYPE.JSON}
            value={formatCode(REQUEST_BODY_TYPE.JSON, message.data)}
            readOnly
          />
        </ScrollArea>
      );

    case SOCKET_MESSAGE_TYPE.SUBSCRIBED:
      return (
        <div className="m-2">
          Subscription to topic<span className="font-semibold"> {message.meta?.headers?.['destination']}</span> with id
          <span className="font-semibold"> {message.meta?.headers?.['id']}</span> was initialized successfully.
        </div>
      );

    case SOCKET_MESSAGE_TYPE.UNSUBSCRIBED:
      return (
        <div className="m-2">
          Subscription to topic<span className="font-semibold"> {message.meta?.headers?.['destination']}</span> with id
          <span className="font-semibold"> {message.meta?.headers?.['id']}</span> was removed successfully.
        </div>
      );

    case SOCKET_MESSAGE_TYPE.CONNECTED:
      return (
        <div className="m-2">
          Connection with id <span className="font-semibold"> {message.connectionId}</span> was established
          successfully.
        </div>
      );

    case SOCKET_MESSAGE_TYPE.DISCONNECTED:
      return (
        <div className="m-2">
          Connection with id <span className="font-semibold"> {message.connectionId}</span> was closed successfully.
        </div>
      );
    default:
      return <div className="m-2">{message.data}</div>;
  }
}

function ConsoleMessage({ message }: { message: SocketMessage }) {
  return (
    <AccordionItem value={message.id.toString()}>
      <AccordionTrigger className="rounded-xs hover:bg-secondary hover:no-underline p-0 px-2 [&>svg]:h-full">
        <div className="p-2.5 flex w-full items-center gap-4 ">
          <SocketConsoleMessageIcon messageType={message.type} size={18} />
          <span className="flex-1 truncate w-0">{message.data}</span>
          <span className="text-muted-foreground min-w-20 text-end">
            {new Date(message.timestamp).toLocaleTimeString([], TIME_FORMAT_HH_MM_SS_MMM)}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-3">
        <ConsoleMessageContent message={message} />
      </AccordionContent>
    </AccordionItem>
  );
}

function SocketMessageConsole() {
  const { activeConnection } = useActiveItem();
  const status = useConnectionStatusStore((s) => (activeConnection ? s.statuses[activeConnection.id] : undefined));

  const { clearMessages } = useSocketMessageStatusStore(
    useShallow((state) => ({
      clearMessages: state.clearMessages,
    }))
  );

  const messages = useConnectionMessages(activeConnection?.id);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue<string>(search, 300);

  const filteredMessages = applyTextSearch(messages, debouncedSearch, (message) => message.data);
  const { variant } = getConnectionButtonVariant(status);

  const parentRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: filteredMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const unsubscribeClearRequestConsole = commandBus.on(COMMANDS.CLEAR_REQUEST_CONSOLE, () => {
      if (activeConnection) clearMessages(activeConnection?.id);
    });

    return () => {
      unsubscribeClearRequestConsole?.();
    };
  }, [activeConnection, clearMessages]);

  return (
    <div className="h-full">
      <header className="flex items-center justify-between p-1 h-8">
        <div className="flex items-center gap-2">
          <p>Response Console: </p>
          <Button variant={variant} size="2xs" className="rounded-md text-sm pointer-events-none">
            {activeConnection?.name || 'No Active Connection'}
          </Button>
        </div>
        {activeConnection && <ConnectionStatusBadge connectionId={activeConnection.id} showLabel />}
      </header>
      {!activeConnection && <NoActiveConnectionFound />}
      {activeConnection && (
        <>
          <header className="flex items-center gap-2 py-2 h-8 px-4">
            <SearchBar
              placeholder="Search messages"
              className="flex-1 max-w-60"
              onSearchChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearMessages(activeConnection?.id);
              }}
            >
              <Trash2 />
              Clear Messages
            </Button>
          </header>
          <ScrollArea viewportRef={parentRef} style={{ height: 'calc(100% - 4rem)' }}>
            <Accordion
              type="multiple"
              className="w-full max-w-full relative"
              style={{ height: virtualizer.getTotalSize() }}
            >
              {messages.length === 0 && <NoSocketMessageFound />}
              {messages.length !== 0 && filteredMessages.length === 0 && (
                <NoResultsFound searchTerm={debouncedSearch} />
              )}
              <div
                className="px-4 w-full absolute top-0 left-0"
                style={{
                  transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
                }}
              >
                {virtualItems.map((virtualRow) => (
                  <div
                    className="border-b"
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                  >
                    <ConsoleMessage key={virtualRow.index} message={filteredMessages[virtualRow.index]} />
                  </div>
                ))}
              </div>
            </Accordion>
          </ScrollArea>
        </>
      )}
    </div>
  );
}

export default SocketMessageConsole;
