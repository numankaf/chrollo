import { CONNECTION_STATUS, type ConnectionStatus } from '@/types/connection';

export function getConnectionButtonVariant(status: ConnectionStatus | undefined): {
  variant: 'error-bordered-ghost' | 'success-bordered-ghost' | 'warn-bordered-ghost' | 'outline';
} {
  switch (status) {
    case CONNECTION_STATUS.CONNECTED:
      return {
        variant: 'success-bordered-ghost',
      };
    case CONNECTION_STATUS.CLOSED:
    case CONNECTION_STATUS.DISCONNECTED: {
      return {
        variant: 'error-bordered-ghost',
      };
    }
    case CONNECTION_STATUS.ERROR:
      return {
        variant: 'warn-bordered-ghost',
      };

    case CONNECTION_STATUS.DEACTIVATED:
    default:
      return {
        variant: 'outline',
      };
  }
}
