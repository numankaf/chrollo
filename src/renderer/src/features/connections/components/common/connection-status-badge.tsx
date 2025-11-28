import useStompStatusStore from '@/store/stomp-status-store';

import { CONNECTION_STATUS } from '@/types/connection';
import { Badge } from '@/components/common/badge';

type ConnectionStatusBadgeProps = React.ComponentProps<'span'> & { asChild?: boolean } & {
  connectionId: string;
};

function ConnectionStatusBadge({ connectionId, ...props }: ConnectionStatusBadgeProps) {
  const status = useStompStatusStore((s) => s.statuses[connectionId]);
  function getBadgeProps(): {
    variant: 'error-bordered-ghost' | 'success-bordered-ghost' | 'warn-bordered-ghost' | 'secondary-bordered-ghost';
    icon: React.ReactNode;
  } {
    switch (status) {
      case CONNECTION_STATUS.CONNECTED:
        return {
          variant: 'success-bordered-ghost',
          icon: <span className="size-2 rounded-full bg-green-600 dark:bg-green-400" aria-hidden="true" />,
        };
      case CONNECTION_STATUS.CLOSED:
      case CONNECTION_STATUS.DISCONNECTED: {
        return {
          variant: 'error-bordered-ghost',
          icon: <span className="size-2 rounded-full bg-red-600 dark:bg-red-400" aria-hidden="true" />,
        };
      }
      case CONNECTION_STATUS.ERROR:
        return {
          variant: 'warn-bordered-ghost',
          icon: <span className="size-2 rounded-full bg-amber-600 dark:bg-amber-400" aria-hidden="true" />,
        };

      case CONNECTION_STATUS.DEACTIVATED:
      default:
        return {
          variant: 'secondary-bordered-ghost',
          icon: (
            <span className="size-2 rounded-full bg-accent-foreground dark:bg-accent-foreground" aria-hidden="true" />
          ),
        };
    }
  }
  const { variant, icon } = getBadgeProps();
  return (
    <Badge className="border-none w-5 h-5 p-0!" variant={variant} {...props}>
      {icon}
    </Badge>
  );
}

export default ConnectionStatusBadge;
