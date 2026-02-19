import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { useAppConfigStore } from '@/store/app-config-store';
import { formatCode } from '@/utils/editor-util';
import { getMessageContentType } from '@/utils/socket-message-util';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Ellipsis, Loader2Icon } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { REQUEST_BODY_TYPE, type RequestBodyType } from '@/types/collection';
import { REQUEST_STATUS, type TestResult, type TrackedRequest } from '@/types/request-response';
import { SOCKET_MESSAGE_TYPE } from '@/types/socket';
import { calculateStringSize, cn, deepParseJson, formatBytes } from '@/lib/utils';
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
import NoResponseFound from '@/components/app/empty/no-response-found';
import NoTestResultsFound from '@/components/app/empty/no-test-results-found';
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
  const { request, response, responseTime } = trackedRequest;
  const { activeConnection } = useActiveItem();
  const { clearRequest } = useRequestResponse(activeConnection?.id);

  const handleClear = () => {
    if (trackedRequest?.requestId) {
      clearRequest(trackedRequest?.requestId);
    }
  };

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
      {responseTime && (
        <span className="text-muted-foreground hover:text-foreground cursor-default">{responseTime} ms</span>
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
              <div className="flex items-center justify-between text-foreground">
                <div className="flex items-center gap-2">
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

function TestResultsPanel({ testResults }: { testResults: TestResult[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: testResults.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
  });

  const virtualItems = virtualizer.getVirtualItems();

  if (testResults.length === 0) {
    return <NoTestResultsFound />;
  }

  return (
    <ScrollArea viewportRef={parentRef} className="h-full px-1">
      <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
        <div
          className="absolute top-0 left-0 w-full"
          style={{ transform: `translateY(${virtualItems[0]?.start ?? 0}px)` }}
        >
          {virtualItems.map((virtualRow) => {
            const result = testResults[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="border-b"
              >
                <div className="flex items-start gap-2 px-3 py-2">
                  <Badge className="w-14" variant={result.passed ? 'success-bordered-ghost' : 'error-bordered-ghost'}>
                    {result.passed ? 'PASSED' : 'FAILED'}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm truncate block" title={result.name}>
                      {result.name}
                      {result.error && (
                        <span className="text-muted-foreground" title={result.error}>
                          - {result.error}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
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
  const testResults = lastTrackedRequest?.testResults || [];
  const passCount = testResults.filter((r) => r.passed).length;
  const hasFailed = testResults.some((r) => !r.passed);
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
              <TabsTrigger value="headers">
                Headers <span className="text-primary">({Object.keys(headers).length})</span>
              </TabsTrigger>
              <TabsTrigger value="test-results">
                Test Results
                {testResults.length > 0 && (
                  <span className={cn(hasFailed ? 'text-destructive' : 'text-green-600 dark:text-green-400')}>
                    ({passCount}/{testResults.length})
                  </span>
                )}
              </TabsTrigger>
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

          <TabsContent value="test-results" className="flex-1 flex flex-col min-h-0 mb-2 h-full relative">
            <LoadingOverlay isLoading={isLoading} />
            <TestResultsPanel testResults={testResults} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default SocketResponseConsole;
