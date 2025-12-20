import { Fragment } from 'react/jsx-runtime';
import { useAppConfigStore } from '@/store/app-config-store';
import { useShallow } from 'zustand/react/shallow';

import type { SettingItem } from '@/types/setting';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/common/item';
import { Separator } from '@/components/common/separator';
import { Switch } from '@/components/common/switch';

const UI_SETTINGS: SettingItem[] = [
  {
    key: 'discardUnsavedChangesOnClose',
    title: 'Always discard unsaved changes when closing a tab',
    description: 'Automatically discard unsaved changes when closing a tab, without showing a confirmation dialog.',
  },
  {
    key: 'showTabIcons',
    title: 'Show icons with tab names',
    description: 'Display icons alongside tab titles for easier identification of open tabs.',
  },
];

function UserInterfaceSettings() {
  const { applicationSettings, updateApplicationSetting } = useAppConfigStore(
    useShallow((state) => ({
      applicationSettings: state.applicationSettings,
      updateApplicationSetting: state.updateApplicationSetting,
    }))
  );

  return (
    <div>
      <div className="m-2 text-lg font-semibold">User Interface</div>
      <Separator />

      {UI_SETTINGS.map((item) => (
        <Fragment key={item.key}>
          <Item className="p-2">
            <ItemContent>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemDescription>{item.description}</ItemDescription>
            </ItemContent>

            <ItemActions>
              <Switch
                checked={applicationSettings[item.key]}
                onCheckedChange={(value) => updateApplicationSetting(item.key, value)}
              />
            </ItemActions>
          </Item>
          <Separator />
        </Fragment>
      ))}
    </div>
  );
}

export default UserInterfaceSettings;
