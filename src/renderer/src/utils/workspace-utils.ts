import useWorkspaceStore from '@/store/workspace-store';

import type { WorkspaceSelectionValue } from '@/types/workspace';

/**
 * Get workspace selection values for the current active workspace.
 * Optionally, you can select a single key from the selection.
 */
export function getActiveWorkspaceSelection<K extends keyof WorkspaceSelectionValue>(
  key?: K
): WorkspaceSelectionValue | WorkspaceSelectionValue[K] | undefined {
  const state = useWorkspaceStore.getState();
  const workspaceId = state.activeWorkspaceId;
  if (!workspaceId) return undefined;

  const selection = state.workspaceSelection[workspaceId];
  if (!selection) return undefined;

  return key !== undefined ? selection[key] : selection;
}
