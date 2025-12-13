import { useState } from 'react';
import { TIME_FORMAT_HH_MM_SS_MMM } from '@/constants/date-constants';
import ConnectionStatusBadge from '@/features/connections/components/common/connection-status-badge';
import useConnectionStatusStore from '@/store/connection-status-store';
import useSocketMessageStatusStore from '@/store/socket-message-store';
import { getConnectionButtonVariant } from '@/utils/connection-util';
import { applyTextSearch } from '@/utils/search-util';
import { Trash2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { type SocketMessage } from '@/types/socket';
import { useActiveItem } from '@/hooks/app/use-active-item';
import useDebouncedValue from '@/hooks/common/use-debounced-value';
import { useConnectionMessages } from '@/hooks/socket/use-connection-messages';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/common/accordion';
import { Button } from '@/components/common/button';
import { ScrollArea } from '@/components/common/scroll-area';
import { SearchBar } from '@/components/common/search-input';
import NoActiveConnectionFound from '@/components/app/empty/no-active-connection-found';
import NoResultsFound from '@/components/app/empty/no-results-found';
import NoSocketMessageFound from '@/components/app/empty/no-socket-message-found';
import { SocketConsoleMessageIcon } from '@/components/icon/socket-console-message-icon';

function ConsoleMessage({ message }: { message: SocketMessage }) {
  return (
    <AccordionItem value={message.id.toString()}>
      <AccordionTrigger className="cursor-pointer rounded-xs hover:bg-secondary hover:no-underline p-0 px-2 [&>svg]:h-full">
        <div className="p-2.5 flex w-full items-center gap-4 ">
          <SocketConsoleMessageIcon messageType={message.type} size={16} />
          <span className="flex-1 truncate w-0">{message.data}</span>
          <span className="text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString([], TIME_FORMAT_HH_MM_SS_MMM)}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>{message.data}</AccordionContent>
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

  return (
    <div className="h-full">
      <header className="flex items-center justify-between p-1 h-8">
        <div className="flex items-center gap-2">
          <p>Response Console: </p>
          <Button variant={variant} size="2xs" className="text-sm pointer-events-none">
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
          <ScrollArea style={{ height: 'calc(100% - 4rem)' }}>
            <Accordion type="multiple" className="w-full px-4">
              {messages.length === 0 && <NoSocketMessageFound />}
              {messages.length !== 0 && filteredMessages.length === 0 && (
                <NoResultsFound searchTerm={debouncedSearch} />
              )}
              {filteredMessages.map((message) => (
                <ConsoleMessage key={message.id} message={message} />
              ))}
            </Accordion>
          </ScrollArea>
        </>
      )}
    </div>
  );
}

export default SocketMessageConsole;
