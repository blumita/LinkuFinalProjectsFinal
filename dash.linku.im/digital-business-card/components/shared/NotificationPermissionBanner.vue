<template>
  <Transition name="toast-slide">
    <div
      v-if="show"
      class="fixed top-4 left-4 right-4 z-[9999] mx-auto max-w-md"
    >
      <div class="bg-card/95 backdrop-blur-md rounded-xl shadow-lg border border-border p-3">
        <div class="flex items-center gap-3">
          <!-- Icon -->
          <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <i class="ti ti-bell text-primary text-xl"></i>
          </div>
          
          <!-- Message -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-foreground">
              فعال‌سازی اعلان‌ها
            </p>
            <p class="text-xs text-muted-foreground mt-0.5">
              برای دریافت آپدیت‌ها
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <button
              @click="handleEnable"
              :disabled="loading"
              class="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <span v-if="!loading">فعال کن</span>
              <span v-else>...</span>
            </button>

            <button
              @click="handleDismiss"
              :disabled="loading"
              class="p-1.5 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
              aria-label="بستن"
            >
              <i class="ti ti-x text-muted-foreground text-lg"></i>
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
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-slide-enter-from {
  transform: translateY(-100px);
  opacity: 0;
}

.toast-slide-leave-to {
  transform: translateY(-100px);
  opacity: 0;
}
</style>
