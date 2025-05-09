import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,             // стандартный порт
    open: true,             // откроет браузер при старте dev-сервера
    strictPort: false,      // не будет падать, если порт занят
    watch: {
      usePolling: true,     // важно для macOS, Docker, сетевых проблем
      interval: 100         // частота опроса файлов (мс)
    }
  },
  resolve: {
    alias: {
      '@': '/src'           // теперь можно импортировать как "@/i18n"
    }
  },
  esbuild: {
    jsx: 'automatic'        // позволяет использовать JSX без `import React from 'react'`
  }
});
