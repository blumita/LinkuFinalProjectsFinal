<template>
  <transition name="slide-fade">
    <div
      v-if="visible"
      class="fixed top-4 inset-x-4 sm:inset-x-auto sm:right-6 z-50 bg-gradient-to-r from-gray-700 via-gray-900 to-gray-700 text-white rounded-xl shadow-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 overflow-hidden"
    >
      <!-- محتوا -->
      <div class="flex items-center gap-2">
        <i class="ti ti-lock text-xl text-yellow-300"></i>
        <span class="text-sm font-medium">
          این ویژگی مخصوص نسخه <span class="text-yellow-400 font-bold">پرو</span> است.
        </span>
      </div>

      <!-- لینک خرید -->
      <a
        href="/dashboard/upgrade"
        class="text-sm font-medium text-yellow-300 hover:underline mt-1 sm:mt-0"
      >
        مشاهده پلن‌ها و خرید اشتراک <i class="ti ti-arrow-left" />
      </a>

      <!-- نوار پیشرفت -->
      <div class="absolute bottom-0 right-0 h-1 bg-yellow-400 animate-toast-bar"></div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  visible: Boolean
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
