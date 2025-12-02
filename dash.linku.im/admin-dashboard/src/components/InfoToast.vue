<template>
  <transition name="slide-fade">
    <div
      v-if="visible"
      :class="[
        'fixed top-4 inset-x-4 sm:inset-x-auto sm:right-6 z-50 text-white rounded-xl shadow-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 overflow-hidden',
        bgClass
      ]"
    >
      <!-- محتوا -->
      <div class="flex items-center gap-2">
        <i :class="['ti', computedIcon, 'text-xl', iconColorClass]"></i>
        <span class="text-sm font-medium">{{ message }}</span>
      </div>

      <!-- نوار پیشرفت -->
      <div :class="['absolute bottom-0 right-0 h-1 animate-toast-bar', barColorClass]"></div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: Boolean,
  message: {
    type: String,
    default: 'این ویژگی مخصوص نسخه پرو است.'
  },
  icon: {
    type: String,
    default: 'ti-lock'
  },
  type: {
    type: String,
    default: '' // success, error, warning, info
  }
})

// تشخیص نوع بر اساس آیکون
const computedType = computed(() => {
  // اگر type مستقیم پاس شده
  if (props.type) return props.type
  
  // تشخیص از روی آیکون
  if (props.icon) {
    if (props.icon.includes('check')) return 'success'
    if (props.icon.includes('alert') || props.icon.includes('triangle') || props.icon.includes('x')) return 'error'
    if (props.icon.includes('lock')) return 'warning'
  }
  
  return 'info'
})

const computedIcon = computed(() => props.icon || 'ti-info-circle')

// رنگ پس‌زمینه بر اساس نوع
const bgClass = computed(() => {
  switch (computedType.value) {
    case 'success': return 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-600'
    case 'error': return 'bg-gradient-to-r from-red-600 via-red-700 to-red-600'
    case 'warning': return 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500'
    default: return 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600'
  }
})

// رنگ آیکون
const iconColorClass = computed(() => {
  switch (computedType.value) {
    case 'success': return 'text-emerald-200'
    case 'error': return 'text-red-200'
    case 'warning': return 'text-amber-200'
    default: return 'text-blue-200'
  }
})

// رنگ نوار پیشرفت
const barColorClass = computed(() => {
  switch (computedType.value) {
    case 'success': return 'bg-emerald-300'
    case 'error': return 'bg-red-300'
    case 'warning': return 'bg-amber-300'
    default: return 'bg-blue-300'
  }
})
</script>

<style scoped>
/* انیمیشن ورود خروج توست */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* نوار انیمیشنی */
@keyframes toastBar {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
.animate-toast-bar {
  animation: toastBar 3s linear forwards;
}
</style>
