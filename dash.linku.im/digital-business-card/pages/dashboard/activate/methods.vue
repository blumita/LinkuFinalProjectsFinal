<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- Header ثابت -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
      <div class="flex items-center h-14 px-2 lg:px-6 max-w-4xl mx-auto">
        <button
          @click="goBack"
          class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-accent transition-colors"
        >
          <i class="ti ti-arrow-right text-xl text-foreground"></i>
        </button>
        <h1 class="flex-1 text-base lg:text-lg font-semibold text-foreground text-center">
          فعال‌سازی {{ selectedDevice?.name || 'محصول' }}
        </h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- محتوا -->
    <div class="flex-1 pt-16 px-2 lg:px-6 max-w-4xl mx-auto w-full pb-8">
      <div class="lg:max-w-md lg:mx-auto">
        <!-- اطلاعات انتخاب شده -->
        <div class="bg-card border border-border rounded-2xl p-4 mb-6">
          <div class="flex items-center gap-3">
            <img :src="selectedDevice?.image" :alt="selectedDevice?.name" class="w-14 h-14 lg:w-16 lg:h-16 object-contain"/>
            <div class="flex-1">
              <h3 class="font-semibold text-foreground text-base">{{ selectedDevice?.name }}</h3>
              <div class="flex items-center gap-2 mt-1.5">
                <img :src="profileSelected?.avatar" class="w-6 h-6 rounded-full object-cover"/>
                <span class="text-sm text-muted-foreground">{{ profileSelected?.name }}</span>
              </div>
            </div>
            <button @click="showProfileSheet = true" class="text-xs text-primary font-medium px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">
              تغییر
            </button>
          </div>
        </div>

        <!-- پیام موفقیت -->
        <div v-if="success" class="mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-center shadow-lg">
          <div class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
            <i class="ti ti-circle-check text-white text-4xl"></i>
          </div>
          <p class="text-white font-bold text-lg mb-2">فعال‌سازی موفق!</p>
          <p class="text-white/90 text-sm">محصول به پروفایل شما متصل شد</p>
          <button
            @click="goToDashboard"
            class="mt-4 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors"
          >
            بازگشت به داشبورد
          </button>
        </div>

        <!-- پیام خطا -->
        <div v-if="error" class="mb-6 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-center shadow-lg">
          <div class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
            <i class="ti ti-alert-circle text-white text-4xl"></i>
          </div>
          <p class="text-white font-bold text-lg mb-2">خطا در فعال‌سازی</p>
          <p class="text-white/90 text-sm">{{ errorMessage || 'کد وارد شده نامعتبر است' }}</p>
        </div>

        <!-- انتخاب روش فعال‌سازی -->
        <div class="space-y-4">
          <h3 class="text-base font-semibold text-foreground text-center mb-6">روش فعال‌سازی را انتخاب کنید</h3>
          
          <!-- دکمه کد فعال‌سازی -->
          <button
            @click.stop="openLicenseSheet"
            class="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] group"
          >
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <i class="ti ti-key text-3xl"></i>
              </div>
              <div class="flex-1 text-right">
                <h4 class="font-bold text-lg mb-1">کد فعال‌سازی دارم</h4>
                <p class="text-sm text-white/80">کد روی بسته‌بندی محصول را وارد کنید</p>
              </div>
              <i class="ti ti-chevron-left text-xl opacity-50"></i>
            </div>
          </button>

          <!-- دکمه اسکن QR -->
          <button
            @click="startQRScanner"
            class="w-full bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] group"
          >
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <i class="ti ti-qrcode text-3xl"></i>
              </div>
              <div class="flex-1 text-right">
                <h4 class="font-bold text-lg mb-1">محصول رو اسکن می‌کنم</h4>
                <p class="text-sm text-white/80">QR کد روی محصول را اسکن کنید</p>
              </div>
              <i class="ti ti-chevron-left text-xl opacity-50"></i>
            </div>
          </button>
        </div>

        <!-- لینک خرید -->
        <div class="mt-8 text-center bg-muted/50 rounded-2xl p-6">
          <i class="ti ti-shopping-bag text-2xl text-muted-foreground mb-2"></i>
          <p class="text-sm text-muted-foreground mb-3">هنوز محصول لینکو ندارید؟</p>
          <a
            href="https://linkutag.com/shop"
            target="_blank"
            class="inline-flex items-center gap-2 text-primary text-sm font-bold hover:underline"
          >
            <span>خرید از فروشگاه لینکو</span>
            <i class="ti ti-arrow-left text-xs"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom Sheet وارد کردن کد لایسنس -->
    <Teleport to="body">
      <Transition name="sheet">
        <div 
          v-if="showLicenseSheet" 
          class="fixed inset-0 z-[9998]"
        >
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showLicenseSheet = false"></div>
          
          <div class="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl overflow-hidden lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-2xl lg:max-w-md lg:w-full">
            <div class="lg:hidden flex justify-center py-3">
              <div class="w-10 h-1 bg-muted-foreground/30 rounded-full"></div>
            </div>
            
            <div class="px-6 pb-4 lg:pt-6">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-xl font-bold text-foreground">کد فعال‌سازی</h3>
                <button @click="showLicenseSheet = false" class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                  <i class="ti ti-x text-xl text-muted-foreground"></i>
                </button>
              </div>
              <p class="text-sm text-muted-foreground">کد روی بسته‌بندی محصول را وارد کنید</p>
            </div>
            
            <div class="px-6 pb-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">کد فعال‌سازی محصول</label>
                <input
                  v-model="license"
                  type="text"
                  dir="ltr"
                  placeholder="LNK4781EPS7O"
                  class="w-full px-4 py-4 bg-muted border-2 border-border rounded-xl text-foreground text-center font-mono text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase placeholder:lowercase placeholder:text-muted-foreground/50"
                  @input="license = $event.target.value.toUpperCase()"
                />
                <p class="text-xs text-muted-foreground mt-2 text-center">معمولاً ۸ تا ۱۲ کاراکتر انگلیسی</p>
              </div>

              <button
                @click="activateDevice"
                :disabled="!license || isActivating"
                class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none"
              >
                <template v-if="isActivating">
                  <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>در حال فعال‌سازی...</span>
                </template>
                <template v-else>
                  <i class="ti ti-check text-xl"></i>
                  <span>تایید و فعال‌سازی</span>
                </template>
              </button>

              <button
                @click="showLicenseSheet = false"
                class="w-full py-3 rounded-xl border-2 border-border text-foreground font-medium hover:bg-muted transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Bottom Sheet انتخاب پروفایل -->
    <Teleport to="body">
      <Transition name="sheet">
        <div 
          v-if="showProfileSheet" 
          class="fixed inset-0 z-[9998]"
        >
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showProfileSheet = false"></div>
          
          <div class="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl max-h-[80vh] overflow-hidden lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-2xl lg:max-w-md lg:w-full">
            <div class="lg:hidden flex justify-center py-3">
              <div class="w-10 h-1 bg-muted-foreground/30 rounded-full"></div>
            </div>
            
            <div class="px-4 pb-3 lg:p-4 lg:border-b lg:border-border">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold text-foreground">انتخاب پروفایل</h3>
                <button @click="showProfileSheet = false" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted">
                  <i class="ti ti-x text-lg text-muted-foreground"></i>
                </button>
              </div>
              <p class="text-xs text-muted-foreground mt-1">کدام پروفایل به این محصول متصل شود؟</p>
            </div>
            
            <div class="px-4 py-3 border-y border-border bg-muted/30">
              <div class="flex items-center gap-3">
                <img :src="selectedDevice?.image" :alt="selectedDevice?.name" class="w-12 h-12 object-contain"/>
                <div>
                  <h4 class="font-semibold text-foreground text-sm">{{ selectedDevice?.name }}</h4>
                  <p class="text-xs text-muted-foreground">محصول انتخاب شده</p>
                </div>
              </div>
            </div>
            
            <div class="px-4 py-3 max-h-[50vh] overflow-y-auto">
              <div v-if="!profiles || profiles.length === 0" class="text-center py-8">
                <i class="ti ti-user-off text-3xl text-muted-foreground mb-2"></i>
                <p class="text-muted-foreground text-sm">پروفایلی یافت نشد</p>
              </div>
              
              <div v-else class="space-y-2">
                <button
                  v-for="profile in profiles"
                  :key="profile.id"
                  @click="selectProfile(profile)"
                  class="w-full bg-card border border-border rounded-xl p-3 flex items-center gap-3 hover:border-primary/50 hover:bg-accent/50 transition-all active:scale-[0.98]"
                >
                  <img :src="profile.avatar" :alt="profile.name" class="w-10 h-10 rounded-full object-cover border-2 border-border"/>
                  <div class="flex-1 text-right">
                    <h4 class="font-medium text-foreground text-sm">{{ profile.name }}</h4>
                    <p class="text-xs text-muted-foreground">{{ profile.role }}</p>
                  </div>
                  <i class="ti ti-chevron-left text-muted-foreground"></i>
                </button>
              </div>
            </div>
            
            <div class="p-4 border-t border-border">
              <button
                @click="showProfileSheet = false"
                class="w-full py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- QR Scanner Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div 
          v-if="showQRScanner" 
          class="fixed inset-0 z-[9999] bg-black flex flex-col"
        >
          <div class="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
            <button 
              @click="closeQRScanner" 
              class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center"
            >
              <i class="ti ti-x text-white text-xl"></i>
            </button>
            <span class="text-white font-medium">اسکن QR کد</span>
            <button
              @click="pickFromGallery"
              class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center"
            >
              <i class="ti ti-photo text-white text-xl"></i>
            </button>
          </div>
          
          <div class="flex-1 flex items-center justify-center p-6">
            <div class="relative w-full max-w-xs aspect-square">
              <video 
                ref="videoElement" 
                class="w-full h-full object-cover rounded-3xl"
                playsinline
                autoplay
                muted
              ></video>
              
              <div class="absolute inset-4 border-2 border-white/30 rounded-2xl pointer-events-none">
                <div class="absolute -top-0.5 -left-0.5 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
                <div class="absolute -top-0.5 -right-0.5 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
                <div class="absolute -bottom-0.5 -left-0.5 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
                <div class="absolute -bottom-0.5 -right-0.5 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
              </div>
              
              <div class="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan"></div>
            </div>
          </div>
          
          <div class="p-6 pb-10 text-center bg-gradient-to-t from-black/80 to-transparent">
            <p class="text-white font-medium mb-2">QR کد محصول را اسکن کنید</p>
            <p class="text-white/60 text-sm">کد روی بسته‌بندی یا پشت محصول قرار دارد</p>
          </div>
          
          <input
            ref="galleryInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleGalleryImage"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
  
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
</template>

