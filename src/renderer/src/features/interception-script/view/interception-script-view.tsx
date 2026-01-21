import useInterceptionScriptStore from '@/store/interception-script-store';
import { formatJs } from '@/utils/editor-util';
import { useShallow } from 'zustand/react/shallow';

import { useActiveItem } from '@/hooks/app/use-active-item';
import { Button } from '@/components/common/button';
import { Label } from '@/components/common/label';
import { ScrollArea } from '@/components/common/scroll-area';
import { Switch } from '@/components/common/switch';
import { BeautifyButton } from '@/components/app/button/beautify-button';
import CodeEditor, { EDITOR_BODY_TYPE } from '@/components/app/editor/code-editor';

function InterceptionScriptView() {
  const { activeTab } = useActiveItem();

  const { script, updateInterceptionScript } = useInterceptionScriptStore(
    useShallow((state) => ({
      script: state.interceptionScripts.find((s) => s.id === activeTab?.id),
      updateInterceptionScript: state.updateInterceptionScript,
    }))
  );

  if (!script) return <></>;

  function onBeautify() {
    if (!script) return;
    const beautifiedCode = formatJs(script.script);
    updateInterceptionScript({ ...script, script: beautifiedCode });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-end gap-2 mx-2 mb-1 ">
        <p className="text-muted-foreground my-1 flex-1">Script</p>
        <div className="flex items-center gap-2">
          <Label htmlFor="script-enabled" className="text-sm text-muted-foreground">
            {script.enabled ? 'Enabled' : 'Disabled'}
          </Label>
          <Switch
            id="script-enabled"
            checked={script.enabled}
            onCheckedChange={async (checked) =>
              await updateInterceptionScript({ ...script, enabled: checked }, { persist: true })
            }
          />
        </div>
        <Button variant="ghost" size="sm" className="h-6 gap-1.5 pointer-events-none!">
          {EDITOR_BODY_TYPE.JAVASCRIPT}
        </Button>
        <BeautifyButton onClick={onBeautify} />
      </div>
      <div className="flex-1 mx-2 mb-2 border rounded-lg h-full" style={{ height: 'calc(100% - 4rem)' }}>
        <ScrollArea className="p-0.5 min-h-full h-full">
          <CodeEditor
            value={script.script}
            bodyType={EDITOR_BODY_TYPE.JAVASCRIPT}
            height="100%"
            onChange={(value) => updateInterceptionScript({ ...script, script: value })}
          />
        </ScrollArea>
      </div>
    </div>
  );
}

export default InterceptionScriptView;
