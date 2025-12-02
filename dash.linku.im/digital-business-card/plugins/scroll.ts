import { OverlayScrollbars } from 'overlayscrollbars'
import type { Options } from 'overlayscrollbars'

export function useCustomScrollbar(el: HTMLElement, options: Partial<Options> = {}) {
  return OverlayScrollbars(el, {
    scrollbars: {
      autoHide: 'leave',
      autoHideDelay: 500,
      theme: 'os-theme-dark',
    },
    ...options
  })
}

// ✅ اینو اضافه کن تا Nuxt بشناسد
export default defineNuxtPlugin(() => {
  // اگر کاری در زمان اجرا می‌خوای، اینجا بنویس
  // مثلاً ثبت global function یا directive (اگه بخوای)
})
