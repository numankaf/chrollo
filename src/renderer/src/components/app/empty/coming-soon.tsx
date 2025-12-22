import { ClockFading } from 'lucide-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/common/empty';

function ComingSoon() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ClockFading size={30} />
        </EmptyMedia>
        <EmptyTitle>Coming Soon</EmptyTitle>
        <EmptyDescription>This feature is currently not avaliable</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default ComingSoon;
