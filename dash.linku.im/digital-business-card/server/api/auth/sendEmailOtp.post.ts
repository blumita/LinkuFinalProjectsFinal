import { ofetch } from 'ofetch'
import { getApiUrl } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {
    // Forward to Laravel API
    const response = await ofetch(getApiUrl('/auth/sendEmailOtp'), {
      method: 'POST',
      body: body,
      timeout: 15000,
      retry: 2,
      retryDelay: 1000,
    })
    
    return response
  } catch (error: any) {
    const errorMessage = error?.data || error?.message || error
    console.error('sendEmailOtp error:', errorMessage)
    
    if (error?.data) {
      return error.data
    }
    
    if (error?.message?.includes('fetch failed') || error?.message?.includes('no response')) {
      throw createError({
        statusCode: 503,
        message: 'سرور API در دسترس نیست. لطفاً چند لحظه دیگر تلاش کنید.',
      })
    }
    
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || 'خطا در ارسال کد',
    })
  }
})
