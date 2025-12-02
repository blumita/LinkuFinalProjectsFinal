<template>
  <div class="flex items-center justify-center min-h-[60vh]">
    <div class="text-center space-y-6 px-6">
      <div class="relative inline-block">
        <i class="ti ti-search text-8xl text-primary opacity-20"></i>
        <div class="absolute inset-0 flex items-center justify-center">
          <i class="ti ti-clock text-3xl text-primary opacity-40"></i>
        </div>
      </div>
      
      <div class="space-y-2">
        <h2 class="text-2xl font-bold text-primary">جستجو</h2>
        <p class="text-primary opacity-60">این بخش به زودی راه‌اندازی خواهد شد</p>
      </div>
      
      <div class="flex items-center justify-center gap-2 text-sm text-primary opacity-40">
        <i class="ti ti-sparkles"></i>
        <span>در حال توسعه...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
  middleware: ['require-activated']
})
</script>
