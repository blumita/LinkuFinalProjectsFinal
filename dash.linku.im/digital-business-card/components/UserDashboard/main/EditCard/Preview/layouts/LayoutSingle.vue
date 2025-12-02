<template>
  <div
    :style="{
      backgroundColor: formStore.themeColor.background || '#fff'
    }"
    class="w-full h-full absolute bg-gradient-to-br from-white to-gray-100 flex items-center justify-center cursor-pointer transition-all duration-200"
    @click="handleLinkClick"
  >
    <!-- بک‌گراند اضافی با opacity مناسب -->
    <div
      class="absolute inset-0 z-0"
      :style="{
        backgroundColor: formStore.themeColor.background || '#ffffff',
        opacity: getBackgroundOpacity(formStore.themeColor.background)
      }"
    />
    
    <!-- محتوای اصلی لینک -->
    <div class="flex flex-col items-center space-y-4 z-10 text-center">
      <!-- آیکون بزرگ -->
      <div
        class="w-28 h-28 rounded-2xl flex items-center justify-center"
        :style="{ backgroundColor: iconColor.background, color: iconColor.text }"
      >
        <template v-if="iconComponent">
          <component 
            :is="iconComponent" 
            class="w-20 h-20 text-current"
          />
        </template>
        <template v-else-if="activeLink?.customIcon">
          <img
            :src="activeLink.customIcon"
            class="w-16 h-16 object-cover rounded-lg"
            alt="custom icon"
          >
        </template>
        <template v-else>
          <i class="ti ti-link text-blue-500 text-4xl" />
        </template>
      </div>
      
      <!-- عنوان -->
      <div class="text-xl font-bold text-gray-800 max-w-xs text-center">
        {{ displayTitle }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormStore } from '~/stores/form'
import { useIconComponents } from '~/composables/useIconComponentsMap'

const formStore = useFormStore()

// دسترسی به composable
const { getIconComponent } = useIconComponents()

// لینک فعال (اولین لینک در آرایه)
const activeLink = computed(() => {
  const links = formStore.links || []
  return links.length > 0 ? links[0] : null
})

// داده‌های آیکون
const iconData = computed(() => activeLink.value?.icon || null)

// کامپوننت آیکون
const iconComponent = computed(() => {
  if (!iconData.value) return null
  
  if (typeof iconData.value === 'string') {
    return getIconComponent(iconData.value)
  }
  
  if (typeof iconData.value === 'object' && 'name' in iconData.value) {
    return getIconComponent(iconData.value.name as string)
  }
  
  return getIconComponent('link') // پیش‌فرض
})

// رنگ آیکون - ساده و درست
const iconColor = computed(() => {
  return formStore.iconColor || { background: '#000000', text: '#ffffff' }
})

// محاسبه opacity مناسب برای پس‌زمینه
function getBackgroundOpacity(color) {
  if (!color || color === 'transparent') return 0.05;

  let r, g, b;

  // اگر رنگ hex باشد
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  }
  // اگر رنگ rgb یا rgba باشد
  else if (color.startsWith('rgb')) {
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbMatch) {
      [, r, g, b] = rgbMatch.map(Number);
    } else {
      return 0.05;
    }
  }
  else {
    return 0.05;
  }

  // محاسبه brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // اگر رنگ کاملاً مشکی است (#000000) یا بسیار تیره
  if (color === '#000000' || brightness < 30) {
    return 0.02;  // کاهش یافته از 0.05 به 0.02
  }
  // اگر رنگ تیره است
  else if (brightness < 100) {
    return 0.1;
  }
  // اگر رنگ متوسط است
  else if (brightness < 150) {
    return 0.15;
  }
  // اگر رنگ روشن است، opacity بیشتر
  else {
    return 0.3;
  }
}

// عنوان نمایشی - با fallback بهتر
const displayTitle = computed(() => {
  const link = activeLink.value
  if (!link) return 'لینک'
  
  // اگر title داره، از اون استفاده کن
  if (link.title && link.title.trim()) {
    return link.title.trim()
  }
  
  // اگر title نداره، از action type استفاده کن
  if (link.action) {
    const actionNames: Record<string, string> = {
      'call': 'تماس',
      'sms': 'پیامک',
      'email': 'ایمیل',
      'website': 'وب‌سایت',
      'instagram': 'اینستاگرام',
      'telegram': 'تلگرام',
      'whatsapp': 'واتساپ',
      'linkedin': 'لینکدین',
      'twitter': 'توییتر',
      'facebook': 'فیسبوک',
      'youtube': 'یوتیوب'
    }
    return actionNames[link.action] || 'لینک'
  }
  
  return 'لینک'
})

// تابع کلیک روی لینک
function handleLinkClick() {
  const link = activeLink.value
  if (!link || !link.value) return

  let url = link.baseUrl + link.value

  // اضافه کردن پروتکل اگر لازم بود
  if (
      !url.startsWith('http://') &&
      !url.startsWith('https://') &&
      !url.startsWith('tel:') &&
      !url.startsWith('sms:') &&
      !url.startsWith('mailto:')
  ) {
    url = 'https://' + url
  }


  // اگر لینک از نوع tel یا sms یا mailto بود، در همان تب باز کن
  if (url.startsWith('tel:') || url.startsWith('sms:') || url.startsWith('mailto:')) {
    window.location.href = url
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
</script>
