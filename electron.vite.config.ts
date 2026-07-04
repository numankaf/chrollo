import path, { resolve } from 'path';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'electron-vite';
import svgr from 'vite-plugin-svgr';

import packageJson from './package.json';

const DEFAULT_PORT = 3000;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    main: {
      resolve: {
        alias: {
          '@/types': resolve('src/types'),
          '@/main': resolve('src/main'),
        },
      },
    },
    preload: {
      resolve: {
        alias: {
          '@/types': resolve('src/types'),
        },
      },
    },
    renderer: {
      resolve: {
        alias: {
          '@/resources': path.resolve(__dirname, 'resources'),
          '@/types': path.resolve(__dirname, 'src/types'),
          '@': path.resolve(__dirname, 'src/renderer/src'),
        },
      },
      server: {
        host: true,
        port: Number(env.VITE_PORT ?? DEFAULT_PORT),
        watch: {
          usePolling: true,
        },
      },
      define: {
        global: 'globalThis',
        APP_VERSION: JSON.stringify(packageJson.version),
      },
      plugins: [
        react(),
        babel({
          presets: [reactCompilerPreset()],
        }),
        tailwindcss(),
        svgr(),
      ],
    },
  };
});
