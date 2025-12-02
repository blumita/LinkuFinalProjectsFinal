import { ref, computed, readonly } from 'vue'
import { useRoute } from 'vue-router'

// Define route types
type RouteKeys = '/dashboard' | '/dashboard/dashboard' | '/dashboard/notifications' | '/dashboard/support' | '/dashboard/transactions' | '/dashboard/insights' | '/settings' | '/inbox'

// Global search states برای حفظ search در هر صفحه
const searchStates = ref<Record<RouteKeys, string>>({
  '/dashboard': '',
  '/dashboard/dashboard': '',
  '/dashboard/notifications': '',
  '/dashboard/support': '',
  '/dashboard/transactions': '',
  '/dashboard/insights': '',
  '/settings': '',
  '/inbox': ''
})

export const useSmartSearch = () => {
  const route = useRoute()
  
  // تعریف placeholder برای هر صفحه
  const searchPlaceholders: Record<RouteKeys, string> = {
    '/dashboard': 'جستجوی پروفایل‌ها...',
    '/dashboard/dashboard': 'جستجوی پروفایل‌ها...',
    '/dashboard/notifications': 'جستجوی اعلان‌ها...',
    '/dashboard/support': 'جستجوی پرسش‌ها...',
    '/dashboard/transactions': 'جستجوی تراکنش‌ها...',
    '/dashboard/insights': 'جستجوی آمارها...',
    '/settings': 'جستجوی تنظیمات...',
    '/inbox': 'جستجوی پیام‌ها...'
  }
  
  // Placeholder پویا
  const placeholder = computed(() => {
    const routePath = route.path as RouteKeys
    return searchPlaceholders[routePath] || 'جستجو...'
  })
  
  // مقدار search فعلی برای این صفحه
  const searchValue = computed({
    get: () => {
      const routePath = route.path as RouteKeys
      return searchStates.value[routePath] || ''
    },
    set: (value: string) => {
      const routePath = route.path as RouteKeys
      if (searchStates.value[routePath] !== undefined) {
        searchStates.value[routePath] = value
      }
    }
  })
  
  // پاک کردن search برای صفحه فعلی
  const clearSearch = () => {
    const routePath = route.path as RouteKeys
    if (searchStates.value[routePath] !== undefined) {
      searchStates.value[routePath] = ''
    }
  }
  
  // دریافت search برای صفحه خاص
  const getSearchForPage = (pagePath: RouteKeys) => {
    return searchStates.value[pagePath] || ''
  }
  
  return {
    searchValue,
    placeholder,
    clearSearch,
    getSearchForPage,
    searchStates: readonly(searchStates)
  }
}
