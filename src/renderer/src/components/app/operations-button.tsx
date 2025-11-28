import { operationHandlers } from '@/utils/base-item-utils';
import { Ellipsis } from 'lucide-react';

import type { BaseItem } from '@/types/base';
import { Button } from '@/components/common/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';

type OperationsButtonProps = {
  item: BaseItem;
};

function OperationsButton({ item }: OperationsButtonProps) {
  const { deleteItem } = operationHandlers[item.modelType];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button
          asChild
          size="icon"
          variant="secondary"
          className="w-5! h-5! p-0.5 rounded-md  bg-transparent hidden"
          id="operations-trigger"
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="bg-background w-40 data-[state=closed]:animate-none!">
        {/* <DropdownMenuItem className="text-sm" onClick={(e) => e.preventDefault()}>
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem className="text-sm" onClick={(e) => e.preventDefault()}>
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm" onClick={(e) => e.preventDefault()}>
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500 text-sm hover:bg-red-500! hover:text-white!"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteItem(item.id);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default OperationsButton;
