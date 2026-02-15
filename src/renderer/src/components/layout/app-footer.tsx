import { useEffect } from 'react';
import { FOOTER_BOTTOM_OFFSET } from '@/constants/layout-constants';
import { CircleQuestionMark, GalleryHorizontalEnd, SquareChevronRight, WifiOff } from 'lucide-react';

import { COMMANDS } from '@/lib/command';
import { commandBus } from '@/lib/command-bus';
import { Button } from '@/components/common/button';
import { SidebarTrigger } from '@/components/common/sidebar';

function Footer() {
  useEffect(() => {
    const unsubscribeToggleConsole = commandBus.on(COMMANDS.TOGGLE_CONSOLE, () => {
      window.api.devtools.toggleDevTools();
    });
    return () => {
      unsubscribeToggleConsole();
    };
  }, []);

  return (
    <footer
      style={
        {
          '--footer-bottom-offset': FOOTER_BOTTOM_OFFSET,
        } as React.CSSProperties
      }
      className="h-(--footer-bottom-offset) fixed w-full bg-sidebar border-t bottom-0 flex items-center justify-between"
    >
      <div className="flex items-center gap-1 h-full">
        <SidebarTrigger />
        <Button variant="ghost" size="xs" className="h-full">
          <WifiOff />
          Offline
        </Button>
        <Button
          variant="ghost"
          size="xs"
          className="h-full"
          onClick={() => {
            window.api.devtools.toggleDevTools();
          }}
        >
          <SquareChevronRight />
          Console
        </Button>
      </div>
      <div className="flex items-center gap-1 h-full">
        <Button variant="ghost" size="xs" className="h-full">
          <CircleQuestionMark />
          Help
        </Button>
        <Button variant="ghost" size="xs" className="h-full">
          <GalleryHorizontalEnd />
          {APP_VERSION}
        </Button>
      </div>
    </footer>
  );
}

export default Footer;
