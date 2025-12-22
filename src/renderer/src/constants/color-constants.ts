import type { WsUrlScheme } from '@/types/connection';

export const URL_SCHEME_COLORS: Record<WsUrlScheme, string> = {
  'ws://': 'text-cyan-600',
  'wss://': 'text-blue-600',
  'http://': 'text-yellow-600',
  'https://': 'text-green-600',
};
