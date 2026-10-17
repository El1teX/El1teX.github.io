import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: { host: '127.0.0.1' },
  // Две страницы: главная и /uses (GitHub Pages отдаёт uses/index.html по адресу /uses/)
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        uses: resolve(import.meta.dirname, 'uses/index.html'),
      },
    },
  },
})
