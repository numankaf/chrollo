import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        'success-bordered-ghost':
          'rounded-md border border-green-600/30 bg-green-600/10 text-green-600  dark:bg-green-400/10 dark:text-green-400 ',
        'error-bordered-ghost': 'rounded-md border border-destructive/30 bg-destructive/10 text-destructive',
        'info-bordered-ghost':
          'rounded-md border border-sky-600/30 bg-sky-600/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400',
        'warn-bordered-ghost':
          'rounded-md border border-amber-600/30 bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400',
        'primary-bordered-ghost': 'rounded-md border border-primary/30 bg-primary/10 text-primary dark:bg-primary/10',
        'secondary-bordered-ghost':
          'rounded-md border border-secondary/30 bg-secondary/10 text-secondary dark:bg-secondary/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
