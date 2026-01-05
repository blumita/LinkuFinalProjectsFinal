// API Base URL utility for server-side
export const getApiBaseUrl = () => {
  // Server-side: Use internal connection for faster response
  // Production: http://127.0.0.1 (internal nginx)
  // Development: http://127.0.0.1:8000
  if (process.server) {
    return 'http://127.0.0.1'
  }
  return process.env.NUXT_PUBLIC_API_BASE || 'https://api.linku.im'
}

export const getApiUrl = (path: string) => {
  const base = getApiBaseUrl()
  // اگر path با / شروع نشده، اضافه کن
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  // اگر path با /api شروع میشه، دوباره /api اضافه نکن
  if (normalizedPath.startsWith('/api')) {
    return `${base}${normalizedPath}`
  }
  return `${base}/api${normalizedPath}`
}
