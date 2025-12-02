<!-- components/ui/Toast.vue -->
<template>
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed top-6 right-6 z-50 px-4 py-3 rounded-md shadow-lg text-white text-sm font-medium transition-all"
        :class="toastClasses"
      >
        {{ message }}
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { computed, watch } from 'vue'
  
  const props = defineProps({
    message: String,
    type: {
      type: String,
      default: 'info', // info | success | error | warning
    },
    visible: Boolean,
  })
  
  const emit = defineEmits(['update:visible'])
  
  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        setTimeout(() => emit('update:visible', false), 3000)
      }
    }
  )
  
  const toastClasses = computed(() => {
    switch (props.type) {
      case 'success':
        return 'bg-green-600'
      case 'error':
        return 'bg-red-600'
      case 'warning':
        return 'bg-yellow-500 text-black'
      case 'info':
      default:
        return 'bg-blue-600'
    }
  })
  </script>
  
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
  