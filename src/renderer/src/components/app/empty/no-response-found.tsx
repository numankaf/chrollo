import { MessageSquareX } from 'lucide-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/common/empty';

function NoResponseFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageSquareX size={30} />
        </EmptyMedia>
        <EmptyTitle>No response found</EmptyTitle>
        <EmptyDescription>Click Send to get a response</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default NoResponseFound;
