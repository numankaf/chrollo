import useInterceptionScriptStore from '@/store/interception-script-store';
import { useShallow } from 'zustand/react/shallow';

export function useWorkspaceInterceptionScripts() {
  const { interceptionScripts } = useInterceptionScriptStore(
    useShallow((state) => ({
      interceptionScripts: state.interceptionScripts,
    }))
  );

  return interceptionScripts;
}
