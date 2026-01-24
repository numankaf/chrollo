import { useEffect, useEffectEvent, useState } from 'react';
import { useAppConfigStore } from '@/store/app-config-store';
import { formatCode } from '@/utils/editor-util';
import { getMessageContentType } from '@/utils/socket-message-util';
import { Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { REQUEST_BODY_TYPE, type RequestBodyType } from '@/types/collection';
import { REQUEST_STATUS, type TrackedRequest } from '@/types/request-response';
import { deepParseJson } from '@/lib/utils';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { useRequestResponse } from '@/hooks/connection/use-request-response';
import { ScrollArea } from '@/components/common/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';
import CodeEditor from '@/components/app/editor/code-editor';
import ComingSoon from '@/components/app/empty/coming-soon';
import { BodyTypeSelector } from '@/components/app/socket/console/common/body-type-selector';
import { MessageHeadersTable } from '@/components/app/socket/console/common/message-headers-table';

function SocketResponseConsole() {
  const { activeConnection } = useActiveItem();
  const { activeTab } = useActiveItem();

  const { getByRequestId } = useRequestResponse(activeConnection?.id);

  const { applicationSettings } = useAppConfigStore(
    useShallow((state) => ({
      applicationSettings: state.applicationSettings,
    }))
  );

  const [trackedRequest, setTrackedRequest] = useState<TrackedRequest | undefined>(undefined);

  const message = trackedRequest?.response;
  const isPending = trackedRequest?.status === REQUEST_STATUS.PENDING;

  const headers = message?.meta?.headers || {};
  const bodyTypeRetrieved = getMessageContentType(headers);

  const [bodyType, setBodyType] = useState<RequestBodyType>(bodyTypeRetrieved);

  const updateTrackedRequest = useEffectEvent((request: TrackedRequest | undefined) => {
    setTrackedRequest(request);
  });

  const updateBodyType = useEffectEvent((c: RequestBodyType) => {
    setBodyType(c);
  });

  const parsedStringResponse =
    message && bodyType === REQUEST_BODY_TYPE.JSON
      ? JSON.stringify(deepParseJson(message.data, applicationSettings.formatResponses))
      : message?.data || '';

  useEffect(() => {
    if (activeTab?.id) {
      const trackedRequest = getByRequestId(activeTab.id);
      updateTrackedRequest(trackedRequest);
    }
  }, [activeTab, getByRequestId]);

  useEffect(() => {
    if (message) {
      updateBodyType(bodyTypeRetrieved);
    }
  }, [bodyTypeRetrieved, message]);

  return (
    <div className="flex flex-col w-full px-2 flex-1 min-h-0 h-full">
      <Tabs variant="link" defaultValue="body" className="w-full flex-1 flex flex-col min-h-0">
        <TabsList>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="test-results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="body" className="flex-1 flex flex-col min-h-0 mb-2 h-full">
          <div className="flex justify-between mb-1 items-center">
            <BodyTypeSelector
              value={bodyType}
              onValueChange={(value) => setBodyType(value as RequestBodyType)}
              options={Object.values(REQUEST_BODY_TYPE)}
            />
          </div>
          <div className="flex-1 min-h-0 border rounded-lg overflow-hidden flex flex-col relative">
            {isPending ? (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground z-10 bg-background/50 gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending Request...
              </div>
            ) : !message ? (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground z-10 bg-background/50">
                No response available
              </div>
            ) : null}
            <ScrollArea className="h-full">
              <CodeEditor bodyType={bodyType} value={formatCode(bodyType, parsedStringResponse)} readOnly />
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="headers" className="flex-1 flex flex-col min-h-0 mb-2 h-full">
          <MessageHeadersTable headers={headers as Record<string, unknown>} />
        </TabsContent>

        <TabsContent value="test-results">
          <ComingSoon />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SocketResponseConsole;
