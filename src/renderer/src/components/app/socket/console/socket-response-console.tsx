import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { useAppConfigStore } from '@/store/app-config-store';
import { formatCode } from '@/utils/editor-util';
import { getMessageContentType } from '@/utils/socket-message-util';
import { Ellipsis, Loader2Icon } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { REQUEST_BODY_TYPE, type RequestBodyType } from '@/types/collection';
import { REQUEST_STATUS, type TrackedRequest } from '@/types/request-response';
import { SOCKET_MESSAGE_TYPE } from '@/types/socket';
import { calculateStringSize, deepParseJson, formatBytes } from '@/lib/utils';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { useRequestResponse } from '@/hooks/connection/use-request-response';
import { Badge } from '@/components/common/badge';
import { Button } from '@/components/common/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';
import { ScrollArea } from '@/components/common/scroll-area';
import { Separator } from '@/components/common/seperator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/common/tooltip';
import CodeEditor from '@/components/app/editor/code-editor';
import ComingSoon from '@/components/app/empty/coming-soon';
import NoResponseFound from '@/components/app/empty/no-response-found';
import { BodyTypeSelector } from '@/components/app/socket/console/common/body-type-selector';
import { MessageHeadersTable } from '@/components/app/socket/console/common/message-headers-table';
import { SocketConsoleMessageIcon } from '@/components/icon/socket-console-message-icon';

