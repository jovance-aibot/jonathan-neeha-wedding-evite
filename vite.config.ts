import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  // Project site: https://jovance-aibot.github.io/jonathan-neeha-wedding-evite/
  base: '/jonathan-neeha-wedding-evite/',
  server: {
    host: '127.0.0.1',
    port: 47321,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 47321,
    strictPort: true,
  },
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        codeSplitting: false,
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
