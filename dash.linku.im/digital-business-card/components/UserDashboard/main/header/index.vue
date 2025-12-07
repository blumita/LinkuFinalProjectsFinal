<template>
  <header class="hidden">
    <div class="flex flex-wrap items-center justify-between gap-4 overflow-x-auto md:overflow-visible min-w-0">
      <!-- 🔹 راست -->
      <div class="flex items-center gap-2 flex-shrink-0 min-w-0">
        <!-- دکمه منو (موبایل) -->
        <button
          class="w-10 h-10 bg-white border text-gray-700 rounded-lg md:hidden flex items-center justify-center shrink-0"
          @click="$emit('toggle-sidebar')"
        >
          <i class="ti ti-menu text-base" />
        </button>

        <!-- دکمه برگشت -->
        <button
          v-if="showBack"
          @click="goBack"
          class="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black text-xl shrink-0"
        >
          <i class="ti ti-chevron-right" />
        </button>

        <!-- نام کاربر -->
        <div v-if="userName" class="items-center gap-2 hidden md:flex min-w-0">
          <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm text-white shrink-0">
            <template v-if="form.defaultCard?.avatar">
              <img
                  :src="form.defaultCard.avatar"
                  alt="cover_img_card"
                  class="w-7 h-7 rounded-full object-cover"
              />
            </template>
            <template v-else>
              <i class="ti ti-user" />
            </template>
          </div>
          <span class="font-semibold text-sm truncate text-gray-700">{{ userName }}</span>
        </div>
      </div>

      <!-- 🔹 عنوان و دکمه افزودن -->
      <div v-if="title" class="flex items-center gap-2 flex-1 min-w-0 sm:text-start text-center">
        <h1 class="text-lg font-bold truncate min-w-0 text-gray-700">{{ title }}</h1>
        <NuxtLink 
          v-if="showAddCard"
          to="/dashboard/add-card"
          class="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center justify-center text-sm shrink-0 transition-colors"
          title="ساخت پروفایل جدید"
        >
          <i class="ti ti-plus"/>
        </NuxtLink>
      </div>

      <!-- 🔹 سرچ -->
      <div v-if="showSearch" class="relative min-w-0">
        <!-- آیکن برای موبایل -->
        <button
          class="w-10 h-10 md:hidden flex items-center justify-center text-gray-500 hover:text-blue-600 text-xl bg-white border border-gray-200 shadow-sm rounded-full transition"
          @click="mobileSearchOpen = true"
        >
          <i class="ti ti-search" />
        </button>

        <!-- فیلد سرچ دسکتاپ -->
        <div class="hidden md:block w-full sm:max-w-sm min-w-0">
          <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base"></i>
          <input
            type="text"
            placeholder="جستجوی کارت..."
            v-model="searchModel"
            class="w-full bg-white rounded-full py-3 ltr:pl-10 ltr:pr-4 rtl:pl-4 rtl:pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black border border-gray-200 min-w-0 text-gray-700"
          />
        </div>
      </div>

      <!-- 🔹 اکشن‌ها -->
      <div class="flex items-center gap-2 flex-shrink-0 min-w-0">
        <slot name="card-select" v-if="showCardSelect" />
        <slot name="state-select" v-if="showStateSelect" />

        <!-- نوتیفیکیشن اشتراک -->
        <NotificationMenu v-if="showNotifications" />

        <!-- دکمه اشتراک‌گذاری -->
        <button
          v-if="showShare"
          class="w-10 h-10 lg:w-auto px-4 flex items-center justify-center bg-black text-white rounded-full text-sm gap-2 shrink-0"
          @click="$emit('open-share',defaultCard)"
        >
          <i class="ti ti-share" />
          <span class="hidden lg:block">اشتراک‌گذاری کارت</span>
        </button>

        <!-- منو سه‌نقطه جدید با کامپوننت مجزا -->
        <ActionMenu
          v-if="showMore"
          @action="emitAction"
          @download-qr="handleDownloadQR"
          @edit-mobile="showEditModal = true"
        />
      </div>
    </div>
  </header>

  <!-- 🔸 سرچ موبایل -->
  <transition name="slide-down">
    <div v-if="mobileSearchOpen" class="fixed inset-x-0 top-0 z-50 bg-white shadow-lg flex flex-col items-center" style="height: 96px;">
      <div class="flex items-center w-full max-w-md mx-auto px-4 h-full">
        <button @click="mobileSearchOpen = false" class="w-10 h-10 flex items-center justify-center text-gray-500 mr-2">
          <i class="ti ti-x" />
        </button>
        <input
          type="text"
          placeholder="جستجوی کارت..."
          v-model="searchModel"
          class="flex-1 bg-gray-100 rounded-full py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autofocus
        />
      </div>
    </div>
  </transition>

  <!-- 🔸 مدال -->
  <EditPhoneModal
    :visible="showEditModal"
    :modelValue="userPhone"
    @update="handlePhoneUpdate"
    @close="showEditModal = false"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import QRCode from 'qrcode'
