import useConnectionStatusStore from '@/store/connection-status-store';
import { getConnectionButtonVariant } from '@/utils/connection-util';

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
    icon: React.ReactNode;
    label: string;
  } {
    switch (status) {
      case CONNECTION_STATUS.CONNECTED:
        return {
          icon: <span className="size-2 rounded-full bg-green-600 dark:bg-green-400" aria-hidden="true" />,
          label: 'CONNECTED',
        };
      case CONNECTION_STATUS.CLOSED: {
        return {
          icon: <span className="size-2 rounded-full bg-red-600 dark:bg-red-400" aria-hidden="true" />,
          label: 'ERROR',
        };
      }

      case CONNECTION_STATUS.DISCONNECTED:
      default:
        return {
          icon: (
            <span className="size-2 rounded-full bg-accent-foreground dark:bg-accent-foreground" aria-hidden="true" />
          ),
          label: 'INACTIVE',
        };
    }
  }
  const { variant } = getConnectionButtonVariant(status);

  const { icon, label } = getBadgeProps();
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
