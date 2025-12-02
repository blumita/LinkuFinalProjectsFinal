<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-8 scale-90"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-4 scale-95"
    >
      <div
        v-if="show"
        class="fixed top-8 left-1/2 -translate-x-1/2 z-[99999]"
      >
        <div 
          :class="[
            'flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-2xl',
            'min-w-[200px] max-w-[90vw]',
            toastBgClass
          ]"
          @click="close"
        >
          <!-- Icon -->
          <div :class="['w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0', iconBgClass]">
            <i :class="[iconClass, 'text-xl', iconColorClass]"></i>
          </div>
          
          <!-- Content -->
          <div class="flex flex-col flex-1 min-w-0">
            <span class="font-semibold text-sm text-white truncate">{{ title }}</span>
            <span v-if="message" class="text-xs text-white/70 truncate">{{ message }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'info', 'warning'].includes(value)
  },
  duration: {
    type: Number,
    default: 2500
  },
  autoClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const show = ref(false)
let timer = null

const toastBgClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-emerald-600/95 border border-emerald-400/20'
    case 'error':
      return 'bg-red-600/95 border border-red-400/20'
    case 'warning':
      return 'bg-amber-600/95 border border-amber-400/20'
    case 'info':
      return 'bg-blue-600/95 border border-blue-400/20'
    default:
      return 'bg-emerald-600/95 border border-emerald-400/20'
  }
})

const iconBgClass = computed(() => 'bg-white/20')

const iconClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'ti ti-check'
    case 'error':
      return 'ti ti-x'
    case 'warning':
      return 'ti ti-alert-triangle'
    case 'info':
      return 'ti ti-info-circle'
    default:
      return 'ti ti-check'
  }
})

const iconColorClass = computed(() => 'text-white')

const close = () => {
  show.value = false
  if (timer) clearTimeout(timer)
  emit('close')
}

onMounted(() => {
  show.value = true
  
  if (props.autoClose && props.duration) {
    timer = setTimeout(() => {
      close()
    }, props.duration)
  }
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>
