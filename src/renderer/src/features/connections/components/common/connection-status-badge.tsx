import useConnectionStatusStore from '@/store/connection-status-store';

import { CONNECTION_STATUS } from '@/types/connection';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/common/badge';

type ConnectionStatusBadgeProps = React.ComponentProps<'span'> & { asChild?: boolean } & {
  connectionId: string;
  showLabel?: boolean;
};

function ConnectionStatusBadge({ connectionId, showLabel = false, className, ...props }: ConnectionStatusBadgeProps) {
  const status = useConnectionStatusStore((s) => s.statuses[connectionId]);
  function getBadgeProps(): {
    variant: 'error-bordered-ghost' | 'success-bordered-ghost' | 'warn-bordered-ghost' | 'secondary-bordered-ghost';
    icon: React.ReactNode;
    label: string;
  } {
    switch (status) {
      case CONNECTION_STATUS.CONNECTED:
        return {
          variant: 'success-bordered-ghost',
          icon: <span className="size-2 rounded-full bg-green-600 dark:bg-green-400" aria-hidden="true" />,
          label: 'Connected',
        };
      case CONNECTION_STATUS.CLOSED:
      case CONNECTION_STATUS.DISCONNECTED: {
        return {
          variant: 'error-bordered-ghost',
          icon: <span className="size-2 rounded-full bg-red-600 dark:bg-red-400" aria-hidden="true" />,
          label: 'Disconnected',
        };
      }
      case CONNECTION_STATUS.ERROR:
        return {
          variant: 'warn-bordered-ghost',
          icon: <span className="size-2 rounded-full bg-amber-600 dark:bg-amber-400" aria-hidden="true" />,
          label: 'Error',
        };

      case CONNECTION_STATUS.DEACTIVATED:
      default:
        return {
          variant: 'secondary-bordered-ghost',
          icon: (
            <span className="size-2 rounded-full bg-accent-foreground dark:bg-accent-foreground" aria-hidden="true" />
          ),
          label: 'Connect',
        };
    }
  }
  const { variant, icon, label } = getBadgeProps();
  return (
    <Badge
      className={cn('border-none w-5 h-5 p-0!', showLabel && 'w-auto p-2!', className)}
      variant={variant}
      {...props}
    >
      {icon}
      {showLabel && label}
    </Badge>
  );
}

export default ConnectionStatusBadge;
