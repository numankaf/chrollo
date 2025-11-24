import path, { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import ReactCompiler from 'babel-plugin-react-compiler';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

import packageJson from './package.json';

const DEFAULT_PORT = '3000';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@/types': resolve('src/types'),
        '@/main': resolve('src/main'),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@/types': resolve('src/types'),
      },
    },
  },
  renderer: {
    resolve: {
      alias: {
        '@/types': resolve('src/types'),
        '@': path.resolve(__dirname, 'src/renderer/src'),
      },
    },
    server: {
      host: true,
      port: parseInt(process.env.VITE_PORT ?? DEFAULT_PORT),
      watch: {
        usePolling: true,
      },
    },
    define: {
      global: 'globalThis',
      APP_VERSION: JSON.stringify(packageJson.version),
    },
    plugins: [
      react({
        babel: {
          plugins: [ReactCompiler],
        },
      }),
      tailwindcss(),
    ],
  },
});
