<template>
  <div v-if="!isLoading">
    <!-- نمایش Layout عادی -->
    <div
        class="w-full h-screen flex flex-col overflow-hidden relative scrollbar-hide"
        :dir="formData?.layout === 'left' ? 'ltr' : 'rtl'"
    >
      <!-- پس‌زمینه با رنگ تم -->
      <div
          class="absolute inset-0 w-full h-full pointer-events-none"
          :style="`background-color: ${backgroundWithOpacity}; z-index: 0;`"
      />

      <!-- محتوای اصلی -->
      <div class="relative z-10 flex-1 pb-8 overflow-auto scrollbar-hide">
        <!-- کاور -->
        <div
            :class="[
              'relative w-full bg-gray-200 bg-cover bg-center',
              formData?.layout === 'portrait' ? 'h-60' : 'h-40'
            ]"
        >
          <template v-if="formData?.coverImage">
            <div
                class="absolute inset-0 bg-cover bg-center"
                :style="`background-image: url('${formData.coverImage}')`"
            ></div>
          </template>

          <!-- گرادینت برای فید کردن پایین عکس - فقط در حالت پورتریت -->
          <div
              v-if="formData?.layout === 'portrait'"
              class="absolute inset-0"
              :style="{
                background: `linear-gradient(to bottom,
                  transparent 60%,
                  ${getLighterColor(formData?.themeColor?.background ?? '#ffffff')} 100%)`
              }"
          />

          <!-- آواتار و لوگو - موقعیت بر اساس layout -->
          <div
              v-if="formData?.layout !== 'portrait'"
              :class="[
                'absolute -bottom-8 z-10 mx-5',
                formData?.layout === 'left' ? 'left-1' :
                formData?.layout === 'center' ? 'left-1/2 transform -translate-x-1/2' :
                'right-1'
              ]"
          >
            <div v-if="formData?.profileImage" class="relative">
              <div class="rounded-full border-4 border-white bg-slate-200 w-28 h-28 overflow-hidden">
                <img :src="formData?.profileImage" class="w-full h-full object-cover">
              </div>

              <div
                  v-if="formData?.logoImage"
                  :class="[
                    'absolute bottom-3 w-10 h-10 rounded-full shadow-md border-2 border-white overflow-hidden bg-white',
                    formData?.layout === 'left' ? '-right-3' : '-left-3'
                  ]"
              >
                <img :src="formData?.logoImage" class="w-full h-full object-cover">
              </div>
            </div>
            <div v-else class="rounded-full border-4 border-white bg-slate-200 w-28 h-28 overflow-hidden flex items-center justify-center">
              <i class="ti ti-user text-4xl text-slate-400"></i>
            </div>
          </div>
        </div>

        <!-- اطلاعات -->
        <div
            :class="[
              'z-10',
              formData?.layout === 'center' ? 'px-4 py-4 text-center flex flex-col items-center' :
              formData?.layout === 'portrait' ? 'px-4 py-3 text-right' :
              formData?.layout === 'left' ? 'px-4 py-4 text-left' :
              'px-4 py-4 text-right'
            ]"
        >
          <div
              :class="[
                'space-y-2',
                formData?.layout === 'center' ? 'mt-6 mx-auto max-w-xs' :
                formData?.layout === 'portrait' ? 'mt-4 mx-2' :
                'mt-8 mx-2'
              ]"
              :style="{ color: iconText }"
          >
            <!-- نام -->
            <div v-if="formData?.name" class="text-xl font-bold flex items-center gap-2"
                 :class="[
                   formData?.layout === 'center' ? 'justify-center' :
                   formData?.layout === 'portrait' ? 'justify-between' :
                   'justify-start'
                 ]"
            >
              <!-- لوگو در پورتریت -->
              <div
                  v-if="formData?.layout === 'portrait' && formData?.logoImage"
                  class="w-12 h-12 rounded-full shadow-md border border-gray-200 overflow-hidden bg-white flex-shrink-0 order-2"
              >
                <img :src="formData?.logoImage" class="w-full h-full object-cover">
              </div>
              <span :class="formData?.layout === 'portrait' ? 'order-1' : ''">{{ formData?.name }}</span>
            </div>

            <!-- شغل -->
            <div v-if="formData?.job" class="text-base font-medium flex items-center gap-1"
                 :class="formData?.layout === 'center' ? 'justify-center' : 'justify-start'"
                 :style="{ color: iconText }"
            >
              <i class="ti ti-briefcase text-sm" :style="{ color: iconColor }"/>
              {{ formData?.job }}
            </div>

            <!-- شرکت -->
            <div v-if="formData?.company" class="text-base font-medium flex items-center gap-1"
                 :class="formData?.layout === 'center' ? 'justify-center' : 'justify-start'"
                 :style="{ color: iconText }"
            >
              <i class="ti ti-building text-sm" :style="{ color: iconText }"/>
              {{ formData?.company }}
            </div>

            <!-- موقعیت -->
            <div v-if="formData?.location" class="text-base font-medium flex items-center gap-1"
                 :class="formData?.layout === 'center' ? 'justify-center' : 'justify-start'"
                 :style="{ color: iconText }"
            >
              <i class="ti ti-map-pin text-sm" :style="{ color: iconText }"/>
              {{ formData?.location }}
            </div>

            <!-- بیو -->
            <div v-if="formData?.bio" class="text-xs leading-relaxed break-words"
                 :class="formData?.layout === 'center' ? 'text-center' : 'text-justify'"
                 :style="{ color: iconText }"
            >
              {{ formData?.bio }}
            </div>
          </div>

          <!-- دکمه ذخیره مخاطب -->
          <div :class="['mt-5 w-full', formData?.layout === 'center' ? 'px-0' : 'px-6']">
            <button
                v-if="formData?.saveContact"
                class="w-full py-3 rounded-full font-semibold text-center flex items-center justify-center gap-2"
                :style="{
                  backgroundColor: iconBg,
                  color: iconBg === '#ffffff' || iconBg === '#FFFFFF' ? '#000000' : '#ffffff'
                }"
            >
              <i class="ti ti-download"/>
              {{ formData?.saveContact }}
            </button>
            <button
                v-else
                disabled
                class="w-full py-3 rounded-full text-center font-bold text-gray-400 bg-gray-200 flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <div class="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
              <div class="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
            </button>
          </div>
        </div>

        <!-- لینک‌ها -->
        <div :class="['flex-1 flex flex-col justify-start min-h-0', formData?.layout === 'portrait' ? 'px-4' : 'px-2']">
          <template v-for="(link, index) in enabledLinks" :key="index">
            <div
                class="w-full p-4 rounded-2xl flex items-center gap-3 mb-3"
                :style="{
                  backgroundColor: iconBg,
                  color: iconText
                }"
            >
              <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                   :style="{ backgroundColor: formData?.themeColor?.background || '#e5e7eb' }">
                <i :class="`ti ti-${getIconForAction(link.action)} text-xl`" :style="{ color: iconColor }"></i>
              </div>
              <span class="font-medium">{{ link.title || link.label || link.action }}</span>
            </div>
          </template>
        </div>

        <!-- فوتر -->
        <div class="mt-8 pb-4 text-center">
          <a href="https://linku.im" target="_blank" class="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">
            <span>ساخته شده با</span>
            <img src="/logo/logo.png" alt="Linku" class="h-4 w-auto">
            <span>لینکو</span>
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- لودینگ -->
  <div v-else class="fixed inset-0 flex items-center justify-center bg-white z-50">
    <div class="flex flex-col items-center gap-4">
      <div class="w-10 h-10 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p class="text-sm text-gray-500">در حال بارگذاری</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useFormStore } from '~/stores/form'

