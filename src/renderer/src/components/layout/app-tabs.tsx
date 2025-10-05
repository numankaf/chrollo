import { Button } from '@/components/common/button';
import { Separator } from '@/components/common/separator';
import TabSelector from '@/components/selector/tab-selector';
import TabItemContent from '@/components/tab/tab-item-content';
import { Plus, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { SIDEBAR_WORKSPACE_OFFSET } from '../../constants/layout-constants';
import useTabsStore from '../../store/tab-store';
import EnviromentSelector from '../selector/enviroment-selector';

const AppTabs = () => {
  const { tabs, activeTabId, setActiveTab, closeTab, addTab } = useTabsStore();
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
    addTab({
      id: nanoid(8),
      name: 'New Request',
      commandType: 'command',
      type: 'request',
      path: '',
    });
  };

  return (
    <div
      style={{ height: `${SIDEBAR_WORKSPACE_OFFSET}` }}
      className="w-full top-[var(--sidebar-top-offset)] border-b-1 px-1"
    >
      <div className="flex h-full items-center justify-between">
        <div
          ref={scrollRef}
          className="overflow-x-auto no-scrollbar select-none w-full inline-flex h-full items-center justify-start gap-1.5 whitespace-nowrap"
        >
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTabId;

            return (
              <div className="h-full flex" key={tab.id} data-tab-id={tab.id}>
                <div
                  className={`w-[160px] p-1 [&:hover>#tabs-close]:opacity-100 cursor-pointer inline-flex flex-1 items-center justify-between gap-1.5 rounded-md font-medium whitespace-nowrap border border-transparent hover:text-accent-foreground 
                  ${isActive ? 'border-b-primary text-foreground' : 'text-muted-foreground '}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <TabItemContent {...tab} />
                  <Button
                    id="tabs-close"
                    variant="ghost"
                    className="opacity-0 w-5! h-5!"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {index !== tabs.length - 1 && (
                  <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
                )}
              </div>
            );
          })}

          {!isOverflowing && (
            <Button variant="ghost" size="sm" className="text-muted-foreground flex-shrink-0" onClick={handleAddTab}>
              <Plus />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1 h-full flex-shrink-0">
          {isOverflowing && (
            <>
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleAddTab}>
                <Plus />
              </Button>
            </>
          )}

          <TabSelector />
          <Separator orientation="vertical" />
          <EnviromentSelector />
        </div>
      </div>
    </div>
  );
};

export default AppTabs;
