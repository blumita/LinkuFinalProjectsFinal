<template>
  <div class="min-h-screen bg-background">
    <!-- Mobile Header -->
    <div class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div class="flex items-center justify-between px-4 h-16">
        <button @click="navigateTo('/profile')" class="p-2 hover:bg-muted rounded-lg transition-colors">
          <i class="ti ti-arrow-right text-foreground text-xl"></i>
        </button>
        <h1 class="text-lg font-bold text-foreground">تخفیفات و جوایز</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Desktop Header -->
    <div class="hidden lg:block bg-card border-b border-border sticky top-0 z-40">
      <div class="px-4 lg:px-6 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-foreground mb-1">تخفیفات و جوایز</h1>
            <p class="text-sm text-muted-foreground">مدیریت کدهای تخفیف خود</p>
          </div>
          <div class="flex items-center gap-3">
            <div v-if="!rewardStore.isLoading" class="flex items-center gap-6 px-6 py-3 bg-muted rounded-xl">
              <div class="text-center">
                <p class="text-xs text-muted-foreground mb-1">فعال</p>
                <p class="text-lg font-bold text-foreground">{{ activeCount }}</p>
              </div>
              <div class="w-px h-8 bg-border"></div>
              <div class="text-center">
                <p class="text-xs text-muted-foreground mb-1">استفاده شده</p>
                <p class="text-lg font-bold text-foreground">{{ usedCount }}</p>
              </div>
              <div class="w-px h-8 bg-border"></div>
              <div class="text-center">
                <p class="text-xs text-muted-foreground mb-1">منقضی</p>
                <p class="text-lg font-bold text-foreground">{{ expiredCount }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rewards Content -->
    <div class="lg:pt-0 pt-20 pb-24 lg:pb-8">
      <div class="px-4 lg:px-6 py-6">
        <!-- Loading State -->
        <div v-if="rewardStore.isLoading" class="space-y-6 animate-pulse">
        <!-- Summary Card Skeleton -->
        <div class="bg-muted rounded-2xl p-6 h-32"></div>
        
        <!-- Items Skeleton -->
        <div class="space-y-4">
          <div v-for="n in 4" :key="n" class="bg-card border border-border p-4 rounded-xl h-32"></div>
        </div>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Filters -->
        <div class="mb-6">
          <div class="flex items-center gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:justify-start">
            <button
              v-for="filter in filters"
              :key="filter.value"
              @click="selectedFilter = filter.value"
              :class="[
                'flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                selectedFilter === filter.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              ]"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <!-- Discounts List -->
        <div class="space-y-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:space-y-0">
          <div v-if="filteredDiscounts.length === 0" class="bg-card border border-border p-8 rounded-xl text-center">
            <i class="ti ti-discount-off text-muted-foreground text-4xl mb-4"></i>
            <h4 class="font-medium text-foreground mb-2">هیچ تخفیفی یافت نشد</h4>
            <p class="text-sm text-muted-foreground">در این دسته تخفیفی موجود نیست</p>
          </div>
          
          <div 
            v-else
            v-for="discount in filteredDiscounts" 
            :key="discount.id"
            :class="[
              'bg-card border border-border p-5 lg:p-6 rounded-xl transition-all flex flex-col',
              discount.status === 'active' 
                ? 'cursor-pointer hover:shadow-lg hover:border-primary/30' 
                : 'opacity-60'
            ]"
            @click="discount.status === 'active' ? viewDiscountDetail(discount.id) : null"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2 flex-wrap">
                  <h4 class="font-medium text-foreground lg:text-base">{{ discount.title }}</h4>
                  <span :class="[
                    'text-xs px-2.5 py-1 rounded-full font-medium',
                    getDiscountStatusClass(discount.status)
                  ]">
                    {{ getDiscountStatusText(discount.status) }}
                  </span>
                </div>
                <p class="text-sm text-muted-foreground mb-4 line-clamp-2">{{ discount.description }}</p>
                
                <!-- Progress Bar -->
                <div v-if="discount.status === 'active' && getDaysRemaining(discount.expiryDate) <= 7 && getDaysRemaining(discount.expiryDate) > 0" class="mb-4">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs text-muted-foreground">زمان باقی‌مانده</span>
                    <span class="text-xs font-medium text-primary">
                      {{ getDaysRemaining(discount.expiryDate) }} روز
                    </span>
                  </div>
                  <div class="w-full bg-muted rounded-full h-2">
                    <div 
                      class="bg-primary h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${getProgressPercentage(discount.expiryDate)}%` }"
                    ></div>
                  </div>
                </div>
                
                <div class="flex items-center gap-4 text-xs text-muted-foreground mb-4 lg:mb-0">
                  <span class="flex items-center gap-1.5">
                    <i class="ti ti-percentage"></i>
                    {{ discount.value }}{{ discount.type === 'percentage' ? '%' : ' ریال' }}
                  </span>
                  <span class="flex items-center gap-1.5">
                    <i class="ti ti-calendar"></i>
                    {{ formatDate(discount.expiryDate) }}
                  </span>
                </div>
              </div>
              <div class="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center border border-primary/20">
                <i class="ti ti-discount text-primary text-2xl lg:text-3xl"></i>
              </div>
            </div>
            
            <div class="pt-3 mt-auto border-t border-border">
              <button 
                v-if="discount.status === 'active'"
                @click.stop="copyDiscountCode(discount.code)"
                :disabled="copyingCode === discount.code"
                :class="[
                  'w-full flex items-center justify-center gap-2 text-sm py-2.5 px-4 rounded-lg font-medium transition-all',
                  copyingCode === discount.code
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                    : 'bg-primary text-primary-foreground hover:opacity-90 hover:shadow-md'
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
                  <span class="font-mono">{{ discount.code }}</span>
                  <span class="mr-1">کپی کد</span>
                </span>
              </button>
              
              <div 
                v-else
                class="flex items-center justify-center gap-2 text-sm py-2.5 px-4 rounded-lg bg-muted text-muted-foreground"
              >
                <i class="ti ti-copy text-base opacity-50"></i>
                <span class="opacity-50 font-mono">{{ discount.code }}</span>
                <span class="mr-2 text-xs">
                  {{ discount.status === 'expired' ? '(منقضی)' : '(استفاده شده)' }}
                </span>
              </div>
            </div>
          </div>
        </div>
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

