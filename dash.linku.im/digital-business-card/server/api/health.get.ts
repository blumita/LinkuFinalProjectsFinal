import { ofetch } from 'ofetch'
import { getApiBaseUrl, getApiUrl } from '~/server/utils/api'

export default defineEventHandler(async () => {
  const apiBase = getApiBaseUrl()
  const results = {
    server: 'ok',
    api: 'unknown',
    apiUrl: apiBase,
    timestamp: new Date().toISOString(),
    error: null as string | null,
  }

  try {
    // تست اتصال به API
    const start = Date.now()
    await ofetch(`${apiBase}/api`, {
      method: 'GET',
      timeout: 5000,
    })
    results.api = `ok (${Date.now() - start}ms)`
  } catch (error: any) {
    results.api = 'failed'
    results.error = error?.message || 'Unknown error'
  }

  return results
})
