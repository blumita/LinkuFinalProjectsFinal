import { proxyRequest, getHeader } from 'h3'
import { getApiUrl } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const path = event.path.replace(/^\/api/, '')
  const targetUrl = getApiUrl(path)
  
  // Get authorization header from original request
  const authHeader = getHeader(event, 'authorization')
  
  return proxyRequest(event, targetUrl, {
    fetch: $fetch.native,
    headers: authHeader ? { 'Authorization': authHeader } : {},
  })
})
