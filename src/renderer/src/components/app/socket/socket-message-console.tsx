import ConnectionStatusBadge from '@/features/connections/components/common/connection-status-badge';

import { useConnectionMessages } from '@/hooks/socket/use-connection-messages';
import { useActiveItem } from '@/hooks/use-active-item';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/common/accordion';
import { ScrollArea } from '@/components/common/scroll-area';

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
        <Accordion type="single" collapsible className="w-full px-4">
          {messages.map((message) => (
            <AccordionItem key={message.id} value={message.id.toString()}>
              <AccordionTrigger>
                <span className="flex items-center gap-4">
                  <span>{message.data}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>{message.data}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}

export default SocketMessageConsole;
