<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- Header ثابت -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
      <div class="flex items-center h-14 px-2 lg:px-6 max-w-4xl mx-auto">
        <button
          @click="handleBack"
          class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-accent transition-colors"
        >
          <i class="ti ti-arrow-right text-xl text-foreground"></i>
        </button>
        <h1 class="flex-1 text-base lg:text-lg font-semibold text-foreground text-center">
          {{ pageTitle }}
        </h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- محتوا -->
    <div class="flex-1 pt-16 px-2 lg:px-6 max-w-4xl mx-auto w-full" :class="profileSelected ? 'pb-28' : 'pb-8'">
      
      <!-- مرحله ۱: انتخاب محصول -->
      <template v-if="!profileSelected">
        <!-- توضیح -->
        <p class="text-sm text-muted-foreground text-center mb-4 lg:mb-6">
          محصولی که می‌خواهید فعال کنید را انتخاب نمایید
        </p>

        <!-- لیست محصولات -->
        <div v-if="loadingDevices" class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-3">
          <div
            v-for="n in 8"
            :key="n"
            class="bg-card rounded-xl p-3 lg:p-3 animate-pulse"
          >
            <div class="w-16 h-16 lg:w-14 lg:h-14 bg-muted rounded-lg mx-auto mb-2 -mt-3"></div>
            <div class="h-3 bg-muted rounded w-16 lg:w-16 mx-auto"></div>
          </div>
        </div>
        
        <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-3">
          <button
            v-for="device in devices"
            :key="device.name"
            @click="selectDevice(device)"
            class="bg-card border border-border rounded-xl p-3 lg:p-3 text-center hover:border-primary/50 hover:shadow-md transition-all active:scale-95"
          >
            <img :src="device.image" :alt="device.name" class="w-16 h-16 lg:w-14 lg:h-14 object-contain mx-auto mb-1 lg:mb-2 -mt-3"/>
            <span class="text-xs lg:text-xs font-medium text-foreground line-clamp-2">{{ device.name }}</span>
          </button>
        </div>

        <!-- محصولات فعال شده -->
        <div v-if="loadingActivated" class="mt-6 lg:mt-8 space-y-3">
          <div class="h-5 bg-muted rounded w-32 animate-pulse"></div>
          <div v-for="n in 2" :key="n" class="bg-card rounded-xl p-3 lg:p-4 animate-pulse">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 lg:w-12 lg:h-12 bg-muted rounded-lg"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-muted rounded w-3/4"></div>
                <div class="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activatedCards.length" class="mt-6 lg:mt-8">
          <div class="flex items-center gap-2 mb-3 lg:mb-4">
            <i class="ti ti-device-mobile-check text-primary"></i>
            <h3 class="font-semibold text-foreground text-sm lg:text-base">محصولات فعال</h3>
            <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{{ activatedCards.length }}</span>
          </div>

          <div class="space-y-2 lg:space-y-3">
            <div
              v-for="card in activatedCards"
              :key="card.license"
              class="bg-card border border-border rounded-xl p-3 lg:p-4 flex items-center gap-2 lg:gap-3"
            >
              <img :src="card.image" :alt="card.name" class="w-10 h-10 lg:w-12 lg:h-12 object-contain"/>
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-foreground text-xs lg:text-sm">{{ card.name }}</h4>
                <p class="text-[10px] lg:text-xs text-muted-foreground font-mono truncate">{{ card.license }}</p>
                <p class="text-[10px] lg:text-xs text-muted-foreground">{{ card.activatedAt }}</p>
              </div>
              <button
                @click="deactivateDevice(card.card_id)"
                class="text-[10px] lg:text-xs text-destructive bg-destructive/10 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg hover:bg-destructive/20 transition-colors"
              >
                غیرفعال
              </button>
            </div>
          </div>
        </div>

        <!-- حالت خالی -->
        <div v-else class="mt-6 lg:mt-8 bg-card border border-dashed border-border rounded-xl p-6 lg:p-8 text-center">
          <i class="ti ti-device-mobile-off text-3xl lg:text-4xl text-muted-foreground mb-2 lg:mb-3"></i>
          <p class="text-foreground font-medium mb-1 text-sm lg:text-base">محصول فعالی ندارید</p>
          <p class="text-[10px] lg:text-xs text-muted-foreground">ابتدا یک محصول را انتخاب و فعال کنید</p>
        </div>
      </template>

      <!-- مرحله ۲: انتخاب روش فعال‌سازی -->
      <template v-else>
        <div class="lg:max-w-md lg:mx-auto">
          <!-- اطلاعات انتخاب شده -->
          <div class="bg-card border border-border rounded-2xl p-4 mb-6">
            <div class="flex items-center gap-3">
              <img :src="selectedDevice.image" :alt="selectedDevice.name" class="w-14 h-14 lg:w-16 lg:h-16 object-contain"/>
              <div class="flex-1">
                <h3 class="font-semibold text-foreground text-base">{{ selectedDevice.name }}</h3>
                <div class="flex items-center gap-2 mt-1.5">
                  <img :src="profileSelected.avatar" class="w-6 h-6 rounded-full object-cover"/>
                  <span class="text-sm text-muted-foreground">{{ profileSelected.name }}</span>
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
              @click="showLicenseSheet = true"
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
      </template>
    </div>

    <!-- Bottom Sheet وارد کردن کد لایسنس -->
    <Teleport to="body">
      <Transition name="sheet">
        <div 
          v-if="showLicenseSheet" 
          class="fixed inset-0 z-[9998]"
        >
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showLicenseSheet = false"></div>
          
          <!-- Sheet -->
          <div class="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl overflow-hidden lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-2xl lg:max-w-md lg:w-full">
            <!-- Handle -->
            <div class="lg:hidden flex justify-center py-3">
              <div class="w-10 h-1 bg-muted-foreground/30 rounded-full"></div>
            </div>
            
            <!-- Header -->
            <div class="px-6 pb-4 lg:pt-6">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-xl font-bold text-foreground">کد فعال‌سازی</h3>
                <button @click="showLicenseSheet = false" class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                  <i class="ti ti-x text-xl text-muted-foreground"></i>
                </button>
              </div>
              <p class="text-sm text-muted-foreground">کد روی بسته‌بندی محصول را وارد کنید</p>
            </div>
            
            <!-- Content -->
            <div class="px-6 pb-6 space-y-4">
              <!-- اینپوت کد -->
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

              <!-- دکمه تایید -->
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

              <!-- دکمه انصراف -->
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
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="cancelProfileSelection"></div>
          
          <!-- Sheet -->
          <div class="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl max-h-[80vh] overflow-hidden lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-2xl lg:max-w-md lg:w-full">
            <!-- Handle -->
            <div class="lg:hidden flex justify-center py-3">
              <div class="w-10 h-1 bg-muted-foreground/30 rounded-full"></div>
            </div>
            
            <!-- Header -->
            <div class="px-4 pb-3 lg:p-4 lg:border-b lg:border-border">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold text-foreground">انتخاب پروفایل</h3>
                <button @click="cancelProfileSelection" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted">
                  <i class="ti ti-x text-lg text-muted-foreground"></i>
                </button>
              </div>
              <p class="text-xs text-muted-foreground mt-1">کدام پروفایل به این محصول متصل شود؟</p>
            </div>
            
            <!-- محصول انتخاب شده -->
            <div class="px-4 py-3 border-y border-border bg-muted/30">
              <div class="flex items-center gap-3">
                <img :src="selectedDevice?.image" :alt="selectedDevice?.name" class="w-12 h-12 object-contain"/>
                <div>
                  <h4 class="font-semibold text-foreground text-sm">{{ selectedDevice?.name }}</h4>
                  <p class="text-xs text-muted-foreground">محصول انتخاب شده</p>
                </div>
              </div>
            </div>
            
            <!-- لیست پروفایل‌ها -->
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
            
            <!-- دکمه انصراف -->
            <div class="p-4 border-t border-border">
              <button
                @click="cancelProfileSelection"
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
          <!-- Header -->
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
              title="انتخاب از گالری"
            >
              <i class="ti ti-photo text-white text-xl"></i>
            </button>
          </div>
          
          <!-- Scanner Area -->
          <div class="flex-1 flex items-center justify-center p-6">
            <div class="relative w-full max-w-xs aspect-square">
              <video 
                ref="videoElement" 
                class="w-full h-full object-cover rounded-3xl"
                playsinline
                autoplay
                muted
              ></video>
              
              <!-- Scan Frame -->
              <div class="absolute inset-4 border-2 border-white/30 rounded-2xl pointer-events-none">
                <div class="absolute -top-0.5 -left-0.5 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
                <div class="absolute -top-0.5 -right-0.5 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
                <div class="absolute -bottom-0.5 -left-0.5 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
                <div class="absolute -bottom-0.5 -right-0.5 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
              </div>
              
              <div class="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan"></div>
            </div>
          </div>
          
          <!-- Instructions -->
          <div class="p-6 pb-10 text-center bg-gradient-to-t from-black/80 to-transparent">
            <p class="text-white font-medium mb-2">QR کد محصول را اسکن کنید</p>
            <p class="text-white/60 text-sm">کد روی بسته‌بندی یا پشت محصول قرار دارد</p>
          </div>
          
          <input
