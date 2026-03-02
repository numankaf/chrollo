import EditorSettings from '@/features/settings/components/general/editor-settings';
import RequestSettings from '@/features/settings/components/general/request-settings';
import UserInterfaceSettings from '@/features/settings/components/general/user-interface-settings';

import { ScrollArea } from '@/components/common/scroll-area';

function GeneralPanel() {
  return (
    <ScrollArea style={{ height: 'calc(100% - 2rem)' }}>
      <div className="flex flex-col gap-3 mx-4 my-2">
        <UserInterfaceSettings />
        <EditorSettings />
        <RequestSettings />
      </div>
    </ScrollArea>
  );
}

export default GeneralPanel;
