import useConnectionStore from '@/store/connection-store';
import useEnvironmentStore from '@/store/environment-store';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { useShallow } from 'zustand/react/shallow';

export function useActiveItem() {
  const { activeWorkspaceId, workspaceSelection, workspaces } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
      workspaceSelection: state.workspaceSelection,
      workspaces: state.workspaces,
    }))
  );

  const { connections } = useConnectionStore(
    useShallow((state) => ({
      connections: state.connections,
    }))
  );

  const { tabs } = useTabsStore(
    useShallow((state) => ({
      tabs: state.tabs,
    }))
  );

  const { environments } = useEnvironmentStore(
    useShallow((state) => ({
      environments: state.environments,
    }))
  );

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) ?? null;

  const selection = activeWorkspaceId ? workspaceSelection[activeWorkspaceId] : undefined;

  const activeConnection = selection?.activeConnectionId
    ? (connections.find((c) => c.id === selection.activeConnectionId) ?? null)
    : null;

  const activeEnvironment = selection?.activeEnvironmentId
    ? (environments.find((e) => e.id === selection.activeEnvironmentId) ?? null)
    : null;

  const activeTab = selection?.activeTabId ? (tabs.find((t) => t.id === selection.activeTabId) ?? null) : null;

  return {
    activeWorkspace,
    activeConnection,
    activeEnvironment,
    activeTab,
  };
}
