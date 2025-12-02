// middleware/seo.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // تنها در سمت کلاینت اجرا شود
  if (process.client) {
    // اضافه کردن structured data برای صفحات خاص
    nextTick(() => {
      addPageSpecificStructuredData(to.path);
    });
  }
});

function addPageSpecificStructuredData(path: string) {
  // حذف structured data قبلی
  const existingScript = document.querySelector('script[data-nuxt-ssr="seo-structured-data"]');
  if (existingScript) {
    existingScript.remove();
  }

  let structuredData = null;

  // تولید structured data بر اساس مسیر
  switch (path) {
    case '/':
      structuredData = generateHomepageSchema();
      break;
    case '/preview':
      structuredData = generatePreviewSchema();
      break;
    case '/dashboard':
      structuredData = generateDashboardSchema();
      break;
    default:
      if (path.startsWith('/preview/')) {
        structuredData = generateProfileSchema(path);
      }
  }

  if (structuredData) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-nuxt-ssr', 'seo-structured-data');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }
}

function generateHomepageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'لینکو - LinkuDash',
    url: 'https://linkudash.com',
    description: 'پلتفرم ایرانی ساخت بیو لینک و کارت دیجیتال',
    inLanguage: 'fa-IR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://linkudash.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

function generatePreviewSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'پیش‌نمایش پروفایل - لینکو',
    description: 'پیش‌نمایش پروفایل شما در لینکو',
    url: 'https://linku.im/preview',
    isPartOf: {
      '@type': 'WebSite',
      name: 'لینکو - Linku.im',
      url: 'https://linku.im'
    }
  };
}

function generateDashboardSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'داشبورد کاربری - لینکو',
    description: 'مدیریت پروفایل و لینک‌های شما',
    url: 'https://linku.im/dashboard',
    isPartOf: {
      '@type': 'WebSite',
      name: 'لینکو - Linku.im',
      url: 'https://linku.im'
    }
  };
}

function generateProfileSchema(path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: `https://linku.im${path}`,
    description: 'صفحه پروفایل کاربر در لینکو',
    isPartOf: {
      '@type': 'WebSite',
      name: 'لینکو - Linku.im',
      url: 'https://linku.im'
    }
  };
}
