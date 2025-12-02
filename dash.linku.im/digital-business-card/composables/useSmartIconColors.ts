import { computed } from 'vue'
import { useSafeFormStore } from '~/composables/useSafeFormStore'

export const useSmartIconColors = (customColor?: string) => {
  const formStore = useSafeFormStore()
  
  // تشخیص رنگ تیره یا روشن
  const isColorDark = (color: string): boolean => {
    if (!color || color === 'transparent') return false
    
    // حذف # اگر وجود دارد
    const hex = color.replace('#', '')
    
    // تبدیل به RGB
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    // محاسبه luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    
    return luminance < 0.5
  }
  
  // رنگ پیکر از FormStore
  const pickerColor = computed(() => formStore.value.iconColor?.background)
  
  // رنگ نهایی: اگر کاربر رنگ انتخاب کرده باشد از آن استفاده کن، وگرنه از رنگ پیش‌فرض ایکون
  const finalColor = computed(() => {
    // اگر رنگ پیکر مشکی باشه، یعنی هیچ رنگی انتخاب نشده
    if (pickerColor.value && 
        pickerColor.value !== 'transparent' && 
        pickerColor.value !== '#000000' && 
        pickerColor.value !== '#000') {
      return pickerColor.value
    }
    return customColor // اگر هیچ رنگی انتخاب نشده، رنگ پیش‌فرض ایکون
  })
  
  const isDarkMode = computed(() => {
    if (!finalColor.value) return false
    return isColorDark(finalColor.value)
  })
  
  // رنگ برای آیکون اصلی
  const primaryIconColor = computed(() => {
    // اگر هیچ رنگی در پیکر انتخاب نشده، رنگ پیش‌فرض ایکون را برگردان
    if (!pickerColor.value || 
        pickerColor.value === 'transparent' || 
        pickerColor.value === '#000000' || 
        pickerColor.value === '#000') {
      return customColor || '#000000'
    }
    
    if (isDarkMode.value) {
      return '#ffffff' // سفید برای رنگ‌های تیره
    }
    return finalColor.value // رنگ انتخابی برای رنگ‌های روشن
  })
  
  // رنگ برای المان‌های ثانویه با opacity
  const secondaryIconColor = computed(() => {
    // اگر هیچ رنگی در پیکر انتخاب نشده، رنگ پیش‌فرض ایکون را برگردان
    if (!pickerColor.value || 
        pickerColor.value === 'transparent' || 
        pickerColor.value === '#000000' || 
        pickerColor.value === '#000') {
      return customColor || '#000000'
    }
    
    if (isDarkMode.value) {
      return '#ffffff' // سفید برای رنگ‌های تیره
    }
    return finalColor.value // رنگ انتخابی برای رنگ‌های روشن
  })
  
  // پس‌زمینه آیکون
  const backgroundIconColor = computed(() => {
    // اگر هیچ رنگی در پیکر انتخاب نشده، رنگ پیش‌فرض ایکون را برگردان
    if (!pickerColor.value || 
        pickerColor.value === 'transparent' || 
        pickerColor.value === '#000000' || 
        pickerColor.value === '#000') {
      return customColor || '#000000'
    }
    return finalColor.value // رنگ انتخابی
  })
  
  return {
    finalColor,
    isDarkMode,
    primaryIconColor,
    secondaryIconColor,
    backgroundIconColor,
    isColorDark
  }
}
