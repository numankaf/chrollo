import { Container, Globe } from 'lucide-react';

import type { IconProps } from '@/types/common';

interface EnvironmentIconProps extends IconProps {
  isGlobal?: boolean;
}

export function EnvironmentIcon({ isGlobal, ...props }: EnvironmentIconProps) {
  if (isGlobal) {
    return <Globe {...props} />;
  }

  return <Container {...props} />;
}
