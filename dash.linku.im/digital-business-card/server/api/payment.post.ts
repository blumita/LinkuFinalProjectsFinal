import { proxyRequest } from 'h3'
import { getApiUrl } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  return proxyRequest(event, getApiUrl('/payment'), {
    fetch: $fetch.native,
  })
})
