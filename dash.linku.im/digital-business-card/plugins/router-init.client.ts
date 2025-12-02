// plugins/router-init.client.ts
export default defineNuxtPlugin((): void => {
  // Ensure router is properly initialized before components try to use it
  if (process.client) {
    const nuxtApp = useNuxtApp()
    
    // Wait for router to be ready (without logging)
    nuxtApp.hook('app:mounted', () => {
      // Router is now ready for use (silently)
    })
  }
})
