<template>
  <Transition 
    name="fade"
    @after-leave="$emit('finished')"
  >
    <div 
      v-if="show"
      class="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
    >
      <div class="flex flex-col items-center">
        <!-- لوگو -->
        <img 
          src="/logo/logo.png" 
          alt="Linku" 
          class="w-32 h-32 mb-10 object-contain"
        />
        
        <!-- لودر سه‌دایره‌ای -->
        <div class="flex gap-3" dir="ltr">
          <span class="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span class="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span class="w-3 h-3 bg-black rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const show = ref(true)

defineEmits(['finished'])

onMounted(() => {
  // Hide splash after 1.5 seconds
  setTimeout(() => {
    show.value = false
  }, 1500)
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
