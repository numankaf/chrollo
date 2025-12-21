import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/common/empty';
import { CableOff } from '@/components/icon/cable-off';

function NoInterceptionScriptsFound() {
  return (
    <Empty className="p-3!">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CableOff size={30} />
        </EmptyMedia>
        <EmptyTitle>No interception scripts yet</EmptyTitle>
        <EmptyDescription>
          Create your first interception script to intercept and modify Websocket connections and requests.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default NoInterceptionScriptsFound;
