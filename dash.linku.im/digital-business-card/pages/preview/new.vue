<template>
  <div class="w-full h-screen flex flex-col overflow-hidden relative scrollbar-hide" :dir="formData?.layout === 'left' ? 'ltr' : 'rtl'">
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
            <!-- لوگو -->
            <div
              v-if="formData?.logoImage"
              class="absolute -bottom-2 -left-2 w-10 h-10 rounded-full bg-white border-2 border-white shadow-lg overflow-hidden"
            >
              <img :src="formData?.logoImage" class="w-full h-full object-cover">
            </div>
          </div>
          <!-- اگر تصویر پروفایل نباشه -->
          <div v-else class="rounded-full border-4 border-white bg-slate-200 w-28 h-28 flex items-center justify-center">
            <i class="ti ti-user text-4xl text-slate-400"></i>
          </div>
        </div>
      </div>

      <!-- بخش اطلاعات کاربر -->
      <div
        :class="[
          'px-5',
          formData?.layout === 'portrait' ? 'pt-4' : 'pt-12'
        ]"
      >
        <!-- آواتار بزرگ وسط - فقط برای portrait -->
        <div v-if="formData?.layout === 'portrait'" class="flex justify-center -mt-20 mb-4">
          <div v-if="formData?.profileImage" class="relative">
            <div class="rounded-full border-4 border-white bg-slate-200 w-32 h-32 overflow-hidden shadow-xl">
              <img :src="formData?.profileImage" class="w-full h-full object-cover">
            </div>
            <div
              v-if="formData?.logoImage"
              class="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-white border-2 border-white shadow-lg overflow-hidden"
            >
              <img :src="formData?.logoImage" class="w-full h-full object-cover">
            </div>
          </div>
          <div v-else class="rounded-full border-4 border-white bg-slate-200 w-32 h-32 flex items-center justify-center shadow-xl">
            <i class="ti ti-user text-5xl text-slate-400"></i>
          </div>
        </div>

        <!-- نام و اطلاعات -->
        <div
          :class="[
            formData?.layout === 'center' || formData?.layout === 'portrait' ? 'text-center' :
            formData?.layout === 'left' ? 'text-left' : 'text-right'
          ]"
        >
          <h1 class="text-xl font-bold" :style="{ color: formData?.themeColor?.text || '#1f2937' }">
            {{ formData?.name || 'نام شما' }}
          </h1>
          <p v-if="formData?.job || formData?.company" class="text-sm mt-1" :style="{ color: formData?.themeColor?.text || '#6b7280' }">
            {{ formData?.job }}{{ formData?.job && formData?.company ? ' • ' : '' }}{{ formData?.company }}
          </p>
          <p v-if="formData?.location" class="text-xs mt-1 flex items-center gap-1" :class="formData?.layout === 'center' || formData?.layout === 'portrait' ? 'justify-center' : ''">
            <i class="ti ti-map-pin"></i>
            <span :style="{ color: formData?.themeColor?.text || '#9ca3af' }">{{ formData?.location }}</span>
          </p>
          <p v-if="formData?.bio" class="text-sm mt-3 leading-relaxed" :style="{ color: formData?.themeColor?.text || '#4b5563' }">
            {{ formData?.bio }}
          </p>
        </div>

        <!-- لینک‌ها -->
        <div class="mt-6 space-y-3">
          <template v-for="(link, index) in enabledLinks" :key="index">
            <div
              class="w-full p-4 rounded-2xl flex items-center gap-3 transition-all"
              :style="{
                backgroundColor: formData?.iconColor?.background || '#f3f4f6',
                color: formData?.iconColor?.icon || '#1f2937'
              }"
            >
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="{ backgroundColor: formData?.themeColor?.background || '#e5e7eb' }">
                <i :class="`ti ti-${getIconForAction(link.action)} text-xl`" :style="{ color: formData?.iconColor?.icon || '#1f2937' }"></i>
              </div>
              <span class="font-medium">{{ link.title || link.action }}</span>
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
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useFormStore } from '~/stores/form'

// SSR رو غیرفعال کن
definePageMeta({
  ssr: false
})

const formData = useFormStore()

// لینک‌های فعال
const enabledLinks = computed(() => {
  return (formData?.links || []).filter(link => link.enabled !== false)
})

// رنگ پس‌زمینه با opacity
const backgroundWithOpacity = computed(() => {
  const bg = formData?.themeColor?.background || '#ffffff'
  return bg
})

// روشن‌تر کردن رنگ
const getLighterColor = (color) => {
  if (!color) return '#ffffff'
  return color
}

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
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)

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
