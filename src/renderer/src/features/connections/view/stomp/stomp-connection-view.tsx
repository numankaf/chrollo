import { useEffect } from 'react';
import { URL_SCHEME_COLORS } from '@/constants/color-constants';
import { STOMP_VALIDATION_SCHEMA } from '@/constants/connection/stomp/stomp-schema';
import ConnectionButton from '@/features/connections/components/common/connection-button';
import StompHeaders from '@/features/connections/components/stomp/stomp-headers';
import StompSettings from '@/features/connections/components/stomp/stomp-settings';
import StompSubsciptions from '@/features/connections/components/stomp/stomp-subscriptions';
import useConnectionStore from '@/store/connection-store';
import { connectStomp, disconnectStomp } from '@/utils/stomp-util';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDownIcon } from 'lucide-react';
import { Controller, FormProvider, useForm, useFormState, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { WS_URL_SCHEME, type StompConnection } from '@/types/connection';
import { useActiveItem } from '@/hooks/app/use-active-item';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/common/input-group';
import { ScrollArea } from '@/components/common/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';

function StompConnectionView() {
  const { activeTab } = useActiveItem();
  const { connection, updateConnection } = useConnectionStore(
    useShallow((state) => ({
      updateConnection: state.updateConnection,
      connection: state.connections.find((c) => c.id === activeTab?.id),
    }))
  );
  const form = useForm<z.infer<typeof STOMP_VALIDATION_SCHEMA>>({
    resolver: zodResolver(STOMP_VALIDATION_SCHEMA),
    defaultValues: { ...connection },
    values: { ...connection } as z.infer<typeof STOMP_VALIDATION_SCHEMA>,
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
        updateConnection(watchedValues as unknown as StompConnection);
      }, 500);
      return () => clearTimeout(t);
    } else {
      updateConnection(watchedValues as unknown as StompConnection);
      return () => {};
    }
  }, [updateConnection, watchedValues, dirtyFields]);

  if (!connection) return <div>Connection not found</div>;

  return (
    <div className="max-h-full h-full flex flex-col">
      <FormProvider {...form}>
        <form className="h-full" noValidate>
          <div className="flex gap-2 m-2 h-10">
            <Controller
              name="prefix"
              control={form.control}
              render={({ field }) => (
                <InputGroup>
                  <InputGroupAddon>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <InputGroupButton
                          variant="ghost"
                          className="-ml-1.5 pr-1.5! w-20 flex items-center justify-between text-foreground h-full border-r"
                        >
                          <span className={URL_SCHEME_COLORS[field.value]}>{field.value}</span>
                          <ChevronDownIcon className="size-3" />
                        </InputGroupButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {Object.values(WS_URL_SCHEME).map((scheme) => (
                          <DropdownMenuItem
                            key={scheme}
                            onClick={() => field.onChange(scheme)}
                            className={URL_SCHEME_COLORS[scheme]}
                          >
                            {scheme}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </InputGroupAddon>

                  <Controller
                    name="url"
                    control={form.control}
                    render={({ field: urlField, fieldState }) => (
                      <InputGroupInput
                        placeholder="Enter URL"
                        className="pl-1.5!"
                        value={urlField.value}
                        onChange={urlField.onChange}
                        aria-invalid={!!fieldState.error}
                      />
                    )}
                  />
                </InputGroup>
              )}
            />
            <ConnectionButton
              connection={connection}
              onConnect={() =>
                form.handleSubmit((data) => {
                  connectStomp(data as StompConnection);
                })()
              }
              onDisconnect={(conenctionId: string) => disconnectStomp(conenctionId)}
            />
          </div>
          <Tabs defaultValue="settings" className="w-full mt-3 h-full flex-1" variant="link">
            <TabsList className="mx-2">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            </TabsList>
            <ScrollArea style={{ height: 'calc(100% - 6.5rem)' }}>
              <TabsContent className="mx-2" value="settings">
                <StompSettings />
              </TabsContent>
              <TabsContent value="headers">
                <Controller
                  name="connectHeaders"
                  control={form.control}
                  render={({ field }) => <StompHeaders headers={field.value} />}
                />
              </TabsContent>
              <TabsContent value="subscriptions">
                <Controller
                  name="subscriptions"
                  control={form.control}
                  render={({ field }) => <StompSubsciptions subscriptions={field.value} />}
                />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </form>
      </FormProvider>
    </div>
  );
}

export default StompConnectionView;
