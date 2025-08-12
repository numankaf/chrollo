import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/common/breadcrumb';
import { Separator } from '@radix-ui/react-dropdown-menu';
import './App.css';
import { AppSidebar } from './components/app-sidebar';
import Topbar from './components/app-topbar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from './components/common/sidebar';

function App() {
  return (
    <div>
      <Topbar></Topbar>
      <SidebarProvider
        style={
          {
            '--sidebar-width': '350px',
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Inbox</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            {Array.from({ length: 24 }).map((_, index) => (
              <div key={index} className="bg-muted/50 aspect-video h-12 w-full rounded-lg" />
            ))}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <div className="fixed bottom-0 w-full h-16 bg-red-200">footer</div>
    </div>
  );
}

export default App;