// غیرفعال کردن SSR برای این صفحه
definePageMeta({
  ssr: false
})

const formData = useFormStore()
const isLoading = ref(true)

// لینک‌های فعال
const enabledLinks = computed(() => {
  return (formData?.links || []).filter(link => link.enabled !== false)
})

// رنگ‌ها
const backgroundWithOpacity = computed(() => formData?.themeColor?.background || '#ffffff')
const iconBg = computed(() => formData?.iconColor?.background || '#f3f4f6')
const iconText = computed(() => formData?.themeColor?.text || '#1f2937')
const iconColor = computed(() => formData?.iconColor?.icon || '#1f2937')

// روشن‌تر کردن رنگ
const getLighterColor = (color) => color || '#ffffff'

// آیکون برای هر اکشن
const getIconForAction = (action) => {
  const icons = {
    instagram: 'brand-instagram',
    telegram: 'brand-telegram',
    whatsapp: 'brand-whatsapp',
    twitter: 'brand-twitter',
    linkedin: 'brand-linkedin',
    youtube: 'brand-youtube',
    tiktok: 'brand-tiktok',
    facebook: 'brand-facebook',
    phone: 'phone',
    call: 'phone',
    email: 'mail',
    website: 'world',
    link: 'link',
    location: 'map-pin',
    address: 'map-pin'
  }
  return icons[action] || 'link'
}

// گوش دادن به پیام‌ها از parent
const handleMessage = (event) => {
  if (typeof window === 'undefined') return
  if (event.origin !== window.location.origin) return

  if (event.data?.type === 'FORM_DATA_UPDATE' && event.data?.data) {
    const newData = event.data.data

    // به‌روزرسانی مستقیم فیلدهای store
    if (newData.name !== undefined) formData.name = newData.name
    if (newData.job !== undefined) formData.job = newData.job
    if (newData.company !== undefined) formData.company = newData.company
    if (newData.location !== undefined) formData.location = newData.location
    if (newData.bio !== undefined) formData.bio = newData.bio
    if (newData.profileImage !== undefined) formData.profileImage = newData.profileImage
    if (newData.logoImage !== undefined) formData.logoImage = newData.logoImage
    if (newData.coverImage !== undefined) formData.coverImage = newData.coverImage
    if (newData.layout !== undefined) formData.layout = newData.layout
    if (newData.themeColor !== undefined) formData.themeColor = newData.themeColor
    if (newData.iconColor !== undefined) formData.iconColor = newData.iconColor
    if (newData.links !== undefined) formData.links = newData.links
    if (newData.saveContact !== undefined) formData.saveContact = newData.saveContact
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return
  
  window.addEventListener('message', handleMessage)
  isLoading.value = false

  // اطلاع دادن به parent که آماده‌ایم
  setTimeout(() => {
    try {
      window.parent.postMessage({ type: 'IFRAME_READY' }, window.location.origin)
    } catch (e) {
      console.error('Error sending IFRAME_READY:', e)
    }
  }, 100)
})

onUnmounted(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('message', handleMessage)
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
