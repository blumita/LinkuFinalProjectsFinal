<template>
  <Transition name="slide-down">
    <div
      v-if="show"
      class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg"
    >
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between gap-3">
          <!-- Icon & Message -->
          <div class="flex items-center gap-3 flex-1">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium leading-tight">
                برای دریافت تخفیف‌ها، بروزرسانی‌ها و اطلاع‌رسانی‌های مهم، اعلان‌ها را فعال کنید
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <!-- Enable Button -->
            <button
              @click="handleEnable"
              :disabled="loading"
              class="px-4 py-2 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all disabled:opacity-50 text-sm whitespace-nowrap"
            >
              <span v-if="!loading">فعال‌سازی</span>
              <span v-else class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>در حال فعال‌سازی...</span>
              </span>
            </button>

            <!-- Close Button -->
            <button
              @click="handleDismiss"
              :disabled="loading"
              class="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
              aria-label="بستن"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useNuxtApp } from '#app'

const show = ref(false)
const loading = ref(false)

const emit = defineEmits<{
  enabled: []
  dismissed: []
}>()

// Check if we should show the banner
const checkPermission = () => {
  if (!process.client || !('Notification' in window)) {
    return false
  }

  // Check if user already dismissed or granted permission
  const dismissed = localStorage.getItem('notification_banner_dismissed')
  const permission = Notification.permission

  // Show banner only if:
  // 1. Not dismissed
  // 2. Permission is default (not asked yet)
  if (!dismissed && permission === 'default') {
    show.value = true
  }
}

// Handle enable button click
const handleEnable = async () => {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const permission = await Notification.requestPermission()
    
    if (permission === 'granted') {
      // Subscribe to push notifications
      const { $subscribeToPush } = useNuxtApp()
      if ($subscribeToPush) {
        await $subscribeToPush()
      }
      
      show.value = false
      localStorage.setItem('notification_banner_dismissed', 'true')
      emit('enabled')
    } else if (permission === 'denied') {
      // User denied - hide banner and save state
      show.value = false
      localStorage.setItem('notification_banner_dismissed', 'true')
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error)
  } finally {
    loading.value = false
  }
}

// Handle dismiss button click
const handleDismiss = () => {
  show.value = false
  localStorage.setItem('notification_banner_dismissed', 'true')
  emit('dismissed')
}

// Check on mount
onMounted(() => {
  // Delay check slightly to let the page settle
  setTimeout(() => {
    checkPermission()
  }, 1500)
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
