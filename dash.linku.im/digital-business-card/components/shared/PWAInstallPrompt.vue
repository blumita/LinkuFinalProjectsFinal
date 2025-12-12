<template>
  <Teleport to="body">
    <!-- Modal Overlay -->
    <div
      v-if="showPrompt"
      class="fixed inset-0 z-[9999] bg-black/50"
      @click="handleDismiss"
    >
      <!-- Modal Content -->
      <div
        class="fixed inset-x-4 bottom-4 bg-card rounded-2xl shadow-xl border border-border p-5 max-w-md mx-auto"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <i class="ti ti-download text-2xl text-primary"></i>
          </div>
          <div class="flex-1">
            <h3 class="text-base font-bold text-foreground">نصب اپلیکیشن لینکو</h3>
            <p class="text-sm text-muted-foreground">دسترسی سریع‌تر به پروفایل شما</p>
          </div>
          <button @click="handleDismiss" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted">
            <i class="ti ti-x text-muted-foreground"></i>
          </button>
        </div>

        <!-- iOS Instructions -->
        <div v-if="isIOS" class="space-y-3 mb-5">
          <div class="flex items-center gap-3 text-sm text-muted-foreground">
            <span class="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium text-foreground">1</span>
            <span>روی دکمه <i class="ti ti-share mx-1 text-foreground"></i> اشتراک‌گذاری کلیک کنید</span>
          </div>
          <div class="flex items-center gap-3 text-sm text-muted-foreground">
            <span class="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium text-foreground">2</span>
            <span>"Add to Home Screen" را انتخاب کنید</span>
          </div>
          <div class="flex items-center gap-3 text-sm text-muted-foreground">
            <span class="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium text-foreground">3</span>
            <span>روی "Add" کلیک کنید</span>
          </div>
        </div>

        <!-- Android Benefits -->
        <div v-else class="flex items-center gap-4 mb-5 text-sm text-muted-foreground">
          <div class="flex items-center gap-1.5">
            <i class="ti ti-rocket text-primary"></i>
            <span>سریع‌تر</span>
          </div>
          <div class="flex items-center gap-1.5">
            <i class="ti ti-bell text-primary"></i>
            <span>اعلان‌ها</span>
          </div>
          <div class="flex items-center gap-1.5">
            <i class="ti ti-wifi-off text-primary"></i>
            <span>آفلاین</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            v-if="!isIOS"
            @click="handleInstall"
            class="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            نصب اپلیکیشن
          </button>
          <button
            v-else
            @click="handleDismiss"
            class="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            متوجه شدم
          </button>
          <button
            @click="handleNeverShow"
            class="py-3 px-4 bg-muted text-muted-foreground rounded-xl text-sm hover:bg-muted/80 transition-colors"
          >
            دیگر نشان نده
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showPrompt = ref(false)
const isIOS = ref(false)
const deferredPrompt = ref<any>(null)

// تشخیص پلتفرم
const detectPlatform = () => {
  if (typeof window === 'undefined') return

  const userAgent = window.navigator.userAgent.toLowerCase()
  isIOS.value = /iphone|ipad|ipod/.test(userAgent)
}

// چک کردن آیا PWA نصب شده یا نه
const isAppInstalled = () => {
  if (typeof window === 'undefined') return true

  if (isIOS.value) {
    return (window.navigator as any).standalone === true ||
           window.matchMedia('(display-mode: standalone)').matches
  }

  return window.matchMedia('(display-mode: standalone)').matches ||
         window.matchMedia('(display-mode: fullscreen)').matches ||
         window.matchMedia('(display-mode: minimal-ui)').matches
}

// چک کردن آیا قبلا dismiss شده
const isDismissedPermanently = () => {
  if (typeof window === 'undefined') return true
  return localStorage.getItem('pwa_install_dismissed') === 'true'
}

// نمایش prompt
const showInstallPrompt = () => {
  if (isAppInstalled() || isDismissedPermanently()) {
    return
  }

  if (isIOS.value || deferredPrompt.value) {
    setTimeout(() => {
      showPrompt.value = true
    }, 2000)
  }
}

// نصب برای Android
const handleInstall = async () => {
  if (!deferredPrompt.value) {
    handleDismiss()
    return
  }

  try {
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
      localStorage.setItem('pwa_installed', 'true')
    }

    deferredPrompt.value = null
    showPrompt.value = false
  } catch (error) {
    console.error('Error installing PWA:', error)
    handleDismiss()
  }
}

// بستن prompt
const handleDismiss = () => {
  showPrompt.value = false
  sessionStorage.setItem('pwa_install_dismissed_session', 'true')
}

// دیگر نمایش نده
const handleNeverShow = () => {
  showPrompt.value = false
  localStorage.setItem('pwa_install_dismissed', 'true')
}

// Event listeners
const handleBeforeInstallPrompt = (e: Event) => {
  e.preventDefault()
  deferredPrompt.value = e

  if (!sessionStorage.getItem('pwa_install_dismissed_session')) {
    showInstallPrompt()
  }
}

const handleAppInstalled = () => {
  showPrompt.value = false
  deferredPrompt.value = null
  localStorage.setItem('pwa_installed', 'true')
}

onMounted(() => {
  detectPlatform()
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)

  if (isIOS.value && !isAppInstalled() && !sessionStorage.getItem('pwa_install_dismissed_session')) {
    showInstallPrompt()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
})
</script>
