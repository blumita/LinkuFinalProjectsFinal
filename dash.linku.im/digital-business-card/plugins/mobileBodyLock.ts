// Global mobile body lock plugin
export default defineNuxtPlugin((nuxtApp) => {
  // Simple global method without composable lifecycle issues
  const mobileBodyLock = {
    enable() {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.width = '100%'
      }
    },
    disable() {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.width = ''
      }
    }
  }

  // Provide globally
  nuxtApp.provide('mobileBodyLock', mobileBodyLock)
  
  // Add to global scope for easier access
  if (typeof window !== 'undefined') {
    (window as any).__mobileBodyLock = mobileBodyLock
  }
})

// Export a composable for component use
export function useMobileBodyLock() {
  const enable = () => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    }
  }

  const disable = () => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }

  return { enable, disable }
}
