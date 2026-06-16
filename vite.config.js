import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:8081';

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api/ws': {
          target: backendUrl,
          changeOrigin: true,
          ws: true,
        },
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
    define: {
      global: 'globalThis'
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
