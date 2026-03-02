import { Fragment } from 'react/jsx-runtime';
import { useAppConfigStore } from '@/store/app-config-store';
import { useShallow } from 'zustand/react/shallow';

import type { SettingItem } from '@/types/setting';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/common/item';
import { Separator } from '@/components/common/separator';
import { Switch } from '@/components/common/switch';

const REQUEST_SETTINGS: SettingItem[] = [
  {
    key: 'formatResponses',
    title: 'Automatically format response payloads',
    description: 'Parse JSON responses and recursively decode any nested JSON values stored as strings.',
  },
];

function RequestSettings() {
  const { applicationSettings, updateApplicationSetting } = useAppConfigStore(
    useShallow((state) => ({
      applicationSettings: state.applicationSettings,
      updateApplicationSetting: state.updateApplicationSetting,
    }))
  );

  return (
    <div>
      <div className="my-2 text-lg font-semibold">Request</div>
      <Separator />

      {REQUEST_SETTINGS.map((item) => (
        <Fragment key={item.key}>
          <Item className="py-2 px-0">
            <ItemContent>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemDescription>{item.description}</ItemDescription>
            </ItemContent>

            <ItemActions>
              <Switch
                checked={applicationSettings[item.key] as boolean}
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
export default RequestSettings;
