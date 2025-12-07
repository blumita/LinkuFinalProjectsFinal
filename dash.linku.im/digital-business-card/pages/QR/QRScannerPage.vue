<template>
  <div class="qr-scanner-wrapper">
    <!-- Header - Position from very top without safe area -->
    <div class="header-section">
      <div class="header-content">
        <div class="flex items-center justify-between">
          <button
            @click="goBack"
            class="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-colors flex-shrink-0"
          >
            <i class="ti ti-arrow-right text-white text-lg"></i>
          </button>
          
          <h1 class="text-white text-lg font-medium">اسکن کد QR</h1>
          
          <button
            @click="showSupportSheet = true"
            class="w-12 h-12 bg-white/10 backdrop-blur-sm text-white rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-300"
          >
            <i class="ti ti-help text-xl"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Camera View - Full Screen behind header/footer -->
    <div class="camera-container">
      <!-- Video Element -->
      <video
        ref="videoElement"
        autoplay
        muted
        playsinline
        class="w-full h-full object-cover"
        :class="{ 'opacity-0': !cameraActive }"
      ></video>
      
      <!-- Loading State -->
      <div v-if="!cameraActive && isLoading" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-white text-lg font-medium">آماده‌سازی دوربین...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="errorMessage && !isLoading" class="absolute inset-0 flex items-center justify-center p-6">
        <div class="text-center max-w-sm">
          <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ti ti-exclamation-triangle text-red-400 text-2xl"></i>
          </div>
          <h3 class="text-white text-lg font-medium mb-2">مشکل در دسترسی به دوربین</h3>
          <p class="text-white/80 text-sm mb-6">{{ errorMessage }}</p>
          <div class="space-y-3">
            <button
              @click="startCamera"
              class="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300"
            >
              تلاش مجدد
            </button>
            <button
              @click="triggerFileInput"
              class="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300"
            >
              انتخاب از گالری
            </button>
          </div>
        </div>
      </div>

            <!-- Scanning overlay when camera is active -->
      <div v-if="cameraActive" class="absolute inset-0 pointer-events-none">
        <!-- Dark overlay with cut-out scanning area -->
        <div class="scanning-overlay">
          <!-- Top overlay -->
          <div class="overlay-top"></div>
          <!-- Bottom overlay -->
          <div class="overlay-bottom"></div>
          <!-- Left overlay -->
          <div class="overlay-left"></div>
          <!-- Right overlay -->
          <div class="overlay-right"></div>
        </div>
        
        <!-- Center scanning frame -->
        <div class="scanning-frame">
          <div class="w-64 h-64 relative">
            <!-- Corner indicators -->
            <div class="absolute -top-2 -left-2 w-6 h-6 border-l-3 border-t-3 border-white rounded-tl-lg"></div>
            <div class="absolute -top-2 -right-2 w-6 h-6 border-r-3 border-t-3 border-white rounded-tr-lg"></div>
            <div class="absolute -bottom-2 -left-2 w-6 h-6 border-l-3 border-b-3 border-white rounded-bl-lg"></div>
            <div class="absolute -bottom-2 -right-2 w-6 h-6 border-r-3 border-b-3 border-white rounded-br-lg"></div>
            
            <!-- Simple scanning line -->
            <div class="absolute top-0 left-0 right-0 h-0.5 bg-white scan-line"></div>
          </div>
        </div>
        
        <!-- Clean instructions -->
        <div class="absolute bottom-32 left-4 right-4 text-center z-50">
          <div class="bg-black/30 backdrop-blur-sm rounded-xl p-3">
            <p class="text-white text-base font-medium">کد QR روی محصول را برای فعال‌سازی اسکن کنید</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Controls - No safe area, stick to bottom -->
    <div class="footer-section">
      <div class="footer-content">
        <!-- Gallery Button -->
        <IconButton
          icon="photo"
          variant="tonal-primary"
          size="lg"
          rounded
          @click="triggerFileInput"
          class="qr-footer-button"
        />

        <!-- Main Camera Button OR My QR Code Button -->
        <IconTextButton
          v-if="!cameraActive"
          icon="camera"
          variant="tonal-primary"
          size="lg"
          :style="{ boxShadow: 'none', marginBottom: '32px', background: 'var(--color-primary)' }"
          @click="startCamera"
          class="qr-main-button"
        >
          شروع اسکن
        </IconTextButton>

        <!-- My QR Code Button (Center) -->
        <IconTextButton
          v-if="cameraActive"
          icon="qrcode"
          variant="tonal-primary"
          size="lg"
          :style="{ boxShadow: 'none', marginBottom: '32px', background: 'var(--color-primary)' }"
          @click="goToMyQRCode"
          class="qr-main-button"
        >
          QR کد من
        </IconTextButton>

        <!-- Manual Input Button -->
        <IconButton
          icon="keyboard"
          variant="tonal-primary"
          size="lg"
          rounded
          @click.stop="openManualInput"
          class="qr-footer-button"
        />

      </div>
    </div>

    <!-- File input (hidden) -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleFileSelect"
      class="hidden"
    >

    <!-- Manual Input Bottom Sheet -->
    <BlumitaBottomSheet
      v-model="showManualInputSheet"
      title="وارد کردن کد دستی"
      size="md"
      :closable="true"
      :close-on-backdrop="true"
      :show-default-footer="false"
      z-index="99999"
    >
      <template #header>
        <div class="text-center">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ti ti-keyboard text-primary text-2xl"></i>
          </div>
          <h3 class="text-xl font-bold text-foreground mb-2">وارد کردن کد دستی</h3>
          <p class="text-muted-foreground text-sm">کد فعال‌سازی دستگاه را وارد کنید</p>
        </div>
      </template>
      
      <div class="px-6 pb-6">
        <div class="mb-6">
          <input
            v-model="manualCode"
            type="text"
            placeholder="کد فعال‌سازی"
            class="w-full p-4 border-2 border-border bg-background text-foreground placeholder-muted-foreground rounded-2xl text-center text-lg font-mono tracking-wider focus:border-primary focus:outline-none transition-colors"
            maxlength="20"
            autofocus
          >
        </div>
        
        <div class="flex gap-3">
          <BlumitaButton
            variant="outline"
            size="lg"
            class="flex-1"
            @click="showManualInputSheet = false"
          >
            انصراف
          </BlumitaButton>
          <BlumitaButton
            variant="primary"
            size="lg"
            class="flex-1"
            :disabled="!manualCode.trim()"
            @click="verifyManualCode"
          >
            تایید
          </BlumitaButton>
        </div>
      </div>
    </BlumitaBottomSheet>

    <!-- Support Bottom Sheet -->
    <BlumitaBottomSheet
      v-model="showSupportSheet"
      title="پشتیبانی لینکو"
      size="md"
      :closable="true"
      :close-on-backdrop="true"
      :show-default-footer="false"
      z-index="99999"
    >
      <template #header>
        <div class="flex items-center py-2">
          <!-- Support Icon -->
          <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ml-3">
            <i class="ti ti-headset text-primary text-2xl"></i>
          </div>
          
          <!-- Header Text -->
          <div class="text-right">
            <h3 class="text-xl font-bold text-foreground mb-1">پشتیبانی لینکو</h3>
            <p class="text-sm text-muted-foreground">ما آماده کمک به شما هستیم</p>
          </div>
        </div>
      </template>
      
      <div class="px-4 py-6">
        <!-- Support Options -->
        <div class="space-y-4">
          <!-- Online Chat -->
          <button
            @click="handleStartChat"
            class="w-full bg-muted/50 border border-border rounded-xl p-4 transition-colors duration-200 flex items-center hover:bg-muted"
          >
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ml-4">
              <i class="ti ti-message-circle text-primary text-xl"></i>
            </div>
            <div class="flex-1 text-right">
              <div class="font-semibold text-foreground mb-1">گفتگوی آنلاین</div>
              <div class="text-sm text-muted-foreground">پاسخ فوری - ۲۴/۷ در دسترس</div>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground"></i>
          </button>

          <!-- Phone Call -->
          <button
            @click="handleMakeCall"
            class="w-full bg-muted/50 border border-border rounded-xl p-4 transition-colors duration-200 flex items-center hover:bg-muted"
          >
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ml-4">
              <i class="ti ti-phone text-primary text-xl"></i>
            </div>
            <div class="flex-1 text-right">
              <div class="font-semibold text-foreground mb-1">تماس تلفنی</div>
              <div class="text-sm text-muted-foreground">شنبه تا پنج‌شنبه ۹ تا ۱۸</div>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground"></i>
          </button>

          <!-- Email Support -->
          <button
            @click="handleSendEmail"
            class="w-full bg-muted/50 border border-border rounded-xl p-4 transition-colors duration-200 flex items-center hover:bg-muted"
          >
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ml-4">
              <i class="ti ti-mail text-primary text-xl"></i>
            </div>
            <div class="flex-1 text-right">
              <div class="font-semibold text-foreground mb-1">ایمیل پشتیبانی</div>
              <div class="text-sm text-muted-foreground">پاسخ در کمتر از ۲۴ ساعت</div>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground"></i>
          </button>

          <!-- Close Button -->
          <BlumitaButton
            variant="outline"
            size="lg"
            class="w-full"
            @click="showSupportSheet = false"
          >
            بستن
          </BlumitaButton>
        </div>
      </div>
    </BlumitaBottomSheet>

    <!-- Scan Result Notification -->
    <div v-if="scanResult.show" :class="[
      'fixed top-28 left-4 right-4 p-4 rounded-2xl text-white z-40 flex items-center gap-3 transition-all duration-300 backdrop-blur-sm',
      scanResult.success ? 'bg-green-600/90' : 'bg-red-600/90'
    ]">
      <i v-if="scanResult.success" class="ti ti-check text-2xl flex-shrink-0"></i>
      <i v-else class="ti ti-x text-2xl flex-shrink-0"></i>
      <span class="font-medium">{{ scanResult.message }}</span>
    </div>

    <!-- QR Code Full Screen Component -->
    <QRCodeFullScreen
      v-if="showQRCodeFullScreen"
      :qr-data="userQRData"
      :user-name="userName"
      @close="showQRCodeFullScreen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useUserStore } from '~/stores/user'
