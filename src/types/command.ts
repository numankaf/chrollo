export const SHORTCUTS = {
  TAB_CLOSE: 'Ctrl+W',
  TAB_NEXT: 'Ctrl+Tab',
  TAB_PREVIOUS: 'Ctrl+Shift+Tab',
  TAB_SEARCH: 'Ctrl+Shift+A',
  REQUEST_SAVE: 'Ctrl+S',
  REQUEST_SEND: 'Ctrl+Enter',
} as const;

export const COMMANDS = {
  TAB_CLOSE: 'tab.close',
  TAB_NEXT: 'tab.next',
  TAB_PREVIOUS: 'tab.previous',
  TAB_SEARCH: 'tab.search',

  REQUEST_SAVE: 'request.save',
  REQUEST_SEND: 'request.send',
} as const;

export type Command = (typeof COMMANDS)[keyof typeof COMMANDS];

export const SHORTCUT_TO_COMMAND: Record<string, Command> = {
  [SHORTCUTS.TAB_CLOSE]: COMMANDS.TAB_CLOSE,
  [SHORTCUTS.TAB_NEXT]: COMMANDS.TAB_NEXT,
  [SHORTCUTS.TAB_PREVIOUS]: COMMANDS.TAB_PREVIOUS,
  [SHORTCUTS.TAB_SEARCH]: COMMANDS.TAB_SEARCH,
  [SHORTCUTS.REQUEST_SAVE]: COMMANDS.REQUEST_SAVE,
  [SHORTCUTS.REQUEST_SEND]: COMMANDS.REQUEST_SEND,
};
