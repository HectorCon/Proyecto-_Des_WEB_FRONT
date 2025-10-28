import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimizaciones para VPS con recursos limitados
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks para mejor caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
        }
      }
    },
    // Reducir el bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Optimizar desarrollo para menos uso de memoria
  server: {
    hmr: {
      overlay: false
    }
  }
})
