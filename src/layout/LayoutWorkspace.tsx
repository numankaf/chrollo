import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/common/breadcrumb';
import { SidebarInset, SidebarProvider } from '@/components/common/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import Topbar from '@/components/layout/app-topbar';
import Footer from '../components/layout/app-footer';

const LayoutWorkspace = () => {
  return (
    <>
      <SidebarProvider
        style={
          {
            '--sidebar-width': '350px',
          } as React.CSSProperties
        }
      >
        <Topbar></Topbar>
        <AppSidebar />
        <SidebarInset>
          <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
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
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-muted/50 aspect-video h-12 w-full rounded-lg" />
            ))}
          </div>
        </SidebarInset>
        <Footer></Footer>
      </SidebarProvider>
    </>
  );
};

export default LayoutWorkspace;
