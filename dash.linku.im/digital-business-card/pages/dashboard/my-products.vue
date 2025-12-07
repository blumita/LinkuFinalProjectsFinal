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
          محصولات فعال من
        </h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- محتوا -->
    <div class="flex-1 pt-16 px-2 lg:px-6 max-w-4xl mx-auto w-full pb-8">
      
      <!-- توضیح -->
      <p class="text-sm text-muted-foreground text-center mb-4 lg:mb-6">
        لیست محصولات فعال شده شما
      </p>

      <!-- محصولات فعال شده -->
      <div v-if="loadingActivated" class="space-y-3">
        <div v-for="n in 3" :key="n" class="bg-card rounded-xl p-3 lg:p-4 animate-pulse">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 lg:w-14 lg:h-14 bg-muted rounded-lg"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-muted rounded w-3/4"></div>
              <div class="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activatedCards.length" class="space-y-2 lg:space-y-3">
        <div
          v-for="card in activatedCards"
          :key="card.license"
          class="bg-card border border-border rounded-xl p-3 lg:p-4 flex items-center gap-2 lg:gap-3"
        >
          <img :src="card.image" :alt="card.name" class="w-12 h-12 lg:w-14 lg:h-14 object-contain"/>
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-foreground text-sm lg:text-base">{{ card.name }}</h4>
            <p class="text-xs lg:text-sm text-muted-foreground font-mono truncate">{{ card.license }}</p>
            <p class="text-xs text-muted-foreground">فعال شده در: {{ card.activatedAt }}</p>
          </div>
          <button
            @click="deactivateDevice(card.card_id)"
            class="text-xs lg:text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg hover:bg-destructive/20 transition-colors"
          >
            غیرفعال
          </button>
        </div>
      </div>

      <!-- حالت خالی -->
      <div v-else class="bg-card border border-dashed border-border rounded-xl p-8 lg:p-12 text-center">
        <i class="ti ti-device-mobile-off text-4xl lg:text-5xl text-muted-foreground mb-3 lg:mb-4"></i>
        <p class="text-foreground font-semibold mb-2 text-base lg:text-lg">محصول فعالی ندارید</p>
        <p class="text-xs lg:text-sm text-muted-foreground mb-6">هنوز محصولی را فعال نکرده‌اید</p>
        <button
          @click="goToActivate"
          class="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          <i class="ti ti-plus"></i>
          <span>فعال‌سازی محصول جدید</span>
        </button>
      </div>

      <!-- دکمه فعال‌سازی محصول جدید -->
      <div v-if="activatedCards.length" class="mt-6 lg:mt-8">
        <button
          @click="goToActivate"
          class="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-4 rounded-xl font-semibold hover:from-primary/90 hover:to-primary/70 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <i class="ti ti-plus text-xl"></i>
          <span>فعال‌سازی محصول جدید</span>
        </button>
      </div>
    </div>
  </div>
  
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useNuxtApp, useRouter} from "nuxt/app";
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";
import { useSafeNavigation } from '~/composables/useSafeNavigation'

const router = useRouter()
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

// Navigation
const { goBack: goBackSafe } = useSafeNavigation()
function goBack() {
  goBackSafe('/profile')
}

function goToActivate() {
  router.push('/dashboard/activate')
}

// API calls
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
    showInfoToast('خطا در دریافت محصولات', 'ti-alert-triangle')
  } finally {
    loadingActivated.value = false
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
      showInfoToast(response.data?.message || 'خطا در غیرفعال‌سازی', 'ti-alert-triangle')
    }
  } catch (e) {
    showInfoToast('خطا در غیرفعال‌سازی', 'ti-alert-triangle')
  }
}

onMounted(async () => {
  await activatedDevice()
})
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
</style>
