<!-- components/ui/ToastProvider.vue -->
<template>
    <Toast
      v-model:visible="visible"
      :message="message"
      :type="type"
    />
  </template>
  
  <script setup>
  import { ref, provide } from 'vue'
  import Toast from './Toast.vue'
  
  const visible = ref(false)
  const message = ref('')
  const type = ref('info')
  
  const showToast = (msg, toastType = 'info') => {
    message.value = msg
    type.value = toastType
    visible.value = true
  }
  
  // make available to all children
  provide('toast', showToast)
  </script>
  