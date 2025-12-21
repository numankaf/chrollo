import { useState } from 'react';
import { TIME_FORMAT_HH_MM_SS_MMM } from '@/constants/date-constants';
import { useAppConfigStore } from '@/store/app-config-store';
import { formatCode } from '@/utils/editor-util';
import { getMessageContentType } from '@/utils/socket-message-util';
import { useShallow } from 'zustand/react/shallow';

import { REQUEST_BODY_TYPE, type RequestBodyType } from '@/types/collection';
import { SOCKET_MESSAGE_TYPE, type SocketMessage } from '@/types/socket';
import { cn, deepParseJson } from '@/lib/utils';
import { Badge } from '@/components/common/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/common/dialog';
import { ScrollArea } from '@/components/common/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/common/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';
import CodeEditor from '@/components/app/editor/code-editor';

interface SocketMessageDetailDialogProps {
  message: SocketMessage | null;
  onOpenChange: (open: boolean) => void;
}

export function SocketMessageDetailDialog({ message, onOpenChange }: SocketMessageDetailDialogProps) {
  const { applicationSettings } = useAppConfigStore(
    useShallow((state) => ({
      applicationSettings: state.applicationSettings,
    }))
  );

  const [bodyType, setBodyType] = useState<RequestBodyType>(getMessageContentType(message?.meta?.headers));

  if (!message) return null;

  const parsedStringResponse = JSON.stringify(deepParseJson(message.data, applicationSettings.formatResponses));
  const headers = message.meta?.headers || {};

  return (
    <Dialog open={!!message} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col items-start p-0 h-[80vh] min-w-[60vw] overflow-hidden">
        <DialogHeader className="p-6 pb-0 w-full flex flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <DialogTitle className="flex items-center gap-2">
              Socket Message Detail
              <Badge
                className={cn(
                  message.type === SOCKET_MESSAGE_TYPE.SENT && 'bg-amber-500/10 text-amber-500',
                  message.type === SOCKET_MESSAGE_TYPE.RECEIVED && 'bg-sky-600/10 text-sky-600'
                )}
              >
                {message.type}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {new Date(message.timestamp).toLocaleString([], {
                ...TIME_FORMAT_HH_MM_SS_MMM,
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex flex-col w-full px-6 flex-1 min-h-0">
          <Tabs variant="link" defaultValue="body" className="w-full mt-3 flex-1 flex flex-col min-h-0">
            <TabsList>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
            </TabsList>

            <TabsContent value="body" className="flex-1 flex flex-col min-h-0 mb-4 h-full">
              <div className="flex justify-end mb-1">
                <Select
                  value={bodyType}
                  onValueChange={(value) => {
                    setBodyType(value as RequestBodyType);
                  }}
                >
                  <SelectTrigger size="sm" className="h-6! w-22 ">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {Object.values(REQUEST_BODY_TYPE).map((value) => (
                      <SelectItem className="h-6 rounded-md" key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-h-0 border rounded-lg overflow-hidden flex flex-col">
                <ScrollArea className="h-full">
                  <CodeEditor bodyType={bodyType} value={formatCode(bodyType, parsedStringResponse)} readOnly />
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="headers" className="flex-1 flex flex-col min-h-0 mb-4 h-full">
              <div className="flex-1 min-h-0  rounded-lg overflow-hidden flex flex-col">
                <ScrollArea className="h-full">
                  <Table className="border table-fixed w-full">
                    <TableHeader>
                      <TableRow className="*:border-border [&>:not(:last-child)]:border-r">
                        <TableHead className="w-1/2">Key</TableHead>
                        <TableHead className="w-1/2">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(headers).length > 0 ? (
                        Object.entries(headers).map(([key, value]) => (
                          <TableRow key={key} className="*:border-border [&>:not(:last-child)]:border-r">
                            <TableCell className="truncate align-top" title={key}>
                              {key}
                            </TableCell>
                            <TableCell className="truncate align-top" title={String(value)}>
                              {String(value)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                            No headers available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
