import AppLogoLoading from '@/resources/app-logo-loading.svg';

function AppLoader({ text }: { text?: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-20 h-20 flex items-center justify-center">
        <img className="w-12 h-12 shrink-0" src={AppLogoLoading} alt="App Logo" />
      </div>
      <span className="loader-text">{text}</span>
    </div>
  );
}

export default AppLoader;