const showLicenseSheet = ref(false)
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
import {useNuxtApp, useRouter} from "nuxt/app";
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";

const router = useRouter()
const devices = ref([])
const formStore = useFormStore()
const profiles = computed(() => formStore.cards.map(card => ({
  id: Number(card.id),
  name: card.userName || 'بدون نام',
  avatar: card.avatar || '/logo.svg',
  role: card.job || 'کاربر'
})))
const {$axios} = useNuxtApp()

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
const activatedCards = ref([])
const loadingActivated = ref(true)
const loadingDevices = ref(true)
const selectedDevice = ref(null)
const profileSelected = ref(null)
const license = ref('')
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')
const isActivating = ref(false)
const showProfileSheet = ref(false)

// QR Scanner
const showQRScanner = ref(false)
const videoElement = ref(null)
const galleryInput = ref(null)
let mediaStream = null
let scanInterval = null

// Page title
const pageTitle = computed(() => {
  if (showQRScanner.value) return 'اسکن QR کد'
  if (!profileSelected.value) return 'فعال‌سازی محصول'
  return `فعال‌سازی ${selectedDevice.value?.name || 'محصول'}`
})

// Navigation
function handleBack() {
  if (showQRScanner.value) {
    closeQRScanner()
  } else if (showProfileSheet.value) {
    showProfileSheet.value = false
  } else if (profileSelected.value) {
    // برگشت به مرحله انتخاب محصول
    profileSelected.value = null
    selectedDevice.value = null
    license.value = ''
    success.value = false
    error.value = false
    errorMessage.value = ''
  } else {
    goBack()
  }
}

