import { Plus } from 'lucide-react';

import { Button } from '@/components/common/button';
import { SearchBar } from '@/components/common/search-input';
import { SidebarContent, SidebarHeader } from '@/components/common/sidebar';
import ComingSoon from '@/components/app/empty/coming-soon';

function HistorySidebar() {
  return (
    <SidebarContent>
      <SidebarHeader className="m-0! p-0!">
        <div className="flex items-center justify-between p-1 gap-1">
          <Button size="sm" variant="ghost">
            <Plus size={16} />
          </Button>
          <SearchBar placeholder="Search history" className="flex-1" onSearchChange={() => {}} />
        </div>
      </SidebarHeader>
      <div>
        <ComingSoon />
      </div>
    </SidebarContent>
  );
}

export default HistorySidebar;
