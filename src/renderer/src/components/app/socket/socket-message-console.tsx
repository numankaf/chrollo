import ConnectionStatusBadge from '@/features/connections/components/common/connection-status-badge';
import { HeadsetIcon, PackageIcon, RefreshCwIcon } from 'lucide-react';

import { useConnectionMessages } from '@/hooks/socket/use-connection-messages';
import { useActiveItem } from '@/hooks/use-active-item';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/common/accordion';
import { ScrollArea } from '@/components/common/scroll-area';

const items = [
  {
    icon: PackageIcon,
    title: 'How do I track my order?',
    content: `You can track your order by logging into your account and visiting the "Orders" section. You'll receive tracking information via email once your order ships. For real-time updates, you can also use the tracking number provided in your shipping confirmation email.`,
  },
  {
    icon: RefreshCwIcon,
    title: 'What is your return policy?',
    content:
      'We offer a 30-day return policy for most items. Products must be unused and in their original packaging. To initiate a return, please contact our customer service team or use the return portal in your account dashboard.',
  },
  {
    icon: HeadsetIcon,
    title: 'How can I contact customer support?',
    content:
      'Our customer support team is available 24/7. You can reach us via live chat, email at support@example.com, or by phone at 1-800-123-4567. For faster service, please have your order number ready when contacting us.',
  },
];

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
            <AccordionItem key={message.timestamp} value={message.timestamp.toString()}>
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
