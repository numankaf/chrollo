import ScopePlatformPlugin from '@/features/plugins/stomp/scope-platform-plugin';
import { useAppConfigStore } from '@/store/app-config-store';
import { ChevronRight, CircleCheck } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { PLUGIN_ID } from '@/types/plugin';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/common/collapsible';
import { ScrollArea } from '@/components/common/scroll-area';
import { Toggle } from '@/components/common/toggle';

const STOMP_PLUGINS = [
  {
    id: PLUGIN_ID.SCOPE_PLATFORM,
    title: 'Scope Platform Plugin',
    description:
      'The Scope Platform Plugin enhances STOMP-based WebSocket connections by automatically handling client session isolation and request–response matching.',
    component: ScopePlatformPlugin,
  },
];

function PluginsPanel() {
  const { activeStompPlugin, setActiveStompPlugin } = useAppConfigStore(
    useShallow((state) => ({
      activeStompPlugin: state.activeStompPlugin,
      setActiveStompPlugin: state.setActiveStompPlugin,
    }))
  );
  return (
    <ScrollArea style={{ height: 'calc(100% - 2rem)' }}>
      <div className="space-y-2 m-4">
        <p>Stomp Plugins</p>
        <div className="flex flex-col gap-3">
          {STOMP_PLUGINS.map((plugin) => {
            const isSelected = activeStompPlugin === plugin.id;

            return (
              <Collapsible key={plugin.id} className="border rounded-lg p-3 bg-card">
                <div className="flex w-fit items-center gap-2 text-sm leading-snug font-medium">{plugin.title}</div>
                <div className="flex items-center text-start gap-3 py-2">
                  <CollapsibleTrigger
                    asChild
                    className="cursor-pointer transition-transform data-[state=open]:rotate-90"
                  >
                    <ChevronRight />
                  </CollapsibleTrigger>

                  <div className="select-none text-muted-foreground line-clamp-2 text-sm leading-normal font-normal">
                    {plugin.description}
                  </div>
                  <Toggle
                    size="sm"
                    variant="outline"
                    pressed={isSelected}
                    onPressedChange={(pressed) => {
                      setActiveStompPlugin(pressed ? plugin.id : undefined);
                    }}
                    className="w-36! data-[state=on]:border-primary data-[state=on]:bg-transparent data-[state=on]:*:[svg]:stroke-primary"
                  >
                    <CircleCheck />
                    <span className={`${isSelected && 'text-primary'}`}>{isSelected ? 'Deactivate' : 'Activate'}</span>
                  </Toggle>
                </div>
                <CollapsibleContent>{<plugin.component />}</CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}

export default PluginsPanel;
