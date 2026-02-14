import useEnvironmentStore from '@/store/environment-store';
import { useShallow } from 'zustand/react/shallow';

export function useWorkspaceEnvironments() {
  const { environments, globalEnvironment } = useEnvironmentStore(
    useShallow((state) => ({
      environments: state.environments,
      globalEnvironment: state.globalEnvironment,
    }))
  );

  return { environments, globalEnvironment };
}
