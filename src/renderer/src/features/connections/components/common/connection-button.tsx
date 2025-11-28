import useStompStatusStore from '@/store/stomp-status-store';
import { CircleAlert, CircleCheck, Loader2Icon, RotateCcw, Send } from 'lucide-react';

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
  const status = useStompStatusStore((s) => s.statuses[connection.id]);

  function getButtonProps(): {
    disabled: boolean;
    label: string;
    onClick: (() => void) | undefined;
    variant:
      | 'default'
      | 'error-bordered-ghost'
      | 'success-bordered-ghost'
      | 'info-bordered-ghost'
      | 'warn-bordered-ghost'
      | 'primary-bordered-ghost';
    icon: React.ReactNode;
  } {
    switch (status) {
      case CONNECTION_STATUS.CONNECTED:
        return {
          disabled: false,
          label: 'Disconnect',
          onClick: () => onDisconnect(connection.id),
          variant: 'success-bordered-ghost',
          icon: <CircleCheck />,
        };

      case CONNECTION_STATUS.DISCONNECTED: {
        return {
          disabled: false,
          label: 'Reconnect',
          onClick: () => onConnect(connection),
          variant: 'error-bordered-ghost',
          icon: <RotateCcw />,
        };
      }
      case CONNECTION_STATUS.CLOSED:
        return {
          disabled: false,
          label: 'Cancel',
          onClick: () => onDisconnect(connection.id),
          variant: 'error-bordered-ghost',
          icon: <Loader2Icon className="animate-spin" />,
        };
      case CONNECTION_STATUS.ERROR:
        return {
          disabled: false,
          label: 'Retry',
          onClick: () => onConnect(connection),
          variant: 'warn-bordered-ghost',
          icon: <CircleAlert />,
        };

      case CONNECTION_STATUS.DEACTIVATED:
      default:
        return {
          disabled: false,
          label: 'Connect',
          onClick: () => onConnect(connection),
          variant: 'primary-bordered-ghost',
          icon: <Send />,
        };
    }
  }

  const { label, variant, icon, onClick, disabled } = getButtonProps();

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
