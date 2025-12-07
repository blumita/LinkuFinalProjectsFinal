<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showPrompt"
        class="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm"
        @click="handleDismiss"
      >
        <Transition
          enter-active-class="transition-transform duration-300 ease-out"
          enter-from-class="translate-y-full"
          enter-to-class="translate-y-0"
          leave-active-class="transition-transform duration-200 ease-in"
          leave-from-class="translate-y-0"
          leave-to-class="translate-y-full"
        >
          <div
            v-if="showPrompt"
            class="fixed inset-x-0 bottom-0 bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-t-3xl shadow-2xl overflow-hidden"
            @click.stop
          >
            <!-- برای iOS -->
            <div v-if="isIOS" class="px-6 py-8 space-y-6">
              <!-- Header -->
              <div class="text-center space-y-3">
                <div class="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-xl flex items-center justify-center animate-bounce-slow">
                  <img src="/logo.svg" alt="Linku" class="w-12 h-12" />
                </div>
                <h2 class="text-2xl font-bold text-gray-900">
                  نصب اپلیکیشن لینکو
                </h2>
                <p class="text-sm text-gray-600 leading-relaxed">
                  برای دسترسی سریع‌تر و تجربه بهتر، لینکو را به صفحه اصلی خود اضافه کنید
                </p>
              </div>

              <!-- Steps for iOS -->
              <div class="space-y-4 bg-white/80 backdrop-blur rounded-2xl p-5 border border-blue-100">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                    1
                  </div>
                  <div class="flex-1 pt-1">
                    <p class="text-sm text-gray-700 leading-relaxed">
                      روی دکمه <span class="font-bold text-blue-600">اشتراک‌گذاری</span>
                      <svg class="inline-block w-5 h-5 mx-1 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/>
                      </svg>
                      در پایین صفحه کلیک کنید
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                    2
                  </div>
                  <div class="flex-1 pt-1">
                    <p class="text-sm text-gray-700 leading-relaxed">
                      گزینه <span class="font-bold text-purple-600">"Add to Home Screen"</span> یا <span class="font-bold text-purple-600">"افزودن به صفحه اصلی"</span> را انتخاب کنید
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                    3
                  </div>
                  <div class="flex-1 pt-1">
                    <p class="text-sm text-gray-700 leading-relaxed">
                      روی <span class="font-bold text-green-600">"Add"</span> یا <span class="font-bold text-green-600">"افزودن"</span> کلیک کنید
                    </p>
                  </div>
                </div>
              </div>

              <!-- Visual Guide -->
              <div class="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 text-white">
                <div class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <i class="ti ti-device-mobile text-2xl"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium">
                      پس از نصب، آیکون لینکو در صفحه اصلی شما ظاهر می‌شود
                    </p>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="space-y-3">
                <button
                  @click="handleDismiss"
                  class="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold transition-colors"
                >
                  متوجه شدم
                </button>
                <button
                  @click="handleNeverShow"
                  class="w-full py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  دیگر نمایش نده
                </button>
              </div>
            </div>

            <!-- برای Android -->
            <div v-else class="px-6 py-8 space-y-6">
              <!-- Header -->
              <div class="text-center space-y-3">
                <div class="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-teal-600 rounded-3xl shadow-xl flex items-center justify-center animate-bounce-slow">
                  <img src="/logo.svg" alt="Linku" class="w-12 h-12" />
                </div>
                <h2 class="text-2xl font-bold text-gray-900">
                  نصب اپلیکیشن لینکو
                </h2>
                <p class="text-sm text-gray-600 leading-relaxed">
                  با نصب اپلیکیشن، دسترسی سریع‌تر و تجربه بهتری داشته باشید
                </p>
              </div>

              <!-- Benefits -->
              <div class="space-y-3">
                <div class="flex items-center gap-3 bg-white/80 backdrop-blur rounded-xl p-4 border border-green-100">
                  <div class="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                    <i class="ti ti-rocket text-xl"></i>
                  </div>
                  <p class="text-sm text-gray-700 font-medium">دسترسی سریع از صفحه اصلی</p>
                </div>

                <div class="flex items-center gap-3 bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100">
                  <div class="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    <i class="ti ti-bell text-xl"></i>
                  </div>
                  <p class="text-sm text-gray-700 font-medium">دریافت اعلان‌های فوری</p>
                </div>

                <div class="flex items-center gap-3 bg-white/80 backdrop-blur rounded-xl p-4 border border-purple-100">
                  <div class="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center">
                    <i class="ti ti-offline text-xl"></i>
                  </div>
                  <p class="text-sm text-gray-700 font-medium">کار بدون نیاز به اینترنت</p>
                </div>
              </div>

              <!-- Steps Guide (Optional - برای اندروید معمولا خودش prompt میده) -->
              <div class="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-4 text-white text-center">
                <p class="text-sm font-medium">
                  با کلیک روی دکمه "نصب"، اپلیکیشن به صورت خودکار نصب می‌شود
                </p>
              </div>

              <!-- Actions -->
              <div class="space-y-3">
                <button
                  @click="handleInstall"
                  class="w-full py-4 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-2xl font-bold text-lg shadow-lg transition-all transform active:scale-95"
                >
                  <i class="ti ti-download ml-2"></i>
                  نصب اپلیکیشن
                </button>
                <button
                  @click="handleDismiss"
                  class="w-full py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  بعداً
                </button>
                <button
                  @click="handleNeverShow"
                  class="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  دیگر نمایش نده
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
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

  // برای iOS
  if (isIOS.value) {
    // چک کردن standalone mode
    return (window.navigator as any).standalone === true ||
           window.matchMedia('(display-mode: standalone)').matches
  }

  // برای Android
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
  // اگر نصب شده یا dismiss شده، نشون نده
  if (isAppInstalled() || isDismissedPermanently()) {
    return
  }

  // برای iOS همیشه نشون بده (چون beforeinstallprompt نداره)
  // برای Android فقط وقتی که deferredPrompt داریم
  if (isIOS.value || deferredPrompt.value) {
    // تاخیر 2 ثانیه برای تجربه بهتر
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
    // نمایش prompt نصب
    deferredPrompt.value.prompt()

    // منتظر انتخاب کاربر
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
      // ذخیره در localStorage که نصب شده
      localStorage.setItem('pwa_installed', 'true')
    }

    // پاک کردن deferredPrompt
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
  // ذخیره session dismiss (فقط برای این session)
  sessionStorage.setItem('pwa_install_dismissed_session', 'true')
}

// دیگر نمایش نده (permanent)
const handleNeverShow = () => {
  showPrompt.value = false
  localStorage.setItem('pwa_install_dismissed', 'true')
}

// Event listener برای beforeinstallprompt
const handleBeforeInstallPrompt = (e: Event) => {
  // جلوگیری از نمایش خودکار
  e.preventDefault()
  
  // ذخیره event برای استفاده بعدی
  deferredPrompt.value = e

  // اگر در این session dismiss نشده، نمایش بده
  if (!sessionStorage.getItem('pwa_install_dismissed_session')) {
    showInstallPrompt()
  }
}

// Event listener برای appinstalled
const handleAppInstalled = () => {
  // مخفی کردن prompt
  showPrompt.value = false
  deferredPrompt.value = null
  
  // ذخیره که نصب شده
  localStorage.setItem('pwa_installed', 'true')
  
  console.log('PWA installed successfully!')
}

onMounted(() => {
  detectPlatform()

  // Event listeners
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)

  // برای iOS که beforeinstallprompt نداره
  if (isIOS.value && !isAppInstalled() && !sessionStorage.getItem('pwa_install_dismissed_session')) {
    showInstallPrompt()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
})
</script>

<style scoped>
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
