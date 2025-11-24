import StompHeaders from '@/features/connections/components/stomp/stomp-headers';
import StompSettings from '@/features/connections/components/stomp/stomp-settings';
import StompSubsciptions from '@/features/connections/components/stomp/stomp-subscriptions';
import { STOMP_DEFAULT_VALUES, STOMP_VALIDATION_SCHEMA } from '@/features/connections/constants/stomp/stomp-schema';
import useConnectionStore from '@/store/connection-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDownIcon } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/components/common/button';
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
  const { id } = useParams<{ id: string }>();
  const { getConnection } = useConnectionStore(
    useShallow((state) => ({
      getConnection: state.getConnection,
    }))
  );

  const connection = id ? getConnection(id) : undefined;

  const form = useForm<z.infer<typeof STOMP_VALIDATION_SCHEMA>>({
    resolver: zodResolver(STOMP_VALIDATION_SCHEMA),
    defaultValues: STOMP_DEFAULT_VALUES,
  });

  function onSubmit(data: z.infer<typeof STOMP_VALIDATION_SCHEMA>) {
    console.log(data);
  }

  if (!connection) return <div>Connection not found</div>;

  return (
    <div className="h-full">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="flex gap-2 mx-2">
            <InputGroup>
              <InputGroupAddon>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <InputGroupButton variant="ghost" className="pr-1.5! text-foreground">
                      https:// <ChevronDownIcon className="size-3" />
                    </InputGroupButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>http://</DropdownMenuItem>
                    <DropdownMenuItem>https://</DropdownMenuItem>
                    <DropdownMenuItem>ws://</DropdownMenuItem>
                    <DropdownMenuItem>wss://</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </InputGroupAddon>
              <InputGroupInput placeholder="Enter URL" className="pl-0.5!" />
            </InputGroup>
            <Button onClick={() => form.handleSubmit(onSubmit)}>Connect</Button>
          </div>
          <Tabs
            defaultValue="settings"
            className="w-full mt-3"
            variant="link"
            style={{ height: 'calc(100% - 6.25rem)' }}
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
