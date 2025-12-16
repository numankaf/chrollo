import { useEffect, useState } from 'react';
import { Maximize, Minimize } from 'lucide-react';

import { Button } from '@/components/common/button';

export function WindowMaximizeButton() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    window.api.window.isMaximized().then(setIsMaximized);

    window.listener.window.onMaximizeChange(setIsMaximized);
  }, []);

  const handleClick = () => {
    if (isMaximized) {
      window.api.window.unmaximize();
    } else {
      window.api.window.maximize();
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleClick} aria-label={isMaximized ? 'Restore' : 'Maximize'}>
      {isMaximized ? <Minimize /> : <Maximize />}
    </Button>
  );
}
