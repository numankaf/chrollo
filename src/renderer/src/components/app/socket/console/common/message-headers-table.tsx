import { ScrollArea } from '@/components/common/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/common/table';

interface MessageHeadersTableProps {
  headers: Record<string, unknown>;
}

export function MessageHeadersTable({ headers }: MessageHeadersTableProps) {
  return (
    <div className="flex-1 min-h-0 rounded-lg overflow-hidden flex flex-col">
      <ScrollArea className="h-full p-2">
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
  );
}
