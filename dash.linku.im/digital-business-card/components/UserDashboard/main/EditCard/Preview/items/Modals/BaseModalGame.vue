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
  maxHeight: { type: String, default: '70vh' }, // prop جدید برای ارتفاع
})
const emit = defineEmits(['update:modelValue', 'close'])

const isMobile = ref(false)
const modalRef = ref(null)

// تشخیص باز و بسته شدن کیبورد
const detectKeyboard = () => {
  if (typeof window !== 'undefined' && isMobile.value) {
    const initialHeight = window.innerHeight
    let currentHeight = initialHeight
    
    const handleResize = () => {
      currentHeight = window.innerHeight
      const heightDiff = initialHeight - currentHeight
      
      // اگر ارتفاع بیش از 150 پیکسل کم شده، کیبورد باز است
      if (heightDiff > 150) {
        if (modalRef.value) {
          modalRef.value.style.height = `${currentHeight}px`
          modalRef.value.style.maxHeight = `${currentHeight}px`
        }
      } else {
        if (modalRef.value) {
          modalRef.value.style.height = props.maxHeight
          modalRef.value.style.maxHeight = props.maxHeight
        }
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }
}

const handleResize = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 1024
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  
  // تشخیص کیبورد
  const cleanupKeyboard = detectKeyboard()
  
  // cleanup keyboard detection
  onBeforeUnmount(() => {
    if (cleanupKeyboard) cleanupKeyboard()
  })
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
    enter-active-class="transform transition-transform duration-300 ease-out"
    leave-active-class="transform transition-transform duration-300 ease-in"
    enter-from-class="translate-y-full"
    enter-to-class="translate-y-0"
    leave-from-class="translate-y-0"
    leave-to-class="translate-y-full"
  >
    <div
      v-if="props.modelValue"
      ref="modalRef"
      :class="[
        'fixed bottom-0 left-0 right-0 flex flex-col text-sm text-gray-800 w-full bg-white',
        zIndex,
        rounded,
      ]"
      :style="{
        touchAction: 'none',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'none',
        height: props.maxHeight,
        maxHeight: props.maxHeight
      }"
      @click.stop
      @touchmove.stop.prevent
    >
      <div class="flex-shrink-0">
        <slot name="header" />
      </div>
      <div 
        class="flex-1 overflow-y-auto"
        :style="{
          touchAction: 'pan-y',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }"
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

/* بهینه‌سازی برای اندروید */
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

/* حمایت از اندروید */
@supports (-webkit-overflow-scrolling: touch) {
  .overflow-y-auto {
    -webkit-overflow-scrolling: touch;
  }
}
</style>
