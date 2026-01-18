import useWorkspaceStore from '@/store/workspace-store';

import { RichTextEditor } from '@/components/app/editor/rich-text-editor';

function WorkspaceOverview() {
  const { activeWorkspaceId, workspaces, updateWorkspace } = useWorkspaceStore();
  const workspace = workspaces.find((w) => w.id === activeWorkspaceId);

  if (!workspace) return null;

  const handleDescriptionUpdate = (newDescription: string) => {
    updateWorkspace({ ...workspace, description: newDescription }, { persist: false });
  };

  return (
    <div className="p-3 h-full">
      <RichTextEditor
        key={workspace.id}
        content={workspace.description || ''}
        onContentChange={handleDescriptionUpdate}
        placeholder="Help people understand your workspace by adding a description..."
        className="h-full"
      />
    </div>
  );
}

export default WorkspaceOverview;
