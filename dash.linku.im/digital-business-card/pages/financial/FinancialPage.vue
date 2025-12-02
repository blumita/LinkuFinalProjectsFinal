<template>
  <div class="min-h-screen bg-background pb-24">
    <!-- هدر -->
    <div class="bg-card border-b border-border sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center gap-3">
          <button
            @click="$router.back()"
            class="w-10 h-10 flex items-center justify-center rounded-xl bg-background hover:bg-secondary transition-colors"
          >
            <i class="ti ti-arrow-right text-xl text-primary"></i>
          </button>
          <div>
            <h1 class="text-xl font-bold text-primary">مالی</h1>
            <p class="text-xs text-secondary">مدیریت امور مالی</p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-6">
      <!-- Loading State -->
      <div v-if="!isDataLoaded" class="space-y-6 animate-pulse">
        <!-- Financial Menu Items Skeleton -->
        <div class="space-y-0 border-t border-border">
          <div v-for="n in 6" :key="n" class="w-full flex items-center justify-between py-4 border-b border-border">
            <div class="flex items-center gap-3">
              <div class="w-5 h-5 bg-secondary rounded"></div>
              <div class="h-4 w-32 bg-secondary rounded"></div>
            </div>
            <div class="w-3 h-3 bg-secondary rounded"></div>
          </div>
        </div>
      </div>

      <!-- Financial Menu Items -->
      <div class="space-y-0 border-t border-border" v-else>

        <!-- Invoices & Billing -->
        <button
          @click="handleMenuClick('invoices')"
          class="w-full flex items-center justify-between py-4 border-b border-border hover:bg-secondary transition-colors"
        >
          <div class="flex items-center gap-3">
            <i class="ti ti-file-invoice text-primary text-lg"></i>
            <span class="font-medium text-primary text-base">فاکتورها و صورتحساب‌ها</span>
          </div>
          <i class="ti ti-chevron-left text-secondary text-sm"></i>
        </button>

        <!-- Wallet Management -->
        <button
          disabled
          class="w-full flex items-center justify-between py-4 border-b border-border opacity-50 cursor-not-allowed"
        >
          <div class="flex items-center gap-3">
            <i class="ti ti-wallet text-secondary text-lg"></i>
            <span class="font-medium text-secondary text-base">کیف پول</span>
            <span class="text-xs text-secondary bg-secondary px-2 py-1 rounded">به‌زودی</span>
          </div>
          <i class="ti ti-chevron-left text-secondary text-sm"></i>
        </button>

        <!-- Payment History -->
        <button
          @click="handleMenuClick('payment-history')"
          class="w-full flex items-center justify-between py-4 border-b border-border hover:bg-secondary transition-colors"
        >
          <div class="flex items-center gap-3">
            <i class="ti ti-history text-primary text-lg"></i>
            <span class="font-medium text-primary text-base">تاریخچه پرداخت‌ها</span>
          </div>
          <i class="ti ti-chevron-left text-secondary text-sm"></i>
        </button>

        <!-- Refunds & Returns - Disabled -->
        <button
          disabled
          class="w-full flex items-center justify-between py-4 border-b border-border opacity-50 cursor-not-allowed"
        >
          <div class="flex items-center gap-3">
            <i class="ti ti-receipt-refund text-secondary text-lg"></i>
            <span class="font-medium text-secondary text-base">بازپرداخت و مرجوعی</span>
            <span class="text-xs text-secondary bg-secondary px-2 py-1 rounded">به‌زودی</span>
          </div>
          <i class="ti ti-chevron-left text-secondary text-sm"></i>
        </button>

        <!-- My Earnings - Disabled -->
        <button
          disabled
          class="w-full flex items-center justify-between py-4 border-b border-border opacity-50 cursor-not-allowed"
        >
          <div class="flex items-center gap-3">
            <i class="ti ti-coins text-secondary text-lg"></i>
            <span class="font-medium text-secondary text-base">درآمدهای من</span>
            <span class="text-xs text-secondary bg-secondary px-2 py-1 rounded">به‌زودی</span>
          </div>
          <i class="ti ti-chevron-left text-secondary text-sm"></i>
        </button>

        <!-- Auto-Payment Settings - Disabled -->
        <button
          disabled
          class="w-full flex items-center justify-between py-4 opacity-50 cursor-not-allowed"
        >
          <div class="flex items-center gap-3">
            <i class="ti ti-refresh text-secondary text-lg"></i>
            <span class="font-medium text-secondary text-base">تنظیمات پرداخت خودکار</span>
            <span class="text-xs text-secondary bg-secondary px-2 py-1 rounded">به‌زودی</span>
          </div>
          <i class="ti ti-chevron-left text-secondary text-sm"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: 'require-activated',
  layout: 'default'
})

// Data
const isDataLoaded = ref(true)

// Methods
const handleMenuClick = (action: string) => {
  switch (action) {
    case 'invoices':
      navigateTo('/financial/invoices')
      break
    case 'wallet':
      navigateTo('/financial/wallet')
      break
    case 'payment-history':
      navigateTo('/dashboard/transactions')
      break
    default:
  }
}
</script>

<style scoped>
/* Financial cards container */
.financial-cards-container {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.financial-cards-container::-webkit-scrollbar {
  display: none;
}

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9) translateY(20px);
}

.modal-enter-to .relative,
.modal-leave-from .relative {
  transform: scale(1) translateY(0);
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
