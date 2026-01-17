import { LayoutDashboard } from 'lucide-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/common/empty';

function NoWorkspaceFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LayoutDashboard size={30} />
        </EmptyMedia>
        <EmptyTitle>No workspaces yet</EmptyTitle>
        <EmptyDescription>
          Create your first workspace to start organizing your collections and environments.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default NoWorkspaceFound;
