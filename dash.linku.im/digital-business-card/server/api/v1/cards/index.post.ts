import { proxyRequest } from 'h3'
import { getApiUrl } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  return proxyRequest(event, getApiUrl('/v1/cards'), {
    fetch: $fetch.native,
  })
})
