import useConnectionStore from '@/store/connection-store';
import useEnvironmentStore from '@/store/environment-store';

import { BASE_MODEL_TYPE } from '@/types/base';
import type { Connection } from '@/types/connection';
import type { Environment } from '@/types/environment';

export const saveHandlers = {
  [BASE_MODEL_TYPE.CONNECTION]: {
    get: (id: string) => useConnectionStore.getState().getConnection(id),
    save: (item: Connection) => useConnectionStore.getState().saveConnection(item),
  },
  [BASE_MODEL_TYPE.ENVIRONMENT]: {
    get: (id: string) => useEnvironmentStore.getState().getEnvironment(id),
    save: (item: Environment) => useEnvironmentStore.getState().saveEnvironment(item),
  },
} as const;
