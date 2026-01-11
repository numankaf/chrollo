import { Fragment, type ReactNode } from 'react';
import { Ellipsis } from 'lucide-react';

import { Button } from '@/components/common/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';

export type OperationButtonItem = {
  id: string;
  content: ReactNode;
  props: React.ComponentPropsWithRef<typeof DropdownMenuItem>;
  separatorTop?: boolean;
  separatorBottom?: boolean;
};

type OperationsButtonProps = {
  items: OperationButtonItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function OperationsButton({ items, open, onOpenChange }: OperationsButtonProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild className="">
        <Button
          asChild
          size="icon"
          variant="secondary"
          className="w-5! h-5! p-0.5 rounded-md bg-transparent hidden operations-trigger"
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="bg-background w-40 data-[state=closed]:animate-none!">
        {items.map((item) => (
          <Fragment key={item.id}>
            {item.separatorTop && <DropdownMenuSeparator />}
            <DropdownMenuItem {...item.props}>{item.content}</DropdownMenuItem>
            {item.separatorBottom && <DropdownMenuSeparator />}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default OperationsButton;
