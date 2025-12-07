<template>
  <a
    v-if="link.fileData||link.value"
    :href="link.fileData||link.value"
    target="_blank"
    rel="noopener"
    :class="[
      'flex items-center gap-4 backdrop-blur rounded-xl p-2 w-full text-right cursor-pointer',
      isDarkTheme ? 'bg-white/[0.02]' : isLightTheme ? 'bg-black/[0.02]' : 'bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20'
    ]"
    tabindex="0"
    role="button"
    :title="link.value"
  >
    <div :class="['flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden', isDarkTheme ? '' : '']">
      <template v-if="isImage(link.value)">
        <img :src="link.value" class="w-full h-full object-cover" alt="file" />
      </template>
      <template v-else-if="link?.customIcon">
        <img :src="link.customIcon" class="w-full h-full object-contain" alt="custom icon" />
      </template>
      <template v-else>
        <component 
          :is="iconComponent"
          :size="50"
          v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
        />
      </template>
    </div>
    <div class="flex flex-col justify-center flex-1 min-w-0 text-right">
      <div :class="['font-bold text-xs leading-snug text-right mb-1', isDarkTheme ? 'text-white' : 'text-gray-800']">
        {{ link.displayName || link.title || link.name || link.value || link.id || defaultTitle }}
      </div>
      <div 
        v-if="sanitizedDescription" 
        :class="['text-xs font-normal leading-relaxed whitespace-pre-line break-words text-right', isDarkTheme ? 'text-gray-300' : 'text-gray-600']"
      >
        {{ sanitizedDescription }}
      </div>
    </div>
  </a>
  <div v-else :class="[
    'flex items-center gap-4 backdrop-blur rounded-xl p-2 w-full text-right',
    isDarkTheme ? 'bg-white/[0.02]' : isLightTheme ? 'bg-black/[0.02]' : 'bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20'
  ]">
    <div :class="['flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden w-14 h-14', isDarkTheme || isLightTheme ? '' : 'bg-white']">
      <component 
        :is="iconComponent"
        :size="50"
        v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
      />
    </div>
    <div class="flex flex-col justify-center flex-1 min-w-0 text-right">
      <div :class="['font-bold text-xs leading-snug text-right mb-1', isBackgroundDark ? 'text-gray-400' : 'text-gray-400']">
        بدون فایل
      </div>
      <div :class="['text-xs font-normal leading-relaxed whitespace-pre-line break-words text-right', isBackgroundDark ? 'text-gray-500' : 'text-gray-400']">
        بدون توضیح
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFormStore } from '~/stores/form'

const { getIconComponent, getSafeIcon } = useIconComponents();

const props = defineProps({
  link: Object,
  showDescription: Boolean,
  isDarkTheme: { type: Boolean, default: false },
  isLightTheme: { type: Boolean, default: false },
  isBackgroundDark: { type: Boolean, default: false }
})

const sanitizedDescription = computed(() => {
  if (!props.link.description) return null
  const trimmed = props.link.description.trim()
  if (!trimmed || trimmed === '' || trimmed === 'description') return null
  return trimmed
})
// دسترسی به store
const formStore = useFormStore()

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

const defaultTitle = 'File'

function isImage(url) {
  return /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(url || '')
}
</script>