function goBack() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator).standalone === true
  if (isStandalone || window.history.length <= 2) {
    router.push('/dashboard')
  } else {
    router.back()
  }
}

// Device & Profile Selection
function selectDevice(device) {
  selectedDevice.value = device
  showProfileSheet.value = true
}

function selectProfile(profile) {
  profileSelected.value = profile
  license.value = ''
  success.value = false
  error.value = false
  showProfileSheet.value = false
}

function cancelProfileSelection() {
  showProfileSheet.value = false
  selectedDevice.value = null
}

// API calls
async function fetchDevices() {
  loadingDevices.value = true
  try {
    const response = await $axios.get(`user/admin/cardProducts`)
    if (response?.data?.success && Array.isArray(response.data.data)) {
      devices.value = response.data.data.map(item => ({
        name: item.name || 'بدون نام',
        image: item.image || '/devices/default.png'
      }))
    }
  } catch (err) {
    showInfoToast('خطا در دریافت محصولات', 'ti-alert-triangle')
  } finally {
    loadingDevices.value = false
  }
}

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
      // Refresh activated cards
      await activatedDevice()
      // Reset after delay
      setTimeout(() => {
        resetForm()
      }, 3000)
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

async function deactivateDevice(cardId) {
  try {
    const response = await $axios.post(`v1/cards/${cardId}/deactivateDevice`)
    if (response?.data?.success) {
      showInfoToast('محصول غیرفعال شد', 'ti-check')
      activatedCards.value = activatedCards.value.filter(
        card => Number(card.card_id) !== Number(cardId)
      )
    } else {
      showInfoToast(response.data?.message || 'خطا', 'ti-alert-triangle')
    }
  } catch (e) {
    showInfoToast('خطا در غیرفعال‌سازی', 'ti-alert-triangle')
  }
}

