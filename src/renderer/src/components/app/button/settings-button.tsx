import { useState } from 'react';
import SettingsDialog from '@/features/settings/view/settings-dialog';
import { Bug, FileText, Settings } from 'lucide-react';

import { Button } from '@/components/common/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';
import { Github } from '@/components/icon/github';

function SettingsButton() {
  const [visible, setVisible] = useState<boolean>(false);

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => setVisible(true)} className="cursor-pointer">
            <Settings size={16} />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => openLink('https://github.com/numankaf/chrollo/releases')}
            className="cursor-pointer"
          >
            <FileText size={16} />
            <span>Releases</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openLink('https://github.com/numankaf/chrollo/issues')}
            className="cursor-pointer"
          >
            <Bug size={16} />
            <span>Issues</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openLink('https://github.com/numankaf/chrollo')} className="cursor-pointer">
            <Github size={16} />
            <span>Repository</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SettingsDialog visible={visible} onVisibleChange={setVisible} />
    </>
  );
}

export default SettingsButton;