import { useFormStore } from '~/stores/form'
import { useSafeNavigation } from '~/composables/useSafeNavigation'

definePageMeta({
  layout: 'default',
  middleware: 'require-activated'
})

// Stores
const userStore = useUserStore()
const formStore = useFormStore()
const { goBack } = useSafeNavigation()

// Computed user data
const userName = computed(() => userStore.user?.name || 'کاربر')
const defaultCard = computed(() => formStore.defaultCard)
const userQRData = computed(() => {
  if (defaultCard.value?.slug) {
    return `https://linku.im/${defaultCard.value.slug}`
  }
  return 'https://linku.im'
})

// Refs
const videoElement = ref<HTMLVideoElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const cameraActive = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const showManualInputSheet = ref(false)
const manualCode = ref('')
const showSupportSheet = ref(false)
const showQRCodeFullScreen = ref(false)

// Scan result notification
const scanResult = ref({
  show: false,
  success: false,
  message: ''
})

let stream: MediaStream | null = null

// Maintain app height custom property for iOS Safari chrome changes
const setAppHeightVar = () => {
  document.documentElement.style.setProperty('--app-height', window.innerHeight + 'px')
}

// Ensure viewport setup without cover
const setFullscreenViewport = () => {
  const viewport = document.querySelector<HTMLMetaElement>('meta[name=viewport]')
  if (viewport) {
    const current = viewport.getAttribute('content') || ''
    // Keep existing viewport settings without adding cover
    if (!current.includes('user-scalable=no')) {
      viewport.setAttribute('content', current.replace(/\s+$/, '') + ', user-scalable=no')
    }
  } else {
    const newViewport = document.createElement('meta')
    newViewport.name = 'viewport'
    newViewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no'
    document.head.appendChild(newViewport)
  }
  setAppHeightVar()
  setTimeout(() => window.dispatchEvent(new Event('resize')), 60)
}

