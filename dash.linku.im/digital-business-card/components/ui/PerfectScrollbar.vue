<template>
  <div ref="scrollContainer" class="ps-container" :class="containerClass">
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import PerfectScrollbar from 'perfect-scrollbar'

const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  },
  containerClass: {
    type: String,
    default: ''
  }
})

const scrollContainer = ref(null)
let ps = null

const defaultOptions = {
  suppressScrollX: true,
  wheelPropagation: false,
  minScrollbarLength: 20,
  maxScrollbarLength: 160
}

const initScrollbar = async () => {
  if (!scrollContainer.value || !import.meta.client) return
  
  await nextTick()
  
  // مستقیماً از PerfectScrollbar استفاده کنیم
  if (ps) {
    ps.destroy()
  }
  
  ps = new PerfectScrollbar(scrollContainer.value, {
    ...defaultOptions,
    ...props.options
  })
  
}

const destroyScrollbar = () => {
  if (ps) {
    ps.destroy()
    ps = null
  }
}

const updateScrollbar = () => {
  if (ps) {
    ps.update()
  }
}

onMounted(() => {
  setTimeout(initScrollbar, 100) // کمی تاخیر برای اطمینان
})

onUnmounted(() => {
  destroyScrollbar()
})

defineExpose({
  updateScrollbar,
  destroyScrollbar,
  initScrollbar
})
</script>

<style scoped>
.ps-container {
  position: relative;
  overflow: hidden;
}
</style>
