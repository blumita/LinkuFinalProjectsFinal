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
          فعال‌سازی محصول
        </h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- محتوا -->
    <div class="flex-1 pt-16 px-2 lg:px-6 max-w-4xl mx-auto w-full pb-8">
      
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
                @click="confirmDeactivate(card)"
                class="text-[10px] lg:text-xs text-green-600 bg-green-500/10 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg hover:bg-green-500/20 transition-colors flex items-center gap-1"
              >
                <i class="ti ti-circle-check text-xs"></i>
                <span>فعال شده</span>
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
    </div>

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
          <div class="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl max-h-[80vh] overflow-hidden lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-2xl lg:max-w-md lg:w-full lg:max-h-[90vh] lg:shadow-2xl">
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
                @click="showProfileSheet = false; selectedDevice = null"
                class="w-full py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- مودال تایید غیرفعال‌سازی -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showConfirmModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showConfirmModal = false"></div>
          <div class="relative bg-background border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div class="text-center mb-4">
              <div class="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
                <i class="ti ti-alert-triangle text-destructive text-3xl"></i>
              </div>
              <h3 class="text-lg font-bold text-foreground mb-2">غیرفعال‌سازی محصول</h3>
              <p class="text-sm text-muted-foreground mb-1">آیا مطمئن هستید که می‌خواهید این محصول را غیرفعال کنید؟</p>
              <p class="text-xs font-semibold text-foreground mt-2">{{ selectedCardToDeactivate?.name }}</p>
            </div>
            <div class="flex gap-2">
              <button
                @click="showConfirmModal = false"
                class="flex-1 py-3 rounded-xl border-2 border-border text-foreground font-medium hover:bg-muted transition-colors"
              >
                انصراف
              </button>
              <button
                @click="proceedDeactivate"
                class="flex-1 py-3 rounded-xl bg-destructive text-white font-medium hover:bg-destructive/90 transition-colors"
              >
                غیرفعال کن
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
  
  <InfoToast :visible="showToast" :title="toastMessage" :icon="toastIcon"/>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import {useNuxtApp, useRouter} from "nuxt/app";
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";

const router = useRouter()
const devices = ref([])
const formStore = useFormStore()
const profiles = computed(() => formStore.cards.map(card => ({
  id: Number(card.id),
  name: card.userName || 'بدون نام',
  avatar: card.avatar || null,
  role: card.job || 'کاربر'
})))
const {$axios} = useNuxtApp()

// Navigation
function goBack() {
  router.push('/dashboard')
}

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
const showProfileSheet = ref(false)
const showConfirmModal = ref(false)
const selectedCardToDeactivate = ref(null)

// Device & Profile Selection
function cancelProfileSelection() {
  showProfileSheet.value = false
  selectedDevice.value = null
}
function selectDevice(device) {
  selectedDevice.value = device
  
  // اگر فقط یک پروفایل داریم، مستقیم بریم به صفحه فعال‌سازی
  if (profiles.value.length === 1) {
    const deviceParam = encodeURIComponent(JSON.stringify(device))
    router.push(`/dashboard/activate/methods?device=${deviceParam}&profile=${profiles.value[0].id}`)
  } else {
    // اگر چند پروفایل داریم، bottom sheet انتخاب پروفایل رو نشون بده
    showProfileSheet.value = true
  }
}

function selectProfile(profile) {
  // اول مودال رو ببند
  showProfileSheet.value = false
  
  // بعد با تاخیر کوتاه redirect کن تا انیمیشن بسته شدن مودال کامل بشه
  setTimeout(() => {
    const deviceParam = encodeURIComponent(JSON.stringify(selectedDevice.value))
    router.push(`/dashboard/activate/methods?device=${deviceParam}&profile=${profile.id}`)
  }, 150)
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

function confirmDeactivate(card) {
  selectedCardToDeactivate.value = card
  showConfirmModal.value = true
}

async function proceedDeactivate() {
  if (!selectedCardToDeactivate.value) return
  
  showConfirmModal.value = false
  const cardId = selectedCardToDeactivate.value.card_id
  
  try {
    const response = await $axios.post(`v1/cards/${cardId}/deactivateDevice`)
    if (response?.data?.success) {
      showInfoToast('محصول غیرفعال شد', 'ti-check')
      activatedCards.value = activatedCards.value.filter(
        card => Number(card.card_id) !== Number(cardId)
      )
    } else {
      showInfoToast(response.data?.message || 'خطا در غیرفعال‌سازی', 'ti-alert-triangle')
    }
  } catch (e) {
    showInfoToast('خطا در غیرفعال‌سازی', 'ti-alert-triangle')
  } finally {
    selectedCardToDeactivate.value = null
  }
}

async function activatedDevice() {
  loadingActivated.value = true
  try {
    const response = await $axios.get(`v1/cards/activateDevices`)
    activatedCards.value = (response.data?.data || []).map(data => ({
      card_id: data.card_id,
      license: data.license,
      name: data.device?.name || 'محصول',
      image: data.device?.image || '/devices/default.png',
      activatedAt: new Date(data.updated_at).toLocaleDateString('fa-IR'),
    }))
  } catch (err) {
    // Silent fail
  } finally {
    loadingActivated.value = false
  }
}

onMounted(async () => {
  await Promise.all([activatedDevice(), fetchDevices()])
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95);
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
