import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/common/field';
import { Input } from '@/components/common/input';
import { Toggle } from '@/components/common/toggle';

function StompSettings() {
  const form = useFormContext();

  return (
    <div className="m-1 space-y-4">
      <FieldGroup>
        <Controller
          name="settings.connectionTimeout"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="connection-timeout">Connection Timeout</FieldLabel>
                <FieldDescription>
                  Will retry if Stomp connection is not established in specified milliseconds. Default 0, which switches
                  off automatic reconnection.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <Input
                id="connection-timeout"
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
          name="settings.reconnectDelay"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="reconnect-delay">Reconnection Delay</FieldLabel>
                <FieldDescription>
                  Automatically reconnect with delay in milliseconds, set to 0 to disable.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <Input
                id="reconnect-delay"
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
          name="settings.maxReconnectDelay"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="max-reconnect-delay">Max Reconnect Delay</FieldLabel>
                <FieldDescription>
                  Maximum time to wait between reconnects, in milliseconds. Set to 0 for no limit on wait time.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <Input
                id="max-reconnect-delay"
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
          name="settings.heartbeatIncoming"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="heartbeat-incoming">Heartbeat Incoming</FieldLabel>
                <FieldDescription>Incoming heartbeat interval in milliseconds. Set to 0 to disable.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <Input
                id="heartbeat-incoming"
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
          name="settings.heartbeatOutgoing"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="heartbeat-outgoing">Heartbeat Outgoing</FieldLabel>
                <FieldDescription>Outgoing heartbeat interval in milliseconds. Set to 0 to disable.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <Input
                id="heartbeat-outgoing"
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
          name="settings.splitLargeFrames"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel>Split Large Frames</FieldLabel>
                <FieldDescription>
                  This switches on a non-standard behavior while sending WebSocket packets. It splits larger (text)
                  packets into chunks of `Max WebSocket Chunk Size`. Only Java Spring brokers seem to support this mode.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <Toggle
                data-state={field.value ? 'on' : 'off'}
                variant="ghost"
                onClick={() => field.onChange(!field.value)}
                className="w-30"
              >
                {field.value ? 'Enabled' : 'Disabled'}
              </Toggle>
            </Field>
          )}
        />

        <Controller
          name="settings.maxWebSocketChunkSize"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="max-websocket-chunk-size">Max WebSocket Chunk Size</FieldLabel>
                <FieldDescription>
                  Maximum allowed message size in bytes. This has no effect if `Split Large Frames` is not enabled.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <Input
                id="max-websocket-chunk-size"
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

export default StompSettings;
