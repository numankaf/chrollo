import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md  font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        toggle:
          'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-xs data-[state=off]:bg-muted data-[state=off]:text-muted-foreground',
        'success-bordered-ghost':
          'border border-green-600/30 bg-green-600/10 text-green-600 hover:bg-green-600/20 focus-visible:ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:hover:bg-green-400/20 dark:focus-visible:ring-green-400/40',
        'error-bordered-ghost':
          'border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        'info-bordered-ghost':
          'border border-sky-600/30 bg-sky-600/10 text-sky-600 hover:bg-sky-600/20 focus-visible:ring-sky-600/20 dark:bg-sky-400/10 dark:text-sky-400 dark:hover:bg-sky-400/20 dark:focus-visible:ring-sky-400/40',
        'warn-bordered-ghost':
          'border border-amber-600/30 bg-amber-600/10 text-amber-600 hover:bg-amber-600/20 focus-visible:ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:hover:bg-amber-400/20 dark:focus-visible:ring-amber-400/40',
        'primary-bordered-ghost':
          'border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:bg-primary/10 dark:text-primary dark:hover:bg-primary/20 dark:focus-visible:ring-primary/40',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        '2xs': 'text-2xs leading-[0] h-5 rounded-sm gap-1.5 px-2 has-[>svg]:px-1 [&>svg]:w-3! [&>svg]:h-3!',
        xs: 'text-xs h-7 rounded-sm gap-1.5 py-1 px-1 has-[>svg]:px-1 [&>svg]:w-3! [&>svg]:h-3!',
        sm: 'text-sm h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
