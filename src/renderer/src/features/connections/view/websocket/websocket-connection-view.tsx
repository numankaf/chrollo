import { useEffect } from 'react';
import { WEBSOCKET_VALIDATION_SCHEMA } from '@/constants/connection/websocket/websocket-schema';
import ConnectionButton from '@/features/connections/components/common/connection-button';
import ConnectionHeaders from '@/features/connections/components/common/connection-headers';
import WebsocketSettings from '@/features/connections/components/websocket/websocket-settings';
import useConnectionStore from '@/store/connection-store';
import { connectWebSocket, disconnectWebSocket } from '@/utils/ws-util';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm, useFormState, useWatch } from 'react-hook-form';
import { useParams } from 'react-router';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { type WebSocketConnection } from '@/types/connection';
import { InputGroup } from '@/components/common/input-group';
import { ScrollArea } from '@/components/common/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';
import { VariableInput } from '@/components/common/variable-input';

function WebsocketConnectionView() {
  const { id } = useParams();
  const { connection, updateConnection } = useConnectionStore(
    useShallow((state) => ({
      updateConnection: state.updateConnection,
      connection: state.connections.find((c) => c.id === id),
    }))
  );
  const form = useForm<z.infer<typeof WEBSOCKET_VALIDATION_SCHEMA>>({
    resolver: zodResolver(WEBSOCKET_VALIDATION_SCHEMA),
    defaultValues: { ...connection },
    values: { ...connection } as z.infer<typeof WEBSOCKET_VALIDATION_SCHEMA>,
  });

  const watchedValues = useWatch({
    control: form.control,
  });
  const { dirtyFields } = useFormState({
    control: form.control,
  });
  useEffect(() => {
    const dirtyKeys = Object.keys(dirtyFields);
    if (!watchedValues || dirtyKeys.length === 0) return;
    const shouldDebounce = dirtyKeys.some((key) => ['url', 'settings'].includes(key));
    if (shouldDebounce) {
      const t = setTimeout(() => {
        updateConnection(watchedValues as unknown as WebSocketConnection);
      }, 500);
      return () => clearTimeout(t);
    } else {
      updateConnection(watchedValues as unknown as WebSocketConnection);
      return () => {};
    }
  }, [updateConnection, watchedValues, dirtyFields]);

  if (!connection) return <></>;

  return (
    <div className="max-h-full h-full flex flex-col">
      <FormProvider {...form}>
        <form className="h-full flex flex-col" noValidate>
          <div className="p-2 w-full flex items-center justify-between gap-2 h-10">
            <InputGroup>
              <Controller
                name="url"
                control={form.control}
                render={({ field: urlField, fieldState }) => (
                  <VariableInput
                    placeholder="Enter URL"
                    className="pl-1.5 text-sm!"
                    value={urlField.value}
                    onChange={urlField.onChange}
                    aria-invalid={!!fieldState.error}
                  />
                )}
              />
            </InputGroup>
            <ConnectionButton
              connection={connection}
              onConnect={() =>
                form.handleSubmit((data) => {
                  connectWebSocket(data as WebSocketConnection);
                })()
              }
              onDisconnect={(connectionId: string) => disconnectWebSocket(connectionId)}
            />
          </div>
          <Tabs
            defaultValue="settings"
            selectionId="websocket-connection-view-tab"
            className="w-full mt-3 min-h-0 flex-1 flex flex-col"
            variant="link"
          >
            <TabsList className="mx-2">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
            </TabsList>
            <ScrollArea className="min-h-0 flex-1">
              <TabsContent className="mx-2" value="settings">
                <WebsocketSettings />
              </TabsContent>
              <TabsContent value="headers">
                <Controller
                  name="connectHeaders"
                  control={form.control}
                  render={({ field }) => <ConnectionHeaders headers={field.value} />}
                />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </form>
      </FormProvider>
    </div>
  );
}

export default WebsocketConnectionView;