<script setup>
import {ref, onMounted, nextTick, computed, onUnmounted} from 'vue'
import {useNuxtApp, useRouter, useRoute} from "nuxt/app";
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";
import { useSafeNavigation } from '~/composables/useSafeNavigation'

const router = useRouter()
const route = useRoute()
const {$axios} = useNuxtApp()
const formStore = useFormStore()

const profiles = computed(() => formStore.cards.map(card => ({
  id: Number(card.id),
  name: card.userName || 'بدون نام',
  avatar: card.avatar || '/logo.svg',
  role: card.job || 'کاربر'
})))

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle')
const showInfoToast = (message, icon = 'ti-lock') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

// States
const selectedDevice = ref(null)
const profileSelected = ref(null)
const license = ref('')
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')
const isActivating = ref(false)
const showLicenseSheet = ref(false)
const showProfileSheet = ref(false)

// QR Scanner
const showQRScanner = ref(false)
const videoElement = ref(null)
const galleryInput = ref(null)
let mediaStream = null
let scanInterval = null

// Get device and profile from route query
onMounted(() => {
  const deviceData = route.query.device
  const profileId = route.query.profile
  
  if (deviceData) {
    try {
      selectedDevice.value = JSON.parse(decodeURIComponent(deviceData))
    } catch (e) {
      router.push('/dashboard/activate')
    }
  } else {
    router.push('/dashboard/activate')
  }
  
  if (profileId && profiles.value.length) {
    profileSelected.value = profiles.value.find(p => p.id === Number(profileId))
  }
  
  if (!profileSelected.value && profiles.value.length === 1) {
    profileSelected.value = profiles.value[0]
  } else if (!profileSelected.value) {
    showProfileSheet.value = true
  }
})

