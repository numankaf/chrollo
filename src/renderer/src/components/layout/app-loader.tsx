import { use } from 'react';
import { FOOTER_BOTTOM_OFFSET, SIDEBAR_TOP_OFFSET } from '@/constants/layout-constants';
import { AppContext } from '@/provider/app-init-provider';

function AppLoader() {
  const { loadingText } = use(AppContext);
  return (
    <div
      style={{
        height: `calc(100vh - ${SIDEBAR_TOP_OFFSET} - ${FOOTER_BOTTOM_OFFSET})`,
      }}
      className="w-full flex flex-col items-center justify-center"
    >
      <div className="w-20 h-20 flex items-center justify-center">
        <div className="loader-icon" />
      </div>
      <span className="loader-text">{loadingText}</span>
    </div>
  );
}

export default AppLoader;
