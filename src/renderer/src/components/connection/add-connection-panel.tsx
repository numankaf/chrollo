import { Plus } from 'lucide-react';

import { Button } from '@/components/common/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';

function AddConnectionPanel() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm" variant="ghost">
          <Plus className="w-4! h-4!" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-60">
        the popover here.
      </PopoverContent>
    </Popover>
  );
}

export default AddConnectionPanel;
