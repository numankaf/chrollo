import type { WsUrlScheme } from '@/types/connection';

export const URL_SCHEME_COLORS: Record<WsUrlScheme, string> = {
  'ws://': 'text-cyan-500',
  'wss://': 'text-blue-500',
  'http://': 'text-yellow-500',
  'https://': 'text-green-500',
};
