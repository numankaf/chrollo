import { useAppConfigStore } from '@/store/app-config-store';
import { useShallow } from 'zustand/react/shallow';

import { EDITOR_THEMES, type EditorTheme } from '@/types/setting';
import { Input } from '@/components/common/input';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/common/item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/select';
import { Separator } from '@/components/common/separator';
import { Switch } from '@/components/common/switch';

const themeEntries = Object.entries(EDITOR_THEMES) as [EditorTheme, string][];

function EditorSettings() {
  const { applicationSettings, updateApplicationSetting } = useAppConfigStore(
    useShallow((state) => ({
      applicationSettings: state.applicationSettings,
      updateApplicationSetting: state.updateApplicationSetting,
    }))
  );

  return (
    <div>
      <div className="my-2 text-lg font-semibold">Editor</div>
      <Separator />

      <Item className="py-2 px-0">
        <ItemContent>
          <ItemTitle>Theme</ItemTitle>
          <ItemDescription>Set the color theme for code editors.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Select
            value={applicationSettings.editorTheme}
            onValueChange={(value) => updateApplicationSetting('editorTheme', value as EditorTheme)}
          >
            <SelectTrigger className="h-7!">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {themeEntries.map(([key, label]) => (
                <SelectItem className="h-7!" key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ItemActions>
      </Item>
      <Separator />
      <Item className="py-2 px-0">
        <ItemContent>
          <ItemTitle>Use theme native background</ItemTitle>
          <ItemDescription>
            Use the editor theme&apos;s own background colors instead of adapting to the app theme.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Switch
            checked={applicationSettings.editorNativeThemeBackground}
            onCheckedChange={(value) => updateApplicationSetting('editorNativeThemeBackground', value)}
          />
        </ItemActions>
      </Item>
      <Separator />
      <Item className="py-2 px-0">
        <ItemContent>
          <ItemTitle>Tab indent size</ItemTitle>
          <ItemDescription>Number of spaces per indentation level.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Input
            type="number"
            min={1}
            max={8}
            className="w-20 h-8"
            value={applicationSettings.editorTabSize}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (val >= 1 && val <= 8) updateApplicationSetting('editorTabSize', val);
            }}
          />
        </ItemActions>
      </Item>
      <Separator />

      <Item className="py-2 px-0">
        <ItemContent>
          <ItemTitle>Font size (px)</ItemTitle>
          <ItemDescription>Font size in pixels for code editors.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Input
            type="number"
            min={8}
            max={32}
            className="w-20 h-8"
            value={applicationSettings.editorFontSize}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (val >= 8 && val <= 32) updateApplicationSetting('editorFontSize', val);
            }}
          />
        </ItemActions>
      </Item>
      <Separator />

      <Item className="py-2 px-0">
        <ItemContent>
          <ItemTitle>Auto close brackets and quotes</ItemTitle>
          <ItemDescription>Automatically insert closing brackets and quotes when typing.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Switch
            checked={applicationSettings.editorAutoCloseBrackets}
            onCheckedChange={(value) => updateApplicationSetting('editorAutoCloseBrackets', value)}
          />
        </ItemActions>
      </Item>
      <Separator />

      <Item className="py-2 px-0">
        <ItemContent>
          <ItemTitle>Show line numbers</ItemTitle>
          <ItemDescription>Display line numbers in the editor gutter.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Switch
            checked={applicationSettings.editorShowLineNumbers}
            onCheckedChange={(value) => updateApplicationSetting('editorShowLineNumbers', value)}
          />
        </ItemActions>
      </Item>
      <Separator />
    </div>
  );
}

export default EditorSettings;
