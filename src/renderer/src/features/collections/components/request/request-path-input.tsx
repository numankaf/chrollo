import { useId } from 'react';

import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';

function RequestPathInput() {
  const id = useId();

  return (
    <div className="p-2 w-full flex items-center justify-between gap-2">
      <div className="flex rounded-md shadow-xs flex-1">
        <Input id={id} type="text" placeholder="Enter a request path or paste text" />
      </div>
      <Button>SEND</Button>
    </div>
  );
}

export default RequestPathInput;
