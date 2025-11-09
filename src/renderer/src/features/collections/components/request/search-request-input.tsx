import { useId } from 'react';

import { Input } from '@/components/common/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/select';

import { Button } from '../../../../components/common/button';

function SearchRequestInput() {
  const id = useId();

  return (
    <div className="w-full px-2 flex items-center justify-between gap-2">
      <div className="flex rounded-md shadow-xs flex-1">
        <Select defaultValue="command">
          <SelectTrigger id={id} className="rounded-r-none shadow-none focus-visible:z-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="command" className="pr-2 [&_svg]:hidden">
              <span className="font-semibold text-start text-yellow-600 w-12">CMD</span>
            </SelectItem>
            <SelectItem value="query" className="pr-2 [&_svg]:hidden">
              <span className="font-semibold text-start text-green-600 w-12">QRY</span>
            </SelectItem>
          </SelectContent>
        </Select>
        <Input
          id={id}
          type="text"
          placeholder="Enter a request path or paste text"
          className="-ms-px rounded-l-none shadow-none"
        />
      </div>
      <Button>SEND </Button>
    </div>
  );
}

export default SearchRequestInput;
