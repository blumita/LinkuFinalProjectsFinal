// plugins/seo.client.ts
export default defineNuxtPlugin(() => {
  // بهینه‌سازی برای Core Web Vitals
  if (process.client) {
    // تاخیر در لود کردن تصاویر غیرضروری
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));

    // Font preloading is now handled in nuxt.config.ts for better performance
    // and to avoid "resource not used" warnings

    // اضافه کردن meta tags دینامیک
    const updateMetaTags = () => {
      // به‌روزرسانی canonical URL
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = window.location.href;

      // به‌روزرسانی og:url
      let ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement;
      if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
      }
      ogUrl.content = window.location.href;
    };

    // به‌روزرسانی meta tags در تغییر route
    const router = useRouter();
    router.afterEach(() => {
      nextTick(() => {
        updateMetaTags();
      });
    });

    // اولین بار
    updateMetaTags();

    // اضافه کردن محاسبه CLS
    let clsValue = 0;
    let clsEntries: any[] = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          const firstSessionEntry = clsEntries[0];
          const lastSessionEntry = clsEntries[clsEntries.length - 1];

          if (!firstSessionEntry || entry.startTime - lastSessionEntry.startTime > 1000 || entry.startTime - firstSessionEntry.startTime > 5000) {
            clsEntries = [entry];
          } else {
            clsEntries.push(entry);
          }

          clsValue += (entry as any).value;
        }
      }
    });

    if ('PerformanceObserver' in window) {
      try {
        observer.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        // Fallback for browsers that don't support the new syntax
      }
    }

    // گزارش CLS در console (فقط در development)
    if (process.dev) {
      setTimeout(() => {
      }, 5000);
    }
  }
});
