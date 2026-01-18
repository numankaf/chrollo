import { useCallback, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Tree, type NodeRendererProps, type RowRendererProps } from 'react-arborist';

import { COLLECTION_TYPE, type Collection, type CollectionItem, type Folder } from '@/types/collection';
import { cn } from '@/lib/utils';
import { useWorkspaceCollectionItemMap } from '@/hooks/workspace/use-workspace-collection-item-map';
import { SearchBar } from '@/components/common/search-input';
import { CollectionItemIcon } from '@/components/icon/collection-item-icon';

interface CollectionTreeSelectorProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  height?: number;
}

function SelectorNode({
  node,
  style,
  dragHandle,
  isSelected,
}: NodeRendererProps<CollectionItem> & { isSelected?: boolean }) {
  const item = node.data;
  return (
    <div
      ref={dragHandle}
      style={style}
      className={cn(
        'flex items-center gap-1 px-2 py-1 h-full cursor-pointer rounded-md transition-colors text-foreground',
        (isSelected ?? node.isSelected) ? 'bg-primary/10 text-primary' : 'hover:bg-sidebar-accent'
      )}
      onClick={() => {
        node.select();
      }}
    >
      {!node.isLeaf && (
        <ChevronRight
          size={16}
          className={cn('w-5! h-5! p-0.5 ml-1 hover:bg-secondary! rounded-md', node.isOpen ? 'rotate-90' : '')}
          onClick={(e) => {
            e.stopPropagation();
            node.toggle();
          }}
        />
      )}
      <CollectionItemIcon size={14} collectionType={item.collectionItemType} />
      <span className="truncate text-sm">{item.name}</span>
    </div>
  );
}

function SelectorRow(props: RowRendererProps<CollectionItem>) {
  const { innerRef, attrs, children } = props;
  return (
    <div {...attrs} ref={innerRef} className="focus-visible:outline-none focus-visible:ring-0">
      {children}
    </div>
  );
}

export function CollectionTreeSelector({ selectedId, onSelect, height = 300 }: CollectionTreeSelectorProps) {
  const collectionItemMap = useWorkspaceCollectionItemMap();
  const [searchTerm, setSearchTerm] = useState('');

  const roots = useMemo(() => {
    return Array.from(collectionItemMap.values()).filter(
      (item) => item.collectionItemType === COLLECTION_TYPE.COLLECTION
    ) as CollectionItem[];
  }, [collectionItemMap]);

  const childrenAccessor = useCallback(
    (nodeData: CollectionItem) => {
      if (
        nodeData.collectionItemType === COLLECTION_TYPE.REQUEST ||
        nodeData.collectionItemType === COLLECTION_TYPE.REQUEST_RESPONSE
      ) {
        return null;
      }
      const childrenIds = (nodeData as Collection | Folder).children ?? [];
      return childrenIds
        .map((childId: string) => collectionItemMap.get(childId))
        .filter(
          (item): item is CollectionItem =>
            !!item &&
            (item.collectionItemType === COLLECTION_TYPE.COLLECTION ||
              item.collectionItemType === COLLECTION_TYPE.FOLDER)
        );
    },
    [collectionItemMap]
  );

  const nodeRenderer = useCallback(
    (props: NodeRendererProps<CollectionItem>) => {
      return <SelectorNode {...props} isSelected={props.node.id === selectedId} />;
    },
    [selectedId]
  );

  return (
    <div className="border rounded-md bg-card overflow-hidden flex flex-col gap-1 p-1">
      <SearchBar
        placeholder="Search collections..."
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        className="px-1 my-1 shrink-0"
      />
      <Tree<CollectionItem>
        data={roots}
        width="100%"
        height={height}
        childrenAccessor={childrenAccessor}
        rowHeight={32}
        openByDefault={false}
        selection={selectedId ?? undefined}
        onSelect={(nodes) => {
          if (nodes.length > 0) {
            onSelect(nodes[0].id);
          }
        }}
        searchTerm={searchTerm}
        searchMatch={(node, term) => {
          return node.data.name.toLowerCase().includes(term.toLowerCase());
        }}
        renderRow={SelectorRow}
        className="app-scroll"
      >
        {nodeRenderer}
      </Tree>
    </div>
  );
}
