<template>
  <div 
    class="rounded-2xl bg-white/90 max-w-full mx-auto transition-all duration-200 border"
    :dir="formData?.layout === 'left' ? 'ltr' : 'rtl'"
  >
    <button
      class="flex items-center justify-between w-full px-2 py-3 font-bold text-base text-gray-800 rounded-2xl focus:outline-none rtl:text-right ltr:text-left"
      @click="expanded = !expanded"
      :aria-expanded="expanded"
    >
      <span class="flex items-center gap-2">
        <component 
          :is="iconComponent"
          :size="50"
          v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
        />
        {{ link.title || 'متن توضیحی' }}
      </span>
      <i :class="expanded ? 'ti ti-chevron-up' : 'ti ti-chevron-down'" class="text-xl text-gray-500 transition-transform"></i>
    </button>
    <transition name="fade">
      <div 
        v-show="expanded" 
        class="px-4 pb-4 pt-1 text-sm leading-relaxed text-gray-700 rtl:text-right ltr:text-left"
      >
        {{ link.value || 'متنی برای نمایش وارد نشده است.' }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFormStore } from '~/stores/form'
import { useIconComponents } from '@/composables/useIconComponentsMap'

const { getIconComponent } = useIconComponents()

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

const expanded = ref(false)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

