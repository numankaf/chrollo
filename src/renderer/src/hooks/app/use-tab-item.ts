import useCollectionItemStore from '@/store/collection-item-store';
import useConnectionStore from '@/store/connection-store';
import useEnvironmentStore from '@/store/environment-store';
import useInterceptionScriptStore from '@/store/interception-script-store';
import useWorkspaceStore from '@/store/workspace-store';
import { useShallow } from 'zustand/react/shallow';

import { BASE_MODEL_TYPE } from '@/types/base';
import type { Tab } from '@/types/layout';

export function useTabItem(tab: Tab | null) {
  const { getWorkspace } = useWorkspaceStore(
    useShallow((state) => ({
      getWorkspace: state.getWorkspace,
    }))
  );

  const { getConnection } = useConnectionStore(
    useShallow((state) => ({
      getConnection: state.getConnection,
    }))
  );

  const { collectionItemMap } = useCollectionItemStore(
    useShallow((state) => ({
      collectionItemMap: state.collectionItemMap,
    }))
  );

  const { getEnvironment } = useEnvironmentStore(
    useShallow((state) => ({
      getEnvironment: state.getEnvironment,
    }))
  );

  const { getInterceptionScript } = useInterceptionScriptStore(
    useShallow((state) => ({
      getInterceptionScript: state.getInterceptionScript,
    }))
  );

  switch (tab?.modelType) {
    case BASE_MODEL_TYPE.WORKSPACE:
      return getWorkspace(tab.id);

    case BASE_MODEL_TYPE.CONNECTION:
      return getConnection(tab.id);

    case BASE_MODEL_TYPE.COLLECTION:
      return collectionItemMap.get(tab.id);

    case BASE_MODEL_TYPE.ENVIRONMENT:
      return getEnvironment(tab.id);

    case BASE_MODEL_TYPE.INTERCEPTION_SCRIPT:
      return getInterceptionScript(tab.id);

    default:
      return undefined;
  }
}
