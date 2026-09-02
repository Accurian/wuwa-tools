import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  base: '/wuwa-tools/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: r('./index.html'),
        comparison: r('./comparison.html'),
        probability: r('./probability.html'),
        'xp-tuners': r('./xp-tuners.html'),
      },
    },
  },
})
