import { useAppConfigStore } from '@/store/app-config-store';
import { useShallow } from 'zustand/react/shallow';

import { SHORTCUTS } from '@/lib/command';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/common/item';
import { ScrollArea } from '@/components/common/scroll-area';
import { Separator } from '@/components/common/separator';
import { Shortcut } from '@/components/common/shortcut';
import { Switch } from '@/components/common/switch';

interface ShortcutGroup {
  title: string;
  items: { label: string; shortcut: string }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Tabs',
    items: [
      { label: 'Close Tab', shortcut: SHORTCUTS.TAB_CLOSE },
      { label: 'Next Tab', shortcut: SHORTCUTS.TAB_NEXT },
      { label: 'Previous Tab', shortcut: SHORTCUTS.TAB_PREVIOUS },
      { label: 'Search Tab', shortcut: SHORTCUTS.TAB_SEARCH },
    ],
  },
  {
    title: 'Request',
    items: [{ label: 'Send Request', shortcut: SHORTCUTS.REQUEST_SEND }],
  },
  {
    title: 'Sidebar',
    items: [
      { label: 'Next Item', shortcut: SHORTCUTS.ITEM_NEXT },
      { label: 'Previous Item', shortcut: SHORTCUTS.ITEM_PREVIOUS },
      { label: 'Collapse Item', shortcut: SHORTCUTS.ITEM_COLLAPSE },
      { label: 'Expand Item', shortcut: SHORTCUTS.ITEM_EXPAND },
      { label: 'Select Item', shortcut: SHORTCUTS.ITEM_SELECT },
      { label: 'Save Item', shortcut: SHORTCUTS.ITEM_SAVE },
      { label: 'Rename Item', shortcut: SHORTCUTS.ITEM_RENAME },
      { label: 'Duplicate Item', shortcut: SHORTCUTS.ITEM_DUPLICATE },
      { label: 'Delete Item', shortcut: SHORTCUTS.ITEM_DELETE },
      { label: 'Toggle Sidebar', shortcut: SHORTCUTS.TOGGLE_SIDEBAR },
    ],
  },
  {
    title: 'Console',
    items: [
      { label: 'Clear Request Console', shortcut: SHORTCUTS.CLEAR_REQUEST_CONSOLE },
      { label: 'Toggle Request Console', shortcut: SHORTCUTS.TOGGLE_REQUEST_CONSOLE },
      { label: 'Toggle Dev Console', shortcut: SHORTCUTS.TOGGLE_CONSOLE },
    ],
  },
];

function ShortcutsPanel() {
  const { applicationSettings, updateApplicationSetting } = useAppConfigStore(
    useShallow((state) => ({
      applicationSettings: state.applicationSettings,
      updateApplicationSetting: state.updateApplicationSetting,
    }))
  );

  return (
    <ScrollArea className="h-[calc(100%-2rem)]">
      <Item>
        <ItemContent>
          <ItemTitle>Keyboard Shortcuts</ItemTitle>
          <ItemDescription>Enable or disable keyboard shortcuts</ItemDescription>
        </ItemContent>

        <ItemActions>
          <Switch
            checked={applicationSettings['shortcutsEnabled']}
            onCheckedChange={(value) => updateApplicationSetting('shortcutsEnabled', value)}
          />
        </ItemActions>
      </Item>
      <div className="flex flex-col gap-6 p-4">
        {SHORTCUT_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">{group.title}</h3>
            <Separator />
            <div className="flex flex-col gap-2">
              {group.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <Shortcut shortcut={item.shortcut} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export default ShortcutsPanel;
