export default defineNuxtPlugin(() => {
  if (process.client) {
    // Override console methods to filter out unwanted warnings
    const originalWarn = console.warn
    const originalError = console.error

    // لیست پیام‌هایی که باید فیلتر شوند
    const warningFilters = [
      '[Vue warn]',
      'Hydration',
      'SSR',
      'router',
      'composable',
      'Suspense',
      'experimental',
      '[Vue Router warn]',
      'Mixed Content',
      'sandbox',
      'allow-scripts',
      'allow-same-origin',
      'Outdated Optimize Dep',
      'error caught during app initialization'
    ]

    const errorFilters = [
      '[Vue warn]',
      'Hydration',
      '[Vue Router warn]',
      'Mixed Content',
      'sandbox',
      'allow-scripts',
      'allow-same-origin',
      'Outdated Optimize Dep',
      'error caught during app initialization',
      'Unexpected error when starting the router',
      'uncaught error during route navigation'
    ]

    console.warn = (...args) => {
      try {
        const message = args.map(arg => String(arg)).join(' ')
        
        // Filter out specific warnings we don't want to see
        if (warningFilters.some(filter => message.includes(filter))) {
          return // Don't show these warnings
        }
      } catch (e) {
        // If there's an error processing the message, just continue
      }
      
      originalWarn.apply(console, args)
    }

    console.error = (...args) => {
      try {
        const message = args.map(arg => String(arg)).join(' ')
        
        // Filter out specific errors we don't want to see in development
        if (errorFilters.some(filter => message.includes(filter))) {
          return // Don't show these errors
        }
      } catch (e) {
        // If there's an error processing the message, just continue
      }
      
      originalError.apply(console, args)
    }
  }
})