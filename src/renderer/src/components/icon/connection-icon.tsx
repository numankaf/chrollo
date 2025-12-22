import type { IconProps } from '@/types/common';
import { CONNECTION_TYPE, type ConnectionType } from '@/types/connection';
import { SocketIoIcon } from '@/components/icon/socket-io-icon';
import { StompIcon } from '@/components/icon/stomp-icon';
import { WebSocketIcon } from '@/components/icon/websocket-icon';

interface ConnectionIconProps extends IconProps {
  connectionType: ConnectionType;
}

export function ConnectionIcon({ connectionType, ...props }: ConnectionIconProps) {
  switch (connectionType) {
    case CONNECTION_TYPE.RAW_WEBSOCKET:
      return <WebSocketIcon {...props} />;

    case CONNECTION_TYPE.STOMP:
      return <StompIcon {...props} />;

    case CONNECTION_TYPE.SOCKETIO:
      return <SocketIoIcon {...props} />;

    default:
      return <></>;
  }
}
