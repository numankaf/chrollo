import { CircleOff } from 'lucide-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/common/empty';

function NoRecentItemFound() {
  return (
    <Empty className="p-3!">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleOff size={30} />
        </EmptyMedia>
        <EmptyTitle>No recent item found</EmptyTitle>
        <EmptyDescription>Your recently viewed items will appear here.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default NoRecentItemFound;
