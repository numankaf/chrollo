import useCollectionItemStore from '@/store/collection-item-store';
import useConnectionStore from '@/store/connection-store';
import useEnvironmentStore from '@/store/environment-store';
import useInterceptionScriptStore from '@/store/interception-script-store';
import useWorkspaceStore from '@/store/workspace-store';
import { useShallow } from 'zustand/react/shallow';

import { BASE_MODEL_TYPE } from '@/types/base';
import type { Tab } from '@/types/layout';

export function useTabItem(tab: Tab | null) {
  const { workspaces } = useWorkspaceStore(
    useShallow((state) => ({
      workspaces: state.workspaces,
    }))
  );

  const { connections } = useConnectionStore(
    useShallow((state) => ({
      connections: state.connections,
    }))
  );

  const { collectionItemMap } = useCollectionItemStore(
    useShallow((state) => ({
      collectionItemMap: state.collectionItemMap,
    }))
  );

  const { environments, globalEnvironment } = useEnvironmentStore(
    useShallow((state) => ({
      environments: state.environments,
      globalEnvironment: state.globalEnvironment,
    }))
  );

  const { interceptionScripts } = useInterceptionScriptStore(
    useShallow((state) => ({
      interceptionScripts: state.interceptionScripts,
    }))
  );

  switch (tab?.modelType) {
    case BASE_MODEL_TYPE.WORKSPACE:
      return workspaces.find((w) => w.id === tab.id);

    case BASE_MODEL_TYPE.CONNECTION:
      return connections.find((c) => c.id === tab.id);

    case BASE_MODEL_TYPE.COLLECTION:
      return collectionItemMap.get(tab.id);

    case BASE_MODEL_TYPE.ENVIRONMENT:
      return environments.find((e) => e.id === tab.id) || globalEnvironment;

    case BASE_MODEL_TYPE.INTERCEPTION_SCRIPT:
      return interceptionScripts.find((e) => e.id === tab.id);

    default:
      return undefined;
  }
}
