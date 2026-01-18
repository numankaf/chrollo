import useCollectionItemStore from '@/store/collection-item-store';
import useConnectionStore from '@/store/connection-store';
import useEnvironmentStore from '@/store/environment-store';
import useInterceptionScriptStore from '@/store/interception-script-store';
import useWorkspaceStore from '@/store/workspace-store';

import { BASE_MODEL_TYPE, type BaseModelType } from '@/types/base';
import type { CollectionItem } from '@/types/collection';
import type { Connection } from '@/types/connection';
import type { Environment } from '@/types/environment';
import type { InterceptionScript } from '@/types/interception-script';
import type { Tab, TabItem } from '@/types/layout';

export async function saveItem(item: TabItem) {
  switch (item.modelType) {
    case BASE_MODEL_TYPE.CONNECTION:
      return await useConnectionStore.getState().saveConnection(item as Connection);

    case BASE_MODEL_TYPE.ENVIRONMENT:
      return await useEnvironmentStore.getState().saveEnvironment(item as Environment);

    case BASE_MODEL_TYPE.COLLECTION:
      return await useCollectionItemStore.getState().saveCollectionItem(item as CollectionItem);

    case BASE_MODEL_TYPE.INTERCEPTION_SCRIPT:
      return await useInterceptionScriptStore.getState().saveInterceptionScript(item as InterceptionScript);

    default:
      return Promise.resolve(undefined);
  }
}

export function isSaveButtonVisible(item: Tab) {
  return (
    [
      BASE_MODEL_TYPE.CONNECTION,
      BASE_MODEL_TYPE.ENVIRONMENT,
      BASE_MODEL_TYPE.COLLECTION,
      BASE_MODEL_TYPE.INTERCEPTION_SCRIPT,
    ] as BaseModelType[]
  ).includes(item.modelType);
}

export async function renameItem(item: TabItem, newName: string) {
  if (!newName.trim()) return;

  switch (item.modelType) {
    case BASE_MODEL_TYPE.CONNECTION:
      return await useConnectionStore.getState().updateConnection({ ...item, name: newName }, { persist: true });

    case BASE_MODEL_TYPE.ENVIRONMENT:
      return await useEnvironmentStore.getState().updateEnvironment({ ...item, name: newName }, { persist: true });

    case BASE_MODEL_TYPE.COLLECTION:
      return await useCollectionItemStore
        .getState()
        .updateCollectionItem({ ...item, name: newName }, { persist: true });

    case BASE_MODEL_TYPE.INTERCEPTION_SCRIPT:
      return await useInterceptionScriptStore
        .getState()
        .updateInterceptionScript({ ...item, name: newName }, { persist: true });

    case BASE_MODEL_TYPE.WORKSPACE:
      return await useWorkspaceStore.getState().updateWorkspace({ ...item, name: newName }, { persist: true });

    default:
      return Promise.resolve(undefined);
  }
}
