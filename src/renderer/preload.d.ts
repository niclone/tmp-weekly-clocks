import { Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        sendMessageSync(channel: Channels, args: unknown[]): object;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
    store: {
      get: (key: string) => unknown;
      set: (key: string, val: unknown) => void;
    };
  }
}

export {};
