import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('jspdf') || id.includes('html2canvas')) return 'pdf'
          if (id.includes('react-webcam'))  return 'webcam'
          if (id.includes('react-toastify')) return 'toast'
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) return 'react'
        },
      },
    },
  },
})
