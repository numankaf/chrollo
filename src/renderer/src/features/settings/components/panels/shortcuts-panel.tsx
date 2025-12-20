import TabShortcurts from '@/features/settings/components/shortcuts/tab-shortcuts';

import { ScrollArea } from '@/components/common/scroll-area';

function ShortcutsPanel() {
  return (
    <ScrollArea style={{ height: 'calc(100% - 2rem)' }}>
      <div className="flex flex-col gap-3 p-3">
        <TabShortcurts />
      </div>
    </ScrollArea>
  );
}

export default ShortcutsPanel;
