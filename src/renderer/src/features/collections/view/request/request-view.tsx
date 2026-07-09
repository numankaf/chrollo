import { useEffect, useMemo } from 'react';
import { getRequestValidationSchema, type REQUEST_VALIDATION_SCHEMA } from '@/constants/collection/request-schema';
import RequestBody from '@/features/collections/components/request/request-body';
import RequestDocs from '@/features/collections/components/request/request-docs';
import RequestHeaders from '@/features/collections/components/request/request-headers';
import RequestScripts from '@/features/collections/components/request/request-scripts';
import RequestViewHeader from '@/features/collections/components/request/request-view-header';
import useCollectionItemStore from '@/store/collection-item-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormState, useWatch } from 'react-hook-form';
import { useParams } from 'react-router';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { type Request } from '@/types/collection';
import { CONNECTION_TYPE } from '@/types/connection';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { ScrollArea } from '@/components/common/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';

function RequestView() {
  const { id } = useParams();
  const { activeConnection } = useActiveItem();
  const isStompConnection = activeConnection?.connectionType === CONNECTION_TYPE.STOMP;
  // Scope tab persistence by connection type so the non-STOMP bucket can never restore the
  // (hidden) Headers tab, which would otherwise render an empty page after switching connections.
  const tabSelectionId = `request-view-tab-${activeConnection?.connectionType ?? 'none'}`;
  const { request, updateCollectionItem } = useCollectionItemStore(
    useShallow((state) => ({
      updateCollectionItem: state.updateCollectionItem,
      request: id ? (state.collectionItemMap.get(id) as Request) : undefined,
    }))
  );
  const schema = useMemo(
    () => getRequestValidationSchema(activeConnection?.connectionType),
    [activeConnection?.connectionType]
  );
  const form = useForm<z.infer<typeof REQUEST_VALIDATION_SCHEMA>>({
    resolver: zodResolver(schema),
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
    const shouldDebounce = dirtyKeys.some((key) => ['destination', 'body', 'documentation', 'scripts'].includes(key));
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
    <div className="h-full flex flex-col">
      <FormProvider {...form}>
        <form className="h-full flex flex-col overflow-hidden" noValidate>
          <RequestViewHeader />
          <Tabs
            key={tabSelectionId}
            defaultValue="body"
            selectionId={tabSelectionId}
            className="w-full mt-3 flex-1 min-h-0 flex flex-col"
            variant="link"
          >
            <TabsList className="mx-2 shrink-0">
              <TabsTrigger value="docs">Docs</TabsTrigger>
              {isStompConnection && <TabsTrigger value="headers">Headers</TabsTrigger>}
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="scripts">Scripts</TabsTrigger>
            </TabsList>
            <div className="flex-1 min-h-0 relative">
              <TabsContent value="docs" className="h-full absolute inset-0">
                <RequestDocs key={request.id} />
              </TabsContent>
              {isStompConnection && (
                <TabsContent value="headers" className="h-full absolute inset-0">
                  <ScrollArea className="h-full">
                    <RequestHeaders headers={request.headers} />
                  </ScrollArea>
                </TabsContent>
              )}
              <TabsContent className="h-full absolute inset-0" value="body">
                <RequestBody />
              </TabsContent>
              <TabsContent value="scripts" className="h-full absolute inset-0">
                <RequestScripts key={request.id} />
              </TabsContent>
            </div>
          </Tabs>
        </form>
      </FormProvider>
    </div>
  );
}

export default RequestView;
