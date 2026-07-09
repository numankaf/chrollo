import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/common/field';
import { Input } from '@/components/common/input';

function WebsocketSettings() {
  const form = useFormContext();

  return (
    <div className="p-1 space-y-4">
      <FieldGroup>
        <Controller
          name="settings.reconnectDelay"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="ws-reconnect-delay">Reconnection Delay</FieldLabel>
                <FieldDescription>
                  Automatically reconnect with delay in milliseconds, set to 0 to disable.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <Input
                id="ws-reconnect-delay"
                type="number"
                className="w-30"
                aria-invalid={fieldState.invalid}
                {...field}
                min={0}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            </Field>
          )}
        />

        <Controller
          name="settings.maxReconnectAttempts"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="ws-max-reconnect-attempts">Max Reconnect Attempts</FieldLabel>
                <FieldDescription>
                  Maximum number of reconnection attempts. Set to 0 for unlimited retries.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <Input
                id="ws-max-reconnect-attempts"
                type="number"
                className="w-30"
                aria-invalid={fieldState.invalid}
                {...field}
                min={0}
                step={1}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            </Field>
          )}
        />
        <Controller
          name="settings.maxMessageSize"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="ws-max-message-size">Max Message Size</FieldLabel>
                <FieldDescription>Maximum allowed incoming message size in MB. Set to 0 for no limit.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <Input
                id="ws-max-message-size"
                type="number"
                className="w-30"
                aria-invalid={fieldState.invalid}
                {...field}
                min={0}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
}

export default WebsocketSettings;
