import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router';
            }
            if (id.includes('@iconify')) {
              return 'icons';
            }
            // Group other vendor libraries
            return 'vendor';
          }
          
          // Admin pages and components
          if (id.includes('/pages/admin/') || id.includes('/components/admin/')) {
            return 'admin';
          }
          
          // Blog-related components
          if (id.includes('/pages/Blog') || id.includes('/components/comments/')) {
            return 'blog';
          }
          
          // Data and utilities
          if (id.includes('/data/') || id.includes('/utils/') || id.includes('/hooks/')) {
            return 'utils';
          }
        }
      }
    },
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    target: 'esnext',
    minify: 'esbuild'
  },
  server: {
    port: 5173,
    host: true
  }
})