// These functions are commented out for now - can be re-enabled when needed
// If you need full theme/viewport control, uncomment and add the required variables

/*
// Transparent status bar - force complete override including manifest
const applyTransparentStatusBar = () => {
  // Mark that QR scanner is active to prevent ANY global theme interference
  document.documentElement.setAttribute('data-qr-active', 'true')
  document.body.setAttribute('data-qr-scanner', 'active')
  
  // Remove all existing theme-color meta tags
  const allThemeMetas = document.querySelectorAll('meta[name="theme-color"]')
  allThemeMetas.forEach(meta => meta.remove())
  
  // Create multiple transparent theme-color metas to force override manifest
  const transparentMeta1 = document.createElement('meta')
  transparentMeta1.name = 'theme-color'
  transparentMeta1.content = '#00000000'
  transparentMeta1.setAttribute('data-qr', 'true')
  document.head.appendChild(transparentMeta1)
  
  // Apple status bar style - force black-translucent
  const allAppleMetas = document.querySelectorAll('meta[name="apple-mobile-web-app-status-bar-style"]')
  allAppleMetas.forEach(meta => meta.remove())
  
  const newAppleMeta = document.createElement('meta')
  newAppleMeta.name = 'apple-mobile-web-app-status-bar-style'
  newAppleMeta.content = 'black-translucent'
  newAppleMeta.setAttribute('data-qr', 'true')
  document.head.appendChild(newAppleMeta)
  
  // Force transparent via CSS to override manifest theme-color
  const style = document.createElement('style')
  style.id = 'qr-status-bar-style'
  style.innerHTML = `
    :root {
      --status-bar-bg: transparent !important;
    }
    body {
      background-color: transparent !important;
    }
    html {
      background-color: transparent !important;
    }
  `
  document.head.appendChild(style)
}

const restoreStatusBar = () => {
  // Remove QR active flags
  document.documentElement.removeAttribute('data-qr-active')
  document.body.removeAttribute('data-qr-scanner')
  
  // Remove all QR-related metas
  const qrMetas = document.querySelectorAll('meta[data-qr]')
  qrMetas.forEach(meta => meta.remove())
  
  // Remove QR CSS style
  const qrStyle = document.getElementById('qr-status-bar-style')
  if (qrStyle) qrStyle.remove()
  
  // Re-trigger global theme update
  setTimeout(() => {
    if (typeof (window as any).updateStatusBarTheme === 'function') {
      (window as any).updateStatusBarTheme()
    }
  }, 500)
}

const restoreViewport = () => {
  document.documentElement.style.removeProperty('--app-height')
  setTimeout(() => window.dispatchEvent(new Event('resize')), 60)
}
*/

