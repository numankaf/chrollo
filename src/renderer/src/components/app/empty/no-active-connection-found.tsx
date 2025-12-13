import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/common/empty';
import { WaypointsOff } from '@/components/icon/waypoints-off-icon';

function NoActiveConnectionFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <WaypointsOff size={30} />
        </EmptyMedia>
        <EmptyTitle>No active connection</EmptyTitle>
        <EmptyDescription>Choose a connection from the connection selector to inspect messages.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default NoActiveConnectionFound;