import EditPhoneModal from '~/components/UserDashboard/modals/EditPhoneModal.vue'
import ActionMenu from '~/components/ui/ActionMenu.vue'
import NotificationMenu from '~/components/ui/NotificationMenu.vue'
import {useFormStore} from "~/stores/form.js";
import {useSafeNavigation} from '~/composables/useSafeNavigation'

const props = defineProps({
  showBack: Boolean,
  userName: String,
  showSearch: Boolean,
  showMore: Boolean,
  showNotifications: Boolean,
  showShare: Boolean,
  showAddCard: Boolean,
  title: String,
  showCardSelect: Boolean,
  showStateSelect: Boolean,
  userLogo: String,
  userPhone:String,
  cardSlug:String,
  qrBgColor:String,
  qrColor:String
})

const emit = defineEmits([
  'open-share',
  'search',
  'action',
  'add-card',
  'toggle-sidebar'
])

// لایو سرچ با defineModel
const search = defineModel('search')
const searchModel = computed({
  get: () => search.value,
  set: v => search.value = v
})

// متغیرها
const menuOpen = ref(false)
const showEditModal = ref(false)
const userPhone = ref(props.userPhone)
const mobileSearchOpen = ref(false)
const { goBack: safeGoBack } = useSafeNavigation()

// متدها
const goBack = () => {
  if (process.client) {
    const currentPath = window.location.pathname
    if (currentPath.includes('/dashboard/edit-card')) {
      // اگه تو صفحه تنظیمات بود، برو داشبورد
      navigateTo('/dashboard/dashboard')
    } else {
      // استفاده از navigation امن
      safeGoBack('/dashboard')
    }
  }
}
const toggleMenu = () => menuOpen.value = !menuOpen.value
const emitAction = (action) => {
  emit('action', action)
  menuOpen.value = false
}

const handlePhoneUpdate = (newPhone) => {
  userPhone.value = newPhone
}
const form = useFormStore()
const defaultCard=computed(()=>form.defaultCard)

const handleDownloadQR = async () => {
  const size = 800
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const data = `https://linku.im/profile/${props.cardSlug}/share`

  await QRCode.toCanvas(canvas, data, {
    errorCorrectionLevel: 'H',
    width: size,
    margin: 2,
    color: { dark: props.qrColor?props.qrColor:'#000000'
      , light: props.qrBgColor?props.qrBgColor:'#ffffff' }
  })

  const logoSrc = props.userLogo?.trim()
    ? props.userLogo
    : new URL('@/assets/logo/logo.png', import.meta.url).href

  const logo = new Image()
  logo.crossOrigin = 'anonymous'
  logo.src = logoSrc

  await new Promise((resolve, reject) => {
    logo.onload = () => {
      const boxSize = size * 0.22
      const x = (size - boxSize) / 2
      const y = (size - boxSize) / 2

      ctx.save()
      ctx.beginPath()
      const r = 16
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + boxSize - r, y)
      ctx.quadraticCurveTo(x + boxSize, y, x + boxSize, y + r)
      ctx.lineTo(x + boxSize, y + boxSize - r)
      ctx.quadraticCurveTo(x + boxSize, y + boxSize, x + boxSize - r, y + boxSize)
      ctx.lineTo(x + r, y + boxSize)
      ctx.quadraticCurveTo(x, y + boxSize, x, y + boxSize - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      ctx.clip()

      const padding = boxSize * 0.12
      const maxLogoWidth = boxSize - padding * 2
      const maxLogoHeight = boxSize - padding * 2
      const ratio = Math.min(maxLogoWidth / logo.width, maxLogoHeight / logo.height)
      const drawWidth = logo.width * ratio
      const drawHeight = logo.height * ratio
      const offsetX = x + (boxSize - drawWidth) / 2
      const offsetY = y + (boxSize - drawHeight) / 2

      ctx.drawImage(logo, offsetX, offsetY, drawWidth, drawHeight)
      ctx.restore()
      resolve()
    }
    logo.onerror = reject
  })

  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `qr-${userPhone.value}.png`
  link.click()
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
