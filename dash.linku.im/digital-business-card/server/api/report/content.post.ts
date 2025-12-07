// Report Content API
// این API برای گزارش محتوای نامناسب کاربران استفاده می‌شود

import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // اعتبارسنجی داده‌های ورودی
    if (!body.type || !body.url) {
      throw createError({
        statusCode: 400,
        message: 'نوع گزارش و URL الزامی است'
      })
    }

    // انواع مجاز گزارش
    const validTypes = ['spam', 'inappropriate', 'fake', 'copyright', 'other']
    if (!validTypes.includes(body.type)) {
      throw createError({
        statusCode: 400,
        message: 'نوع گزارش معتبر نیست'
      })
    }

    // آماده‌سازی داده‌های گزارش
    const reportData = {
      type: body.type,
      url: body.url,
      description: body.description || '',
      reportedAt: new Date().toISOString(),
      userAgent: event.node.req.headers['user-agent'] || 'Unknown',
      ipAddress: event.node.req.headers['x-forwarded-for'] || 
                 event.node.req.headers['x-real-ip'] || 
                 event.node.req.socket.remoteAddress || 
                 'Unknown'
    }

    // TODO: ذخیره در دیتابیس
    // در اینجا باید گزارش را در دیتابیس ذخیره کنید
    // مثال:
    // await db.reports.create(reportData)
    
    // فعلاً فقط لاگ می‌کنیم
    console.log('📢 New Content Report:', reportData)

    // TODO: ارسال ایمیل/نوتیفیکیشن به ادمین
    // مثال:
    // await sendAdminNotification(reportData)

    return {
      success: true,
      message: 'گزارش شما با موفقیت ثبت شد و توسط تیم پشتیبانی بررسی خواهد شد',
      reportId: `REPORT-${Date.now()}` // ID موقت - باید از دیتابیس بیاید
    }

  } catch (error: any) {
    // اگر خطای createError باشد، همان را برگردان
    if (error.statusCode) {
      throw error
    }

    // خطای غیرمنتظره
    console.error('❌ Report API Error:', error)
    throw createError({
      statusCode: 500,
      message: 'خطا در ثبت گزارش. لطفاً دوباره تلاش کنید'
    })
  }
})
