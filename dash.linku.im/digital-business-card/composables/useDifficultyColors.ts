import { computed } from 'vue'
import { useSafeFormStore } from '~/composables/useSafeFormStore'

export function useDifficultyColors() {
  const formStore = useSafeFormStore()
  
  // دریافت رنگ انتخابی از آیکون پیکر (iconColor)
  const pickerColor = computed(() => formStore.value.iconColor?.background)
  
  // بررسی اینکه آیا رنگی از آیکون پیکر انتخاب شده
  const hasPickerColor = computed(() => {
    return pickerColor.value && 
           pickerColor.value !== 'transparent' && 
           pickerColor.value !== '#000000' && 
           pickerColor.value !== '#000' &&
           pickerColor.value !== 'rgba(0,0,0,0)' &&
           pickerColor.value !== 'rgba(0, 0, 0, 0)'
  })
  
  // تولید شدت‌های مختلف رنگ انتخابی
  const generateShades = (baseColor: string) => {
    // برای رنگ‌های انتخابی از آیکون پیکر، شدت‌های مختلف ایجاد می‌کنیم
    const removeHash = baseColor.replace('#', '')
    const r = parseInt(removeHash.substring(0, 2), 16)
    const g = parseInt(removeHash.substring(2, 4), 16)
    const b = parseInt(removeHash.substring(4, 6), 16)
    
    // برای مشکی، شدت‌های خاکستری استفاده میکنیم
    if (baseColor === '#000000' || baseColor === '#000') {
      return {
        easy: '#666666',    // خاکستری روشن
        medium: '#333333',  // خاکستری متوسط  
        hard: '#000000'     // مشکی
      }
    }
    
    return {
      easy: `rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)})`,
      medium: baseColor,
      hard: `rgb(${Math.max(0, r - 50)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 50)})`
    }
  }
  
  // رنگ‌های نهایی برای سطوح سختی
  const difficultyColors = computed(() => {
    const colors = hasPickerColor.value 
      ? generateShades(pickerColor.value!)
      : generateShades('#000000') // اگر رنگی انتخاب نشده، از رنگ مشکی دیفالت استفاده کن
    
    return colors
  })
  
  // آرایه سطوح سختی با رنگ‌های داینامیک
  const difficultyLevels = computed(() => [
    {
      value: 'easy',
      label: 'ساده',
      colorHex: difficultyColors.value.easy
    },
    {
      value: 'medium', 
      label: 'متوسط',
      colorHex: difficultyColors.value.medium
    },
    {
      value: 'hard',
      label: 'سخت', 
      colorHex: difficultyColors.value.hard
    }
  ])
  
  return {
    difficultyLevels,
    difficultyColors,
    hasPickerColor
  }
}
