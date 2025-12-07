import { Controller, useFormContext } from 'react-hook-form';

import type { Request } from '@/types/collection';
import { useConnection } from '@/hooks/use-connection';
import { Button } from '@/components/common/button';
import { InputGroup, InputGroupInput } from '@/components/common/input-group';

function RequestViewHeader() {
  const form = useFormContext();
  const { sendRequest } = useConnection();

  return (
    <div className="p-2 w-full flex items-center justify-between gap-2">
      <div className="flex rounded-md shadow-xs flex-1">
        <Controller
          name="destination"
          control={form.control}
          render={({ field, fieldState }) => (
            <InputGroup>
              <InputGroupInput
                type="text"
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
