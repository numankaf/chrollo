import useCollectionItemStore from '@/store/collection-item-store';
import useConnectionStore from '@/store/connection-store';
import useEnvironmentStore from '@/store/environment-store';

import { BASE_MODEL_TYPE } from '@/types/base';

export const operationHandlers = {
  [BASE_MODEL_TYPE.CONNECTION]: {
    deleteItem: (id: string) => useConnectionStore.getState().deleteConnection(id),
  },
  [BASE_MODEL_TYPE.ENVIRONMENT]: {
    deleteItem: (id: string) => useEnvironmentStore.getState().deleteEnvironment(id),
  },
  [BASE_MODEL_TYPE.COLLECTION]: {
    deleteItem: (id: string) => useCollectionItemStore.getState().deleteCollectionItem(id),
  },
} as const;
