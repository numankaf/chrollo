import { useEffect, useState } from 'react';
import useWorkspaceStore from '@/store/workspace-store';
import { useShallow } from 'zustand/react/shallow';

import useDebouncedValue from '@/hooks/common/use-debounced-value';
import { RichTextEditor } from '@/components/app/editor/rich-text-editor';

function WorkspaceOverview() {
  const { workspace, updateWorkspace } = useWorkspaceStore(
    useShallow((state) => ({
      workspace: state.workspaces.find((w) => w.id === state.activeWorkspaceId),
      updateWorkspace: state.updateWorkspace,
    }))
  );

  const [description, setDescription] = useState(workspace?.description || '');
  const debouncedDescription = useDebouncedValue(description, 500);

  useEffect(() => {
    if (workspace && debouncedDescription !== workspace.description) {
      updateWorkspace({ ...workspace, description: debouncedDescription }, { persist: false });
    }
  }, [debouncedDescription, updateWorkspace, workspace]);

  if (!workspace) return null;

  return (
    <div className="p-3 h-full">
      <RichTextEditor
        key={workspace.id}
        content={description}
        onContentChange={setDescription}
        placeholder="Help people understand your workspace by adding a description..."
        className="h-full"
      />
    </div>
  );
}

export default WorkspaceOverview;
