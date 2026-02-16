import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ConnectionStatusBadge from '@/features/connections/components/common/connection-status-badge';
import useConnectionStatusStore from '@/store/connection-status-store';
import { getConnectionButtonVariant } from '@/utils/connection-util';

import { COMMANDS } from '@/lib/command';
import { commandBus } from '@/lib/command-bus';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { Button } from '@/components/common/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/select';
import SocketMessageConsole from '@/components/app/socket/console/socket-message-console';
import SocketResponseConsole from '@/components/app/socket/console/socket-response-console';

export const CONSOLE_TYPE = {
  MESSAGE: 'MESSAGE',
  RESPONSE: 'RESPONSE',
} as const;

export type ConsoleType = (typeof CONSOLE_TYPE)[keyof typeof CONSOLE_TYPE];

const SOCKET_CONSOLE_TYPE_STORAGE_KEY = 'socket-console-view';

function SocketConsole({ isCollapsed }: { isCollapsed: boolean }) {
  const { activeConnection, activeTab } = useActiveItem();
  const status = useConnectionStatusStore((s) => (activeConnection ? s.statuses[activeConnection.id] : undefined));
  const { variant } = getConnectionButtonVariant(status);

  const [consoleType, setConsoleType] = useState<ConsoleType>(() => {
    const stored = localStorage.getItem(SOCKET_CONSOLE_TYPE_STORAGE_KEY);
    return (stored as ConsoleType) || CONSOLE_TYPE.MESSAGE;
  });

  useEffect(() => {
    localStorage.setItem(SOCKET_CONSOLE_TYPE_STORAGE_KEY, consoleType);
  }, [consoleType]);

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between p-1 h-8 shrink-0 relative z-10">
        <div className="flex items-center gap-2">
          <Select value={consoleType} onValueChange={(v) => setConsoleType(v as ConsoleType)}>
            <SelectTrigger size="sm" className="h-6! text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="h-6! text-sm rounded-md" value={CONSOLE_TYPE.MESSAGE}>
                Message Console
              </SelectItem>
              <SelectItem className="h-6! text-sm rounded-md" value={CONSOLE_TYPE.RESPONSE}>
                Response Console
              </SelectItem>
            </SelectContent>
          </Select>
          <Button variant={variant} size="2xs" className="rounded-md text-sm pointer-events-n h-6">
            {activeConnection?.name || 'No Active Connection'}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {activeConnection && <ConnectionStatusBadge connectionId={activeConnection.id} showLabel />}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => commandBus.emit(COMMANDS.TOGGLE_REQUEST_CONSOLE)}
          >
            {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </header>
      {!isCollapsed && (
        <div className="flex-1 min-h-0">
          {consoleType === CONSOLE_TYPE.MESSAGE && <SocketMessageConsole />}
          {consoleType === CONSOLE_TYPE.RESPONSE && <SocketResponseConsole key={activeTab?.id} />}
        </div>
      )}
    </div>
  );
}

export default SocketConsole;
