<template>
  <div>
    <!-- Mobile Header -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-card border-b divide-border">
      <div class="flex items-center justify-between px-4 h-16">
        <button @click="navigateTo('/profile')" class="p-2 hover:bg-secondary rounded-lg transition-colors">
          <i class="ti ti-arrow-right text-primary text-xl"></i>
        </button>
        <h1 class="text-lg font-bold text-primary">تخفیفات و جوایز</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Rewards Content -->
    <div class="pt-[68px] pb-20">
      <!-- Loading State -->
      <div v-if="rewardStore.isLoading" class="space-y-6 animate-pulse px-6">
        <!-- Items Skeleton -->
        <div class="space-y-4">
          <div v-for="n in 4" :key="n" class="bg-card border border-border p-4 rounded-xl">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1 space-y-2">
                <div class="h-5 w-32 bg-muted rounded"></div>
                <div class="h-4 w-48 bg-muted-foreground/20 rounded"></div>
                <div class="h-4 w-20 bg-muted-foreground/20 rounded"></div>
              </div>
              <div class="w-16 h-16 bg-muted rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Discounts List -->
      <div v-else class="px-4">
        <div class="space-y-4">
          <div v-if="discounts.length === 0" class="bg-card border border-border p-8 rounded-xl text-center">
            <i class="ti ti-discount-off text-secondary text-4xl mb-4"></i>
            <h4 class="font-medium text-primary mb-2">هیچ تخفیفی یافت نشد</h4>
            <p class="text-sm text-secondary">در حال حاضر تخفیف فعالی ندارید</p>
          </div>
          
          <template v-else>
            <div 
              v-for="discount in discounts" 
              :key="discount.id"
              :class="[
                'bg-card border border-border p-4 rounded-xl transition-colors',
                discount.status === 'active' 
                  ? 'cursor-pointer hover:bg-muted/30' 
                  : 'opacity-60 cursor-not-allowed'
              ]"
              @click="discount.status === 'active' ? viewDiscountDetail(discount.id) : null"
            >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h4 class="font-medium text-primary">{{ discount.title }}</h4>
                  <span :class="[
                    'text-xs px-2 py-1 rounded-full',
                    getDiscountStatusClass(discount.status)
                  ]">
                    {{ getDiscountStatusText(discount.status) }}
                  </span>
                </div>
                <p class="text-sm text-secondary mb-3">{{ discount.description }}</p>
                
                <!-- Progress Bar برای تخفیفات فعال که زمان کمی مانده -->
                <div v-if="discount.status === 'active' && getDaysRemaining(discount.expiryDate) <= 7 && getDaysRemaining(discount.expiryDate) > 0" class="mb-3">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs text-secondary">زمان باقی‌مانده</span>
                    <span class="text-xs font-medium accent-text">
                      {{ getDaysRemaining(discount.expiryDate) }} روز
                    </span>
                  </div>
                  <div class="w-full bg-secondary rounded-full h-2">
                    <div 
                      class="accent-bg h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${getProgressPercentage(discount.expiryDate)}%` }"
                    ></div>
                  </div>
                </div>
                
                <div class="flex items-center gap-4 text-xs text-secondary">
                  <span class="flex items-center gap-1">
                    <i class="ti ti-percentage"></i>
                    {{ discount.value }}{{ discount.type === 'percentage' ? '%' : ' ریال' }}
                  </span>
                  <span class="flex items-center gap-1">
                    <i class="ti ti-calendar"></i>
                    {{ formatDate(discount.expiryDate) }}
                  </span>
                </div>
              </div>
              <div class="w-16 h-16 rounded-xl flex items-center justify-center border border-border overflow-hidden flex-shrink-0">
                <img 
                  v-if="discount.banner || discount.image" 
                  :src="discount.banner || discount.image" 
                  :alt="discount.title"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-secondary flex items-center justify-center">
                  <i class="ti ti-discount accent-text text-2xl"></i>
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-between pt-3 border-t divide-border">
              <!-- کپی کد -->
              <div class="flex-1">
                <button 
                  v-if="discount.status === 'active'"
                  @click.stop="copyDiscountCode(discount.code)"
                  :disabled="copyingCode === discount.code"
                  :class="[
                    'w-full flex items-center justify-center gap-2 text-sm py-2.5 px-4 rounded-lg font-medium transition-all',
                    copyingCode === discount.code
                      ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                      : 'accent-bg accent-text hover:opacity-90 border border-border'
                  ]"
                >
                  <i 
                    :class="copyingCode === discount.code ? 'ti ti-check' : 'ti ti-copy'" 
                    class="text-base"
                  ></i>
                  <span v-if="copyingCode === discount.code">
                    کپی شد!
                  </span>
                  <span v-else>
                    کپی کد: {{ discount.code }}
                  </span>
                </button>
                
                <div 
                  v-else
                  class="flex items-center justify-center gap-2 text-sm py-2.5 px-4 rounded-lg bg-secondary text-secondary"
                >
                  <i class="ti ti-copy text-base opacity-50"></i>
                  <span class="opacity-50">{{ discount.code }}</span>
                </div>
              </div>
              
              <!-- دکمه جزئیات -->
              <div class="mr-3">
                <button 
                  v-if="discount.status === 'active'"
                  @click.stop="viewDiscountDetail(discount.id)"
                  class="text-sm accent-text hover:opacity-80 transition-colors flex items-center gap-1 px-2"
                >
                  جزئیات
                  <i class="ti ti-chevron-left text-xs"></i>
                </button>
                <span 
                  v-else
                  class="text-sm text-secondary opacity-50 px-2"
                >
                  {{ discount.status === 'expired' ? 'منقضی' : 'استفاده شده' }}
                </span>
              </div>
            </div>
          </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRewardStore } from '~/stores/reward'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'default',
  middleware: 'require-activated'
})

