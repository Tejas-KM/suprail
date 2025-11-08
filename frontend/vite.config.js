import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0',      // binds to all network interfaces
    port: 5173,           // customize port
    strictPort: true      // fail if port is in use
  },
  optimizeDeps: {
    exclude: ['xlsx-js-style']
  }
})
