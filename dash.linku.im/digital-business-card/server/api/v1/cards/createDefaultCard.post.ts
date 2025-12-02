import { proxyRequest, getHeader } from 'h3'
import { getApiUrl } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  
  return proxyRequest(event, getApiUrl('/v1/cards/createDefaultCard'), {
    fetch: $fetch.native,
    headers: authHeader ? { 'Authorization': authHeader } : {},
  })
})
