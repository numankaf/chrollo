import useEnvironmentStore from '@/store/environment-store';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import { ENVIRONMENT_DEFAULT_VALUES, type Environment } from '@/types/environment';
import { AddItemDialog } from '@/components/app/dialog/add-item-dialog';

interface AddEnvironmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddEnvironmentDialog({ open, onOpenChange }: AddEnvironmentDialogProps) {
  const { activeWorkspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
    }))
  );

  const { saveEnvironment } = useEnvironmentStore(
    useShallow((state) => ({
      saveEnvironment: state.saveEnvironment,
    }))
  );

  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );

  async function onAddSubmit(values: { name: string }) {
    if (!activeWorkspaceId) {
      return;
    }
    try {
      const environmentPayload: Environment = {
        id: nanoid(),
        name: values.name,
        workspaceId: activeWorkspaceId,
        ...ENVIRONMENT_DEFAULT_VALUES,
      };
      const newEnvironment = await saveEnvironment(environmentPayload);
      openTab(newEnvironment);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to submit environment:', error);
      toast.error('Failed to submit environment.');
    }
  }

  return (
    <AddItemDialog
      title="Create Environment"
      inputLabel="Environment Name"
      inputRequiredLabel="Environment name is required."
      inputPlaceholder="Enter a environment name"
      defaultValue="New Environment"
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onAddSubmit}
    />
  );
}
