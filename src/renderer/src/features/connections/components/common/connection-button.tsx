import useConnectionStatusStore from '@/store/connection-status-store';
import { getConnectionButtonVariant } from '@/utils/connection-util';
import { CircleCheck, Loader2Icon, Send } from 'lucide-react';

import { CONNECTION_STATUS, type Connection } from '@/types/connection';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/button';

type ConnectionButtonProps = React.ComponentProps<'button'> & {
  asChild?: boolean;
} & {
  connection: Connection;
  onConnect: (connection: Connection) => void;
  onDisconnect: (connectionId: string) => void;
};

function ConnectionButton({
  connection,
  onConnect,
  onDisconnect,
  type = 'button',
  className,
  ...props
}: ConnectionButtonProps) {
  const status = useConnectionStatusStore((s) => s.statuses[connection.id]);

  function getButtonProps(): {
    disabled: boolean;
    label: string;
    onClick: (() => void) | undefined;
    icon: React.ReactNode;
  } {
    switch (status) {
      case CONNECTION_STATUS.CONNECTED:
        return {
          disabled: false,
          label: 'Disconnect',
          onClick: () => onDisconnect(connection.id),
          icon: <CircleCheck />,
        };

      case CONNECTION_STATUS.CLOSED:
        return {
          disabled: false,
          label: 'Cancel',
          onClick: () => onDisconnect(connection.id),
          icon: <Loader2Icon className="animate-spin" />,
        };

      case CONNECTION_STATUS.DISCONNECTED:
      default:
        return {
          disabled: false,
          label: 'Connect',
          onClick: () => onConnect(connection),
          icon: <Send />,
        };
    }
  }

  const { variant } = getConnectionButtonVariant(status);
  const { label, icon, onClick, disabled } = getButtonProps();

  return (
    <Button
      variant={variant}
      className={cn('w-28', className)}
      type={type}
      {...props}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
}

export default ConnectionButton;
