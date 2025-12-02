<template>
  <Transition name="fade">
    <div 
      v-if="isVisible"
      class="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-[9999]"
    >
      <!-- لوگو در مرکز -->
      <img
        src="/logo/logowhite.png"
        alt="Logo"
        class="w-32 h-32 mb-10 object-contain"
      />

      <!-- لودر سه‌دایره‌ای -->
      <div class="flex gap-3" dir="ltr">
        <span class="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span class="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span class="w-3 h-3 bg-white rounded-full animate-bounce"></span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  minDuration?: number
}>()

const emit = defineEmits(['hide'])

const isVisible = ref(true)
const minDuration = props.minDuration || 1000

onMounted(() => {
  // مخفی کردن بعد از زمان مشخص
  setTimeout(() => {
    isVisible.value = false
    emit('hide')
  }, minDuration)
})
</script>

<style scoped>
.fade-leave-active {
  transition: opacity 0.3s ease-out;
}
.fade-leave-to {
  opacity: 0;
}
</style>
