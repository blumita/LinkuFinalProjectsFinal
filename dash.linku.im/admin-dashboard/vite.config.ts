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
    chunkSizeWarningLimit: 1500,
    // کاهش استفاده از حافظه برای سرورهای با RAM محدود
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      // کاهش استفاده از CPU/RAM
      maxParallelFileOps: 2,
      output: {
        // اضافه کردن hash برای cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: (id) => {
          // فقط کتابخونه‌های سنگین رو جدا می‌کنیم
          // Vue و پیوستگی‌هاش رو با هم نگه می‌داریم
          
          // Charts - سنگین
          if (id.includes('node_modules/apexcharts') || id.includes('node_modules/vue3-apexcharts')) {
            return 'charts'
          }
          
          // Excel/PDF - خیلی سنگین
          if (id.includes('node_modules/xlsx') || id.includes('node_modules/jspdf')) {
            return 'export-libs'
          }
          
          // TinyMCE - خیلی سنگین
          if (id.includes('node_modules/tinymce') || id.includes('node_modules/@tinymce')) {
            return 'tinymce'
          }
          
          // بقیه vendor ها با Vue با هم
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
