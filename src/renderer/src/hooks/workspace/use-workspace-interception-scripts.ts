import { useMemo } from 'react';
import useInterceptionScriptStore from '@/store/interception-script-store';
import useWorkspaceStore from '@/store/workspace-store';
import { useShallow } from 'zustand/react/shallow';

export function useWorkspaceInterceptionScripts() {
  const { interceptionScripts } = useInterceptionScriptStore(
    useShallow((state) => ({
      interceptionScripts: state.interceptionScripts,
    }))
  );
  const { activeWorkspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
    }))
  );

  return useMemo(() => {
    if (!activeWorkspaceId) return [];
    return interceptionScripts.filter((e) => e.workspaceId === activeWorkspaceId);
  }, [interceptionScripts, activeWorkspaceId]);
}
