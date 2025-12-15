import {
  ArrowDownFromLine,
  ArrowUpFromLine,
  Bell,
  BellOff,
  CircleCheck,
  CircleX,
  Info,
  TriangleAlert,
} from 'lucide-react';

import type { IconProps } from '@/types/common';
import { SOCKET_MESSAGE_TYPE, type SocketMessageType } from '@/types/socket';
import { cn } from '@/lib/utils';

interface SocketConsoleMessageIconProps extends IconProps {
  messageType: SocketMessageType;
}

export function SocketConsoleMessageIcon({ messageType, className, ...props }: SocketConsoleMessageIconProps) {
  switch (messageType) {
    case SOCKET_MESSAGE_TYPE.SENT:
      return <ArrowUpFromLine className={cn('bg-amber-500/10 text-amber-500 rounded-xs', className)} {...props} />;

    case SOCKET_MESSAGE_TYPE.RECEIVED:
      return <ArrowDownFromLine className={cn('bg-sky-600/10 text-sky-600 rounded-xs', className)} {...props} />;

    case SOCKET_MESSAGE_TYPE.CONNECTED:
      return <CircleCheck className={cn('text-green-600', className)} {...props} />;

    case SOCKET_MESSAGE_TYPE.ERROR:
      return <TriangleAlert className={cn('text-yellow-600', className)} {...props} />;

    case SOCKET_MESSAGE_TYPE.EVENT:
      return <Info className={cn('text-blue-600', className)} {...props} />;

    case SOCKET_MESSAGE_TYPE.DISCONNECTED:
      return <CircleX className={cn('text-destructive', className)} {...props} />;

    case SOCKET_MESSAGE_TYPE.SUBSCRIBED:
      return <Bell className={cn('text-indigo-500', className)} {...props} />;

    case SOCKET_MESSAGE_TYPE.UNSUBSCRIBED:
      return <BellOff className={cn('text-gray-600', className)} {...props} />;

    default:
      return <></>;
  }
}
