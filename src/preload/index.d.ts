import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    api: {
      view: {
        minimize: () => void;
        maximize: () => void;
        close: () => void;
        reload: () => void;
      };
      stomp: {
        connect: (connection: StompConnection) => void;
        disconnect: (id: string) => void;
        disconnectAll: () => void;
        subscribe: (id: string, topic: string) => void;
        unsubscribe: (id: string, topic: string) => void;
        send: (data: { id: string; destination: string; body: string; headers?: StompHeaders }) => void;
      };
    };
    electron: ElectronAPI;
  }
}
