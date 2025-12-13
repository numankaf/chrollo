import { TIME_FORMAT_HH_MM_SS_MMM } from '@/constants/date-constants';
import ConnectionStatusBadge from '@/features/connections/components/common/connection-status-badge';

import { type SocketMessage } from '@/types/socket';
import { useConnectionMessages } from '@/hooks/socket/use-connection-messages';
import { useActiveItem } from '@/hooks/use-active-item';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/common/accordion';
import { ScrollArea } from '@/components/common/scroll-area';
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
  const messages = useConnectionMessages(activeConnection?.id);

  return (
    <div className="h-full">
      <header className="flex items-center justify-between p-1 h-8">
        <p>Response Console</p>
        {activeConnection && <ConnectionStatusBadge connectionId={activeConnection.id} showLabel />}
      </header>
      <ScrollArea className="h-full">
        <Accordion type="multiple" className="w-full px-4">
          {messages.map((message) => (
            <ConsoleMessage key={message.id} message={message} />
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}

export default SocketMessageConsole;
