import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/submit': 'http://127.0.0.1:5000',
      '/healthCheck': 'http://127.0.0.1:5000',
    },
  },
});
