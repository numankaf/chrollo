import { SettingsPanel } from '@/features/settings/components/settings-panel';

import { Dialog, DialogContent } from '@/components/common/dialog';

interface SettingsDialogProps {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
}
function SettingsDialog({ visible, onVisibleChange }: SettingsDialogProps) {
  return (
    <Dialog open={visible} onOpenChange={onVisibleChange}>
      <DialogContent className="flex flex-col items-start p-0 h-[75vh] min-w-[75vw]">
        <SettingsPanel />
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog;
