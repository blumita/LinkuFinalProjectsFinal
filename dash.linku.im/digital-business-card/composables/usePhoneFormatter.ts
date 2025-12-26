/**
 * Composable برای فرمت کردن شماره تلفن
 * شماره‌ها در دیتابیس به صورت 9XXXXXXXXX (بدون صفر) ذخیره می‌شوند
 * کد کشور (+98) جداگانه ذخیره می‌شود
 */
export const usePhoneFormatter = () => {
  /**
   * فرمت کردن شماره تلفن برای نمایش - با اضافه کردن صفر
   * @param phone شماره تلفن از دیتابیس (9XXXXXXXXX)
   * @returns شماره فرمت شده برای نمایش (09XXXXXXXXX)
   */
  const formatPhone = (phone: string | null | undefined): string => {
    if (!phone) return ''
    
    // حذف فاصله‌ها و کاراکترهای غیرعددی
    const cleaned = phone.replace(/\D/g, '')
    
    // اگر با 09 شروع میشه، برگردون
    if (cleaned.startsWith('09') && cleaned.length === 11) {
      return cleaned
    }
    
    // اگر با 98 شروع میشه (کد کشور)، تبدیل کن به 09
    if (cleaned.startsWith('98') && cleaned.length === 12) {
      return `0${cleaned.substring(2)}`
    }
    
    // اگر با 9 شروع میشه و 10 رقمه (فرمت database)، یه صفر اضافه کن
    if (cleaned.startsWith('9') && cleaned.length === 10) {
      return `0${cleaned}`
    }
    
    // اگر با 0 شروع میشه و 11 رقمه، برگردون
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      return cleaned
    }
    
    // در غیر این صورت همونطوری که هست برگردون
    return cleaned
  }

  /**
   * فرمت کردن شماره تلفن با کد کشور
   * @param phone شماره تلفن
   * @param withPlus آیا + در ابتدا اضافه بشه؟
   * @returns شماره فرمت شده با کد کشور (+989XXXXXXXXX یا 989XXXXXXXXX)
   */
  const formatPhoneWithCountryCode = (phone: string | null | undefined, withPlus: boolean = true): string => {
    if (!phone) return ''
    
    // حذف فاصله‌ها و کاراکترهای غیرعددی
    const cleaned = phone.replace(/\D/g, '')
    
    // حذف صفر اول اگر وجود داشت
    let normalized = cleaned
    if (normalized.startsWith('0')) {
      normalized = normalized.substring(1)
    }
    
    // حذف کد کشور اگر از قبل وجود داشت
    if (normalized.startsWith('98')) {
      normalized = normalized.substring(2)
    }
    
    // اضافه کردن کد کشور
    const prefix = withPlus ? '+98' : '98'
    return `${prefix}${normalized}`
  }

  return {
    formatPhone,
    formatPhoneWithCountryCode
  }
}
