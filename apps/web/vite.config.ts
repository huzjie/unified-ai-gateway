import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 配置（代理 /admin → gateway）
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/admin': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
      '/healthz': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
