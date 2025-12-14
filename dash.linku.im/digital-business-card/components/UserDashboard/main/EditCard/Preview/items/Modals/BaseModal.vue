<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean, // v-model:visible
  mobileSlide: { type: Boolean, default: true },
  desktopSlide: { type: Boolean, default: true },
  width: { type: String, default: 'w-full' },
  height: { type: String, default: 'h-fit' },
  rounded: { type: String, default: 'lg:rounded-2xl rounded-t-2xl overflow-hidden' },
  zIndex: { type: String, default: 'z-[99999]' },
  rtl: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue', 'close'])

const isMobile = ref(false)
const handleResize = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 1024
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

function closeModal() {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <!-- بک‌دراپ -->
  <transition name="fade">
    <div
      v-if="props.modelValue"
      @click="closeModal"
      class="fixed inset-0 bg-stone-900/20 z-[99998]"
      style="touch-action: none;"
    />
  </transition>

  <!-- مودال -->
  <transition
    appear
    enter-active-class="transition-transform duration-300 ease-in-out"
    leave-active-class="transition-transform duration-300 ease-in-out"
    enter-from-class="translate-y-full"
    enter-to-class="translate-y-0"
    leave-from-class="translate-y-0"
    leave-to-class="translate-y-full"
  >
    <div
      v-if="props.modelValue"
      :class="[
        'fixed bottom-0 left-0 right-0 flex flex-col text-sm text-gray-800 max-h-[60vh] bg-white',
        zIndex,
        rounded,
      ]"
      style="touch-action: none; overscroll-behavior: none;"
      @click.stop
      @touchmove.stop.prevent
    >
      <div class="flex-shrink-0">
        <slot name="header" />
      </div>
      <div 
        class="flex-1 overflow-y-auto"
        style="-webkit-overflow-scrolling: touch; touch-action: pan-y; overscroll-behavior: contain;"
        @touchmove.stop
      >
        <slot />
      </div>
      <div class="flex-shrink-0">
        <slot name="footer" />
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