async function activatedDevice() {
  loadingActivated.value = true
  try {
    const response = await $axios.get(`v1/cards/activateDevices`)
    activatedCards.value = (response.data?.data || []).map(data => ({
      card_id: data.card_id,
      license: data.license,
      name: data.device?.name || 'دستگاه',
      image: data.device?.image || '/devices/default.png',
      activatedAt: new Date(data.updated_at).toLocaleDateString('fa-IR'),
    }))
  } catch (err) {
    // Silent fail
  } finally {
    loadingActivated.value = false
  }
}

function resetForm() {
  selectedDevice.value = null
  profileSelected.value = null
  license.value = ''
  success.value = false
  error.value = false
  errorMessage.value = ''
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
  
  console.log('🔍 QR Code Raw Data:', data)
  
  // استخراج کد از فرمت‌های مختلف URL
  // کد لایسنس: ۸ کاراکتر lowercase مثل aq35tdh5
  const patterns = [
    /linku\.im\/profile\/([a-z0-9]{8})\/[a-z0-9-]+/i, // فرمت جدید: /profile/aq35tdh5/TIT
    /linku\.im\/([a-z0-9]{8})\/[a-z0-9-]+/i,
    /linkutag\.com\/([a-z0-9]{8})\/[a-z0-9-]+/i,
    /activate\/([a-z0-9]+)/i,
    /license[=\/]([a-z0-9]+)/i,
    /code[=\/]([a-z0-9]+)/i,
    /linku\.im\/([a-z0-9]{8})$/i,
    /linkutag\.com\/([a-z0-9]{8})$/i,
    /^([a-z0-9]{8})$/i // کد ۸ کاراکتری مستقیم
  ]
  
  for (const pattern of patterns) {
    const match = licenseCode.match(pattern)
    if (match && match[1]) {
      console.log('✅ Pattern matched:', pattern.toString(), '-> License:', match[1])
      licenseCode = match[1]
      break
    }
  }
  
  // اعتبارسنجی فرمت کد - حداقل ۶ کاراکتر (کدهای لایسنس معمولاً ۸ کاراکتر هستند)
  if (/^[a-z0-9]{6,20}$/i.test(licenseCode)) {
    const lowerLicense = licenseCode.toLowerCase()
    
    // بررسی اینکه آیا این لایسنس قبلاً فعال شده یا نه
    const alreadyActivated = activatedCards.value.find(
      card => card.license?.toLowerCase() === lowerLicense
    )
    
    if (alreadyActivated) {
      showInfoToast('این کارت قبلاً فعال شده است!', 'ti-alert-circle')
      closeQRScanner()
      return
    }
    
    license.value = lowerLicense
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

onMounted(async () => {
  await Promise.all([activatedDevice(), fetchDevices()])
})

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

.safe-area-bottom {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Sheet transition for bottom sheet */
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
