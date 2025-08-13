import { CircleCheck, CircleQuestionMark, SquareChevronRight } from 'lucide-react';
import { FOOTER_BOTTOM_OFFSET } from '../../constants/layout-constants';
import { Button } from '../common/button';
import { SidebarTrigger } from '../common/sidebar';

const Footer = () => {
  return (
    <footer
      style={
        {
          '--footer-bottom-offset': FOOTER_BOTTOM_OFFSET,
        } as React.CSSProperties
      }
      className="h-[var(--footer-bottom-offset)] fixed w-full bg-sidebar border-1 bottom-0 flex items-center justify-between p-1"
    >
      <div className="flex items-center gap-1">
        <SidebarTrigger />
        <Button variant="ghost" size="2xs">
          <CircleCheck />
          Online
        </Button>
        <Button variant="ghost" size="2xs">
          <SquareChevronRight />
          Console
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="2xs">
          <CircleQuestionMark />
          Help
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
