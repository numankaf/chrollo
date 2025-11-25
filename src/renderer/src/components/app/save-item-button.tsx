import { useState } from 'react';
import useTabsStore from '@/store/tab-store';
import { saveHandlers } from '@/utils/save-registry-utils';
import { Loader2, Save } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/components/common/button';

function SaveItemButton() {
  const { activeTab } = useTabsStore(
    useShallow((state) => ({
      activeTab: state.activeTab,
    }))
  );

  const [loading, setLoading] = useState(false);

  const handler = activeTab ? (saveHandlers[activeTab.item.modelType] ?? null) : null;

  async function save() {
    if (!activeTab || !handler) return;

    const id = activeTab.item.id;
    const item = handler.get(id);
    if (!item) return;

    try {
      setLoading(true);
      await handler.save(item);
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