// Navigation
const { goBack: goBackSafe } = useSafeNavigation()
function goBack() {
  goBackSafe('/dashboard/activate')
}

function goToDashboard() {
  router.push('/dashboard')
}

function selectProfile(profile) {
  profileSelected.value = profile
  showProfileSheet.value = false
}

// Open license sheet with proper event handling
function openLicenseSheet(event) {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  showLicenseSheet.value = true
}

// API calls
async function activateDevice() {
  if (!license.value || isActivating.value) return
  
  isActivating.value = true
  success.value = false
  error.value = false
  errorMessage.value = ''
  
  try {
    const response = await $axios.post(`v1/cards/${profileSelected.value.id}/activateDevice`, {
      code: license.value,
      device: selectedDevice.value
    })
    
    if (response?.data?.success) {
      success.value = true
      showLicenseSheet.value = false
      showInfoToast('محصول با موفقیت فعال شد!', 'ti-check')
    } else {
      error.value = true
      errorMessage.value = response.data?.message || 'کد نامعتبر است'
      showInfoToast(errorMessage.value, 'ti-alert-triangle')
    }
  } catch (e) {
    error.value = true
    errorMessage.value = e.response?.data?.message || 'خطا در فعال‌سازی'
    showInfoToast(errorMessage.value, 'ti-alert-triangle')
  } finally {
    isActivating.value = false
  }
}

