// API Base URL utility for server-side
export const getApiBaseUrl = () => {
  // Production: https://api.linku.im
  // Development: http://127.0.0.1:8000
  return process.env.NUXT_PUBLIC_API_BASE || 'https://api.linku.im'
}

export const getApiUrl = (path: string) => {
  const base = getApiBaseUrl()
  // اگر path با / شروع نشده، اضافه کن
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}/api${normalizedPath}`
}
