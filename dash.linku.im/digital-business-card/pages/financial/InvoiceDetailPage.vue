<template>
  <div class="min-h-screen bg-background">
    <!-- Mobile Page Header -->
    <MobilePageHeader 
      title="جزئیات فاکتور"
      home-route="/dashboard"
      :show-back="true"
      :show-home="true"
    />

    <!-- Invoice Detail Content -->
    <div class="pt-24 px-6 py-4">
      <!-- Loading State -->
      <div v-if="!isDataLoaded" class="space-y-6 animate-pulse">
        <!-- Invoice Header Card Skeleton -->
        <div class="bg-card border border-border/20 p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="h-6 w-40 bg-muted rounded mb-2"></div>
              <div class="h-5 w-20 bg-muted rounded-full"></div>
            </div>
            <div class="text-right">
              <div class="h-8 w-32 bg-muted rounded mb-1"></div>
              <div class="h-4 w-16 bg-muted-foreground/20 rounded"></div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-border/20">
            <div>
              <div class="h-4 w-16 bg-muted-foreground/20 rounded mb-1"></div>
              <div class="h-5 w-24 bg-muted rounded"></div>
            </div>
            <div>
              <div class="h-4 w-20 bg-muted-foreground/20 rounded mb-1"></div>
              <div class="h-5 w-24 bg-muted rounded"></div>
            </div>
          </div>
        </div>

        <!-- Customer Information Skeleton -->
        <div class="bg-card border border-border/20 p-6 rounded-2xl">
          <div class="h-6 w-28 bg-muted rounded mb-4"></div>
          <div class="space-y-3">
            <div v-for="n in 4" :key="n" class="flex justify-between">
              <div class="h-4 w-20 bg-muted-foreground/20 rounded"></div>
              <div class="h-4 w-24 bg-muted rounded"></div>
            </div>
          </div>
        </div>

        <!-- Items List Skeleton -->
        <div class="bg-card border border-border/20 p-6 rounded-2xl">
          <div class="h-6 w-24 bg-muted rounded mb-4"></div>
          <div class="space-y-4">
            <div v-for="n in 2" :key="n" class="flex justify-between items-center py-3 border-b border-border/20">
              <div>
                <div class="h-5 w-32 bg-muted rounded mb-1"></div>
                <div class="h-4 w-20 bg-muted-foreground/20 rounded"></div>
              </div>
              <div class="h-5 w-24 bg-muted rounded"></div>
            </div>
          </div>
          
          <div class="flex justify-between items-center pt-4 border-t border-border/20">
            <div class="h-6 w-16 bg-muted rounded"></div>
            <div class="h-6 w-28 bg-muted rounded"></div>
          </div>
        </div>

        <!-- Payment Information Skeleton -->
        <div class="bg-card border border-border/20 p-6 rounded-2xl">
          <div class="h-6 w-32 bg-muted rounded mb-4"></div>
          <div class="space-y-3">
            <div v-for="n in 3" :key="n" class="flex justify-between">
              <div class="h-4 w-24 bg-muted-foreground/20 rounded"></div>
              <div class="h-4 w-20 bg-muted rounded"></div>
            </div>
          </div>
        </div>

        <!-- Action Buttons Skeleton -->
        <div class="flex gap-3">
          <div class="flex-1 h-12 bg-muted rounded-xl"></div>
          <div class="flex-1 h-12 bg-muted rounded-xl"></div>
        </div>
      </div>

      <div v-else-if="invoice" class="space-y-6">
        <!-- Invoice Header Card -->
        <div class="bg-card border border-border/20 p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-bold text-foreground mb-1">فاکتور #{{ invoice.invoiceNumber }}</h2>
              <span :class="[
                'text-sm px-3 py-1 rounded-full',
                getStatusClass(invoice.status)
              ]">
                {{ getStatusText(invoice.status) }}
              </span>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-foreground">{{ formatPrice(invoice.amount) }}</p>
              <p class="text-sm text-muted-foreground">مبلغ کل</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-border/20">
            <div>
              <p class="text-sm text-muted-foreground mb-1">تاریخ صدور</p>
              <p class="font-medium">{{ invoice.issueDate }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-1">تاریخ سررسید</p>
              <p class="font-medium">{{ invoice.dueDate }}</p>
            </div>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="bg-card border border-border/20 p-6 rounded-2xl">
          <h3 class="text-lg font-semibold text-foreground mb-4">اطلاعات مشتری</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-muted-foreground">نام مشتری:</span>
              <span class="font-medium">کاربر لینکو</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">شماره کاربری:</span>
              <span class="font-medium">USER-2024</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">ایمیل:</span>
              <span class="font-medium">user@linku.im</span>
            </div>
          </div>
        </div>

        <!-- Invoice Items -->
        <div class="bg-card border border-border/20 p-6 rounded-2xl">
          <h3 class="text-lg font-semibold text-foreground mb-4">آیتم‌های فاکتور</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div class="flex-1">
                <h4 class="font-medium text-foreground">{{ invoice.description }}</h4>
                <p class="text-sm text-muted-foreground mt-1">مقدار: 1 عدد</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-foreground">{{ formatPrice(invoice.amount) }}</p>
              </div>
            </div>
          </div>
          
          <!-- Total -->
          <div class="mt-4 pt-4 border-t border-border/20">
            <div class="flex justify-between text-lg font-bold">
              <span>مجموع کل:</span>
              <span>{{ formatPrice(invoice.amount) }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Information -->
        <div class="bg-card border border-border/20 p-6 rounded-2xl">
          <h3 class="text-lg font-semibold text-foreground mb-4">اطلاعات پرداخت</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-muted-foreground">روش پرداخت:</span>
              <span class="font-medium">{{ invoice.paymentMethod }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">وضعیت پرداخت:</span>
              <span :class="getStatusClass(invoice.status)">{{ getStatusText(invoice.status) }}</span>
            </div>
            <div v-if="invoice.status === 'paid'" class="flex justify-between">
              <span class="text-muted-foreground">تاریخ پرداخت:</span>
              <span class="font-medium">{{ invoice.paymentDate || invoice.issueDate }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button 
            @click="downloadInvoice"
            class="w-full bg-muted text-muted-foreground py-3 px-4 rounded-xl font-medium hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
          >
            <i class="ti ti-download text-lg"></i>
            دانلود فاکتور (PDF)
          </button>
          
          <button 
            v-if="invoice.status === 'pending'"
            @click="payInvoice"
            class="w-full bg-green-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <i class="ti ti-credit-card text-lg"></i>
            پرداخت فاکتور
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MobilePageHeader from '~/components/shared/Header/MobilePageHeader.vue'
import { usePersianImage } from '~/composables/usePersianImage'

const route = useRoute()
const router = useRouter()
const { downloadInvoiceImage, formatPrice, getStatusText } = usePersianImage()

// Data
const isDataLoaded = ref(false)
const invoice = ref<any>(null)

// Sample invoice data (in real app, fetch from API using route.params.id)
const sampleInvoices = [
  {
    id: '1',
    invoiceNumber: '2024001',
    description: 'اشتراک پریمیوم - ماهانه',
    amount: 150000,
    issueDate: '1403/06/15',
    dueDate: '1403/06/25',
    status: 'paid',
    paymentMethod: 'کارت بانکی',
    paymentDate: '1403/06/16'
  },
  {
    id: '2',
    invoiceNumber: '2024002',
    description: 'خرید محصول فیزیکی - کارت هوشمند',
    amount: 250000,
    issueDate: '1403/06/10',
    dueDate: '1403/06/20',
    status: 'pending',
    paymentMethod: 'کیف پول'
  },
  {
    id: '3',
    invoiceNumber: '2024003',
    description: 'ارتقا اشتراک - سالانه',
    amount: 1200000,
    issueDate: '1403/05/20',
    dueDate: '1403/05/30',
    status: 'overdue',
    paymentMethod: 'کارت بانکی'
  },
  {
    id: '4',
    invoiceNumber: '2024004',
    description: 'تمدید اشتراک - 3 ماهه',
    amount: 450000,
    issueDate: '1403/05/15',
    dueDate: '1403/05/25',
    status: 'paid',
    paymentMethod: 'انتقال بانکی',
    paymentDate: '1403/05/16'
  }
]

const downloadInvoice = async () => {
  if (!invoice.value) return
  
  try {
    // Generate and download image
    await downloadInvoiceImage(invoice.value)
  } catch (error) {
    alert('خطا در دانلود فاکتور')
  }
}

const getStatusClass = (status: string): string => {
  const classes: { [key: string]: string } = {
    paid: 'bg-green-500/10 text-green-600',
    pending: 'bg-yellow-500/10 text-yellow-600',
    overdue: 'bg-red-500/10 text-red-600',
    cancelled: 'bg-gray-500/10 text-gray-600'
  }
  return classes[status] || 'bg-muted text-muted-foreground'
}

const payInvoice = () => {
  alert('هدایت به درگاه پرداخت...')
  // In real app, redirect to payment gateway
}

// Lifecycle
onMounted(async () => {
  const invoiceId = route.params.id as string
  isDataLoaded.value = false
  
  try {
    const { $axios } = useNuxtApp() as any
    const response = await $axios.get(`invoices/${invoiceId}`)
    
    if (response.data && response.data.data) {
      invoice.value = response.data.data
    } else {
      // Fallback to sample data if API fails
      invoice.value = sampleInvoices.find(inv => inv.id === invoiceId) || sampleInvoices[0]
    }
  } catch (error) {
    console.error('Error loading invoice:', error)
    // Use sample data as fallback
    invoice.value = sampleInvoices.find(inv => inv.id === invoiceId) || sampleInvoices[0]
  } finally {
    isDataLoaded.value = true
  }
})
</script>

<style scoped>
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
