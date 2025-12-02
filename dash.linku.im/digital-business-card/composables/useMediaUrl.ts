/**
 * Composable برای تبدیل URL تصاویر و media
 * در محیط توسعه، URLهای http را به https تبدیل می‌کند تا Mixed Content error نداشته باشیم
 */
export const useMediaUrl = () => {
  const config = useRuntimeConfig()
  const isDev = config.public.isDevelopment

  /**
   * تبدیل URL media به URL قابل استفاده
   * در محیط توسعه، اگر صفحه روی HTTPS است، URL را به SSL proxy تبدیل می‌کند
   */
  const transformMediaUrl = (url: string | null | undefined): string | null => {
    if (!url) return null

    // اگر URL base64 است، تغییری نده
    if (url.startsWith('data:')) return url

    // اگر URL نسبی است، تغییری نده
    if (url.startsWith('/') && !url.startsWith('//')) return url

    // اگر از قبل HTTPS است، تغییری نده
    if (url.startsWith('https://')) return url

    // در محیط توسعه: تبدیل http://localhost:8000 به https://localhost:8443
    if (isDev && typeof window !== 'undefined') {
      const isPageHttps = window.location.protocol === 'https:'
      
      if (isPageHttps) {
        // تبدیل HTTP به HTTPS با پورت SSL proxy
        // http://localhost:8000 -> https://localhost:8443
        // http://127.0.0.1:8000 -> https://localhost:8443
        const transformed = url
          .replace('http://localhost:8000', 'https://localhost:8443')
          .replace('http://127.0.0.1:8000', 'https://localhost:8443')
        
        return transformed
      }
    }

    return url
  }

  /**
   * تبدیل آرایه‌ای از URLها
   */
  const transformMediaUrls = (urls: (string | null | undefined)[]): (string | null)[] => {
    return urls.map(transformMediaUrl)
  }

  return {
    transformMediaUrl,
    transformMediaUrls
  }
}

// برای استفاده مستقیم بدون composable
export const transformMediaUrl = (url: string | null | undefined): string | null => {
  if (!url) return null
  if (url.startsWith('data:')) return url
  if (url.startsWith('/') && !url.startsWith('//')) return url
  if (url.startsWith('https://')) return url

  // در محیط توسعه
  if (process.client && typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return url
      .replace('http://localhost:8000', 'https://localhost:8443')
      .replace('http://127.0.0.1:8000', 'https://localhost:8443')
  }

  return url
}
