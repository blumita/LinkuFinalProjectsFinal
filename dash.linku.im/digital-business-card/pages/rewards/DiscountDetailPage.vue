<template>
  <MobileLayout 
    page-title="جزئیات تخفیف" 
    :show-back-button="true" 
    :show-bottom-nav="false"
  >
    <!-- Discount Detail Content -->
    <div class="pt-[68px] pb-20">
      <!-- Loading State -->
      <div v-if="!isDataLoaded" class="space-y-6 animate-pulse p-6">
        <!-- Header Skeleton -->
        <div class="bg-muted p-6 rounded-2xl h-48"></div>
        <!-- Content Skeleton -->
        <div class="space-y-4">
          <div v-for="n in 3" :key="n" class="bg-card border border-border p-4 rounded-xl">
            <div class="h-4 w-full bg-muted rounded mb-2"></div>
            <div class="h-4 w-3/4 bg-muted-foreground/20 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Discount Details -->
      <div v-else-if="discount" class="space-y-6">
        <!-- Main Discount Banner -->
        <div class="relative mx-6 rounded-2xl overflow-hidden h-48">
          <!-- Background Image or Gradient -->
          <img 
            v-if="discount.banner || discount.image"
            :src="discount.banner || discount.image"
            :alt="discount.title"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div v-else class="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20">
          </div>
        </div>

        <!-- Discount Info -->
        <div class="px-6 text-center">
          <h1 class="text-2xl font-bold mb-3">{{ discount.title }}</h1>
          <div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-lg">
            <i class="ti ti-discount text-xl"></i>
            {{ discount.value }}{{ discount.type === 'percentage' ? '%' : ' ریال' }}
          </div>
        </div>

        <!-- Description -->
        <div class="px-6">
          <div class="bg-card border border-border rounded-xl p-4">
            <p class="text-muted-foreground leading-relaxed text-center">
              {{ discount.description }}
            </p>
          </div>
        </div>

        <!-- Status Badge -->
        <div class="px-6">
          <div class="flex justify-center">
            <span :class="[
              'inline-block text-sm px-4 py-2 rounded-full font-medium',
              discount.status === 'active' 
                ? 'bg-success/10 text-success' 
                : discount.status === 'expired'
                ? 'bg-warning/10 text-warning'
                : 'bg-muted text-muted-foreground'
            ]">
              {{ getDiscountStatusText(discount.status) }}
            </span>
          </div>
        </div>

      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-12 px-6">
        <i class="ti ti-discount-off text-muted-foreground text-6xl mb-4"></i>
        <h3 class="text-lg font-bold text-foreground mb-2">تخفیف یافت نشد</h3>
        <p class="text-muted-foreground mb-6">تخفیف مورد نظر شما یافت نشد یا حذف شده است</p>
        <button 
          @click="router.back()"
          class="bg-primary text-white px-6 py-2 rounded-xl"
        >
          بازگشت
        </button>
      </div>
    </div>

    <!-- Fixed Bottom Copy Button -->
    <div 
      v-if="discount && discount.status === 'active'" 
      class="fixed bottom-0 left-0 right-0 bg-card/98 backdrop-blur-md border-t border-border p-4 z-50 shadow-2xl"
    >
      <button 
        @click="copyDiscountCode"
        :disabled="copySuccess"
        :class="[
          'w-full py-4 px-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 text-lg shadow-lg',
          copySuccess 
            ? 'bg-success/90 text-white scale-95 ring-2 ring-success/50' 
            : 'bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-xl hover:scale-[1.02] active:scale-95'
        ]">
        <i 
          :class="copySuccess ? 'ti ti-check' : 'ti ti-copy'" 
          class="text-2xl transition-all duration-300"
          :style="{ transform: copySuccess ? 'scale(1.3) rotate(360deg)' : 'scale(1)' }"
        ></i>
        <span class="text-lg font-black tracking-wide">
          {{ copySuccess ? 'کپی شد!' : `کپی کد: ${discount.code}` }}
        </span>
      </button>
    </div>
  </MobileLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MobileLayout from '~/components/Mobile/layouts/MobileLayout.vue'
