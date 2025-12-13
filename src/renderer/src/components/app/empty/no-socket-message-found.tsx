import { MessageSquareX } from 'lucide-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/common/empty';

function NoSocketMessageFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageSquareX size={30} />
        </EmptyMedia>
        <EmptyTitle>No messages yet</EmptyTitle>
        <EmptyDescription>Establish a connection to send and receive messages.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default NoSocketMessageFound;
