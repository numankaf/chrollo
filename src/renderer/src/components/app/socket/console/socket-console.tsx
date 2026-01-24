import { useState } from 'react';
import ConnectionStatusBadge from '@/features/connections/components/common/connection-status-badge';
import useConnectionStatusStore from '@/store/connection-status-store';
import { getConnectionButtonVariant } from '@/utils/connection-util';

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

function SocketConsole() {
  const { activeConnection } = useActiveItem();
  const status = useConnectionStatusStore((s) => (activeConnection ? s.statuses[activeConnection.id] : undefined));
  const { variant } = getConnectionButtonVariant(status);
  const [view, setView] = useState<ConsoleType>(CONSOLE_TYPE.MESSAGE);

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between p-1 h-8 shrink-0 relative z-10">
        <div className="flex items-center gap-2">
          <Select value={view} onValueChange={(v) => setView(v as ConsoleType)}>
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
        {activeConnection && <ConnectionStatusBadge connectionId={activeConnection.id} showLabel />}
      </header>
      <div className="flex-1 min-h-0">
        {view === CONSOLE_TYPE.MESSAGE && <SocketMessageConsole />}
        {view === CONSOLE_TYPE.RESPONSE && <SocketResponseConsole />}
      </div>
    </div>
  );
}

export default SocketConsole;
