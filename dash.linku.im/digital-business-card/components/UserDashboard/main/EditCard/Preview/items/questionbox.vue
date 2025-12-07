<template>
  <div>
    <div
      :class="'flex items-center gap-4 bg-gradient-to-br from-white/60 via-white/30 to-white/10 backdrop-blur border rounded-xl p-2 w-full cursor-pointer ' + (formData?.layout === 'left' ? 'text-left' : 'text-right')"
      @click.prevent="showBox = true"
      tabindex="0"
      role="button"
    >
      <div class="flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden">
        <img
          v-if="link?.customIcon"
          :src="link.customIcon"
          class="w-12 h-12 object-contain"
          alt="custom icon"
        />
        <component 
          v-else
          :is="iconComponent"
          :size="50"
          v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
        />
      </div>
      <div :class="'flex flex-col justify-center flex-1 min-w-0 ' + (formData?.layout === 'left' ? 'text-left' : 'text-right')">
        <div :class="'font-bold text-xs text-gray-800 leading-snug mb-1 ' + (formData?.layout === 'left' ? 'text-left' : 'text-right')">
          {{ link.displayName || link.title || link.name || link.value || link.id }}
        </div>
        <div :class="'text-xs text-gray-600 font-normal leading-relaxed whitespace-pre-line break-words ' + (formData?.layout === 'left' ? 'text-left' : 'text-right')">
          {{ link.description??''}}
        </div>
      </div>
    </div>
    <BaseModalGame  max-height="45vh" v-model="showBox">
      <template #header>
        <div class="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
          <div class="flex items-center gap-3">
            <img
              v-if="link?.customIcon"
              :src="link.customIcon"
              class="w-5 h-5 object-contain"
              alt="custom icon"
            />
            <component
              v-else
              :is="iconComponent"
              :size="20"
              v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
            />
            <h3 class="text-lg font-semibold text-gray-800">{{ link.displayName || link.title || link.name || link.value || link.id || 'سوال باکس' }}</h3>
          </div>
          <button 
            @click="showBox = false" 
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i class="ti ti-x text-lg"></i>
          </button>
        </div>
      </template>
      <template #default>
        <div class="flex flex-col items-center justify-center w-full mt-6 mb-6">
          <div class="flex items-center justify-center rounded-full overflow-hidden  border border-gray-200 mb-3">
          </div>
          <div class="font-bold text-base text-gray-800 leading-snug text-center mb-1">
            {{ link.fullName || link.phonenumber || link.name || link.value || link.id || 'از من سوال بپرس!' }}
          </div>
          <div class="text-xs text-gray-600 font-normal leading-relaxed whitespace-pre-line break-words text-center">
            {{ link.phoneNumber ??'' }}
          </div>
        </div>
        <div class="w-full flex flex-col items-center gap-3 mt-2 px-4">
          <transition name="fade">
            <div v-if="!sent" class="w-full flex flex-col items-center gap-3">
              <input
                v-model="question"
                type="text"
                class="w-full rounded-xl bg-gray-100 px-4 py-3 text-base text-gray-700 outline-none border border-gray-200 focus:border-blue-400 transition text-center"
                :placeholder="typeof link.placeholder === 'string' ? link.placeholder : '' || 'اینجا بنویسید...'"
                @keyup.enter="send"
              />
              <button
                class="bg-black text-white px-4 py-2 rounded-xl w-full font-bold shadow transition disabled:opacity-50"
                :disabled="!question.trim()"
                @click="send"
              >
                ارسال سوال
              </button>
            </div>
            <div
              v-else
              class="text-green-600 text-xs font-medium text-center mt-4 flex items-center justify-center gap-2 py-3"
            >
              <i class="ti ti-check text-base"></i>
              <span>سوال شما با موفقیت ارسال شد!</span>
            </div>
          </transition>
        </div>
      </template>
    </BaseModalGame>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFormStore } from '~/stores/form'
import BaseModalGame from './Modals/BaseModalGame.vue'
import {useNuxtApp} from "#app";

const { getIconComponent, getSafeIcon } = useIconComponents();

const props = defineProps({ 
  link: Object,
  formData: { type: Object, required: false }
})

// دسترسی به store
const formStore = useFormStore()
const formData = computed(() => props.formData || formStore)

// Get icon data and component
const iconData = computed(() => props.link?.icon || null)

// Icon color logic - return user selected color or undefined for default SVG colors
const iconColor = computed(() => {
  // اگر کاربر رنگ انتخاب کرده، از آن استفاده کن
  if (formStore.iconColor?.background && 
      formStore.iconColor.background !== 'transparent') {
    return formStore.iconColor.background
  }
  // در غیر این صورت، undefined برگردان تا رنگ پیش‌فرض SVG استفاده شود
  return undefined
})

const isIconFilled = computed(() => {
  return !!(formStore.iconColor?.background && 
           formStore.iconColor.background !== 'transparent')
})

const iconComponent = computed(() => {
  return getIconComponent(iconData.value);
})

const question = ref('')
const sent = ref(false)
const showBox = ref(false)
const {$axios}=useNuxtApp()
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle') // یا 'ti-lock', 'ti-check', هر چی خواستی
const showInfoToast = (message, icon = 'ti-lock') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000) // بعد از ۳ ثانیه بسته می‌شه
}
async function send() {
  if (typeof question.value !== 'string') question.value = ''
  if (!question.value.trim()) return

  try {
    const payload = {
      question: question.value, // سوال کاربر
      linkId: props.link?.id || null, // آیدی لینک (در صورت نیاز)
      cardId: props.link?.card_id || null, // آیدی کارت (اختیاری)
    }

    // ارسال به بک‌اند
    const response = await $axios.post(
        `club/${props.link?.hash}/recordQuestion`,
        payload
    )

    if (response.data?.success) {
      sent.value = true
      question.value = ''
    } else {
      showInfoToast('خطا در ارسال سوال', 'ti-check');
    }
  } catch (e) {
    showInfoToast('مشکلی در ارسال سوال پیش آمد', 'ti-check');
  }
}

</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
