<template>
  <div class="min-h-screen bg-background pb-24">
    <!-- هدر -->
    <div class="bg-card border-b border-border sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center gap-3">
          <button
            @click="navigateTo('/financial')"
            class="w-10 h-10 flex items-center justify-center rounded-xl bg-background hover:bg-secondary transition-colors"
          >
            <i class="ti ti-arrow-right text-xl text-primary"></i>
          </button>
          <div>
            <h1 class="text-xl font-bold text-primary">تاریخچه پرداخت‌ها</h1>
            <p class="text-xs text-secondary">گزارش کامل تراکنش‌های شما</p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-6">
      <Transactions />
    </div>
  </div>
</template>

<script setup lang="ts">
import Transactions from '~/components/UserDashboard/main/transactions/index.vue'

definePageMeta({
  middleware: 'require-activated',
  layout: 'default'
})
</script>

<style scoped>
/* Custom scrollbar for filters */
.overflow-x-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.overflow-x-auto::-webkit-scrollbar {
  display: none;
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.page-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
