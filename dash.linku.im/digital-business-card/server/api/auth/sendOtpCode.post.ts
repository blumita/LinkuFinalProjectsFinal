import { ofetch } from 'ofetch'
import { getApiUrl } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {
    const response = await ofetch(getApiUrl('/auth/sendOtpCode'), {
      method: 'POST',
      body: body,
      timeout: 15000, // 15 ثانیه timeout
      retry: 2, // 2 بار retry
      retryDelay: 1000, // 1 ثانیه بین هر retry
    })
    
    return response
  } catch (error: any) {
    const errorMessage = error?.data || error?.message || error
    console.error('sendOtpCode error:', errorMessage)
    
    // اگر خطا از API اومده، همون رو برگردون
    if (error?.data) {
      return error.data
    }
    
    // خطای fetch failed - مشکل اتصال
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
