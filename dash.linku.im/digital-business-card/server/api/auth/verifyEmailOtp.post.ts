import { proxyRequest, getHeader } from 'h3'
import { getApiUrl } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  // Use proxyRequest to preserve status code (200 for existing users, 201 for new users)
  const targetUrl = getApiUrl('/auth/verifyEmailOtp')
  const authHeader = getHeader(event, 'authorization')
  
  return proxyRequest(event, targetUrl, {
    fetch: $fetch.native,
    headers: authHeader ? { 'Authorization': authHeader } : {},
  })
})
