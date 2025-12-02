<template>
  <div>
    <!-- Mobile Header -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-card border-b divide-border">
      <div class="flex items-center justify-between px-4 h-16">
        <button @click="navigateTo('/financial')" class="p-2 hover:bg-secondary rounded-lg transition-colors">
          <i class="ti ti-arrow-right text-primary text-xl"></i>
        </button>
        <h1 class="text-lg font-bold text-primary">کیف پول</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Wallet Content -->
    <div class="pt-20 py-4">
      <!-- Wallet Balance Card -->
      <div class="mb-6 px-6">
        <div class="p-6 rounded-2xl text-white" style="background: var(--accent-color);">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold">موجودی کیف پول</h3>
            <i class="ti ti-wallet text-2xl"></i>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <p class="text-2xl font-bold mb-2">{{ formatPrice(walletBalance) }}</p>
              <p class="text-sm opacity-80">موجودی فعلی شما</p>
            </div>
            <button 
              @click="handleChargeWallet"
              class="bg-white/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors"
            >
              شارژ کیف پول
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mb-6 px-6">
        <h4 class="text-lg font-bold text-primary mb-4">عملیات سریع</h4>
        <div class="grid grid-cols-2 gap-4">
          <!-- Charge Wallet -->
          <button 
            @click="handleChargeWallet"
            class="bg-card border border-border p-4 rounded-xl flex items-center gap-3 hover:bg-secondary transition-colors"
          >
            <div class="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <i class="ti ti-plus text-green-500 text-lg"></i>
            </div>
            <div class="text-right">
              <p class="font-medium text-primary text-sm">شارژ کیف پول</p>
              <p class="text-xs text-secondary">افزودن اعتبار</p>
            </div>
          </button>

          <!-- Withdraw -->
          <button 
            @click="handleWithdraw"
            class="bg-card border border-border p-4 rounded-xl flex items-center gap-3 hover:bg-secondary transition-colors"
          >
            <div class="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <i class="ti ti-cash text-blue-500 text-lg"></i>
            </div>
            <div class="text-right">
              <p class="font-medium text-primary text-sm">برداشت وجه</p>
              <p class="text-xs text-secondary">انتقال به حساب</p>
            </div>
          </button>
        </div>
      </div>

      <!-- Wallet Menu Items -->
      <div class="space-y-0 px-6">
        <!-- Transaction History -->
        <button
          @click="handleMenuClick('transaction-history')"
          class="w-full flex items-center justify-between py-4 border-b divide-border hover:bg-secondary transition-colors"
        >
          <div class="flex items-center gap-3">
            <i class="ti ti-history text-primary text-lg"></i>
            <span class="font-medium text-primary text-base">تاریخچه تراکنش‌ها</span>
          </div>
          <i class="ti ti-chevron-left text-secondary text-sm"></i>
        </button>

        <!-- Payment Methods - Disabled -->
        <button
          disabled
          class="w-full flex items-center justify-between py-4 border-b divide-border opacity-50 cursor-not-allowed"
        >
          <div class="flex items-center gap-3">
            <i class="ti ti-credit-card text-primary text-lg"></i>
            <span class="font-medium text-primary text-base">روش‌های پرداخت</span>
            <span class="text-xs text-secondary bg-secondary px-2 py-1 rounded">به‌زودی</span>
          </div>
          <i class="ti ti-chevron-left text-secondary text-sm"></i>
        </button>

        <!-- Bank Accounts - Disabled -->
        <button
          disabled
          class="w-full flex items-center justify-between py-4 border-b divide-border opacity-50 cursor-not-allowed"
        >
          <div class="flex items-center gap-3">
            <i class="ti ti-building-bank text-primary text-lg"></i>
            <span class="font-medium text-primary text-base">حساب‌های بانکی</span>
            <span class="text-xs text-secondary bg-secondary px-2 py-1 rounded">به‌زودی</span>
          </div>
          <i class="ti ti-chevron-left text-secondary text-sm"></i>
        </button>

        <!-- Wallet Settings - Disabled -->
        <button
          disabled
          class="w-full flex items-center justify-between py-4 opacity-50 cursor-not-allowed"
        >
          <div class="flex items-center gap-3">
            <i class="ti ti-settings text-primary text-lg"></i>
            <span class="font-medium text-primary text-base">تنظیمات کیف پول</span>
            <span class="text-xs text-secondary bg-secondary px-2 py-1 rounded">به‌زودی</span>
          </div>
          <i class="ti ti-chevron-left text-secondary text-sm"></i>
        </button>
      </div>

      <!-- Recent Transactions -->
      <div class="mt-6 px-6">
        <h4 class="text-lg font-bold text-primary mb-4">آخرین تراکنش‌ها</h4>
        <div class="space-y-3">
          <div v-if="recentTransactions.length === 0" class="bg-card border border-border p-6 rounded-xl text-center">
            <i class="ti ti-receipt-off text-secondary text-3xl mb-2"></i>
            <p class="text-secondary">هیچ تراکنشی یافت نشد</p>
          </div>
          
          <div v-else v-for="transaction in recentTransactions" :key="transaction.id" 
               class="bg-card border border-border p-4 rounded-xl">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  transaction.type === 'charge' ? 'bg-green-500/10' : 'bg-red-500/10'
                ]">
                  <i :class="[
                    'text-lg',
                    transaction.type === 'charge' ? 'ti ti-plus text-green-500' : 'ti ti-minus text-red-500'
                  ]"></i>
                </div>
                <div>
                  <p class="font-medium text-primary text-sm">{{ transaction.title }}</p>
                  <p class="text-xs text-secondary">{{ transaction.date }}</p>
                </div>
              </div>
              <div class="text-left">
                <p :class="[
                  'font-bold text-sm',
                  transaction.type === 'charge' ? 'text-green-500' : 'text-red-500'
                ]">
                  {{ transaction.type === 'charge' ? '+' : '-' }}{{ formatPrice(transaction.amount) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'default',
  middleware: 'require-activated'
})

// Data
const walletBalance = ref(0) // موجودی کیف پول
const recentTransactions = ref<Array<{
  id: string
  title: string
  amount: number
  type: 'charge' | 'withdraw'
  date: string
}>>([])

// Methods
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' ریال'
}

const handleChargeWallet = () => {
  // TODO: Implement charge wallet functionality
  alert('قابلیت شارژ کیف پول به زودی اضافه خواهد شد')
}

const handleWithdraw = () => {
  if (walletBalance.value === 0) {
    alert('موجودی کیف پول شما صفر است')
    return
  }
  // TODO: Implement withdraw functionality
  alert('قابلیت برداشت وجه به زودی اضافه خواهد شد')
}

const handleMenuClick = (action: string) => {
  switch (action) {
    case 'transaction-history':
      navigateTo('/dashboard/transactions')
      break
    case 'payment-methods':
      alert('روش‌های پرداخت به زودی اضافه خواهد شد')
      break
    case 'bank-accounts':
      alert('حساب‌های بانکی به زودی اضافه خواهد شد')
      break
    case 'wallet-settings':
      alert('تنظیمات کیف پول به زودی اضافه خواهد شد')
      break
  }
}

// Lifecycle
onMounted(() => {
  // Set initial wallet balance (sync with main financial page)
  walletBalance.value = 0
  
  // Load recent transactions (sample data)
  recentTransactions.value = []
})
</script>

<style scoped>
/* Component specific styles */
.wallet-card {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-foreground) 100%);
}
</style>