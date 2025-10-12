import { Button } from '@/components/common/button';
import { SearchBar } from '@/components/common/search-input';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/common/sidebar';
import { Plus } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useTabNavigation } from '../../../hooks/use-tab-navigation';
import useConnectionStore from '../../../store/connection-store';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

const WebSocketIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg viewBox="0 -31.5 256 256" width={size} height={size} fill={color} preserveAspectRatio="xMidYMid" {...props}>
    <path d="M192.440223,144.644612 L224.220111,144.644612 L224.220111,68.3393384 L188.415329,32.5345562 L165.943007,55.0068785 L192.440223,81.5040943 L192.440223,144.644612 L192.440223,144.644612 Z M224.303963,160.576482 L178.017688,160.576482 L113.451687,160.576482 L86.954471,134.079266 L98.1906322,122.843105 L120.075991,144.728464 L165.104487,144.728464 L120.746806,100.286931 L132.06682,88.9669178 L176.4245,133.324599 L176.4245,88.2961022 L154.622994,66.4945955 L165.775303,55.3422863 L110.684573,0 L56.3485097,0 L56.3485097,0 L0,0 L31.6960367,31.6960367 L31.6960367,31.7798886 L31.8637406,31.7798886 L97.4359646,31.7798886 L120.662954,55.0068785 L86.7029152,88.9669178 L63.4759253,65.7399279 L63.4759253,47.7117589 L31.6960367,47.7117589 L31.6960367,78.9046839 L86.7029152,133.911562 L64.3144448,156.300033 L100.119227,192.104815 L154.45529,192.104815 L256,192.104815 L256,192.104815 L224.303963,160.576482 L224.303963,160.576482 Z" />
  </svg>
);

const ConnectionSidebar = () => {
  const { openAndNavigateToTab } = useTabNavigation();
  const { connections } = useConnectionStore(
    useShallow((state) => ({
      connections: state.connections,
    }))
  );
  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarContent>
        <SidebarHeader className="m-0! p-0!">
          <div className="flex items-center justify-between p-1 gap-1">
            <Button size="sm" variant="ghost">
              <Plus className="w-4! h-4!" />
            </Button>
            <SearchBar placeholder="Search socket connections" className="flex-1" onSearchChange={() => {}} />
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {connections.map((item) => (
                <SidebarMenuButton
                  size="sm"
                  className="data-[active=true]:bg-transparent"
                  key={item.id}
                  onClick={() => openAndNavigateToTab(item)}
                >
                  <WebSocketIcon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default ConnectionSidebar;
