<template>
  <Transition name="toast-slide">
    <div
        v-if="visible"
        :class="[
          'fixed top-6 left-1/2 -translate-x-1/2 z-[9999] min-w-[280px] max-w-sm',
          'rounded-2xl flex items-center gap-3 px-4 py-3 backdrop-blur-md shadow-2xl',
          bgClass
        ]"
    >
      <!-- Icon with white circle background -->
      <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
        <i :class="['ti', computedIcon, 'text-lg text-white']"></i>
      </div>

      <!-- Content -->
      <div class="flex-1 text-sm leading-tight">
        <p class="font-semibold text-white">{{ computedTitle }}</p>
        <p v-if="message" class="text-white/70 text-xs mt-0.5">{{ message }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  type: {
    type: String,
    default: '', // success, error, warning, info
  },
  // پراپ icon برای سازگاری با کدهای قبلی
  icon: {
    type: String,
    default: ''
  }
})

// تشخیص نوع بر اساس آیکون (برای کدهای قبلی)
const computedType = computed(() => {
  // اگر type مستقیم پاس شده
  if (props.type) return props.type
  
  // تشخیص از روی آیکون
  if (props.icon) {
    if (props.icon.includes('check')) return 'success'
    if (props.icon.includes('alert') || props.icon.includes('triangle')) return 'error'
    if (props.icon.includes('lock')) return 'warning'
  }
  
  return 'info'
})

const computedIcon = computed(() => {
  // اگر آیکون مستقیم پاس شده
  if (props.icon) return props.icon
  
  // آیکون بر اساس تایپ
  switch (computedType.value) {
    case 'success': return 'ti-check'
    case 'error': return 'ti-alert-circle'
    case 'warning': return 'ti-lock'
    default: return 'ti-info-circle'
  }
})

const computedTitle = computed(() => {
  if (props.title) return props.title
  
  // عنوان پیش‌فرض بر اساس تایپ
  switch (computedType.value) {
    case 'success': return 'موفقیت!'
    case 'error': return 'خطا!'
    case 'warning': return 'هشدار!'
    default: return 'توجه!'
  }
})

const bgClass = computed(() => {
  switch (computedType.value) {
    case 'success': return 'bg-emerald-500/95'
    case 'error': return 'bg-red-500/95'
    case 'warning': return 'bg-amber-500/95'
    default: return 'bg-blue-500/95'
  }
})
</script>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-slide-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}
.toast-slide-enter-to {
  opacity: 1;
  transform: translate(-50%, 0);
}
.toast-slide-leave-from {
  opacity: 1;
  transform: translate(-50%, 0);
}
.toast-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
