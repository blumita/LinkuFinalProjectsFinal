<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
      <div class="flex items-center h-14 px-4">
        <button
          @click="$router.back()"
          class="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-accent transition-colors"
        >
          <i class="ti ti-arrow-right text-xl"></i>
        </button>
        <h1 class="flex-1 text-lg font-semibold text-foreground">جزئیات کد تخفیف</h1>
      </div>
    </div>

    <!-- Content -->
    <div class="pt-16 pb-8">
      <div v-if="loading" class="max-w-2xl mx-auto px-4 space-y-4 animate-pulse">
        <div class="h-48 bg-accent rounded-2xl"></div>
        <div class="h-32 bg-accent rounded-2xl"></div>
        <div class="h-48 bg-accent rounded-2xl"></div>
      </div>

      <div v-else-if="discount" class="max-w-2xl mx-auto px-4 space-y-4">
        <!-- Banner Image -->
        <div v-if="discount.banner" class="w-full rounded-2xl overflow-hidden border border-border">
          <img 
            :src="discount.banner" 
            :alt="discount.title"
            class="w-full h-48 object-cover"
          />
        </div>

        <!-- Main Card -->
        <div class="bg-card border border-border rounded-2xl p-6 space-y-6">
          <!-- Header with Icon -->
          <div class="flex items-start gap-4">
            <div class="w-16 h-16 rounded-xl flex items-center justify-center border border-border overflow-hidden flex-shrink-0 bg-primary/5">
              <img 
                v-if="discount.image" 
                :src="discount.image" 
                :alt="discount.title"
                class="w-full h-full object-cover"
              />
              <i v-else class="ti ti-discount text-primary text-3xl"></i>
            </div>

            <div class="flex-1 space-y-2">
              <div class="flex items-start justify-between gap-2">
                <h2 class="text-xl font-bold text-foreground">{{ discount.title }}</h2>
                <span :class="[
                  'text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap',
                  getDiscountStatusClass(discount.status)
                ]">
                  {{ getDiscountStatusText(discount.status) }}
                </span>
              </div>
              <p class="text-muted-foreground text-sm">{{ discount.description }}</p>
            </div>
          </div>

          <!-- Discount Value -->
          <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 text-center border border-primary/20">
            <div class="text-4xl font-bold text-primary mb-2">
              {{ discount.value }}{{ discount.type === 'percentage' ? '%' : ' تومان' }}
            </div>
            <p class="text-sm text-muted-foreground">مقدار تخفیف</p>
          </div>

          <!-- Discount Code -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-foreground">کد تخفیف</label>
            <div class="flex items-center gap-3">
              <div class="flex-1 bg-muted border border-border rounded-xl px-4 py-3 font-mono text-lg text-center text-foreground">
                {{ discount.code }}
              </div>
              <button
                @click="copyDiscountCode"
                :disabled="copied"
                :class="[
                  'px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2',
                  copied
                    ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                ]"
              >
                <i :class="copied ? 'ti ti-check' : 'ti ti-copy'"></i>
                {{ copied ? 'کپی شد' : 'کپی' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Details Card -->
        <div class="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h3 class="text-lg font-semibold text-foreground mb-4">جزئیات</h3>

          <div class="space-y-3">
            <!-- Expiry Date -->
            <div class="flex items-center justify-between py-3 border-b border-border">
              <div class="flex items-center gap-3 text-muted-foreground">
                <i class="ti ti-calendar text-xl"></i>
                <span>تاریخ انقضا</span>
              </div>
              <span class="text-foreground font-medium">{{ formatDate(discount.expiryDate) }}</span>
            </div>

            <!-- Days Remaining -->
            <div v-if="discount.status === 'active'" class="flex items-center justify-between py-3 border-b border-border">
              <div class="flex items-center gap-3 text-muted-foreground">
                <i class="ti ti-clock text-xl"></i>
                <span>زمان باقی‌مانده</span>
              </div>
              <span :class="[
                'font-medium',
                getDaysRemaining(discount.expiryDate) <= 3 ? 'text-red-500' : 'text-green-600'
              ]">
                {{ getDaysRemaining(discount.expiryDate) }} روز
              </span>
            </div>

            <!-- Minimum Amount -->
            <div v-if="discount.minAmount" class="flex items-center justify-between py-3 border-b border-border">
              <div class="flex items-center gap-3 text-muted-foreground">
                <i class="ti ti-coins text-xl"></i>
                <span>حداقل مبلغ خرید</span>
              </div>
              <span class="text-foreground font-medium">{{ formatPrice(discount.minAmount) }} تومان</span>
            </div>

            <!-- Maximum Discount -->
            <div v-if="discount.maxDiscount" class="flex items-center justify-between py-3 border-b border-border">
              <div class="flex items-center gap-3 text-muted-foreground">
                <i class="ti ti-circle-dashed text-xl"></i>
                <span>حداکثر تخفیف</span>
              </div>
              <span class="text-foreground font-medium">{{ formatPrice(discount.maxDiscount) }} تومان</span>
            </div>

            <!-- Usage Limit -->
            <div v-if="discount.usageLimit" class="flex items-center justify-between py-3 border-b border-border">
              <div class="flex items-center gap-3 text-muted-foreground">
                <i class="ti ti-repeat text-xl"></i>
                <span>تعداد استفاده</span>
              </div>
              <span class="text-foreground font-medium">
                {{ discount.usageCount || 0 }} از {{ discount.usageLimit }}
              </span>
            </div>

            <!-- Type -->
            <div class="flex items-center justify-between py-3">
              <div class="flex items-center gap-3 text-muted-foreground">
                <i class="ti ti-tag text-xl"></i>
                <span>نوع تخفیف</span>
              </div>
              <span class="text-foreground font-medium">
                {{ discount.type === 'percentage' ? 'درصدی' : 'مبلغ ثابت' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Progress Bar for Active Discounts -->
        <div v-if="discount.status === 'active' && getDaysRemaining(discount.expiryDate) <= 7" class="bg-card border border-border rounded-2xl p-6">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-foreground">پیشرفت زمان</span>
            <span class="text-sm font-medium text-primary">
              {{ Math.round(getProgressPercentage(discount.expiryDate)) }}%
            </span>
          </div>
          <div class="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              class="bg-gradient-to-r from-primary to-primary/60 h-3 rounded-full transition-all duration-300"
              :style="{ width: `${getProgressPercentage(discount.expiryDate)}%` }"
            ></div>
          </div>
          <p class="text-xs text-muted-foreground mt-2 text-center">
            {{ getDaysRemaining(discount.expiryDate) }} روز تا انقضا
          </p>
        </div>

        <!-- Terms and Conditions -->
        <div v-if="discount.appliesTo && discount.appliesTo.length > 0" class="bg-card border border-border rounded-2xl p-6">
          <h3 class="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <i class="ti ti-list-check"></i>
            شرایط استفاده
          </h3>
          <ul class="space-y-2">
            <li 
              v-for="(item, index) in discount.appliesTo" 
              :key="index"
              class="flex items-start gap-3 text-sm text-muted-foreground"
            >
              <i class="ti ti-circle-check text-green-500 text-base mt-0.5 flex-shrink-0"></i>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="max-w-2xl mx-auto px-4 text-center py-12">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
          <i class="ti ti-alert-circle text-red-500 text-4xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-foreground mb-2">کد تخفیف یافت نشد</h3>
        <p class="text-muted-foreground mb-6">این کد تخفیف حذف شده یا وجود ندارد</p>
        <button
          @click="$router.back()"
          class="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          بازگشت به لیست تخفیف‌ها
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRewardStore } from '~/stores/reward'
import { useToast } from '~/composables/useToast'

const route = useRoute()
const router = useRouter()
const rewardStore = useRewardStore()
const toast = useToast()

const loading = ref(true)
const copied = ref(false)

const discount = computed(() => {
  const id = route.params.id as string
  // جستجو با ID یا code
  return rewardStore.rewards.find(r => {
    return String(r.id) === String(id) || r.code === id
  })
})

onMounted(async () => {
  try {
    if (rewardStore.rewards.length === 0) {
      await rewardStore.fetchRewards()
    }
  } catch (error) {
    console.error('Error loading discount:', error)
  } finally {
    loading.value = false
  }
})

const copyDiscountCode = async () => {
  if (!discount.value) return
  
  copied.value = true
  
  try {
    if (!navigator.clipboard) {
      const textArea = document.createElement('textarea')
      textArea.value = discount.value.code
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    } else {
      await navigator.clipboard.writeText(discount.value.code)
    }
    
    toast.success(`کد ${discount.value.code} کپی شد`)
    
    setTimeout(() => {
      copied.value = false
    }, 2000)
    
  } catch (error) {
    toast.error('امکان کپی کردن کد تخفیف وجود ندارد')
    copied.value = false
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

const getDaysRemaining = (expiryDate: string): number => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const timeDiff = expiry.getTime() - today.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

const getProgressPercentage = (expiryDate: string): number => {
  const totalDays = 30 // Assume 30 days total validity
  const daysRemaining = getDaysRemaining(expiryDate)
  if (daysRemaining <= 0) return 0
  return Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100))
}

const getDiscountStatusClass = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-500/10 text-green-600 border border-green-500/20'
    case 'expired':
      return 'bg-orange-500/10 text-orange-600 border border-orange-500/20'
    case 'used':
      return 'bg-gray-500/10 text-gray-600 border border-gray-500/20'
    default:
      return 'bg-gray-500/10 text-gray-600'
  }
}

const getDiscountStatusText = (status: string): string => {
  switch (status) {
    case 'active':
      return 'فعال'
    case 'expired':
      return 'منقضی شده'
    case 'used':
      return 'استفاده شده'
    default:
      return 'نامشخص'
  }
}
</script>
