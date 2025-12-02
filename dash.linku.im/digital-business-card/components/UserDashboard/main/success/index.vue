<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="bg-card rounded-3xl p-8 text-center max-w-md w-full">
      <div class="animate-pulse space-y-6">
        <div class="w-20 h-20 bg-secondary rounded-full mx-auto"></div>
        <div class="space-y-2">
          <div class="h-8 bg-secondary rounded mx-auto w-48"></div>
          <div class="h-6 bg-secondary rounded mx-auto w-32"></div>
        </div>
        <div class="h-24 bg-secondary rounded"></div>
        <div class="h-12 bg-secondary rounded"></div>
      </div>
    </div>

    <!-- Success Content -->
    <div v-else-if="purchaseData" class="bg-card rounded-3xl p-8 text-center max-w-md w-full shadow-2xl relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-primary/10"></div>
      
      <div class="relative z-10 space-y-6">
        <!-- آیکون تایید -->
        <div class="flex justify-center">
          <div class="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
            <i class="ti ti-check text-white text-4xl"></i>
          </div>
        </div>

        <!-- پیام تایید اصلی -->
        <div class="space-y-2">
          <h1 class="text-2xl font-bold text-primary">
            🎉 تبریک!
          </h1>
          <p class="text-lg text-secondary">
            اشتراک شما با موفقیت فعال شد
          </p>
        </div>

        <!-- اطلاعات کلیدی -->
        <div class="accent-bg/10 rounded-xl p-4 border" style="border-color: var(--accent-color);">
          <div class="font-semibold text-lg mb-2 accent-text">{{ purchaseData.planTitle }}</div>
          <div class="text-sm text-secondary space-y-1">
            <div class="flex items-center justify-center gap-2">
              <i class="ti ti-calendar text-green-500"></i>
              <span>{{ purchaseData.duration }} اشتراک فعال</span>
            </div>
            <div class="text-primary font-medium">
              تا {{ purchaseData.expiryDate }} معتبر است
            </div>
          </div>
        </div>

        <!-- جزئیات پرداخت -->
        <div class="bg-secondary/50 rounded-lg p-4 space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-secondary">مبلغ پرداختی:</span>
            <span class="text-primary font-medium">{{ purchaseData.amount }} تومان</span>
          </div>
          <div v-if="purchaseData.trackingCode" class="flex justify-between">
            <span class="text-secondary">کد پیگیری:</span>
            <span class="text-primary font-mono text-xs">{{ purchaseData.trackingCode }}</span>
          </div>
        </div>

        <!-- دکمه‌ها -->
        <div class="space-y-3">
          <button 
            @click="goToDashboard"
            class="w-full accent-bg accent-text font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-200"
          >
            ورود به پروفایل
          </button>
          
          <div class="flex gap-3 justify-center text-sm">
            <NuxtLink 
              to="/dashboard/add-card" 
              class="text-accent hover:underline font-medium"
            >
              ساخت پروفایل جدید
            </NuxtLink>
            <span class="text-border">|</span>
            <NuxtLink 
              to="/financial/invoices" 
              class="text-secondary hover:text-primary font-medium"
            >
              مشاهده فاکتور
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="bg-card rounded-3xl p-8 text-center max-w-md w-full">
      <div class="space-y-6">
        <div class="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
          <i class="ti ti-x text-red-500 text-4xl"></i>
        </div>
        <div class="space-y-2">
          <h2 class="text-xl font-bold text-primary">خطا در دریافت اطلاعات</h2>
          <p class="text-sm text-secondary">اطلاعات خرید یافت نشد</p>
        </div>
        <button 
          @click="$router.push('/dashboard/checkout')"
          class="w-full accent-bg accent-text font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-200"
        >
          بازگشت به صفحه اشتراک
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlanStore } from '~/stores/plan'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const route = useRoute()
const planStore = usePlanStore()
const authStore = useAuthStore()
const isLoading = ref(true)

interface PurchaseData {
  planTitle: string
  duration: string
  amount: string
  expiryDate: string
  trackingCode?: string
}

const purchaseData = ref<PurchaseData | null>(null)

const goToDashboard = () => {
  router.push('/dashboard')
}

onMounted(async () => {
  // بررسی پارامترهای URL که از درگاه بانک برمی‌گرده
  const { status, transaction_id, plan_id } = route.query
  
  if (status === 'success' && transaction_id) {
    try {
      // دریافت اطلاعات کاربر برای نمایش تاریخ انقضا
      await authStore.fetchUser()
      
      // پیدا کردن پلن خریداری شده
      if (planStore.plans.length === 0) {
        await planStore.fetchPlans()
      }
      
      const plan = planStore.plans.find(p => Number(p.id) === Number(plan_id))
      
      if (plan && authStore.user) {
        const finalPrice = Math.round(plan.price * (1 - plan.discount / 100))
        
        purchaseData.value = {
          planTitle: `${plan.title} پرمیوم`,
          duration: plan.duration,
          amount: finalPrice.toLocaleString('fa-IR'),
          expiryDate: authStore.user.subscription?.expire_date || 'نامشخص',
          trackingCode: transaction_id as string
        }
      }
    } catch (error) {
    }
  } else {
    // اگر از query params نیومد، از localStorage بخون (برای تست)
    const savedData = localStorage.getItem('last_purchase')
    if (savedData) {
      purchaseData.value = JSON.parse(savedData)
      localStorage.removeItem('last_purchase')
    }
  }
  
  isLoading.value = false
})
</script>