// Start camera automatically when component mounts
onMounted(() => {
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'

  window.addEventListener('resize', setAppHeightVar)
  window.addEventListener('orientationchange', () => setTimeout(setAppHeightVar, 300))

  startCamera()
})

// Start camera
const startCamera = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  errorMessage.value = ''

  try {
    // Request camera permission and get stream
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Back camera
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    })

    if (videoElement.value) {
      videoElement.value.srcObject = stream
      await videoElement.value.play()
      cameraActive.value = true
      
      // TODO: Integrate QR Scanner library here
      // Simulate scan for demo
      setTimeout(() => {
        const demoCode = 'LINKU-DEMO-' + Math.random().toString(36).substring(7).toUpperCase()
        handleScanResult(demoCode)
      }, 3000)
    }
  } catch (error: any) {
    handleCameraError(error)
  } finally {
    isLoading.value = false
  }
}

// Stop camera
const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }

  if (videoElement.value) {
    videoElement.value.srcObject = null
  }

  cameraActive.value = false
  errorMessage.value = ''
}

// Handle camera errors
const handleCameraError = (error: any) => {
  
  if (error.name === 'NotAllowedError') {
    errorMessage.value = 'لطفاً اجازه دسترسی به دوربین را بدهید'
  } else if (error.name === 'NotFoundError') {
    errorMessage.value = 'دوربین یافت نشد'
  } else if (error.name === 'NotSupportedError') {
    errorMessage.value = 'مرورگر شما از دوربین پشتیبانی نمی‌کند'
  } else {
    errorMessage.value = 'خطا در دسترسی به دوربین'
  }
}

