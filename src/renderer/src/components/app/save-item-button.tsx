import { useState } from 'react';
import { saveHandlers } from '@/utils/save-registry-utils';
import { getTabItem } from '@/utils/tab-utils';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

import { useActiveItem } from '@/hooks/workspace/use-active-item';
import { Button } from '@/components/common/button';

function SaveItemButton() {
  const { activeTab } = useActiveItem();

  const [loading, setLoading] = useState(false);

  const tabItem = activeTab ? getTabItem(activeTab) : null;
  const handler = tabItem ? (saveHandlers[tabItem.modelType] ?? null) : null;

  async function save() {
    if (!tabItem || !handler) return;

    const id = tabItem.id;
    const item = handler.get(id);
    if (!item) return;

    try {
      setLoading(true);
      await handler.save(item);
      toast.success(`${item.name} saved.`, { duration: 1000 });
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Button className="w-20" onClick={save} size="sm" variant="outline" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save
      </Button>
    </>
  );
}

export default SaveItemButton;
