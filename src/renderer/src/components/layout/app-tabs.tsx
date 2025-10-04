import { Separator } from '@/components/common/separator';
import { X } from 'lucide-react';
import { SIDEBAR_WORKSPACE_OFFSET } from '../../constants/layout-constants';
import useTabsStore from '../../store/tabs-store';
import { Button } from '../common/button';
const AppTabs = () => {
  const { tabs, activeTabId, setActiveTab, closeTab } = useTabsStore();
  return (
    <div
      style={{ height: `${SIDEBAR_WORKSPACE_OFFSET}` }}
      className="w-full top-[var(--sidebar-top-offset)] border-b-1"
    >
      <div className="inline-flex h-full w-fit items-center justify-center rounded-lg gap-1.5">
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabId;

          return (
            <div className="h-full flex" key={tab.id}>
              <div
                className={`p-1 [&:hover>#tabs-close]:opacity-100 cursor-pointer inline-flex flex-1 items-center justify-center gap-1.5 rounded-md font-medium whitespace-nowrap border border-transparent hover:text-accent-foreground 
                ${isActive ? 'border-b-primary text-foreground' : 'text-muted-foreground '}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <p className="ml-2">{tab.title}</p>
                <Button
                  id="tabs-close"
                  variant="ghost"
                  className="opacity-0 w-5! h-5!"
                  size="xs"
                  onClick={() => closeTab(tab.id)}
                >
                  <X className=" w-4 h-4" />
                </Button>
              </div>
              {index !== tabs.length - 1 && (
                <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppTabs;
