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
    // بهینه‌سازی برای سرور با 6GB RAM
    minify: 'esbuild',
    target: 'es2015',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      // کاهش استفاده از CPU/RAM - فقط 1 فایل همزمان
      maxParallelFileOps: 1,
      output: {
        // اضافه کردن hash برای cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // کاهش تعداد chunk ها برای کاهش مصرف RAM
        manualChunks: (id) => {
          // فقط یک vendor chunk برای همه
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
