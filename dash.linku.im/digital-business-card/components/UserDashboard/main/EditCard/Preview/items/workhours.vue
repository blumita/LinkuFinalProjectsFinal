<template>
  <div class="w-full max-w-full mx-auto space-y-4">
    <div :class="[
      'backdrop-blur rounded-xl overflow-hidden',
      isDarkTheme ? 'bg-white/[0.02]' : isLightTheme ? 'bg-black/[0.02]' : 'bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20'
    ]">
      <button
        class="flex items-center gap-4 p-3 w-full rtl:text-right ltr:text-left cursor-pointer"
        @click="showWorkHours = true"
        tabindex="0"
        role="button"
      >
        <div :class="['flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden', isDarkTheme || isLightTheme ? '' : iconBackgroundClass]">
          <img
            v-if="props.link?.customIcon"
            :src="props.link.customIcon"
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
        <div class="flex flex-col justify-center flex-1 min-w-0 rtl:text-right ltr:text-left">
          <div :class="['font-bold text-sm leading-snug rtl:text-right ltr:text-left mb-1', props.isDarkTheme ? 'text-white' : 'text-gray-800']">
            {{ props.link?.title || 'ساعات کاری مجموعه' }}
          </div>
          <div :class="['text-xs font-normal leading-relaxed whitespace-pre-line break-words rtl:text-right ltr:text-left', props.isDarkTheme ? 'text-gray-300' : 'text-gray-600']">
            برای مشاهده ساعات کاری کلیک کنید
          </div>
        </div>
        <div class="flex items-center">
          <i :class="['ti ti-chevron-left text-xl', props.isDarkTheme ? 'text-gray-300' : 'text-gray-400']"></i>
        </div>
      </button>
    </div>
    <BaseModal v-model="showWorkHours">
      <template #header>
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 class="text-lg font-bold">ساعات کاری مجموعه</h3>
          <button @click="showWorkHours = false" class="text-gray-500 hover:text-red-500 text-xl">&times;</button>
        </div>
      </template>
      <template #default>
        <div class="flex-1 overflow-y-auto p-4 text-right">
          <div v-for="(day, index) in days" :key="index" class="flex justify-between items-center py-2 border-b last:border-b-0">
            <span class="text-sm font-medium text-gray-800">{{ day.name }}</span>
            <span class="text-sm text-gray-600 font-light">
              <template v-if="!day.enabled || day.type === 'closed'">تعطیل</template>
              <template v-else-if="day.type === 'by_appointment' || day.type === 'appointment'">فقط با هماهنگی قبلی</template>
              <template v-else>{{ day.start }} تا {{ day.end }}</template>
            </span>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import BaseModal from './Modals/BaseModal.vue';
import { useFormStore } from '~/stores/form';
import { useIconComponents } from '@/composables/useIconComponentsMap';

const { getIconComponent, getSafeIcon } = useIconComponents();

const props = defineProps<{ link: any, isDarkTheme?: boolean, isLightTheme?: boolean, isBackgroundDark?: boolean }>();

// دسترسی به store
const formStore = useFormStore()

const days = computed(() => Array.isArray(props.link?.days) ? props.link.days : []);
const showWorkHours = ref(false);

// Icon data and component logic - same as basiclink
const sanitizedLink = computed(() => props.link || {})
const iconData = computed(() => sanitizedLink.value?.icon || null)

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

// Dynamic background for icon based on selected color
const iconBackgroundClass = computed(() => {
  if (formStore.iconColor?.background === '#000000' || formStore.iconColor?.background === 'black') {
    return 'bg-black/5'
  }
  if (formStore.iconColor?.background === '#ffffff' || formStore.iconColor?.background === 'white') {
    return 'bg-gray-100/30'
  }
  return 'bg-white'
})

const iconComponent = computed(() => {
  return getIconComponent(iconData.value);
})
</script>

<style scoped>

</style>

