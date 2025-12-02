<template>
  <div class="w-full max-w-full mx-auto space-y-4">
    <div :class="[
      'backdrop-blur rounded-xl overflow-hidden',
      isDarkTheme ? 'bg-white/[0.02]' : isLightTheme ? 'bg-black/[0.02]' : 'bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20'
    ]">
      <div class="flex items-center gap-4 p-3 w-full text-right">
        <div :class="['flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden w-14 h-14', isDarkTheme || isLightTheme ? '' : iconBackgroundClass]">
          <component 
            :is="iconComponent"
            :size="32"
            v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
          />
        </div>
        <div class="flex flex-col justify-center flex-1 min-w-0 text-right">
          <div :class="['font-bold text-sm leading-snug text-right mb-1', isDarkTheme ? 'text-white' : 'text-gray-800']">
            {{ link?.title || link?.name || 'بلوک محتوا' }}
          </div>
          <div v-if="sanitizedDescription" :class="['text-xs font-normal leading-relaxed whitespace-pre-line break-words text-right', isDarkTheme ? 'text-gray-300' : 'text-gray-600']">
            {{ sanitizedDescription }}
          </div>
        </div>
      </div>
      
      <!-- محتوای اصلی بلوک -->
      <div v-if="link?.content" :class="['p-4', isBackgroundDark ? 'border-t border-white/10' : 'border-t border-white/20']">
        <div :class="['text-sm leading-relaxed whitespace-pre-line', isDarkTheme ? 'text-gray-200' : 'text-gray-700']">
          {{ link.content }}
        </div>
      </div>
      
      <!-- Slot برای محتوای اضافی -->
      <div v-if="$slots.default" :class="['p-4', isBackgroundDark ? 'border-t border-white/10' : 'border-t border-white/20']">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormStore } from '~/stores/form'
import { useIconComponents } from '@/composables/useIconComponentsMap'

const { getIconComponent } = useIconComponents()

const props = defineProps({
  link: { type: Object, required: true },
  iconBg: { type: String, default: '' },
  iconText: { type: String, default: '' },
  isDarkTheme: { type: Boolean, default: false },
  isLightTheme: { type: Boolean, default: false },
  isBackgroundDark: { type: Boolean, default: false },
  formData: { type: Object, required: false },
  previewItems: { type: Object, default: () => ({}) }
})

// دسترسی به store
const formStore = useFormStore()
const formData = computed(() => props.formData || formStore)

// Icon data and component logic - same as other components
const sanitizedLink = computed(() => props.link || {})

const sanitizedDescription = computed(() => {
  if (props.link?.description) {
    const trimmed = props.link.description.trim()
    if (trimmed && trimmed !== '' && trimmed !== 'description') {
      return trimmed
    }
  }
  if (props.link?.content) {
    const trimmed = props.link.content.trim()
    if (trimmed && trimmed !== '' && trimmed !== 'content') {
      return trimmed
    }
  }
  return null
})

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
  if (iconData.value?.type === 'component' && iconData.value?.name) {
    return getIconComponent(iconData.value.name) || getIconComponent('textSection')
  }
  // Default to textSection component for content blocks
  return getIconComponent('textSection')
})
</script>

<style scoped>
</style>
