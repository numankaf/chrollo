import { FolderOpen, GalleryVerticalEnd, Zap } from 'lucide-react';

import { COLLECTION_TYPE, type CollectionType } from '@/types/collection';
import type { IconProps } from '@/types/common';

interface CollectionItemIconProps extends IconProps {
  collectionType: CollectionType;
}

export function CollectionItemIcon({ collectionType, ...props }: CollectionItemIconProps) {
  switch (collectionType) {
    case COLLECTION_TYPE.COLLECTION:
      return <GalleryVerticalEnd {...props} />;

    case COLLECTION_TYPE.FOLDER:
      return <FolderOpen {...props} />;

    case COLLECTION_TYPE.REQUEST:
      return <Zap color="var(--color-green-500)" {...props} />;

    default:
      return <></>;
  }
}
