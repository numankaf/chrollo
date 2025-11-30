import { useEffect } from 'react';
import { REQUEST_VALIDATION_SCHEMA } from '@/constants/collection/request-schema';
import RequestBody from '@/features/collections/components/request/request-body';
import RequestViewHeader from '@/features/collections/components/request/request-view-header';
import useCollectionItemStore from '@/store/collection-item-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import type { Request } from '@/types/collection';
import { useActiveItem } from '@/hooks/workspace/use-active-item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';

function RequestView() {
  const { activeTab } = useActiveItem();
  const { collectionItemMap, updateCollectionItem } = useCollectionItemStore(
    useShallow((state) => ({
      updateCollectionItem: state.updateCollectionItem,
      collectionItemMap: state.collectionItemMap,
    }))
  );

  const request = activeTab?.id ? (collectionItemMap.get(activeTab.id) as Request) : undefined;

  const form = useForm<z.infer<typeof REQUEST_VALIDATION_SCHEMA>>({
    resolver: zodResolver(REQUEST_VALIDATION_SCHEMA),
    defaultValues: request ? { ...request } : undefined,
    values: request ? ({ ...request } as z.infer<typeof REQUEST_VALIDATION_SCHEMA>) : undefined,
  });

  const watchedValues = useWatch({
    control: form.control,
  });

  useEffect(() => {
    if (watchedValues) {
      updateCollectionItem(watchedValues as unknown as Request);
    }
  }, [updateCollectionItem, watchedValues]);

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
              <TabsTrigger value="scipts">Scripts</TabsTrigger>
            </TabsList>
            <TabsContent value="docs">Docs</TabsContent>
            <TabsContent value="headers">Headers</TabsContent>
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
