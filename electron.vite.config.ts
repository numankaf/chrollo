import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import ReactCompiler from 'babel-plugin-react-compiler';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import path, { resolve } from 'path';
import packageJson from './package.json';
const DEFAULT_PORT = '3000';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
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
