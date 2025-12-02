import { computed } from 'vue'
import { useSafeFormStore } from '~/composables/useSafeFormStore'

export const useIconColorSystem = () => {
  const formStore = useSafeFormStore()
  
  // تشخیص اینکه آیا color picker فعال است
  const isColorPickerActive = computed(() => {
    const iconColor = formStore.value.iconColor?.background
    return iconColor && iconColor !== '#000000' && iconColor !== 'transparent'
  })
  
  // رنگ اصلی آیکون از color picker
  const primaryColor = computed(() => {
    return formStore.value.iconColor?.background || '#000000'
  })
  
  // رنگ پس‌زمینه - اگر color picker فعال باشد transparent, وگرنه رنگ اصلی آیکون
  const backgroundColor = computed(() => {
    return isColorPickerActive.value ? 'transparent' : undefined
  })
  
  // رنگ اصلی با کمی شفافیت برای قسمت‌های ثانویه
  const secondaryColor = computed(() => {
    return isColorPickerActive.value ? primaryColor.value : undefined
  })
  
  // opacity برای قسمت‌های مختلف آیکون
  const primaryOpacity = computed(() => {
    return isColorPickerActive.value ? '1' : '1'
  })
  
  const secondaryOpacity = computed(() => {
    return isColorPickerActive.value ? '0.8' : '0.8'
  })
  
  const tertiaryOpacity = computed(() => {
    return isColorPickerActive.value ? '0.6' : '0.6'
  })
  
  return {
    isColorPickerActive,
    primaryColor,
    backgroundColor,
    secondaryColor,
    primaryOpacity,
    secondaryOpacity,
    tertiaryOpacity
  }
}
