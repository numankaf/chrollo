import { useEffect, useState } from 'react';
import useEnvironmentStore from '@/store/environment-store';

import { useActiveItem } from '@/hooks/app/use-active-item';
import useDebouncedValue from '@/hooks/common/use-debounced-value';

function useUpdateEnvironmentVariable() {
  const { activeEnvironment } = useActiveItem();
  const updateEnvironment = useEnvironmentStore((s) => s.updateEnvironment);

  const [editingVariable, setEditingVariable] = useState<{ id: string; value: string } | null>(null);

  const debouncedEditingVar = useDebouncedValue(editingVariable, 500);

  useEffect(() => {
    if (!debouncedEditingVar || !activeEnvironment) return;

    const { id, value } = debouncedEditingVar;
    const variable = activeEnvironment.variables.find((v) => v.id === id);

    if (variable && variable.value !== value) {
      updateEnvironment(
        {
          ...activeEnvironment,
          variables: activeEnvironment.variables.map((v) => (v.id === id ? { ...v, value } : v)),
        },
        { persist: true }
      );
    }
  }, [debouncedEditingVar, activeEnvironment, updateEnvironment]);

  return { activeEnvironment, editingVariable, setEditingVariable };
}

export default useUpdateEnvironmentVariable;
