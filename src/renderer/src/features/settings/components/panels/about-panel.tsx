import Contributor from '@/features/settings/components/contributor';
import AppLogo from '@/resources/app-logo.svg';
import AppText from '@/resources/app-text.svg';
import numankaf from '@/resources/avatar/numankaf.png';

import { ScrollArea } from '@/components/common/scroll-area';

function AboutPanel() {
  const about = window.api.about;
  return (
    <ScrollArea style={{ height: 'calc(100% - 2rem)' }}>
      <div className="m-4 flex flex-col items-center h-full gap-3 text-sm">
        <div className="flex items-center gap-1 shrink-0">
          <img className="w-16 h-16 shrink-0" src={AppLogo} alt="App Logo" />
          <img className="h-16 shrink-0" src={AppText} alt="App Text" />
        </div>
        <p className="leading-7 text-center">
          Chrollo is a Postman-like tool designed for inspecting, testing, and debugging WebSocket APIs, featuring
          built-in plugins developed specifically for the SCOPE Platform.
        </p>

        <div className="flex flex-col items-center">
          <span className="text-muted-foreground">Version</span>
          <span>{APP_VERSION}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-muted-foreground">Electron Platform</span>
          <span>{about.electron}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-muted-foreground">Chromium Platform</span>
          <span>{about.chrome}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-muted-foreground">Architecture</span>
          <span>{about.arch}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-muted-foreground">OS platform</span>
          <span>
            {about.platform} {about.osVersion}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className=" flex items-center gap-1 m-1">
            <span className="text-muted-foreground">Contributors</span>
            <span className="bg-secondary w-4 h-4 text-xs p-0.5 text-center rounded-full">1</span>
          </div>
          <Contributor name="Numan Kafadar" avatar={numankaf} github="github.com/numankaf" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-muted-foreground">License</span>
          <span className="font-medium">MIT License</span>
          <span className="text-xs text-muted-foreground">
            © 2025 <span className="font-medium"> Numan Kafadar</span>. All rights reserved.
          </span>
        </div>
      </div>
    </ScrollArea>
  );
}

export default AboutPanel;
