<template>
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <!-- تم رنگ متاکالر برای موبایل - داینامیک بر اساس دارک/لایت مود -->
    <meta name="theme-color" :content="themeColor" />
    <!-- برای iOS Safari -->
    <meta name="apple-mobile-web-app-status-bar-style" :content="isDarkMode ? 'black-translucent' : 'default'" />
  </Head>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

// Use safe form store
const formStore = await import('~/composables/useSafeFormStore').then(m => m.useSafeFormStore())

// تشخیص دارک مود
const isDarkMode = ref(false)

onMounted(() => {
  // چک کردن کلاس dark روی html
  const checkDarkMode = () => {
    isDarkMode.value = document.documentElement.classList.contains('dark')
  }
  
  checkDarkMode()
  
  // Observer برای تغییرات کلاس
  const observer = new MutationObserver(checkDarkMode)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
  
  onUnmounted(() => observer.disconnect())
})

// رنگ theme برای meta tag
const themeColor = computed(() => {
  // اول چک کن آیا دارک مود فعاله
  if (isDarkMode.value) {
    // در دارک مود از رنگ تیره استفاده کن
    return '#0a0a0a' // رنگ background دارک
  }
  
  // اگر رنگ آیکون موجود باشد از آن استفاده کن
  if (formStore.iconColor?.background && 
      formStore.iconColor.background !== 'transparent' && 
      formStore.iconColor.background !== '#000000') {
    return formStore.iconColor.background
  }
  
  // در غیر این صورت از رنگ تم پس‌زمینه استفاده کن
  if (formStore.themeColor?.background && 
      formStore.themeColor.background !== 'transparent') {
    return formStore.themeColor.background
  }
  
  // پیش‌فرض سفید
  return '#ffffff'
})
</script>