// Initialize
const rewardStore = useRewardStore()
const toast = useToast()
const copyingCode = ref<string | null>(null)

// Computed
const discounts = computed(() => rewardStore.rewards)

// Methods

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR').format(date)
}

const getDaysRemaining = (expiryDate: string): number => {
  const today = new Date('2025-09-24') // تاریخ فعلی
  const expiry = new Date(expiryDate)
  const timeDiff = expiry.getTime() - today.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

const getProgressPercentage = (expiryDate: string): number => {
  const totalDays = 30 // فرض کنیم کل مدت 30 روز بوده
  const daysRemaining = getDaysRemaining(expiryDate)
  if (daysRemaining <= 0) return 0
  return Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100))
}

const getDiscountStatusClass = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-success/10 text-success border border-success/20'
    case 'expired':
      return 'bg-warning/10 text-warning border border-warning/20'
    case 'used':
      return 'bg-muted text-muted-foreground border border-muted'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

const getDiscountStatusText = (status: string): string => {
  switch (status) {
    case 'active':
      return 'فعال'
    case 'expired':
      return 'منقضی'
    case 'used':
      return 'استفاده شده'
    default:
      return 'نامشخص'
  }
}

const copyDiscountCode = async (code: string) => {
  copyingCode.value = code
  
  try {
    if (!navigator.clipboard) {
      const textArea = document.createElement('textarea')
      textArea.value = code
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    } else {
      await navigator.clipboard.writeText(code)
    }
    
    toast.success(`کد ${code} کپی شد`)
    
    setTimeout(() => {
      copyingCode.value = null
    }, 1500)
    
  } catch (error) {
    toast.error('امکان کپی کردن کد تخفیف وجود ندارد')
    copyingCode.value = null
  }
}

const viewDiscountDetail = (discountId: string) => {
  navigateTo(`/rewards/discount/${discountId}`)
}

// Lifecycle
onMounted(async () => {
  await rewardStore.fetchRewards()
})
</script>

<style scoped>
/* Custom styles for rewards page */
.rewards-card {
  transition: all 0.2s ease-in-out;
}

.rewards-card:hover {
  transform: translateY(-1px);
}
</style>