<template>
  <div class="relative min-w-0">
    <button
        class="w-10 h-10 border border-gray-300 text-gray-700 rounded-full flex items-center justify-center shrink-0 hover:bg-gray-100 transition"
        @click="open = !open"
        aria-label="نمایش منو"
    >
      <i class="ti ti-dots"></i>
    </button>

    <!-- دسکتاپ: منوی معمولی -->
    <div v-if="open && !isMobile" class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">


      <ul class="text-sm p-2 space-y-2">
        <li
            v-for="action in actions"
            :key="action.key"
            class="hover:bg-gray-100 p-2 rounded flex items-center gap-2 cursor-pointer text-gray-700"
            @click="handleAction(action.key)"
        >
          <i :class="`ti ${action.icon} text-lg`"></i> {{ action.label }}
        </li>
      </ul>

    </div>

    <!-- موبایل: باتم شیت -->
    <UiBottomSheet
        :visible="open && isMobile"
        title="منوی عملیات"
        :desktop-centered="false"
        height-class="max-h-[50vh]"
        content-padding="p-4"
        @close="open = false"
    >
      <ul class="text-base space-y-1">
        <li
            v-for="action in actions"
            :key="action.key"
            class="hover:bg-gray-100 p-4 rounded-lg flex items-center gap-3 cursor-pointer text-gray-700"
            @click="handleAction(action.key)"
        >
          <i :class="`ti ${action.icon} text-lg`"></i> {{ action.label }}
        </li>
      </ul>
    </UiBottomSheet>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue'
import {useFormStore} from "~/stores/form.js";

const open = ref(false)
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  // اگر تبدیل به دسکتاپ شد، باتم شیت رو ببند
  if (!isMobile.value) {
    open.value = false
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  // کلیک خارج از کامپوننت برای دسکتاپ
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('click', handleOutsideClick)
})

const handleOutsideClick = (event) => {
  // فقط برای دسکتاپ
  if (open.value) {
    const target = event.target
    const menu = target.closest('.relative')
    if (!menu) {
      open.value = false
    }
  }
}
const emit = defineEmits(['action', 'download-qr', 'edit-mobile'])
const actions = [
  {key: 'view', label: 'مشاهده پروقایل', icon: 'ti-eye'},
  {key: 'share', label: 'اشتراک کارت', icon: 'ti-share'},
  {key: 'downloadQR', label: 'دانلود QR', icon: 'ti-download'},
  {key: 'editMobile', label: 'ویرایش موبایل', icon: 'ti-mail'}
]

const handleAction = (key) => {
  switch (key) {
    case 'view':
      emit('action', 'show-profile')
      break
    case 'share':
      emit('action', 'open-share')
      break
    case 'downloadQR':
      emit('download-qr')
      break
    case 'editMobile':
      emit('edit-mobile')
      break
  }
  open.value = false // بستن منو بعد از کلیک
}
</script>

<style scoped>
/* استایل‌های اضافی در صورت نیاز */
</style>
