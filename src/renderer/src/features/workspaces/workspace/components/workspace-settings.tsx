import { useState } from 'react';
import useWorkspaceStore from '@/store/workspace-store';
import { Lock, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { WORKSPACE_TYPE, type WorkspaceType } from '@/types/workspace';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/common/alert-dialog';
import { Button } from '@/components/common/button';
import { RadioGroup, RadioGroupItem } from '@/components/common/radio-group';
import { ScrollArea } from '@/components/common/scroll-area';
import { Separator } from '@/components/common/separator';

function WorkspaceSettings() {
  const navigate = useNavigate();
  const { workspace, updateWorkspace, deleteWorkspace } = useWorkspaceStore(
    useShallow((state) => ({
      workspace: state.workspaces.find((w) => w.id === state.activeWorkspaceId),
      updateWorkspace: state.updateWorkspace,
      deleteWorkspace: state.deleteWorkspace,
    }))
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!workspace) return null;

  const handleTypeChange = (newType: WorkspaceType) => {
    updateWorkspace({ ...workspace, type: newType }, { persist: false });
  };

  const handleDelete = async () => {
    await deleteWorkspace(workspace.id);
    setIsDeleteDialogOpen(false);
    navigate(`/home`);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-6">Workspace settings</h2>
          <Separator className="mb-4" />

          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground">Workspace type</h3>
            <RadioGroup
              value={workspace.type}
              onValueChange={(v) => handleTypeChange(v as WorkspaceType)}
              className="grid gap-4"
            >
              <label
                htmlFor="type-internal"
                className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
              >
                <RadioGroupItem value={WORKSPACE_TYPE.INTERNAL} id="type-internal" className="mt-1" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 font-medium">
                    <Lock className="w-4 h-4 text-primary" />
                    Internal
                  </div>
                  <p className="text-sm text-muted-foreground">Build and test APIs within your team.</p>
                </div>
              </label>

              <label
                htmlFor="type-public"
                className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
              >
                <RadioGroupItem value={WORKSPACE_TYPE.PUBLIC} id="type-public" className="mt-1" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 font-medium">
                    <Users className="w-4 h-4 text-primary" />
                    Public
                  </div>
                  <p className="text-sm text-muted-foreground">Make your workspace visible to everyone.</p>
                </div>
              </label>
            </RadioGroup>
          </div>
        </div>

        <div className="pt-8 border-t">
          <div className="space-y-2">
            <h3 className="font-semibold text-muted-foreground">Delete workspace</h3>
            <p className="text-sm text-muted-foreground">
              Once deleted, a workspace is gone forever along with its data. This action cannot be undone.
            </p>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Workspace
            </Button>
          </div>
        </div>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the workspace <span className="ml-1 font-semibold">{workspace.name}</span>{' '}
                and remove all its collections, environments, and scripts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete Workspace
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ScrollArea>
  );
}

export default WorkspaceSettings;
