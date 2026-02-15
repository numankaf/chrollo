import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Command, Delete, Option } from 'lucide-react';

import { MODIFIER_KEYS } from '@/lib/command';
import { getPlatform } from '@/lib/platform';
import { cn } from '@/lib/utils';
import { Kbd, KbdGroup } from '@/components/common/kbd';

interface ShortcutKeyProps extends React.ComponentProps<typeof Kbd> {
  children: React.ReactNode;
}

function getKeyContent(key: string) {
  switch (key) {
    case 'ArrowUp':
      return <ArrowUp className="size-3" />;
    case 'ArrowDown':
      return <ArrowDown className="size-3" />;
    case 'ArrowLeft':
      return <ArrowLeft className="size-3" />;
    case 'ArrowRight':
      return <ArrowRight className="size-3" />;
    default:
      return key;
  }
}

export function ShortcutKey({ children, className, ...props }: ShortcutKeyProps) {
  const { isMac } = getPlatform();

  if (typeof children === 'string') {
    if (children === MODIFIER_KEYS.META) {
      return (
        <Kbd className={cn(className)} {...props}>
          {isMac ? <Command className="size-3" /> : MODIFIER_KEYS.CONTROL}
        </Kbd>
      );
    }

    if (children === 'Backspace') {
      return (
        <Kbd className={cn(className)} {...props}>
          <Delete className="size-3" />
        </Kbd>
      );
    }

    if (children === 'Alt') {
      return (
        <Kbd className={cn(className)} {...props}>
          {isMac ? <Option className="size-3" /> : 'Alt'}
        </Kbd>
      );
    }
  }

  return (
    <Kbd className={cn(className)} {...props}>
      {children}
    </Kbd>
  );
}

interface ShortcutProps {
  shortcut: string;
}

export function Shortcut({ shortcut }: ShortcutProps) {
  return (
    <KbdGroup>
      {shortcut.split('+').map((key) => (
        <ShortcutKey key={key}>{getKeyContent(key)}</ShortcutKey>
      ))}
    </KbdGroup>
  );
}
