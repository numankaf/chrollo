import { Lock, Users } from 'lucide-react';

import type { IconProps } from '@/types/common';
import { WORKSPACE_TYPE, type WorkspaceType } from '@/types/workspace';

interface WorkspaceTypeIconProps extends IconProps {
  workspaceType: WorkspaceType;
}

export function WorkspaceTypeIcon({ workspaceType, ...props }: WorkspaceTypeIconProps) {
  switch (workspaceType) {
    case WORKSPACE_TYPE.PUBLIC:
      return <Users {...props} />;

    case WORKSPACE_TYPE.INTERNAL:
      return <Lock {...props} />;

    default:
      return <></>;
  }
}