import { useToast } from '~/composables/useToast'

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
}

// Initialize
const router = useRouter()
const route = useRoute()
const { quickSuccess, error } = useToast()

// Data
const isDataLoaded = ref(true)
const copySuccess = ref(false)
const discount = ref<Discount | null>(null)

// Sample discounts data (در production از API می‌آید)
const discountsData: Discount[] = [
  {
    id: '1',
    title: 'تخفیف ویژه اشتراک پریمیوم',
    description: '20% تخفیف برای خرید اشتراک پریمیوم سالانه. این تخفیف ویژه فقط برای کاربران جدید لینکو طراحی شده و فرصت استثنایی برای بهره‌مندی از امکانات پیشرفته پلتفرم است.',
    code: 'PREMIUM20',
    value: 20,
    type: 'percentage',
    status: 'active',
    expiryDate: '2025-12-31',
    minAmount: 500000
  },
  {
    id: '2',
    title: 'تخفیف خرید محصولات لینکو',
    description: '50,000 ریال تخفیف برای خرید دستگاه‌های لینکو',
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

// Computed
const isExpired = computed(() => {
  if (!discount.value) return false
  return new Date(discount.value.expiryDate) < new Date()
})

// Methods
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' ریال'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR').format(date)
}

const getDiscountStatusClass = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-success/10 text-success'
    case 'expired':
      return 'bg-warning/10 text-warning'
    case 'used':
      return 'bg-muted text-muted-foreground'
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

const copyDiscountCode = async () => {
  if (!discount.value) return
  
  try {
    const code = discount.value.code
    
    // چک کردن clipboard API
    if (!navigator.clipboard) {
      // Fallback برای مرورگرهای قدیمی
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
    
    copySuccess.value = true
    quickSuccess('کپی شد!', `کد ${code} در کلیپ‌بورد شما کپی شد`)
    
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (error) {
    error('خطا در کپی ❌', 'امکان کپی کردن کد تخفیف وجود ندارد')
  }
}

const useDiscount = () => {
  // ریدایرکت به صفحه خرید یا فروشگاه
  alert('شما به صفحه فروشگاه هدایت خواهید شد')
  // router.push('/shop')
}

const shareDiscount = async () => {
  if (!discount.value) return
  
  const shareData = {
    title: discount.value.title,
    text: `${discount.value.description}\nکد تخفیف: ${discount.value.code}`,
    url: window.location.href
  }
  
  try {
    if (navigator.share) {
      await navigator.share(shareData)
      quickSuccess('اشتراک‌گذاری شد', 'اطلاعات تخفیف اشتراک‌گذاری شد')
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
      quickSuccess('کپی شد!', 'اطلاعات تخفیف کپی شد')
    }
  } catch (err) {
    error('خطا در اشتراک‌گذاری', 'امکان اشتراک‌گذاری اطلاعات وجود ندارد')
  }
}

// Lifecycle
onMounted(() => {
  const discountId = route.params.id as string
  
  // پیدا کردن تخفیف مورد نظر
  discount.value = discountsData.find(d => d.id === discountId) || null
  
  if (!discount.value) {
  }
})
</script>

<style scoped>
/* Text shadow for better readability on image */
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.drop-shadow-lg {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4));
}

/* Fade transition for copy success */
.bg-green-500\/30 {
  transition: all 0.3s ease;
}

/* Custom styles for discount detail */
.font-mono {
  font-family: 'Courier New', Courier, monospace;
}

/* Banner image optimization */
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Backdrop blur support */
@supports (backdrop-filter: blur(10px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
}

@supports not (backdrop-filter: blur(10px)) {
  .backdrop-blur-sm {
    background: rgba(255, 255, 255, 0.3);
  }
}
</style>