const rewardStore = useRewardStore()
const toast = useToast()
const copyingCode = ref<string | null>(null)
const selectedFilter = ref('all')

const filters = [
  { label: 'همه', value: 'all' },
  { label: 'فعال', value: 'active' },
  { label: 'استفاده شده', value: 'used' },
  { label: 'منقضی', value: 'expired' }
]

// Computed
const filteredDiscounts = computed(() => {
  if (selectedFilter.value === 'all') {
    return rewardStore.rewards
  }
  return rewardStore.rewards.filter(r => r.status === selectedFilter.value)
})

const activeCount = computed(() => rewardStore.activeRewards.length)
const usedCount = computed(() => rewardStore.usedRewards.length)
const expiredCount = computed(() => rewardStore.expiredRewards.length)

// Methods
const formatDate = (dateString: string): string => {
  if (!dateString) return 'نامشخص'
  
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return 'نامشخص'
  }
  
  return new Intl.DateTimeFormat('fa-IR').format(date)
}

const getDaysRemaining = (expiryDate: string): number => {
  if (!expiryDate) return 0
  
  const today = new Date()
  const expiry = new Date(expiryDate)
  
  if (isNaN(expiry.getTime())) {
    return 0
  }
  
  const timeDiff = expiry.getTime() - today.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

const getProgressPercentage = (expiryDate: string): number => {
  const totalDays = 30
  const daysRemaining = getDaysRemaining(expiryDate)
  if (daysRemaining <= 0) return 0
  return Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100))
}

const getDiscountStatusClass = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-500/10 text-green-500'
    case 'expired':
      return 'bg-red-500/10 text-red-500'
    case 'used':
      return 'bg-gray-500/10 text-gray-500'
    default:
      return 'bg-secondary text-secondary'
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

onMounted(async () => {
  await rewardStore.fetchRewards()
})
</script>
