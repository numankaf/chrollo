/// <reference types="vite/client" />
declare const APP_VERSION: string;

declare module '*?asset' {
  const src: string;
  export default src;
}
