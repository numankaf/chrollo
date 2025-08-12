import { SIDEBAR_TOP_OFFSET } from '../constants/layout-constants';

const Topbar = () => {
  return (
    <nav
      style={
        {
          '--sidebar-top-offset': SIDEBAR_TOP_OFFSET,
        } as React.CSSProperties
      }
      className="h-[var(--sidebar-top-offset)] fixed w-full bg-sidebar border-1"
    >
      Topbar
    </nav>
  );
};

export default Topbar;
