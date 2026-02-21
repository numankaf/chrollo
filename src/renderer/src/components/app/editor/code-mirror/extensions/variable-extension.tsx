import {
  Decoration,
  EditorView,
  hoverTooltip,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate,
  type DecorationSet,
} from '@uiw/react-codemirror';
import { createRoot } from 'react-dom/client';

import { ENVIRONMENT_VARIABLE_CAPTURE_REGEX, ENVIRONMENT_VARIABLE_MATCH_REGEX } from '@/types/common';
import type { EnvironmentVariable } from '@/types/environment';
import type { Tab } from '@/types/layout';
import { VariableInputTooltipContent } from '@/components/common/variable-input';

export function variableExtension(
  enabledVariables: EnvironmentVariable[] | undefined,
  onEnvironmentClick?: (tab: Tab) => void
) {
  const variableMatcher = new MatchDecorator({
    regexp: ENVIRONMENT_VARIABLE_MATCH_REGEX,
    decoration: (match: RegExpExecArray) => {
      const varName = match[0].slice(2, -2).trim();
      const exists = enabledVariables?.find((v) => v.key === varName && v.enabled);

      return Decoration.mark({
        class: exists ? 'cm-variable-exists' : 'cm-variable-not-exists',
        attributes: { 'data-variable': varName },
      });
    },
  });

  const variableTooltip = hoverTooltip(
    (view, pos, side) => {
      const { from, to, text } = view.state.doc.lineAt(pos);

      let start = pos;
      let end = pos;

      while (start > from && /[\w.-]|{|}/.test(text[start - from - 1])) start--;
      while (end < to && /[\w.-]|{|}/.test(text[end - from])) end++;

      if ((start === pos && side < 0) || (end === pos && side > 0)) return null;

      const word = text.slice(start - from, end - from);
      const match = ENVIRONMENT_VARIABLE_CAPTURE_REGEX.exec(word);
      if (!match) return null;

      const varKey = match[1];

      const variable = enabledVariables?.find((v) => v.key === varKey && v.enabled);

      return {
        pos: start,
        end,
        above: false,
        create() {
          const dom = document.createElement('div');
          dom.className = 'cm-tooltip-cursor bg-transparent border-none p-0 pointer-events-none';

          const root = createRoot(dom);

          root.render(
            <div className="p-3 min-w-64 bg-card border rounded-md shadow-xl text-foreground">
              <VariableInputTooltipContent variable={variable} onEnvironmentClick={onEnvironmentClick} />
            </div>
          );

          return {
            dom,
            destroy() {
              setTimeout(() => root.unmount(), 50);
            },
          };
        },
      };
    },
    { hoverTime: 500 }
  );

  return [
    variableTooltip,
    ViewPlugin.fromClass(
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
    ),
  ];
}
