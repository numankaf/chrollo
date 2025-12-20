import { use } from 'react';
import { AppContext } from '@/provider/app-init-provider';

function AppLoader() {
  const { loadingText } = use(AppContext);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-20 h-20 flex items-center justify-center">
        <div className="loader-icon" />
      </div>
      <span className="loader-text">{loadingText}</span>
    </div>
  );
}

export default AppLoader;
