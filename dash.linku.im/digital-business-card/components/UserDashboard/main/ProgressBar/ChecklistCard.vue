<template>
  <div 
    class="bg-secondary border border-border rounded-xl p-4 pt-5 relative min-h-[150px] text-right transition-all hover:border-accent"
    :class="disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'"
    @click="handleClick"
  >
    
    <!-- آیکون و عنوان -->
    <div class="flex items-start justify-between mb-6">
      <div class="flex-1">
        <h3 class="text-sm font-semibold text-primary">{{ title }}</h3>
        <p class="text-xs text-primary opacity-60 mt-1 leading-5">{{ description }}</p>
      </div>
      <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 mr-3">
        <i :class="icon" class="text-xl text-primary"></i>
      </div>
    </div>

    <!-- فوتر چسبیده پایین -->
    <div class="absolute bottom-0 left-0 right-0 border-t border-border bg-primary text-xs flex items-center justify-between px-4 py-3 rounded-b-xl">
      <div class="flex items-center gap-1 text-primary font-medium">
        <span>{{ action }}</span>
        <i class="ti ti-arrow-left text-sm"></i>
      </div>
      <div class="flex items-center gap-2 text-primary opacity-70">
        <span>{{ status === 'done' ? 'تکمیل‌شده' : 'ناقص' }}</span>
        <div
          :class="[
            'w-5 h-5 rounded-full flex items-center justify-center',
            status === 'done' ? 'accent-bg accent-text' : 'bg-red-100 text-red-600'
          ]"
        >
          <i :class="status === 'done' ? 'ti ti-check text-xs' : 'ti ti-alert-triangle-filled text-xs'"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: String,
  title: String,
  description: String,
  action: String,
  status: String, // "done" or "pending"
  to: String, // مسیر لینک
  disabled: Boolean // برای غیرفعال کردن لینک
})

const handleClick = () => {
  if (props.disabled || !props.to) return
  navigateTo(props.to)
}
</script>
