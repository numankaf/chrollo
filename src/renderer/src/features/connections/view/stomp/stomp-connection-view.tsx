import { useEffect } from 'react';
import { URL_SCHEME_COLORS } from '@/constants/color-constants';
import { STOMP_VALIDATION_SCHEMA } from '@/constants/connection/stomp/stomp-schema';
import ConnectionButton from '@/features/connections/components/common/connection-button';
import StompHeaders from '@/features/connections/components/stomp/stomp-headers';
import StompSettings from '@/features/connections/components/stomp/stomp-settings';
import StompSubsciptions from '@/features/connections/components/stomp/stomp-subscriptions';
import useConnectionStore from '@/store/connection-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDownIcon } from 'lucide-react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { WS_URL_SCHEME, type Connection } from '@/types/connection';
import { useActiveItem } from '@/hooks/workspace/use-active-item';
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

  useEffect(() => {
    if (watchedValues) {
      updateConnection(watchedValues as Connection);
    }
  }, [updateConnection, watchedValues]);

  function onSubmit(data: z.infer<typeof STOMP_VALIDATION_SCHEMA>) {
    window.api.stomp.connect(data);
  }

  if (!connection) return <div>Connection not found</div>;

  return (
    <div className="h-full">
      <FormProvider {...form}>
        <form className="h-full" noValidate>
          <div className="flex gap-2 m-2">
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
              onConnect={(connection: Connection) => window.api.stomp.connect(connection)}
              onDisconnect={(conenctionId: string) => window.api.stomp.disconnect(conenctionId)}
            />
          </div>
          <Tabs
            defaultValue="settings"
            className="w-full mt-3"
            variant="link"
            style={{ height: 'calc(100% - 6.5rem)' }}
          >
            <TabsList className="mx-2">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-full">
              <TabsContent className="mx-2" value="settings">
                <StompSettings />
              </TabsContent>
              <TabsContent value="headers">
                <StompHeaders />
              </TabsContent>
              <TabsContent value="subscriptions">
                <StompSubsciptions />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </form>
      </FormProvider>
    </div>
  );
}

export default StompConnectionView;
