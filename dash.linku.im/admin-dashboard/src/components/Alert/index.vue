<template>
  <!-- Alert Overlay -->
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
    @click="handleOverlayClick"
  >
    <!-- Alert Modal -->
    <div
      class="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 w-full max-w-md transform transition-all duration-300"
      :class="alertAnimation"
      @click.stop
    >
      <!-- Alert Header -->
      <div class="p-6 text-center">
        <!-- Icon -->
        <div class="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center" :class="iconClasses">
          <i :class="iconName" class="text-3xl"></i>
        </div>

        <!-- Title -->
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {{ title }}
        </h3>

        <!-- Message -->
        <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {{ message }}
        </p>

        <!-- Additional Details (for delete confirmations) -->
        <div v-if="details" class="mt-4 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-300" v-html="details"></p>
        </div>
      </div>

      <!-- Alert Actions -->
      <div class="px-6 pb-6 flex gap-3" :class="buttonLayout">
        <!-- Cancel Button -->
        <button
          v-if="showCancel"
          @click="handleCancel"
          class="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl transition-all duration-200 font-medium"
        >
          {{ cancelText }}
        </button>

        <!-- Confirm Button -->
        <button
          @click="handleConfirm"
          class="flex-1 px-4 py-3 text-white rounded-xl transition-all duration-200 font-medium"
          :class="confirmButtonClasses"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

export interface AlertOptions {
  type?: 'success' | 'error' | 'warning' | 'info' | 'confirm' | 'delete'
  title: string
  message: string
  details?: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  autoClose?: number
}

interface Props {
  modelValue: boolean
  options: AlertOptions
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  options: () => ({
    type: 'info',
    title: '',
    message: '',
    confirmText: 'تایید',
    cancelText: 'انصراف',
    showCancel: true
  })
})

const emit = defineEmits<Emits>()

const isVisible = ref(false)
const alertAnimation = ref('scale-95 opacity-0')

// Computed properties
const iconName = computed(() => {
  const icons = {
    success: 'ti ti-check-circle',
    error: 'ti ti-alert-circle',
    warning: 'ti ti-alert-triangle',
    info: 'ti ti-info-circle',
    confirm: 'ti ti-help-circle',
    delete: 'ti ti-trash'
  }
  return icons[props.options.type || 'info']
})

const iconClasses = computed(() => {
  const classes = {
    success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    confirm: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    delete: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
  }
  return classes[props.options.type || 'info']
})

const confirmButtonClasses = computed(() => {
  const classes = {
    success: 'bg-green-600 hover:bg-green-700',
    error: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
    confirm: 'bg-purple-600 hover:bg-purple-700',
    delete: 'bg-red-600 hover:bg-red-700'
  }
  return classes[props.options.type || 'info']
})

const buttonLayout = computed(() => {
  return props.options.showCancel ? 'justify-center' : 'justify-center'
})

const title = computed(() => props.options.title)
const message = computed(() => props.options.message)
const details = computed(() => props.options.details)
const confirmText = computed(() => props.options.confirmText || 'تایید')
const cancelText = computed(() => props.options.cancelText || 'انصراف')
const showCancel = computed(() => props.options.showCancel !== false)

// Watch for modelValue changes
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    showAlert()
  } else {
    hideAlert()
  }
})

// Methods
const showAlert = () => {
  isVisible.value = true
  setTimeout(() => {
    alertAnimation.value = 'scale-100 opacity-100'
  }, 10)

  // Auto close if specified
  if (props.options.autoClose) {
    setTimeout(() => {
      handleConfirm()
    }, props.options.autoClose)
  }
}

const hideAlert = () => {
  alertAnimation.value = 'scale-95 opacity-0'
  setTimeout(() => {
    isVisible.value = false
    emit('update:modelValue', false)
  }, 200)
}

const handleConfirm = () => {
  emit('confirm')
  hideAlert()
}

const handleCancel = () => {
  emit('cancel')
  hideAlert()
}

const handleOverlayClick = () => {
  if (props.options.type !== 'delete') {
    handleCancel()
  }
}

defineOptions({
  name: 'AlertComponent'
})
</script>

<style scoped>
.transform {
  transform-origin: center;
}
</style>
