import type { ReactNode } from 'react';
import { Ellipsis } from 'lucide-react';
import { nanoid } from 'nanoid';

import { Button } from '@/components/common/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';

export type OperationButtonItem = {
  content: ReactNode;
  props: React.ComponentPropsWithRef<typeof DropdownMenuItem>;
  separatorTop?: boolean;
  separatorBottom?: boolean;
};

type OperationsButtonProps = {
  id?: string;
  items: OperationButtonItem[];
};

function OperationsButton({ id = 'operations-trigger', items }: OperationsButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button
          asChild
          size="icon"
          variant="secondary"
          className="w-5! h-5! p-0.5 rounded-md  bg-transparent hidden"
          id={id}
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="bg-background w-40 data-[state=closed]:animate-none!">
        {items.map((item) => (
          <>
            {item.separatorTop && <DropdownMenuSeparator />}
            <DropdownMenuItem key={nanoid(4)} {...item.props}>
              {item.content}
            </DropdownMenuItem>
            {item.separatorBottom && <DropdownMenuSeparator />}
          </>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default OperationsButton;
