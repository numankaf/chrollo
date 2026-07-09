import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import type { Request } from '@/types/collection';
import { CONNECTION_TYPE } from '@/types/connection';
import { COMMANDS } from '@/lib/command';
import { commandBus } from '@/lib/command-bus';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { useConnection } from '@/hooks/connection/use-connection';
import { Button } from '@/components/common/button';
import { InputGroup } from '@/components/common/input-group';
import { VariableInput } from '@/components/common/variable-input';

function RequestViewHeader() {
  const form = useFormContext();
  const { sendRequest } = useConnection();
  const { activeConnection } = useActiveItem();

  const isRawWebSocket = activeConnection?.connectionType === CONNECTION_TYPE.RAW_WEBSOCKET;

  useEffect(() => {
    const unsubscribeSend = commandBus.on(COMMANDS.REQUEST_SEND, () => {
      form.handleSubmit((data) => {
        sendRequest(data as Request);
      })();
    });
    return () => {
      unsubscribeSend?.();
    };
  }, [form, sendRequest]);

  return (
    <div className={`w-full flex items-center justify-end gap-2 ${isRawWebSocket ? 'px-2 relative' : 'p-2 h-10'}`}>
      {!isRawWebSocket && (
        <div className="flex rounded-md shadow-xs flex-1">
          <Controller
            name="destination"
            control={form.control}
            render={({ field, fieldState }) => (
              <InputGroup>
                <VariableInput
                  className="text-sm"
                  placeholder="Enter a request path or paste text"
                  aria-invalid={fieldState.invalid}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </InputGroup>
            )}
          />
        </div>
      )}
      <Button
        type="button"
        variant="primary-bordered-ghost"
        className={isRawWebSocket ? 'absolute top-1.5' : ''}
        onClick={() =>
          form.handleSubmit((data) => {
            sendRequest(data as Request);
          })()
        }
      >
        Send
      </Button>
    </div>
  );
}

export default RequestViewHeader;
