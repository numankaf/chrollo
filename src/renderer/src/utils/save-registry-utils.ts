import useConnectionStore from '@/store/connection-store';

import { BASE_MODEL_TYPE } from '@/types/base';
import type { Connection } from '@/types/connection';

export const saveHandlers = {
  [BASE_MODEL_TYPE.CONNECTION]: {
    get: (id: string) => useConnectionStore.getState().getConnection(id),
    save: (item: Connection) => useConnectionStore.getState().saveConnection(item),
  },
} as const;
