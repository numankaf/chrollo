import { useEffect } from 'react';
import { REQUEST_VALIDATION_SCHEMA } from '@/constants/collection/request-schema';
import RequestBody from '@/features/collections/components/request/request-body';
import RequestHeaders from '@/features/collections/components/request/request-headers';
import RequestViewHeader from '@/features/collections/components/request/request-view-header';
import useCollectionItemStore from '@/store/collection-item-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormState, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { type Request } from '@/types/collection';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { ScrollArea } from '@/components/common/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';
import ComingSoon from '@/components/app/empty/coming-soon';

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
  const { dirtyFields } = useFormState({
    control: form.control,
  });
  useEffect(() => {
    const dirtyKeys = Object.keys(dirtyFields);
    if (!watchedValues || dirtyKeys.length === 0) return;
    const shouldDebounce = dirtyKeys.some((key) => ['destination', 'body'].includes(key));
    if (shouldDebounce) {
      const t = setTimeout(() => {
        updateCollectionItem(watchedValues as Request);
      }, 500);
      return () => clearTimeout(t);
    } else {
      updateCollectionItem(watchedValues as Request);
      return () => {};
    }
  }, [watchedValues, updateCollectionItem, dirtyFields]);

  if (!request) return <></>;
  return (
    <div className="max-h-full h-full flex flex-col">
      <FormProvider {...form}>
        <form className="h-full" noValidate>
          <RequestViewHeader />
          <Tabs defaultValue="body" className="w-full mt-3 h-full flex-1" variant="link">
            <TabsList className="mx-2">
              <TabsTrigger value="docs">Docs</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="scripts">Scripts</TabsTrigger>
            </TabsList>
            <div style={{ height: 'calc(100% - 6rem)', minHeight: 'calc(100% - 6rem)' }}>
              <TabsContent value="docs">
                <ComingSoon />
              </TabsContent>
              <TabsContent value="headers" className="h-full">
                <ScrollArea className="h-full">
                  <RequestHeaders headers={request.headers} />
                </ScrollArea>
              </TabsContent>
              <TabsContent className="h-full" value="body">
                <RequestBody />
              </TabsContent>
              <TabsContent value="scripts">
                <ComingSoon />
              </TabsContent>
            </div>
          </Tabs>
        </form>
      </FormProvider>
    </div>
  );
}

export default RequestView;
