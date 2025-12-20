import { useEffect } from 'react';
import { useAppConfigStore } from '@/store/app-config-store';
import { useShallow } from 'zustand/react/shallow';

import { SHORTCUT_TO_COMMAND } from '@/types/command';
import { commandBus } from '@/lib/command-bus';

export function normalizeShortcut(e: KeyboardEvent): string {
  const keys: string[] = [];

  if (e.ctrlKey) keys.push('Ctrl');
  if (e.metaKey) keys.push('Meta');
  if (e.shiftKey) keys.push('Shift');
  if (e.altKey) keys.push('Alt');

  const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;

  if (!['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
    keys.push(key);
  }

  return keys.join('+');
}

export function useGlobalShortcuts() {
  const { applicationSettings } = useAppConfigStore(
    useShallow((state) => ({
      applicationSettings: state.applicationSettings,
    }))
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;

      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) {
        return;
      }

      const shortcut = normalizeShortcut(e);
      const command = SHORTCUT_TO_COMMAND[shortcut];
      if (!applicationSettings.shortcutsEnabled || !command) return;

      e.preventDefault();
      commandBus.emit(command);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [applicationSettings.shortcutsEnabled]);
}
