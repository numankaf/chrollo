import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import type { Request } from '@/types/collection';
import { COMMANDS } from '@/types/command';
import { commandBus } from '@/lib/command-bus';
import { useConnection } from '@/hooks/connection/use-connection';
import { Button } from '@/components/common/button';
import { InputGroup } from '@/components/common/input-group';
import { VariableInput } from '@/components/common/variable-input';

function RequestViewHeader() {
  const form = useFormContext();
  const { sendRequest } = useConnection();

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
    <div className="p-2 w-full flex items-center justify-between gap-2 h-10">
      <div className="flex rounded-md shadow-xs flex-1">
        <Controller
          name="destination"
          control={form.control}
          render={({ field, fieldState }) => (
            <InputGroup>
              <VariableInput
                placeholder="Enter a request path or paste text"
                aria-invalid={fieldState.invalid}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </InputGroup>
          )}
        />
      </div>
      <Button
        type="button"
        variant="primary-bordered-ghost"
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
