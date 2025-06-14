import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    // Code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and core libraries
          vendor: ['react', 'react-dom'],
          // Router chunk for navigation
          router: ['react-router-dom'],
          // UI chunk for Iconify and other UI libraries
          ui: ['@iconify/react']
        }
      }
    },
    // Enable source maps for production debugging
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification with esbuild (default)
    minify: 'esbuild'
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@iconify/react']
  },
  // Server configuration for development
  server: {
    port: 3000,
    host: true
  },
  // Preview configuration
  preview: {
    port: 3000,
    host: true
  }
})