// Handle scan result
const handleScanResult = (data: string) => {
  
  // Stop scanning
  stopCamera()
  
  // Process the result
  processQRCode(data)
}

// Process QR code data
const processQRCode = (data: string) => {
  try {
    // Check if it's a valid device activation code
    if (data && data.length > 5) {
      showScanResult(true, 'کد با موفقیت اسکن شد!')
      
      // Navigate to device activation with the code
      navigateTo({
        path: '/dashboard/activate',
        query: { code: data }
      })
    } else {
      showScanResult(false, 'کد معتبر نیست')
    }
  } catch (error) {
    showScanResult(false, 'خطا در پردازش کد')
  }
}

// Show scan result notification
const showScanResult = (success: boolean, message: string) => {
  scanResult.value = {
    show: true,
    success,
    message
  }
  
  setTimeout(() => {
    scanResult.value.show = false
  }, 3000)
}

// Trigger file input
const triggerFileInput = () => {
  fileInput.value?.click()
}

// Handle file selection
const handleFileSelect = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    // TODO: Integrate QR scanner for image files
    // Simulate scan for demo
    const demoCode = 'LINKU-IMG-' + Math.random().toString(36).substring(7).toUpperCase()
    handleScanResult(demoCode)
    showScanResult(true, 'تصویر با موفقیت اسکن شد!')
    
    if (false) {
      showScanResult(false, 'کد QR در تصویر یافت نشد')
    }
  } catch (error) {
    showScanResult(false, 'خطا در اسکن تصویر')
  }

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Go to My QR Code page
const goToMyQRCode = () => {
  stopCamera()
  showQRCodeFullScreen.value = true
}

// Handle manual input - stop camera first
const handleManualInput = () => {
  stopCamera()
  showManualInputSheet.value = true
}

// Open manual input with proper event handling
const openManualInput = (event?: MouseEvent) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  stopCamera()
  showManualInputSheet.value = true
}

// Verify manual code
const verifyManualCode = async () => {
  if (!manualCode.value.trim()) return

  showManualInputSheet.value = false
  processQRCode(manualCode.value.trim())
  manualCode.value = ''
}

// Support methods
const handleStartChat = () => {
  // Navigate to chat page
  showSupportSheet.value = false
  navigateTo('/dashboard/support')
}

const handleMakeCall = () => {
  // Open phone dialer
  const phoneNumber = '+98-21-12345678'
  showSupportSheet.value = false
  window.location.href = `tel:${phoneNumber}`
}

const handleSendEmail = () => {
  // Open email client
  const email = 'support@linku.im'
  const subject = encodeURIComponent('درخواست پشتیبانی - QR Scanner')
  const body = encodeURIComponent('سلام، من در استفاده از QR Scanner به کمک نیاز دارم...')
  showSupportSheet.value = false
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
}


// Cleanup on component unmount
onUnmounted(() => {
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
  document.body.classList.remove('qr-scanner-fullscreen')

  // restoreStatusBar() // Commented out - uncomment if needed
  // restoreViewport() // Commented out - uncomment if needed
  window.removeEventListener('resize', setAppHeightVar)
  stopCamera()
})
</script>

<style scoped>
/* PWA Fullscreen Support */
:global(.qr-scanner-fullscreen) {
  width: 100vw !important;
  height: 100svh !important; /* Dynamic viewport height */
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  overflow: hidden !important;
  z-index: 9999 !important;
}

/* iOS specific fixes */
:global(.qr-scanner-fullscreen) body {
  -webkit-overflow-scrolling: touch !important;
  overscroll-behavior: none !important;
}

/* Wrapper uses dynamic height variable for iOS Safari */
.qr-scanner-wrapper {
  height: 100svh !important;
  background: #000;
  
  /* iOS 16+ PWA Fix - Force edge-to-edge */
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100svw !important;
  height: 100svh !important;
  margin: 0 !important;
  padding: 0 !important;
}

