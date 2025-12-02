import { ref, computed } from 'vue'

export const useTheme = () => {
  const isDark = ref(false)

  // چک کردن وضعیت فعلی
  if (process.client) {
    isDark.value = document.documentElement.classList.contains('dark')
  }

  // تغییر به حالت دارک
  const setDark = () => {
    if (process.client) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      isDark.value = true
    }
  }

  // تغییر به حالت لایت
  const setLight = () => {
    if (process.client) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      isDark.value = false
    }
  }

  // تغییر بین دارک و لایت
  const toggleTheme = () => {
    if (isDark.value) {
      setLight()
    } else {
      setDark()
    }
  }

  // پاک کردن تنظیمات و استفاده از تنظیمات سیستم
  const useSystemTheme = () => {
    if (process.client) {
      localStorage.removeItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        setDark()
      } else {
        setLight()
      }
    }
  }

  // بررسی اینکه آیا از تنظیمات سیستم استفاده می‌شه
  const isUsingSystemTheme = computed(() => {
    if (process.client) {
      return !localStorage.getItem('theme')
    }
    return false
  })

  return {
    isDark,
    setDark,
    setLight,
    toggleTheme,
    useSystemTheme,
    isUsingSystemTheme
  }
}
