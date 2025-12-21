import { Braces } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/common/button';

export function BeautifyButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button size="sm" variant="outline" type="button" className={cn('h-6 gap-1.5', className)} {...props}>
      <Braces size={14} />
      Beautify
    </Button>
  );
}
