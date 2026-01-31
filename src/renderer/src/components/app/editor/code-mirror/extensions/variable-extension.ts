import {
  Decoration,
  EditorView,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate,
  type DecorationSet,
} from '@uiw/react-codemirror';

import { ENVIRONMENT_VAR_REGEX } from '@/types/common';

export function variableExtension(enabledVariables: string[]) {
  const variableMatcher = new MatchDecorator({
    regexp: ENVIRONMENT_VAR_REGEX,
    decoration: (match: RegExpExecArray) => {
      const varName = match[0].slice(2, -2).trim();
      const exists = enabledVariables.includes(varName);

      return Decoration.mark({
        class: exists ? 'cm-variable-exists' : 'cm-variable-not-exists',
      });
    },
  });

  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      constructor(view: EditorView) {
        this.decorations = variableMatcher.createDeco(view);
      }
      update(update: ViewUpdate) {
        this.decorations = variableMatcher.updateDeco(update, this.decorations);
      }
    },
    {
      decorations: (instance: { decorations: DecorationSet }) => instance.decorations,
    }
  );
}
