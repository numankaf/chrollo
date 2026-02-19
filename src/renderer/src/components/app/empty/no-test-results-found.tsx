import { FlaskConicalOff } from 'lucide-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/common/empty';

function NoTestResultsFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FlaskConicalOff size={30} />
        </EmptyMedia>
        <EmptyTitle>There are no tests for this request</EmptyTitle>
        <EmptyDescription>Add post-response tests to this request to see the results here.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default NoTestResultsFound;
