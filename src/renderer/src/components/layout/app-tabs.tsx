import { useEffect, useRef, useState } from 'react';
import { SIDEBAR_WORKSPACE_OFFSET } from '@/constants/layout-constants';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { confirmTabClose } from '@/utils/tab-util';
import { Plus, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useShallow } from 'zustand/react/shallow';

import { BASE_MODEL_TYPE } from '@/types/base';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { useWorkspaceTabs } from '@/hooks/workspace/use-workspace-tabs';
import { Button } from '@/components/common/button';
import { Separator } from '@/components/common/separator';
import EnvironmentSelector from '@/components/selector/environment-selector';
import TabSelector from '@/components/selector/tab-selector';
import TabItemContent from '@/components/tab/tab-item-content';

function AppTabs() {
  const { activeWorkspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
    }))
  );

  const { addTab, openTab, dirtyBeforeSaveByTab } = useTabsStore(
    useShallow((state) => ({
      addTab: state.addTab,
      openTab: state.openTab,
      dirtyBeforeSaveByTab: state.dirtyBeforeSaveByTab,
    }))
  );

  const { activeTab } = useActiveItem();

  const tabs = useWorkspaceTabs();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

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

  const handleAddTab = () => {
    if (activeWorkspaceId) {
      addTab({
        id: nanoid(),
        workspaceId: activeWorkspaceId,
        modelType: BASE_MODEL_TYPE.COLLECTION,
      });
    }
  };

  return (
    <div style={{ height: `${SIDEBAR_WORKSPACE_OFFSET}` }} className="w-full top-(--sidebar-top-offset) border-b px-1">
      <div style={{ height: `${SIDEBAR_WORKSPACE_OFFSET}` }} className="flex items-center justify-between">
        <div
          ref={scrollRef}
          className="overflow-x-auto no-scrollbar select-none w-full inline-flex h-full items-center justify-start gap-1.5 whitespace-nowrap"
        >
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTab?.id;

            return (
              <div className="h-full flex" key={tab.id} data-tab-id={tab.id}>
                <div
                  className={`w-40 p-1 [&:hover>#tabs-close]:opacity-100 cursor-pointer inline-flex flex-1 items-center justify-between gap-1 rounded-md whitespace-nowrap border border-transparent hover:text-accent-foreground 
                  ${isActive ? 'border-b-primary text-foreground' : 'text-muted-foreground '}`}
                  onClick={() => {
                    openTab(tab);
                  }}
                  onMouseDown={(e) => {
                    if (e.button === 1) {
                      e.preventDefault();
                      confirmTabClose(tab.id);
                    }
                  }}
                >
                  <div className="flex-1 truncate">
                    <TabItemContent tab={tab} />
                  </div>
                  {dirtyBeforeSaveByTab[tab.id] && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
                  <Button
                    id="tabs-close"
                    variant="ghost"
                    className="opacity-0 w-5! h-5!"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmTabClose(tab.id);
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
                {index !== tabs.length - 1 && (
                  <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
                )}
              </div>
            );
          })}

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
