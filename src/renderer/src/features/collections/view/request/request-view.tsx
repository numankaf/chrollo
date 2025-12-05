import { useEffect } from 'react';
import { REQUEST_VALIDATION_SCHEMA } from '@/constants/collection/request-schema';
import RequestBody from '@/features/collections/components/request/request-body';
import RequestHeaders from '@/features/collections/components/request/request-headers';
import RequestViewHeader from '@/features/collections/components/request/request-view-header';
import useCollectionItemStore from '@/store/collection-item-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import type { Request } from '@/types/collection';
import { useActiveItem } from '@/hooks/use-active-item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';

function RequestView() {
  const { activeTab } = useActiveItem();
  const { request, updateCollectionItem } = useCollectionItemStore(
    useShallow((state) => ({
      updateCollectionItem: state.updateCollectionItem,
      request: activeTab?.id ? (state.collectionItemMap.get(activeTab.id) as Request) : undefined,
    }))
  );
  const form = useForm<z.infer<typeof REQUEST_VALIDATION_SCHEMA>>({
    resolver: zodResolver(REQUEST_VALIDATION_SCHEMA),
    defaultValues: { ...request },
    values: { ...request } as z.infer<typeof REQUEST_VALIDATION_SCHEMA>,
  });

  const watchedValues = useWatch({
    control: form.control,
  });

  useEffect(() => {
    if (!watchedValues) return;

    const handler = setTimeout(() => {
      updateCollectionItem(watchedValues as Request);
    }, 500);

    return () => clearTimeout(handler);
  }, [watchedValues, updateCollectionItem]);

  if (!request) return <div>Request not found</div>;
  return (
    <div className="h-full">
      <FormProvider {...form}>
        <form className="h-full" noValidate>
          <RequestViewHeader />
          <Tabs defaultValue="body" className="w-full mt-3" variant="link" style={{ height: 'calc(100% - 6.5rem)' }}>
            <TabsList className="mx-2">
              <TabsTrigger value="docs">Docs</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="scripts">Scripts</TabsTrigger>
            </TabsList>
            <TabsContent value="docs">Docs</TabsContent>
            <TabsContent value="headers">
              <RequestHeaders headers={request.headers} />
            </TabsContent>
            <TabsContent value="body">
              <RequestBody />
            </TabsContent>
            <TabsContent value="scripts">scripts</TabsContent>
          </Tabs>
        </form>
      </FormProvider>
    </div>
  );
}

export default RequestView;
