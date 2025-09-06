import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@shared': resolve(__dirname, '../shared/dist'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: ['electron', 'fs', 'path', 'electron-is-dev', 'electron-store'],
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 5173
  },
  publicDir: false
})