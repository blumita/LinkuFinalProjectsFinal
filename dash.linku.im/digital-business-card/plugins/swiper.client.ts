import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (process.client) {
    // Swiper will be loaded client-side only
  }
})