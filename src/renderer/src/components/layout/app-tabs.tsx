import { useEffect, useRef, useState } from 'react';
import { SIDEBAR_WORKSPACE_OFFSET } from '@/constants/layout-constants';
import useCollectionItemStore from '@/store/collection-item-store';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { confirmTabClose, getNextTab, getPreviousTab } from '@/utils/tab-util';
import type { DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor, restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useShallow } from 'zustand/react/shallow';

import { NULL_PARENT_ID, REQUEST_DEFAULT_VALUES, type Request } from '@/types/collection';
import { COMMANDS } from '@/types/command';
import type { Tab } from '@/types/layout';
import { commandBus } from '@/lib/command-bus';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { useWorkspaceTabs } from '@/hooks/workspace/use-workspace-tabs';
import { Button } from '@/components/common/button';
import { Separator } from '@/components/common/separator';
import EnvironmentSelector from '@/components/selector/environment-selector';
import TabSelector from '@/components/selector/tab-selector';
import TabItemContent from '@/components/tab/tab-item-content';

interface SortableTabItemProps {
  tab: Tab;
  isActive: boolean;
  dirtyBeforeSave: boolean;
  onOpenTab: (tab: Tab) => void;
  onCloseTab: (id: string) => void;
}

function SortableTabItem({ tab, isActive, dirtyBeforeSave, onOpenTab, onCloseTab }: SortableTabItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tab.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="h-full flex items-center">
      <div
        className={`w-40 p-1 [&:hover>#tabs-close]:opacity-100 cursor-pointer inline-flex flex-1 items-center justify-between gap-1 rounded-lg whitespace-nowrap border border-transparent hover:text-accent-foreground hover:bg-card
        ${isActive ? 'border-primary/30! bg-primary/10 hover:bg-primary/10 text-foreground' : 'text-muted-foreground '}`}
        onClick={() => onOpenTab(tab)}
        onMouseDown={(e) => {
          if (e.button === 1) {
            e.preventDefault();
            onCloseTab(tab.id);
          }
        }}
        {...attributes}
        {...listeners}
      >
        <div className="flex-1 truncate">
          <TabItemContent tab={tab} />
        </div>
        {dirtyBeforeSave && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
        <Button
          id="tabs-close"
          variant="ghost"
          className="opacity-0 w-5! h-5! pointer-events-auto hover:bg-secondary!"
          size="xs"
          onClick={(e) => {
            e.stopPropagation();
            onCloseTab(tab.id);
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
}

function AppTabs() {
  const { activeWorkspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
    }))
  );

  const { saveCollectionItem } = useCollectionItemStore(
    useShallow((state) => ({
      saveCollectionItem: state.saveCollectionItem,
    }))
  );

  const { addTab, openTab, moveTabItem, dirtyBeforeSaveByTab } = useTabsStore(
    useShallow((state) => ({
      addTab: state.addTab,
      openTab: state.openTab,
      moveTabItem: state.moveTabItem,
      dirtyBeforeSaveByTab: state.dirtyBeforeSaveByTab,
    }))
  );

  const { activeTab } = useActiveItem();

  const tabs = useWorkspaceTabs();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      moveTabItem(active.id as string, over.id as string);
    }
  };

  useEffect(() => {
    const unsubscribeTabClose = commandBus.on(COMMANDS.TAB_CLOSE, () => {
      if (activeTab) confirmTabClose(activeTab.id);
    });
    const unsubscribeTabNext = commandBus.on(COMMANDS.TAB_NEXT, () => {
      if (!activeTab) return;

      const nextTab = getNextTab(tabs, activeTab.id);
      if (nextTab) {
        openTab(nextTab);
      }
    });

    const unsubscribeTabPrevious = commandBus.on(COMMANDS.TAB_PREVIOUS, () => {
      if (!activeTab) return;

      const prevTab = getPreviousTab(tabs, activeTab.id);
      if (prevTab) {
        openTab(prevTab);
      }
    });

    return () => {
      unsubscribeTabClose?.();
      unsubscribeTabNext?.();
      unsubscribeTabPrevious?.();
    };
  }, [activeTab, openTab, tabs]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    };

    checkOverflow();

    window.addEventListener('resize', checkOverflow);
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);

    return () => {
      window.removeEventListener('resize', checkOverflow);
      observer.disconnect();
    };
  }, [tabs.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  const handleAddTab = async () => {
    if (activeWorkspaceId) {
      const requestPayload: Request = {
        id: nanoid(),
        name: 'New Request',
        workspaceId: activeWorkspaceId,
        parentId: NULL_PARENT_ID,
        ...REQUEST_DEFAULT_VALUES,
      };
      const newRequest = await saveCollectionItem(requestPayload);
      addTab(newRequest);
    }
  };

  return (
    <div style={{ height: `${SIDEBAR_WORKSPACE_OFFSET}` }} className="w-full top-(--sidebar-top-offset) border-b px-1">
      <div style={{ height: `${SIDEBAR_WORKSPACE_OFFSET}` }} className="flex items-center justify-between">
        <div
          ref={scrollRef}
          className="overflow-x-auto no-scrollbar select-none w-full inline-flex h-full items-center justify-start gap-1.5 whitespace-nowrap"
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToHorizontalAxis, restrictToFirstScrollableAncestor]}
          >
            <SortableContext items={tabs.map((t) => t.id)} strategy={horizontalListSortingStrategy}>
              {tabs.map((tab) => (
                <SortableTabItem
                  key={tab.id}
                  tab={tab}
                  isActive={tab.id === activeTab?.id}
                  dirtyBeforeSave={!!dirtyBeforeSaveByTab[tab.id]}
                  onOpenTab={openTab}
                  onCloseTab={confirmTabClose}
                />
              ))}
            </SortableContext>
          </DndContext>

          {!isOverflowing && (
            <Button variant="ghost" size="sm" className="text-muted-foreground shrink-0" onClick={handleAddTab}>
              <Plus />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1 h-full shrink-0">
          {isOverflowing && (
            <>
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleAddTab}>
                <Plus />
              </Button>
            </>
          )}

          <TabSelector />
          <Separator orientation="vertical" />
          <EnvironmentSelector />
        </div>
      </div>
    </div>
  );
}

export default AppTabs;
