import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// added for __dirname in ESM
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    // En ACI, le dev server doit accepter le Host public :
    //   VITE_ALLOWED_HOSTS="mon-fqdn.azurecontainer.io"  (ou "all")
    // Non défini => défaut Vite (localhost), ce qui suffit en local/compose.
    allowedHosts:
      process.env.VITE_ALLOWED_HOSTS === 'all'
        ? true
        : process.env.VITE_ALLOWED_HOSTS?.split(','),
    proxy: {
      '/api': {
        // compose: http://backend:8000 ; ACI: http://localhost:8000
        target: process.env.VITE_API_PROXY_TARGET || 'http://backend:8000',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setupTests.js',
  },
})
