import { useState } from 'react';
import { Download } from 'lucide-react';

import { SidebarMenuButton, SidebarMenuItem } from '@/components/common/sidebar';
import { ImportItemDialog } from '@/components/app/dialog/import-item-dialog';

function ImportButton() {
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setImportDialogOpen(true)}
          className=" group flex flex-col items-center h-auto border border-dashed"
        >
          <Download />
          <span className="text-xs ">Import</span>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <ImportItemDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} />
    </>
  );
}

export default ImportButton;
