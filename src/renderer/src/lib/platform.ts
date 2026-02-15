export const getPlatform = () => {
  const about = window.api.about;
  return {
    ...about,
    isMac: about.platform === 'darwin',
    isWindows: about.platform === 'win32',
    isLinux: about.platform === 'linux',
  };
};
