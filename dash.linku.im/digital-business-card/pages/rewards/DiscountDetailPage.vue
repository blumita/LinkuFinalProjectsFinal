<template>
  <MobileLayout 
    page-title="جزئیات تخفیف" 
    :show-back-button="true" 
    :show-bottom-nav="false"
  >
    <!-- Discount Detail Content -->
    <div class="pt-[68px] pb-28 bg-background min-h-screen">
      <!-- Loading State -->
      <div v-if="!isDataLoaded" class="space-y-4 animate-pulse p-4">
        <div class="bg-muted rounded-2xl h-56"></div>
        <div class="space-y-3">
          <div v-for="n in 2" :key="n" class="bg-card border border-border rounded-xl p-4">
            <div class="h-4 w-full bg-muted rounded mb-2"></div>
            <div class="h-4 w-3/4 bg-muted rounded"></div>
          </div>
        </div>
      </div>

      <!-- Discount Details -->
      <div v-else-if="discount" class="space-y-4 p-4">
        <!-- Discount Card with Image/Gradient -->
        <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <!-- Image/Gradient Header -->
          <div class="relative h-48">
            <img 
              v-if="discount.banner || discount.image"
              :src="discount.banner || discount.image"
              :alt="discount.title"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div v-else class="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/40"></div>
            
            <!-- Overlay with Discount Value -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4">
              <div class="flex items-end justify-between">
                <div class="flex-1">
                  <h1 class="text-white text-2xl font-bold drop-shadow-lg mb-2">{{ discount.title }}</h1>
                  <div class="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm text-primary px-4 py-2 rounded-full font-bold text-xl shadow-lg">
                    <i class="ti ti-discount-2 text-2xl"></i>
                    <span>{{ discount.value }}{{ discount.type === 'percentage' ? '%' : ' تومان' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Status Badge -->
            <div class="absolute top-4 left-4">
              <span :class="[
                'inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium shadow-lg backdrop-blur-sm',
                discount.status === 'active' 
                  ? 'bg-success/90 text-white' 
                  : discount.status === 'expired'
                  ? 'bg-warning/90 text-white'
                  : 'bg-muted/90 text-foreground'
              ]">
                <i :class="[
                  'ti text-sm',
                  discount.status === 'active' ? 'ti-circle-check-filled' : 'ti-circle-x-filled'
                ]"></i>
                {{ getDiscountStatusText(discount.status) }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div class="p-4">
            <div class="flex items-start gap-3">
              <i class="ti ti-info-circle text-primary text-xl mt-0.5 flex-shrink-0"></i>
              <p class="text-muted-foreground leading-relaxed text-sm">
                {{ discount.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Discount Code Display -->
        <div class="bg-card rounded-2xl shadow-sm border border-border p-4">
          <div class="flex items-center justify-between gap-4">
            <div class="flex-1">
              <div class="text-xs text-muted-foreground mb-1 font-medium">کد تخفیف</div>
              <div class="text-2xl font-black text-primary tracking-wider font-mono">
                {{ discount.code }}
              </div>
            </div>
            <button
              @click="copyDiscountCode"
              :disabled="copySuccess"
              :class="[
                'flex items-center justify-center w-12 h-12 rounded-xl transition-all',
                copySuccess 
                  ? 'bg-success text-white scale-95' 
                  : 'bg-primary/10 text-primary hover:bg-primary/20 active:scale-95'
              ]"
            >
              <i 
                :class="copySuccess ? 'ti ti-check' : 'ti ti-copy'" 
                class="text-2xl transition-transform duration-300"
                :style="{ transform: copySuccess ? 'rotate(360deg)' : 'rotate(0)' }"
              ></i>
            </button>
          </div>
        </div>

        <!-- Expiry Info -->
        <div v-if="discount.expiryDate" class="bg-card rounded-2xl shadow-sm border border-border p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
              <i class="ti ti-clock text-warning text-xl"></i>
            </div>
            <div class="flex-1">
              <div class="text-xs text-muted-foreground mb-0.5">تاریخ انقضا</div>
              <div class="text-sm font-semibold text-foreground">{{ formatDate(discount.expiryDate) }}</div>
            </div>
          </div>
        </div>

        <!-- Min Amount Info -->
        <div v-if="discount.minAmount" class="bg-card rounded-2xl shadow-sm border border-border p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <i class="ti ti-shopping-cart text-primary text-xl"></i>
            </div>
            <div class="flex-1">
              <div class="text-xs text-muted-foreground mb-0.5">حداقل خرید</div>
              <div class="text-sm font-semibold text-foreground">{{ formatPrice(discount.minAmount) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="flex flex-col items-center justify-center text-center py-20 px-6">
        <div class="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <i class="ti ti-discount-off text-muted-foreground text-4xl"></i>
        </div>
        <h3 class="text-xl font-bold text-foreground mb-2">تخفیف یافت نشد</h3>
        <p class="text-muted-foreground mb-6 text-sm max-w-xs">کد تخفیف مورد نظر یافت نشد یا منقضی شده است</p>
        <button 
          @click="goBack()"
          class="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          بازگشت
        </button>
      </div>
    </div>

    <!-- Fixed Bottom Button -->
    <div 
      v-if="discount && discount.status === 'active'" 
      class="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 z-50 shadow-2xl"
    >
      <button 
        @click="copyDiscountCode"
        :disabled="copySuccess"
        :class="[
          'w-full py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg',
          copySuccess 
            ? 'bg-success text-white scale-95' 
            : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
        ]"
      >
        <i 
          :class="copySuccess ? 'ti ti-check' : 'ti ti-copy'" 
          class="text-xl transition-all duration-300"
          :style="{ transform: copySuccess ? 'scale(1.2) rotate(360deg)' : 'scale(1)' }"
        ></i>
        <span class="text-base font-bold">
          {{ copySuccess ? 'کپی شد!' : 'استفاده از کد تخفیف' }}
        </span>
      </button>
    </div>
  </MobileLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MobileLayout from '~/components/Mobile/layouts/MobileLayout.vue'
import { useToast } from '../../composables/useToast'
import { useSafeNavigation } from '../../composables/useSafeNavigation'

// Types
interface Discount {
  id: string
  title: string
  description: string
  code: string
  value: number
  type: 'percentage' | 'fixed'
  status: 'active' | 'expired' | 'used'
  expiryDate: string
  minAmount?: number
  banner?: string
  image?: string
}

// Initialize
const router = useRouter()
const route = useRoute()
const toast = useToast()
const { success, error } = toast
const { goBack } = useSafeNavigation()

// Data
const isDataLoaded = ref(true)
const copySuccess = ref(false)
const discount = ref<Discount | null>(null)

// Sample discounts data (در production از API می‌آید)
const discountsData: Discount[] = [
  {
    id: '1',
    title: 'تخفیف ویژه پریمیوم',
    description: '20% تخفیف برای خرید اشتراک پریمیوم سالانه',
    code: 'PREMIUM20',
    value: 20,
    type: 'percentage',
    status: 'active',
    expiryDate: '2025-12-31',
    minAmount: 500000
  },
  {
    id: '2',
    title: 'تخفیف محصولات لینکو',
    description: '50,000 تومان تخفیف برای خرید دستگاه‌های لینکو',
    code: 'LINKU50K',
    value: 50000,
    type: 'fixed',
    status: 'active',
    expiryDate: '2025-11-30',
    minAmount: 200000
  },
  {
    id: '3',
    title: 'تخفیف مشتری جدید',
    description: '15% تخفیف برای اولین خرید',
    code: 'WELCOME15',
    value: 15,
    type: 'percentage',
    status: 'used',
    expiryDate: '2025-10-15'
  }
]

// Methods
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR').format(date)
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

const copyDiscountCode = async () => {
  if (!discount.value || copySuccess.value) return
  
  try {
    const code = discount.value.code
    
    if (!navigator.clipboard) {
      const textArea = document.createElement('textarea')
      textArea.value = code
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    } else {
      await navigator.clipboard.writeText(code)
    }
    
    copySuccess.value = true
    success('کد کپی شد!', `کد ${code} در کلیپ‌بورد شما ذخیره شد`)
    
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    error('خطا در کپی', 'امکان کپی کردن کد تخفیف وجود ندارد')
  }
}

// Lifecycle
onMounted(() => {
  const discountId = route.params.id as string
  discount.value = discountsData.find(d => d.id === discountId) || null
})
</script>

<style scoped>
/* Smooth transitions */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Image optimization */
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Drop shadow for text on images */
.drop-shadow-lg {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

/* Backdrop blur fallback */
@supports (backdrop-filter: blur(10px)) {
  .backdrop-blur-lg {
    backdrop-filter: blur(16px);
  }
}

@supports not (backdrop-filter: blur(10px)) {
  .backdrop-blur-lg {
    background-color: rgba(var(--background), 0.95);
  }
}
</style>