function LoadingOverlay({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;
  return <div className="absolute inset-0 flex items-center justify-center z-50 bg-background/70  select-none" />;
}

function TrackedRequestStatusBadge({ trackedRequest }: { trackedRequest: TrackedRequest }) {
  const { status } = trackedRequest;
  if (status === REQUEST_STATUS.PENDING) {
    return (
      <Badge variant="secondary-bordered-ghost" className="text-sm">
        PENDING
      </Badge>
    );
  }
  if (status === REQUEST_STATUS.RESOLVED) {
    return (
      <Badge variant="success-bordered-ghost" className="text-sm">
        RESOLVED
      </Badge>
    );
  }
  if (status === REQUEST_STATUS.CANCELED) {
    return (
      <Badge variant="error-bordered-ghost" className="text-sm">
        CANCELED
      </Badge>
    );
  }
  return (
    <Badge variant="secondary-bordered-ghost" className="text-sm">
      UNKNOWN
    </Badge>
  );
}

function ResponseStatusBar({ trackedRequest }: { trackedRequest: TrackedRequest }) {
  const { request, response, startTime, endTime } = trackedRequest;
  const { activeConnection } = useActiveItem();
  const { clearRequest } = useRequestResponse(activeConnection?.id);

  const handleClear = () => {
    if (trackedRequest?.requestId) {
      clearRequest(trackedRequest?.requestId);
    }
  };
  const duration = useMemo(() => {
    if (!startTime || !endTime) return null;
    return endTime - startTime;
  }, [startTime, endTime]);

  const requestStats = useMemo(() => {
    if (!request) return { headers: 0, body: 0, total: 0 };
    const headersSize = request.headers
      .filter((h) => h.enabled)
      .reduce((acc, h) => acc + calculateStringSize(h.key) + calculateStringSize(h.value), 0);
    const bodySize = calculateStringSize(request.body.data);
    return {
      headers: headersSize,
      body: bodySize,
      total: headersSize + bodySize,
    };
  }, [request]);

  const responseStats = useMemo(() => {
    if (!response) return { headers: 0, body: 0, total: 0 };
    const headers = response.meta?.headers || {};
    const headersSize = Object.entries(headers).reduce(
      (acc, [k, v]) => acc + calculateStringSize(k) + calculateStringSize(String(v)),
      0
    );
    const bodySize = calculateStringSize(response.data);
    return {
      headers: headersSize,
      body: bodySize,
      total: headersSize + bodySize,
    };
  }, [response]);

  if (!response) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <TrackedRequestStatusBadge trackedRequest={trackedRequest} />
      <Separator orientation="vertical" className="h-3.5!" />
      {duration !== null && (
        <span className="text-muted-foreground hover:text-foreground cursor-default">{duration} ms</span>
      )}
      <Separator orientation="vertical" className="h-3.5!" />
      <TooltipProvider delayDuration={500}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-muted-foreground cursor-default hover:text-foreground ">
              {formatBytes(responseStats.total)}
            </span>
          </TooltipTrigger>
          <TooltipContent
            showArrow={false}
            side="bottom"
            className="bg-card w-64 p-3 grid gap-3 text-sm z-50 border shadow-md"
            align="center"
          >
            <div className="grid gap-1">
              <div className="flex items-center justify-between text-foreground">
                <div className="flex items-center gap-2">
                  <SocketConsoleMessageIcon messageType={SOCKET_MESSAGE_TYPE.RECEIVED} size={12} />
                  <span>Response Size</span>
                </div>
                <span>{formatBytes(responseStats.total)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Headers</span>
                <span>{formatBytes(responseStats.headers)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Body</span>
                <span>{formatBytes(responseStats.body)}</span>
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="grid gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-foreground">
                  <SocketConsoleMessageIcon messageType={SOCKET_MESSAGE_TYPE.SENT} size={12} />
                  <span>Request Size</span>
                </div>
                <span>{formatBytes(requestStats.total)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Headers</span>
                <span>{formatBytes(requestStats.headers)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Body</span>
                <span>{formatBytes(requestStats.body)}</span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Separator orientation="vertical" className="h-3.5!" />
      <Button variant="ghost" size="sm" className="text-muted-foreground! h-6! px-0.5">
        Save Response
      </Button>
      <Separator orientation="vertical" className="h-3.5!" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="">
          <Button asChild size="icon" variant="ghost" className="text-muted-foreground! w-6! h-6! p-0.5 rounded-md ">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="data-[state=closed]:animate-none!">
          <DropdownMenuItem className="h-7! text-sm!">Save Response To File</DropdownMenuItem>
          <DropdownMenuItem className="h-7! text-sm!" onClick={handleClear}>
            Clear Response
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function SocketResponseConsole() {
  const { activeConnection } = useActiveItem();
  const { activeTab } = useActiveItem();

  const { getByRequestId, getLastResolvedByRequestId, cancel } = useRequestResponse(activeConnection?.id);

  const { applicationSettings } = useAppConfigStore(
    useShallow((state) => ({
      applicationSettings: state.applicationSettings,
    }))
  );

  const [lastTrackedRequest, setLastTrackedRequest] = useState<TrackedRequest | undefined>(undefined);
  const [trackedRequest, setTrackedRequest] = useState<TrackedRequest | undefined>(undefined);

  const updateTrackedRequest = useEffectEvent((request: TrackedRequest | undefined) => {
    setTrackedRequest(request);
  });

  const updateLastTrackedRequest = useEffectEvent((request: TrackedRequest | undefined) => {
    setLastTrackedRequest(request);
  });

  useEffect(() => {
    if (!activeTab) return;
    const request = getByRequestId(activeTab.id);
    updateTrackedRequest(request);

    const lastResolvedRequest = getLastResolvedByRequestId(activeTab.id);
    updateLastTrackedRequest(lastResolvedRequest);
  }, [activeTab, getByRequestId, getLastResolvedByRequestId]);

  const message = lastTrackedRequest?.response;
  const headers = message?.meta?.headers || {};
  const bodyTypeRetrieved = getMessageContentType(headers);

  const [bodyType, setBodyType] = useState<RequestBodyType>(bodyTypeRetrieved);

  const updateBodyType = useEffectEvent((c: RequestBodyType) => {
    setBodyType(c);
  });

  useEffect(() => {
    if (message) {
      updateBodyType(bodyTypeRetrieved);
    }
  }, [bodyTypeRetrieved, message]);

  const parsedStringResponse =
    message && bodyType === REQUEST_BODY_TYPE.JSON
      ? JSON.stringify(deepParseJson(message.data, applicationSettings.formatResponses))
      : message?.data || '';

  const isLoading = !!(trackedRequest && trackedRequest.status === REQUEST_STATUS.PENDING);
  return (
    <div className="flex flex-col w-full px-2 flex-1 min-h-0 h-full relative">
      {!lastTrackedRequest && (
        <div>
          <div className="flex items-center justify-end h-7">
            {isLoading && (
              <Button
                variant="error-bordered-ghost"
                size="sm"
                className="h-7! px-0.5"
                onClick={() => cancel(trackedRequest.requestId)}
              >
                <Loader2Icon className="animate-spin" />
                Cancel
              </Button>
            )}
          </div>
          <div className="flex-1 flex flex-col min-h-0 mb-2 h-full relative">
            <LoadingOverlay isLoading={isLoading} />
            <NoResponseFound />
          </div>
        </div>
      )}

      {lastTrackedRequest && (
        <Tabs variant="link" defaultValue="body" className="w-full flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="test-results">Test Results</TabsTrigger>
            </TabsList>
            {!isLoading && <ResponseStatusBar trackedRequest={lastTrackedRequest} />}
            {isLoading && (
              <Button
                variant="error-bordered-ghost"
                size="sm"
                className="h-7! px-0.5"
                onClick={() => cancel(trackedRequest.requestId)}
              >
                <Loader2Icon className="animate-spin" />
                Cancel
              </Button>
            )}
          </div>

          <TabsContent value="body" className="flex-1 flex flex-col min-h-0 mb-2 h-full relative">
            <LoadingOverlay isLoading={isLoading} />
            <div className="flex justify-between mb-1 items-center">
              <BodyTypeSelector
                value={bodyType}
                onValueChange={(value) => setBodyType(value as RequestBodyType)}
                options={Object.values(REQUEST_BODY_TYPE)}
              />
            </div>
            <div className="flex-1 min-h-0 border rounded-lg overflow-hidden flex flex-col relative">
              <ScrollArea className="h-full">
                <CodeEditor bodyType={bodyType} value={formatCode(bodyType, parsedStringResponse)} readOnly />
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="headers" className="flex-1 flex flex-col min-h-0 mb-2 h-full relative">
            <LoadingOverlay isLoading={isLoading} />
            <MessageHeadersTable headers={headers as Record<string, unknown>} />
          </TabsContent>

          <TabsContent value="test-results" className="relative">
            <LoadingOverlay isLoading={isLoading} />
            <ComingSoon />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default SocketResponseConsole;