// QR Scanner Functions
async function startQRScanner() {
  showQRScanner.value = true
  
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { 
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    })
    
    await nextTick()
    
    if (videoElement.value) {
      videoElement.value.srcObject = mediaStream
      await videoElement.value.play()
      startScanning()
    }
  } catch (err) {
    showInfoToast('دسترسی به دوربین امکان‌پذیر نیست', 'ti-camera-off')
    closeQRScanner()
  }
}

function startScanning() {
  import('jsqr').then(({ default: jsQR }) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    scanInterval = setInterval(() => {
      if (!videoElement.value || !showQRScanner.value) {
        clearInterval(scanInterval)
        return
      }
      
      const video = videoElement.value
      if (video.readyState !== video.HAVE_ENOUGH_DATA) return
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      })
      
      if (code && code.data) {
        handleQRCode(code.data)
      }
    }, 150)
  }).catch(() => {
    showInfoToast('خطا در بارگذاری اسکنر', 'ti-alert-triangle')
    closeQRScanner()
  })
}

function handleQRCode(data) {
  let licenseCode = data.trim()
  
  const patterns = [
    /linku\.im\/profile\/([a-z0-9]{8})\/[a-z0-9-]+/i,
    /linku\.im\/([a-z0-9]{8})\/[a-z0-9-]+/i,
    /linkutag\.com\/([a-z0-9]{8})\/[a-z0-9-]+/i,
    /activate\/([a-z0-9]+)/i,
    /license[=\/]([a-z0-9]+)/i,
    /code[=\/]([a-z0-9]+)/i,
    /linku\.im\/([a-z0-9]{8})$/i,
    /linkutag\.com\/([a-z0-9]{8})$/i,
    /^([a-z0-9]{8})$/i
  ]
  
  for (const pattern of patterns) {
    const match = licenseCode.match(pattern)
    if (match && match[1]) {
      licenseCode = match[1]
      break
    }
  }
  
  if (/^[a-z0-9]{6,20}$/i.test(licenseCode)) {
    license.value = licenseCode.toLowerCase()
    closeQRScanner()
    showInfoToast('کد لایسنس شناسایی شد!', 'ti-check')
  } else {
    closeQRScanner()
    showInfoToast('QR کد معتبر نیست', 'ti-alert-triangle')
  }
}

function pickFromGallery() {
  galleryInput.value?.click()
}

async function handleGalleryImage(event) {
  const file = event.target.files?.[0]
  if (!file) return
  
  try {
    const { default: jsQR } = await import('jsqr')
    
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      
      if (code && code.data) {
        handleQRCode(code.data)
      } else {
        closeQRScanner()
        showInfoToast('QR کد در تصویر یافت نشد', 'ti-alert-triangle')
      }
    }
    img.onerror = () => {
      closeQRScanner()
      showInfoToast('خطا در خواندن تصویر', 'ti-alert-triangle')
    }
    img.src = URL.createObjectURL(file)
  } catch (err) {
    closeQRScanner()
    showInfoToast('خطا در پردازش تصویر', 'ti-alert-triangle')
  }
  
  if (galleryInput.value) {
    galleryInput.value.value = ''
  }
}

function closeQRScanner() {
  showQRScanner.value = false
  
  if (scanInterval) {
    clearInterval(scanInterval)
    scanInterval = null
  }
  
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    mediaStream = null
  }
}

onUnmounted(() => {
  closeQRScanner()
})
</script>

<style scoped>
@keyframes scan {
  0%, 100% { top: 1.5rem; opacity: 0.5; }
  50% { top: calc(100% - 1.5rem); opacity: 1; }
}

.animate-scan {
  animation: scan 2.5s ease-in-out infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: all 0.3s ease;
}

.sheet-enter-active > div:last-child,
.sheet-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from > div:last-child {
  transform: translateY(100%);
}

.sheet-leave-to > div:last-child {
  transform: translateY(100%);
}

@media (min-width: 1024px) {
  .sheet-enter-from > div:last-child,
  .sheet-leave-to > div:last-child {
    transform: translate(-50%, -50%) scale(0.9);
    opacity: 0;
  }
}
</style>
