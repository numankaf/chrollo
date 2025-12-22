import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/common/empty';
import { LibraryBigOff } from '@/components/icon/library-big-off';

function NoCollectionFound() {
  return (
    <Empty className="p-3!">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LibraryBigOff size={30} />
        </EmptyMedia>
        <EmptyTitle>No collections yet</EmptyTitle>
        <EmptyDescription>
          Create your first environment to keep connections and configurations organized.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default NoCollectionFound;
