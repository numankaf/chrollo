import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/common/empty';
import { WaypointsOff } from '@/components/icon/waypoints-off-icon';

function NoConnectionFound() {
  return (
    <Empty className="p-3!">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <WaypointsOff size={30} />
        </EmptyMedia>
        <EmptyTitle>No connections yet</EmptyTitle>
        <EmptyDescription>Set up your first connection to explore live WebSocket messages and events.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default NoConnectionFound;
