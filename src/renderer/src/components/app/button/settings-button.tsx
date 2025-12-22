import { useState } from 'react';
import SettingsDialog from '@/features/settings/view/settings-dialog';
import { Settings } from 'lucide-react';

import { Button } from '@/components/common/button';

function SettingsButton() {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setVisible(true)} aria-label="Settings">
        <Settings />
      </Button>
      <SettingsDialog visible={visible} onVisibleChange={setVisible} />
    </>
  );
}

export default SettingsButton;
