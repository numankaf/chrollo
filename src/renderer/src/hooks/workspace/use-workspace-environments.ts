import useEnvironmentStore from '@/store/environment-store';
import { useShallow } from 'zustand/react/shallow';

export function useWorkspaceEnvironments() {
  const { environments } = useEnvironmentStore(
    useShallow((state) => ({
      environments: state.environments,
    }))
  );

  return environments;
}
