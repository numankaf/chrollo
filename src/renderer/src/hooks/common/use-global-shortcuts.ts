import { useEffect } from 'react';
import { useAppConfigStore } from '@/store/app-config-store';
import { useShallow } from 'zustand/react/shallow';

import { SHORTCUT_TO_COMMAND, type Command } from '@/lib/command';
import { commandBus } from '@/lib/command-bus';

const MODIFIER_CODES = new Set([
  'ControlLeft',
  'ControlRight',
  'ShiftLeft',
  'ShiftRight',
  'AltLeft',
  'AltRight',
  'MetaLeft',
  'MetaRight',
]);

function getModifiers(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey) parts.push('Ctrl');
  if (e.metaKey) parts.push('Meta');
  if (e.shiftKey) parts.push('Shift');
  if (e.altKey) parts.push('Alt');
  return parts.join('+');
}

function getKeyFromCode(code: string): string | undefined {
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  if (code.startsWith('Numpad')) return code.slice(6);
  if (
    code.startsWith('Arrow') ||
    code.startsWith('F') ||
    ['Tab', 'Enter', 'Backspace', 'Delete', 'Escape', 'Space'].includes(code)
  ) {
    return code;
  }
  return undefined;
}

function getKeyFromEvent(e: KeyboardEvent): string | undefined {
  if (e.key.length === 1) return e.key;
  if (['Tab', 'Enter', 'Backspace', 'Delete', 'Escape'].includes(e.key)) return e.key;
  return undefined;
}

function buildShortcut(modifiers: string, key: string): string {
  return modifiers ? `${modifiers}+${key}` : key;
}

function resolveCommand(e: KeyboardEvent): Command | undefined {
  if (MODIFIER_CODES.has(e.code)) return undefined;

  const modifiers = getModifiers(e);

  // Try code-based first (layout-independent, handles letters/digits/functional keys)
  const codeKey = getKeyFromCode(e.code);
  if (codeKey) {
    const command = SHORTCUT_TO_COMMAND[buildShortcut(modifiers, codeKey)];
    if (command) return command;
  }

  // Fallback to key-based (layout-dependent, handles symbols like \, ", [ etc.)
  const eventKey = getKeyFromEvent(e);
  if (eventKey && eventKey !== codeKey) {
    const command = SHORTCUT_TO_COMMAND[buildShortcut(modifiers, eventKey)];
    if (command) return command;
  }

  return undefined;
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

      const command = resolveCommand(e);
      if (!applicationSettings.shortcutsEnabled || !command) return;
      e.preventDefault();
      commandBus.emit(command);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [applicationSettings.shortcutsEnabled]);
}
