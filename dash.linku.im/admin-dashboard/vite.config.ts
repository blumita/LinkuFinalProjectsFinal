import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core Vue packages
          if (id.includes('node_modules/vue/') || id.includes('node_modules/@vue/')) {
            return 'vue-vendor'
          }
          if (id.includes('node_modules/vue-router/')) {
            return 'vue-router'
          }
          if (id.includes('node_modules/pinia/')) {
            return 'pinia'
          }
          
          // Charts
          if (id.includes('node_modules/apexcharts') || id.includes('node_modules/vue3-apexcharts')) {
            return 'charts'
          }
          
          // HTTP
          if (id.includes('node_modules/axios/')) {
            return 'axios'
          }
          
          // Excel/PDF
          if (id.includes('node_modules/xlsx') || id.includes('node_modules/jspdf')) {
            return 'export-libs'
          }
          
          // TinyMCE
          if (id.includes('node_modules/tinymce') || id.includes('node_modules/@tinymce')) {
            return 'tinymce'
          }
          
          // Other vendor code
          if (id.includes('node_modules/')) {
            return 'vendor'
          }
        }
      }
    }
  },
  server: {
    host: '0.0.0.0', // برای دسترسی از بیرون
    allowedHosts: [
      'dash.linku.im', // ← دامنه خودت
    ],
    port: 5779,
    strictPort: true, // اگر پورت اشغال بود، خطا بده به جای انتخاب پورت دیگه
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
