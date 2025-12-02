// nuxt.config.ts
import fs from 'fs'
import path from 'path'

// فقط در محیط development فایل‌های certificate رو بخون
const isDev = process.env.NODE_ENV === 'development'
const certPath = path.resolve(__dirname, '.cert/localhost+3-key.pem')
const hasCert = isDev && fs.existsSync(certPath)

const httpsConfig = hasCert ? {
  key: fs.readFileSync(path.resolve(__dirname, '.cert/localhost+3-key.pem'), 'utf-8'),
  cert: fs.readFileSync(path.resolve(__dirname, '.cert/localhost+3.pem'), 'utf-8')
} : undefined

export default defineNuxtConfig({
  compatibilityDate: '2025-07-12',
  devServer: {
    port: 3000,
    host: '0.0.0.0', // برای دسترسی از IP شبکه
    // SSL فقط در development (اگر certificate موجود باشد)
    https: httpsConfig
  },
  vite: {
    server: {
      // SSL فقط در development (اگر certificate موجود باشد)
      https: httpsConfig,
      hmr: {
        port: 24678,
        host: '0.0.0.0', // برای دسترسی از IP شبکه
        overlay: false,
      }
    },
    optimizeDeps: {
      include: ['object-assign'],
      exclude: ['vue-router'] // Exclude vue-router to prevent hydration issues
    },
    vue: {
      template: {
        compilerOptions: {
          whitespace: 'preserve'
        }
      }
    },
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            // Core Vue packages
            'vue-vendor': ['vue', 'vue-router', '@vue/reactivity', '@vue/runtime-core', '@vue/runtime-dom', '@vue/shared'],
            'pinia': ['pinia'],
            
            // UI Components
            'swiper': ['swiper'],
            
            // HTTP & API
            'axios': ['axios'],
          }
        }
      }
    }
  },
  nitro: {
    // Removed devProxy - using server-side API routes in /server/api/ instead
    routeRules: {
      '/board/**': { ssr: false }, // Disable SSR for board pages to avoid proxy conflicts
      '/auth/**': { ssr: false }, // Disable SSR for auth pages to fix 403 error
      '/preview/**': {
        ssr: true,
        headers: {
          'X-Frame-Options': 'SAMEORIGIN',
          'Content-Security-Policy': "frame-ancestors 'self'; sandbox allow-scripts allow-same-origin allow-forms"
        }
      },
      '/api/sitemap.xml': { headers: { 'Content-Type': 'application/xml' } },
      //'/:slug': { redirect: '/preview/:slug', statusCode: 200 } // برای rewrite باید statusCode رو 200 بذاری
    }
  },
  css: [
    '@/assets/css/main.css'
  ],
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => tag.startsWith('ion-')
    },
    runtimeCompiler: process.env.NODE_ENV === 'development'
  },
  components: true,
  ssr: true,
  
  // Modules
  modules: [
    '@pinia/nuxt'
  ],
  
  // SSR optimization to prevent hydration mismatches
  experimental: {
    payloadExtraction: false, // Disabled to prevent hydration issues
    renderJsonPayloads: false,
    typedPages: false
  },
  
  // Client-side plugins to ensure proper hydration
  plugins: [
    '~/plugins/auth-sync.client.ts', // Auth token sync (must be first)
    '~/plugins/theme.client.ts', // Theme detection plugin
    '~/plugins/axios.ts',
    '~/plugins/scroll.ts',
    '~/plugins/vue-warnings.client.ts', // Added Vue warnings suppression
    '~/plugins/router-init.client.ts', // Added router initialization
    '~/plugins/pwa-navigation.client.ts', // PWA navigation handling
    '~/plugins/seo.client.ts', // SEO optimization plugin
    '~/plugins/permissions.client.ts', // PWA permissions (camera, location, NFC)
    '~/plugins/service-worker.client.ts', // Service Worker & Push Notifications
  ],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl',
      },
      title: 'لینکو - Linku | پلتفرم ساخت بیو لینک و کارت دیجیتال',
      titleTemplate: '%s | لینکو - Linku',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        },
        { name: 'description', content: 'پلتفرم ایرانی ساخت بیو لینک و کارت دیجیتال - تمام لینک‌های شما در یک مکان' },
        { name: 'keywords', content: 'بیو لینک, کارت دیجیتال, لینکو, linku, لینک در بیو, bio link, digital card' },
        { name: 'author', content: 'Linku Team' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'format-detection', content: 'telephone=no' },
        // رنگ متا برای اندروید (theme-color)
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: dark)' },
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
        // رنگ نوار وضعیت iOS
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'Linku' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        // رنگ برای ویندوز
        { name: 'msapplication-TileColor', content: '#ffffff' },
        // Mobile optimization
        { name: 'HandheldFriendly', content: 'true' },
        { name: 'MobileOptimized', content: '320' },
        // Geo tags
        { name: 'geo.region', content: 'IR' },
        { name: 'geo.country', content: 'Iran' },
        // Language and content
        { name: 'language', content: 'Persian' },
        { name: 'distribution', content: 'global' },
        { name: 'rating', content: 'general' },
        { name: 'revisit-after', content: '7 days' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'لینکو - Linku' },
        { property: 'og:title', content: 'لینکو - Linku | پلتفرم ساخت بیو لینک و کارت دیجیتال' },
        { property: 'og:description', content: 'پلتفرم ایرانی ساخت بیو لینک و کارت دیجیتال - تمام لینک‌های شما در یک مکان' },
        { property: 'og:image', content: '/images/og-image.jpg' },
        { property: 'og:url', content: 'https://linku.com' },
        { property: 'og:locale', content: 'fa_IR' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@linku' },
        { name: 'twitter:creator', content: '@linku' },
        { name: 'twitter:title', content: 'لینکو - Linku | پلتفرم ساخت بیو لینک و کارت دیجیتال' },
        { name: 'twitter:description', content: 'پلتفرم ایرانی ساخت بیو لینک و کارت دیجیتال - تمام لینک‌های شما در یک مکان' },
        { name: 'twitter:image', content: '/images/og-image.jpg' },
        // رنگ‌بندی کل سایت
        { name: 'color-scheme', content: 'dark light' },
      ],
      link: [
        { rel: 'canonical', href: 'https://linku.com' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'sitemap', type: 'application/xml', href: '/api/sitemap.xml' },
        // DNS Prefetch for performance
        { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: '//cdn.jsdelivr.net' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
      ],
      script: [
        // اسکریپت inline برای جلوگیری از فلش دارک مود و تم (باید اول باشه)
        {
          innerHTML: `
            (function() {
              try {
                const savedThemeMode = localStorage.getItem('theme-mode') || localStorage.getItem('theme') || 'system';
                const savedThemeColor = localStorage.getItem('theme-color') || 'blue';
                
                // اضافه کردن کلاس رنگ تم
                document.documentElement.classList.add('theme-' + savedThemeColor);
                
                // اعمال dark/light mode
                if (savedThemeMode === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (savedThemeMode === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  // system mode
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (prefersDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                }
              } catch (e) {}
            })();
          `,
          type: 'text/javascript',
          tagPosition: 'head'
        },
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'لینکو - Linku',
            url: 'https://linku.com',
            logo: 'https://linku.com/logo/logo.png',
            description: 'پلتفرم ایرانی ساخت بیو لینک و کارت دیجیتال',
            sameAs: [
              'https://www.instagram.com/linkuفtagtag',
              'https://www.twitter.com/linkuفtagtag',
              'https://www.linkedin.com/company/linkuفtagtag'
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              availableLanguage: ['Persian', 'English']
            },
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'تهران',
              addressCountry: 'IR'
            }
          })
        }
      ]
    }
  },
  runtimeConfig: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.linku.im',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.linku.im',
      isDevelopment: process.env.NODE_ENV === 'development',
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'https://linku.im',
      siteName: 'لینکو - Linku',
      siteDescription: 'پلتفرم ایرانی ساخت بیو لینک و کارت دیجیتال - تمام لینک‌های شما در یک مکان',
    }
  },
  // Development-specific configuration
  devtools: { enabled: false },
});
