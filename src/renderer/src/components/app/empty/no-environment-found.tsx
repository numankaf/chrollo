import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/common/empty';
import { Columns3CogOff } from '@/components/icon/columns-3-cog-off';

function NoEnvironmentFound() {
  return (
    <Empty className="p-3!">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Columns3CogOff size={30} />
        </EmptyMedia>
        <EmptyTitle>No environments yet</EmptyTitle>
        <EmptyDescription>
          Create your first environment to keep connections and configurations organized.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default NoEnvironmentFound;
