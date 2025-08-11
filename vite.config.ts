import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import ReactCompiler from 'babel-plugin-react-compiler';
import { defineConfig, loadEnv } from 'vite';

const DEFAULT_PORT = '3000';

export default ({ mode }: { mode: string }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return defineConfig({
    plugins: [
      react({
        babel: {
          plugins: [ReactCompiler],
        },
      }),
      tailwindcss(),
    ],
    server: {
      host: true,
      port: parseInt(process.env.VITE_PORT ?? DEFAULT_PORT),
      watch: {
        usePolling: true,
      },
    },
    define: {
      global: 'globalThis',
    },
  });
};
