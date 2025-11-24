import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/common/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/common/field';
import { Input } from '@/components/common/input';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/components/common/input-group';

const formSchema = z.object({
  title: z
    .string()
    .min(5, 'Bug title must be at least 5 characters.')
    .max(32, 'Bug title must be at most 32 characters.'),
  description: z.z
    .string()
    .min(20, 'Description must be at least 20 characters.')
    .max(100, 'Description must be at most 100 characters.'),
});

function StompSettings() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    console.log(data);
  }

  const [on, setOn] = useState(false);
  return (
    <div className="m-1 space-y-4">
      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">Bug Title</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Login button not working on mobile"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-description">Description</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="form-rhf-demo-description"
                    placeholder="I'm having an issue with the login button on mobile."
                    rows={6}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">{field.value.length}/100 characters</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  Include steps to reproduce, expected behavior, and what actually happened.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1">
          <p className="">Connection Timeout</p>
          <p className="text-muted-foreground text-sm">
            Will retry if Stomp connection is not established in specified milliseconds.
          </p>
          <p className="text-muted-foreground text-sm"> Default 0, which switches off automatic reconnection.</p>
        </div>
        <Input className="w-25 h-8" type="number" value={0} onChange={() => {}} />
      </div>
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1">
          <p className="">Reconnection Delay</p>
          <p className="text-muted-foreground text-sm">
            Automatically reconnect with delay in milliseconds, set to 0 to disable.
          </p>
        </div>
        <Input className="w-25 h-8" type="number" value={5000} onChange={() => {}} />
      </div>
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1">
          <p className="">Max Reconnect Delay</p>
          <p className="text-muted-foreground text-sm">
            Maximum time to wait between reconnects, in milliseconds. Set to 0 for no limit on wait time.
          </p>
        </div>
        <Input className="w-25 h-8" type="number" value={30000} onChange={() => {}} />
      </div>
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1">
          <p className="">Heartbeat Incoming</p>
          <div className="text-muted-foreground text-sm">
            <p className="">Incoming heartbeat interval in milliseconds. Set to 0 to disable.</p>
          </div>
        </div>
        <Input className="w-25 h-8" type="number" value={10000} onChange={() => {}} />
      </div>
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1">
          <p className="">Heartbeat Outgoing</p>
          <p className="text-muted-foreground text-sm">
            Outgoing heartbeat interval in milliseconds. Set to 0 to disable.
          </p>
        </div>
        <Input className="w-25 h-8" type="number" value={10000} onChange={() => {}} />
      </div>
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1">
          <p className="">Split Large Frames</p>
          <p className="text-muted-foreground text-sm">
            This switches on a non-standard behavior while sending WebSocket packets.
          </p>
          <p className="text-muted-foreground text-sm">
            It splits larger (text) packets into chunks of `Max WebSocket Chunk Size`.
          </p>
          <p className="text-muted-foreground text-sm">
            Only Java Spring brokers seem to support this mode. WebSockets, by itself, split large (text) packets.
          </p>
        </div>
        <Button
          className="w-25 h-8"
          variant="toggle"
          data-state={on ? 'on' : 'off'}
          onClick={() => setOn((prev) => !prev)}
        >
          {on ? 'Enabled' : 'Disabled'}
        </Button>
      </div>
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1">
          <p className="">Max WebSocket Chunk Size</p>
          <div className="text-muted-foreground text-sm">
            <p className="">
              Maximum allowed message size in MB. This has no effect if `Split Large Frames` is not enabled.
            </p>
          </div>
        </div>
        <Input className="w-25 h-8" type="number" value={10} onChange={() => {}} />
      </div>
    </div>
  );
}

export default StompSettings;
