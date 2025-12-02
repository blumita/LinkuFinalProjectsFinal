<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

let lastBodyOverflow = ''
let lastBodyPosition = ''
let scrollY = 0

const setBodyOverflow = (hidden) => {
  if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    if (hidden) {
      // ذخیره تنظیمات فعلی
      lastBodyOverflow = document.body.style.overflow || ''
      lastBodyPosition = document.body.style.position || ''
      scrollY = window.scrollY || 0
      
      // قفل ساده‌تر برای compatibility بهتر با اندروید
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100vw'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
    } else {
      // بازگردانی تنظیمات اصلی
      document.body.style.overflow = lastBodyOverflow
      document.body.style.position = lastBodyPosition
      document.body.style.width = ''
      document.body.style.top = ''
      document.body.style.left = ''
      
      // بازگردانی موقعیت اسکرول
      if (window.scrollTo) {
        window.scrollTo(0, scrollY)
      }
    }
  }
}

const props = defineProps({
  modelValue: Boolean, // v-model:visible
  mobileSlide: { type: Boolean, default: true },
  desktopSlide: { type: Boolean, default: true },
  width: { type: String, default: 'w-full' },
  height: { type: String, default: 'h-fit' },
  rounded: { type: String, default: 'lg:rounded-2xl rounded-t-2xl overflow-hidden' },
  zIndex: { type: String, default: 'z-[999]' },
  rtl: { type: Boolean, default: true },
  maxHeight: { type: String, default: '70vh' }, // prop جدید برای ارتفاع
})
const emit = defineEmits(['update:modelValue', 'close'])

const isMobile = ref(false)
const inited = ref(false)
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
        keyboardOpen = true
        if (modalRef.value) {
          modalRef.value.style.height = `${currentHeight}px`
          modalRef.value.style.maxHeight = `${currentHeight}px`
        }
      } else {
        keyboardOpen = false
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
  
  requestAnimationFrame(() => {
    inited.value = true
    // فقط زمانی که مدال واقعاً باز است و inited فعال شد، overflow را مخفی کن
    if (props.modelValue) setBodyOverflow(true)
  })
  
  // cleanup keyboard detection
  onBeforeUnmount(() => {
    if (cleanupKeyboard) cleanupKeyboard()
  })
})

watch(() => props.modelValue, (val) => {
  // فقط زمانی که inited فعال است، overflow را تغییر بده
  if (inited.value) setBodyOverflow(val)
})


onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  setBodyOverflow(false)
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
      v-if="props.modelValue && inited"
      @click="closeModal"
      class="fixed inset-0 bg-stone-900/20 z-[998]"
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
        'fixed flex flex-col text-sm text-gray-800 w-full bg-white overflow-hidden',
        zIndex,
        rounded,
        'bottom-0 left-0 right-0',
      ]"
      :style="{
        touchAction: 'manipulation',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'none',
        height: props.maxHeight,
        maxHeight: props.maxHeight
      }"
      @click.stop
    >
      <slot name="header" />
      <div 
        class="flex-1 overflow-y-auto"
        :style="{
          touchAction: 'pan-y',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }"
      >
        <slot />
      </div>
      <slot name="footer" />
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
