import { FileCode, LayoutDashboard } from 'lucide-react';

import { BASE_MODEL_TYPE } from '@/types/base';
import type { CollectionItem } from '@/types/collection';
import type { IconProps } from '@/types/common';
import type { Connection } from '@/types/connection';
import type { TabItem } from '@/types/layout';
import { CollectionItemIcon } from '@/components/icon/collection-item-icon';
import { ConnectionIcon } from '@/components/icon/connection-icon';
import { EnvironmentIcon } from '@/components/icon/environment-icon';

interface TabItemIconProps extends IconProps {
  item: TabItem;
}

function TabItemIcon({ item, ...props }: TabItemIconProps) {
  switch (item.modelType) {
    case BASE_MODEL_TYPE.CONNECTION:
      return <ConnectionIcon connectionType={(item as Connection).connectionType} {...props} />;
    case BASE_MODEL_TYPE.ENVIRONMENT:
      return <EnvironmentIcon isGlobal={item.isGlobal} {...props} />;
    case BASE_MODEL_TYPE.INTERCEPTION_SCRIPT:
      return <FileCode {...props} />;
    case BASE_MODEL_TYPE.WORKSPACE:
      return <LayoutDashboard {...props} />;
    case BASE_MODEL_TYPE.COLLECTION:
      return <CollectionItemIcon collectionType={(item as CollectionItem).collectionItemType} {...props} />;
    default:
      return <></>;
  }
}

export default TabItemIcon;