@supports not (padding: env(safe-area-inset-top)) {
  .qr-scanner-wrapper { padding-top: 0; }
}

/* Scanning animations */
.scan-line {
  animation: scanLine 2s linear infinite;
}

@keyframes scanLine {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(288px);
    opacity: 0;
  }
}

/* Corner glow effect */
.corner-glow {
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
  animation: cornerPulse 2s ease-in-out infinite;
}

@keyframes cornerPulse {
  0%, 100% {
    opacity: 0.9;
  }
  50% {
    opacity: 1;
    filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8));
  }
}

/* Button animations */
.camera-button-pulse {
  animation: cameraPulse 2s ease-in-out infinite;
}

@keyframes cameraPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
}

.stop-button-pulse {
  animation: stopPulse 1s ease-in-out infinite;
}

@keyframes stopPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.button-glow {
  transition: all 0.3s ease;
}

.button-glow:hover {
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}

/* Mobile adjustments */
@media screen and (max-height: 700px) {
  .scan-line {
    animation-duration: 1.5s;
  }
  
  @keyframes scanLine {
    0% {
      transform: translateY(0);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateY(200px);
      opacity: 0;
    }
  }
}

/* Force mobile browsers to use full viewport - Complete fullscreen override */
.qr-scanner-wrapper {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  min-height: 100vh !important;
  max-height: 100vh !important;
  background: #000 !important;
  z-index: 9999 !important;
  overflow: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
}

@supports (-webkit-touch-callout: none) {
  .qr-scanner-wrapper {
    height: -webkit-fill-available !important;
    min-height: -webkit-fill-available !important;
    max-height: -webkit-fill-available !important;
  }
}

/* Header section - stick to very top without safe area */
.header-section {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 70%, transparent 100%);
  padding-top: 0;
  margin-top: 0;
}

.header-content {
  padding: 16px 16px 16px 16px;
  margin-top: 0;
}

/* Camera container - full screen */
.camera-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

/* Scanning overlay with cut-out center */
.scanning-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
}

/* Dark overlay sections around the scanning area */
.overlay-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: calc(50% - 128px);
  background: rgba(0, 0, 0, 0.7);
}

.overlay-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(50% - 128px);
  background: rgba(0, 0, 0, 0.7);
}

.overlay-left {
  position: absolute;
  top: calc(50% - 128px);
  left: 0;
  width: calc(50% - 128px);
  height: 256px;
  background: rgba(0, 0, 0, 0.7);
}

.overlay-right {
  position: absolute;
  top: calc(50% - 128px);
  right: 0;
  width: calc(50% - 128px);
  height: 256px;
  background: rgba(0, 0, 0, 0.7);
}

.scanning-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

/* Footer section - stick to very bottom without safe area */
.footer-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%);
  padding-bottom: 0;
  margin-bottom: 0;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px 16px 32px;
  margin-bottom: 0;
  position: relative;
}

.qr-footer-button {
  flex-shrink: 0;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.qr-main-button {
  flex-shrink: 0;
  backdrop-filter: blur(10px);
  border-radius: 16px !important;
  min-width: 120px;
  height: 56px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.qr-main-button.camera-button-pulse {
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    transform: translateX(-50%) scale(1);
  }
  50% {
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
    transform: translateX(-50%) scale(1.05);
  }
}

.scan-line {
  animation: scanLine 2s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

@keyframes scanLine {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(250px);
    opacity: 0;
  }
}

/* Custom border width classes */
.border-l-3 {
  border-left-width: 3px;
}

.border-t-3 {
  border-top-width: 3px;
}

.border-r-3 {
  border-right-width: 3px;
}

.border-b-3 {
  border-bottom-width: 3px;
}

/* Force body and html to not add any margin/padding when QR scanner is active */
:global(body[data-qr-scanner="active"]) {
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  height: 100vh !important;
  position: fixed !important;
  width: 100% !important;
  top: 0 !important;
  left: 0 !important;
}

:global(html[data-qr-active]) {
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

</style>
