import { Button } from '@/components/common/button';
import { Separator } from '@/components/common/separator';
import { Plus, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { SIDEBAR_WORKSPACE_OFFSET } from '../../constants/layout-constants';
import useTabsStore from '../../store/tabs-store';
import EnviromentSelector from '../selector/enviroment-selector';
import TabSelector from '../selector/tab-selector';

const AppTabs = () => {
  const { tabs, activeTabId, setActiveTab, closeTab, addTab } = useTabsStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // enable horizontal scrolling via mouse wheel
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

  return (
    <div
      style={{ height: `${SIDEBAR_WORKSPACE_OFFSET}` }}
      className="w-full top-[var(--sidebar-top-offset)] border-b-1 px-1"
    >
      <div
        ref={scrollRef}
        className="flex h-full overflow-x-auto no-scrollbar select-none items-center justify-between"
      >
        <div className="inline-flex h-full items-center justify-start gap-1.5 whitespace-nowrap">
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTabId;

            return (
              <div className="h-full flex" key={tab.id}>
                <div
                  className={`p-1 [&:hover>#tabs-close]:opacity-100 cursor-pointer inline-flex flex-1 items-center justify-center gap-1.5 rounded-md font-medium whitespace-nowrap border border-transparent hover:text-accent-foreground 
                  ${isActive ? 'border-b-primary text-foreground' : 'text-muted-foreground '}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <p>{tab.title}</p>
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
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground flex-shrink-0"
            onClick={() => addTab('Title New One', 'connection', 'newId')}
          >
            <Plus />
          </Button>
        </div>
        <div className="flex items-center gap-1 h-full">
          <TabSelector />
          <Separator orientation="vertical" />
          <EnviromentSelector />
        </div>
      </div>
    </div>
  );
};

export default AppTabs;
