<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

let lastBodyOverflow = ''
let lastBodyPosition = ''
let lastBodyWidth = ''
let lastBodyHeight = ''
let lastBodyTop = ''
let lastBodyLeft = ''
let scrollY = 0
const setBodyOverflow = (hidden) => {
  if (typeof document !== 'undefined') {
    if (hidden) {
      lastBodyOverflow = document.body.style.overflow
      lastBodyPosition = document.body.style.position
      lastBodyWidth = document.body.style.width
      lastBodyHeight = document.body.style.height
      lastBodyTop = document.body.style.top
      lastBodyLeft = document.body.style.left
      scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100vw'
      document.body.style.height = '100vh'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
    } else {
      document.body.style.overflow = lastBodyOverflow || ''
      document.body.style.position = lastBodyPosition || ''
      document.body.style.width = lastBodyWidth || ''
      document.body.style.height = lastBodyHeight || ''
      document.body.style.top = lastBodyTop || ''
      document.body.style.left = lastBodyLeft || ''
      window.scrollTo(0, scrollY)
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
})
const emit = defineEmits(['update:modelValue', 'close'])

const isMobile = ref(false)
const inited = ref(false)
const handleResize = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 1024
  }
}



onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  requestAnimationFrame(() => {
    inited.value = true
    // فقط زمانی که مدال واقعاً باز است و inited فعال شد، overflow را مخفی کن
    if (props.modelValue) setBodyOverflow(true)
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
        'fixed flex flex-col text-sm text-gray-800  h-screen min-h-96 max-h-[60vh] bg-white overflow-hidden',
        zIndex,
        width,
        height,
        rounded,
        rtl ? 'rtl:right-0 ltr:left-0' : 'left-0',
        'bottom-0',
      ]"
      @click.stop
    >
      <slot name="header" />
      <div class="flex-1 overflow-y-auto">
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
</style>
