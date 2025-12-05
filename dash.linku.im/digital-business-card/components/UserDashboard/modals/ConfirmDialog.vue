<template>
  <transition
    enter-active-class="transition-all duration-200 ease-out"
    leave-active-class="transition-all duration-150 ease-in"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      @click.self="cancel"
    >
      <transition
        enter-active-class="transition-all duration-200 ease-out"
        leave-active-class="transition-all duration-150 ease-in"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div
          v-if="visible"
          class="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-sm overflow-hidden"
        >
          <!-- Icon & Title -->
          <div class="p-6 pb-4 text-center">
            <div class="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <i :class="icon" class="text-destructive text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-foreground mb-2">{{ title }}</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ message }}</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 p-6 pt-0">
            <button
              @click="cancel"
              class="flex-1 px-4 py-3 rounded-xl border border-border hover:bg-muted text-foreground font-medium transition-colors"
            >
              {{ cancelText }}
            </button>
            <button
              @click="confirm"
              class="flex-1 px-4 py-3 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium transition-colors"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'تایید عملیات'
  },
  message: {
    type: String,
    default: 'آیا از انجام این عملیات اطمینان دارید؟'
  },
  icon: {
    type: String,
    default: 'ti ti-alert-triangle'
  },
  confirmText: {
    type: String,
    default: 'بله، حذف شود'
  },
  cancelText: {
    type: String,
    default: 'انصراف'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('cancel')
}
</script>
