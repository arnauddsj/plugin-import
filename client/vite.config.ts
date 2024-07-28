import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@plugins': path.resolve(__dirname, '../plugins'),
    },
  },
  server: {
    fs: {
      allow: ['..'], // This allows importing from the parent directory
    },
  },
})