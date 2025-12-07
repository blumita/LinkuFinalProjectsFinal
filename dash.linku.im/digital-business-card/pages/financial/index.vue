<template>
  <ClientOnly>
    <div class="min-h-screen bg-background">
      <!-- Mobile Page Header -->
      <div 
        class="fixed top-0 left-0 right-0 w-full bg-background/95 backdrop-blur-lg border-b border-border z-50"
        style="position: fixed !important; top: 0px !important; left: 0px !important; right: 0px !important; z-index: 50 !important; width: 100% !important;"
      >
        <div 
          class="flex items-center justify-between px-4 py-3" 
          style="pointer-events: auto !important;"
        >
          <!-- Back Button -->
          <button
            @click="goBack"
            class="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
            style="pointer-events: auto !important; position: relative !important;"
          >
            <i class="ti ti-arrow-right text-foreground text-lg"></i>
          </button>
          
          <!-- Page Title -->
          <h1 
            class="text-lg font-semibold text-foreground" 
            style="pointer-events: auto !important;"
          >
            تاریخچه پرداخت‌ها
          </h1>
          
          <!-- Right Action Button -->
          <div 
            class="w-10 h-10 flex items-center justify-center" 
            style="pointer-events: auto !important;"
          >
            <!-- Default empty space -->
          </div>
        </div>
      </div>

      <!-- Payment History Content -->
      <div class="pt-[60px] px-4 py-3">
        <!-- Summary Card -->
        <div v-if="!loading && transactions.length > 0" class="mb-6">
          <div class="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold">خلاصه پرداخت‌ها</h3>
              <i class="ti ti-chart-line text-2xl"></i>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm opacity-80 mb-1">کل پرداخت‌ها</p>
                <p class="text-xl font-bold">{{ formatPrice(totalPayments) }} تومان</p>
              </div>
              <div>
                <p class="text-sm opacity-80 mb-1">این ماه</p>
                <p class="text-xl font-bold">{{ formatPrice(monthlyTotal) }} تومان</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div v-if="!loading && transactions.length > 0" class="mb-6">
          <div class="flex items-center gap-3 overflow-x-auto pb-2">
            <button 
              @click="selectedFilter = 'all'"
              :class="selectedFilter === 'all' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'"
              class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              همه
            </button>
            <button 
              @click="selectedFilter = 'thisMonth'"
              :class="selectedFilter === 'thisMonth' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'"
              class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              این ماه
            </button>
            <button 
              @click="selectedFilter = 'lastMonth'"
              :class="selectedFilter === 'lastMonth' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'"
              class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              ماه گذشته
            </button>
            <button 
              @click="selectedFilter = 'lastThreeMonths'"
              :class="selectedFilter === 'lastThreeMonths' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'"
              class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              سه ماه اخیر
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="space-y-4">
          <!-- Date Group Skeleton -->
          <div v-for="i in 3" :key="i" class="space-y-3">
            <!-- Date Header Skeleton -->
            <div class="h-5 bg-muted rounded w-24 px-2 animate-pulse"></div>
            
            <!-- Transaction Items Skeleton -->
            <div class="space-y-3">
              <div v-for="j in 2" :key="j" class="bg-card border border-border/20 p-4 rounded-xl animate-pulse">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3 flex-1">
                    <!-- Icon Skeleton -->
                    <div class="w-12 h-12 bg-muted rounded-xl"></div>
                    
                    <!-- Details Skeleton -->
                    <div class="flex-1 space-y-2">
                      <div class="h-4 bg-muted rounded w-36"></div>
                      <div class="h-3 bg-muted rounded w-28"></div>
                    </div>
                  </div>
                  
                  <!-- Amount Skeleton -->
                  <div class="text-left">
                    <div class="h-6 bg-muted rounded w-24"></div>
                  </div>
                </div>
                
                <!-- Footer Skeleton -->
                <div class="flex items-center justify-between pt-3 border-t border-border/20">
                  <div class="flex items-center gap-4">
                    <div class="h-3 bg-muted rounded w-16"></div>
                    <div class="h-3 bg-muted rounded w-20"></div>
                    <div class="h-3 bg-muted rounded w-24"></div>
                  </div>
                  <div class="h-3 bg-muted rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payments List -->
        <div v-if="!loading && filteredTransactions.length > 0" class="space-y-4">
          <!-- Date Group -->
          <div
            v-for="(group, date) in groupedTransactions"
            :key="date"
            class="space-y-3"
          >
            <h4 class="text-sm font-medium text-muted-foreground px-2">{{ date }}</h4>
            
            <!-- Payment Items -->
            <div class="space-y-3">
              <div
                v-for="transaction in group"
                :key="transaction.id"
                class="bg-card border border-border/20 p-4 rounded-xl hover:bg-card/80 transition-colors"
              >
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3 flex-1">
                    <!-- Payment Icon -->
                    <div 
                      class="w-12 h-12 rounded-xl flex items-center justify-center"
                      :class="isSuccess(transaction.status) ? 'bg-green-500/10' : 'bg-red-500/10'"
                    >
                      <i 
                        class="text-xl"
                        :class="isSuccess(transaction.status) ? 'ti ti-check text-green-500' : 'ti ti-x text-red-500'"
                      ></i>
                    </div>
                    
                    <!-- Payment Details -->
                    <div class="flex-1">
                      <h5 class="font-medium text-foreground mb-1">پرداخت اشتراک پریمیوم</h5>
                      <p class="text-sm text-muted-foreground">{{ formatPlanDescription(transaction) }}</p>
                    </div>
                  </div>
                  
                  <!-- Amount -->
                  <div class="text-left">
                    <p class="font-bold text-lg text-foreground">{{ formatPrice(transaction.amount) }} تومان</p>
                  </div>
                </div>
                
                <div class="flex items-center justify-between pt-3 border-t border-border/20">
                  <div class="flex items-center gap-4 text-xs text-muted-foreground">
                    <span v-if="transaction.time">{{ transaction.time }}</span>
                    <span>{{ formatGatewayName(transaction.paymentMethod || transaction.method || transaction.gateway) }}</span>
                    <span v-if="transaction.referenceId || transaction.ref || transaction.tracking_code">شناسه: {{ transaction.referenceId || transaction.ref || transaction.tracking_code }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <button 
                      @click="downloadReceipt(transaction)"
                      class="flex items-center gap-1 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
                      title="دانلود رسید"
                    >
                      <i class="ti ti-download text-base"></i>
                      <span>دانلود رسید</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredTransactions.length === 0" class="text-center py-12">
          <div class="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <i class="ti ti-wallet text-primary text-2xl opacity-50"></i>
          </div>
          <h3 class="text-foreground font-medium mb-2">هیچ تراکنشی یافت نشد</h3>
          <p class="text-muted-foreground text-sm">تاکنون تراکنش مالی ثبت نشده است</p>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNuxtApp } from 'nuxt/app'
import type { AxiosInstance } from 'axios'
import { useSafeNavigation } from '~/composables/useSafeNavigation'

definePageMeta({
  middleware: 'require-activated',
  layout: 'default',
  ssr: false
})

interface Transaction {
  id: number | string
  amount: number
  title?: string
  description?: string
  status?: string
  date?: string
  createdAt?: string
  created_at?: string
  time?: string
  paymentMethod?: string
  method?: string
  gateway?: string
  referenceId?: string
  ref?: string
  tracking_code?: string
  plan?: string
  planTitle?: string
  planDuration?: string
  transactionId?: string
  discount?: number
  discountAmount?: number
  originalAmount?: number
  startDate?: string
  endDate?: string
}

const { $axios, $pwa } = useNuxtApp()
const { goBack } = useSafeNavigation()
const loading = ref(true)
const transactions = ref<Transaction[]>([])
const selectedFilter = ref('all')

// فیلتر تراکنش‌ها بر اساس فیلتر انتخابی
const filteredTransactions = computed(() => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  if (selectedFilter.value === 'all') {
    return transactions.value
  }
  
  return transactions.value.filter(t => {
    const dateStr = t.createdAt || t.created_at || t.date
    if (!dateStr) return false
    
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return false
    
    const transactionMonth = date.getMonth()
    const transactionYear = date.getFullYear()
    
    if (selectedFilter.value === 'thisMonth') {
      return transactionMonth === currentMonth && transactionYear === currentYear
    } else if (selectedFilter.value === 'lastMonth') {
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
      return transactionMonth === lastMonth && transactionYear === lastMonthYear
    } else if (selectedFilter.value === 'lastThreeMonths') {
      const threeMonthsAgo = new Date(now)
      threeMonthsAgo.setMonth(currentMonth - 3)
      return date >= threeMonthsAgo
    }
    
    return true
  })
})

// گروه‌بندی تراکنش‌ها براساس تاریخ
const groupedTransactions = computed(() => {
  const groupMap: { [key: string]: Transaction[] } = {}
  
  // ابتدا گروه‌بندی می‌کنیم
  filteredTransactions.value.forEach(transaction => {
    const date = formatPersianDate(transaction.createdAt || transaction.created_at || transaction.date)
    if (!groupMap[date]) {
      groupMap[date] = []
    }
    groupMap[date].push(transaction)
  })
  
  return groupMap
})

// محاسبه مجموع این ماه
const monthlyTotal = computed(() => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  return transactions.value
    .filter(t => {
      if (!isSuccess(t.status)) return false
      
      const dateStr = t.createdAt || t.created_at || t.date
      if (!dateStr) return false
      
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return false
      
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })
    .reduce((sum, t) => sum + (t.amount || 0), 0)
})

// تابع برای ساخت توضیحات پلن
const formatPlanDescription = (transaction: Transaction): string => {
  const planTitle = transaction.planTitle || transaction.plan || ''
  
  // تشخیص اینکه خرید است یا تمدید (اگر startDate وجود داشت احتمالا تمدید است)
  const actionType = transaction.startDate ? 'تمدید' : 'خرید'
  
  // نرمال‌سازی متن پلن
  let normalizedPlan = planTitle.trim()
  
  // اگر شامل "ماه" یا "ماهه" باشد
  if (normalizedPlan.match(/(\d+)\s*(ماه|ماهه)/)) {
    // استخراج عدد ماه
    const match = normalizedPlan.match(/(\d+)\s*(ماه|ماهه)/)
    if (match) {
      const monthCount = match[1]
      if (monthCount === '۱' || monthCount === '1') {
        return `${actionType} اشتراک ماهانه`
      } else {
        return `${actionType} اشتراک ${monthCount} ماهه`
      }
    }
  }
  
  // اگر فقط عدد و "ماهه" داشت (مثل "6 ماهه")
  if (normalizedPlan.includes('ماهه')) {
    if (normalizedPlan.includes('۱') || normalizedPlan.includes('1') || normalizedPlan === 'ماهه') {
      return `${actionType} اشتراک ماهانه`
    }
    return `${actionType} اشتراک ${normalizedPlan}`
  }
  
  // اگر planDuration وجود داشت
  if (transaction.planDuration) {
    const duration = transaction.planDuration
    if (duration.includes('۱') || duration.includes('1') || duration.includes('یک')) {
      return `${actionType} اشتراک ماهانه`
    }
    return `${actionType} اشتراک ${duration}`
  }
  
  // اگر planTitle وجود داشت اما شناسایی نشد
  if (planTitle) {
    return `${actionType} اشتراک ${planTitle}`
  }
  
  return `${actionType} اشتراک ماهانه`
}

// تبدیل نام درگاه به فارسی
const formatGatewayName = (gateway: any): string => {
  if (!gateway) return '-'
  
  const gatewayStr = gateway.toString().toLowerCase()
  const gatewayMap: { [key: string]: string } = {
    'zarinpal': 'زرین‌پال',
    'zarrin pal': 'زرین‌پال',
    'zarrinpal': 'زرین‌پال',
    'idpay': 'آیدی‌پی',
    'mellat': 'بانک ملت',
    'parsian': 'بانک پاسارگاد',
    'saman': 'بانک سامان',
    'melli': 'بانک ملی',
    'saderat': 'بانک صادرات',
    'card': 'کارت بانکی',
    'wallet': 'کیف پول',
    'bank': 'انتقال بانکی'
  }
  
  for (const [key, value] of Object.entries(gatewayMap)) {
    if (gatewayStr.includes(key)) {
      return value
    }
  }
  
  return gateway.toString()
}

// Import composable functions
const formatPrice = (price: number): string => {
  if (!price && price !== 0) return '0'
  return price.toLocaleString('fa-IR')
}

const formatPersianDate = (date: any): string => {
  try {
    if (!date) {
      return '—'
    }
    
    const toPersianDigits = (str: string) => {
      const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
      return str.replace(/\d/g, d => persianDigits[parseInt(d)])
    }
    
    // اگر تاریخ از API به فرمت شمسی آمده (مثل 1403/06/15)
    if (typeof date === 'string') {
      // حذف فضاهای خالی
      const cleaned = date.trim()
      
      // اگر تاریخ شمسی است (شامل / و احتمالاً 4 رقم سال دارد)
      if (cleaned.includes('/')) {
        // بررسی اینکه آیا تاریخ شمسی معتبر است
        if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(cleaned)) {
          return toPersianDigits(cleaned)
        }
      }
      
      // اگر تاریخ به فرمت ISO یا میلادی است
      if (cleaned.includes('-') || cleaned.includes('T')) {
        const dateObj = new Date(cleaned)
        if (!isNaN(dateObj.getTime())) {
          return toPersianDigits(dateObj.toLocaleDateString('fa-IR'))
        }
      }
      
      // تلاش برای تبدیل رشته به تاریخ
      const dateObj = new Date(cleaned)
      if (!isNaN(dateObj.getTime())) {
        return toPersianDigits(dateObj.toLocaleDateString('fa-IR'))
      }
    }
    
    if (date instanceof Date && !isNaN(date.getTime())) {
      return toPersianDigits(date.toLocaleDateString('fa-IR'))
    }
    
    return '—'
  } catch (error) {
    return '—'
  }
}

const isSuccess = (status: any): boolean => {
  if (!status) return false
  
  const statusStr = status?.toString().toLowerCase()
  const successStates = [
    'موفق', 'successful', 'success', 'completed', 'paid', 'تکمیل شده',
    'پرداخت شده', 'confirmed', 'تایید شده', 'done', 'انجام شده',
    'verified', 'تایید شده', 'ok', '200', 'true', '1'
  ]
  
  return successStates.some(s => statusStr?.includes(s))
}

const totalPayments = computed(() => {
  // فقط پرداخت‌های موفق را جمع می‌کنیم
  return transactions.value
    .filter(t => isSuccess(t.status))
    .reduce((sum, t) => sum + (t.amount || 0), 0)
})

const successfulTransactions = computed(() => {
  return transactions.value.filter(t => isSuccess(t.status)).length
})

const averageAmount = computed(() => {
  const successfulCount = successfulTransactions.value
  if (successfulCount === 0) return 0
  return Math.round(totalPayments.value / successfulCount)
})

const fetchTransactions = async () => {
  loading.value = true
  try {
    const axios = $axios as AxiosInstance
    const response = await axios.get('transactions/list')
    
    if (response.data?.data) {
      transactions.value = response.data.data
    } else if (Array.isArray(response.data)) {
      transactions.value = response.data
    }
  } catch (error) {
    // خطا در دریافت تراکنش‌ها
  } finally {
    loading.value = false
  }
}

const downloadReceipt = async (transaction: Transaction) => {
  try {
    const isSuccessful = isSuccess(transaction.status)
    
    // Create iframe for rendering
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.top = '-9999px'
    iframe.style.width = '500px'
    iframe.style.height = '450px'
    iframe.style.visibility = 'hidden'
    document.body.appendChild(iframe)
    
    const doc = iframe.contentWindow!.document
    doc.open()
    doc.write(generateReceiptHTML(transaction, isSuccessful))
    doc.close()
    
    // Wait for images to load and then capture
    iframe.onload = async () => {
      setTimeout(async () => {
        try {
          const html2canvas = (await import('html2canvas')).default
          const canvas = await html2canvas(iframe.contentDocument!.body, {
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: true,
            scale: 2,
            logging: false,
          })
          
          const link = document.createElement('a')
          link.download = `receipt_${transaction.referenceId || transaction.ref || transaction.id}.png`
          link.href = canvas.toDataURL('image/png')
          link.click()
          
          document.body.removeChild(iframe)
        } catch (error) {
          document.body.removeChild(iframe)
        }
      }, 500)
    }
  } catch (error) {
    alert('خطا در دانلود رسید. لطفاً دوباره تلاش کنید.')
  }
}

const generateReceiptHTML = (tx: Transaction, isSuccess: boolean): string => {
  const logoUrl = window.location.origin + '/logo/logo.png'
  
  // تبدیل متن اشتراک ماهانه به یکماهه
  const formatPlanName = (plan: string) => {
    if (!plan) return 'اشتراک'
    return plan.replace(/اشتراک\s*ماهانه|ماهانه/gi, 'یکماهه')
  }
  
  return `
    <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazir-Matn-font-face.css" rel="stylesheet" type="text/css" />
        <style>
          @font-face {
            font-family: 'IRANSans';
            src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Regular.woff2') format('woff2');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'IRANSans';
            src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Bold.woff2') format('woff2');
            font-weight: bold;
            font-style: normal;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
            background: transparent;
            font-family: 'IRANSans', 'Vazirmatn', Tahoma, Arial, sans-serif;
            direction: rtl;
          }
          .receipt {
            width: 420px;
            margin: 24px auto;
            padding: 24px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
            position: relative;
            overflow: hidden;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ddd;
            padding-bottom: 16px;
            margin-bottom: 16px;
          }
          .logo {
            height: 28px;
            width: auto;
          }
          .icon {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .icon svg {
            width: 48px;
            height: 48px;
          }
          .stamp {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-15deg);
            font-size: 28px;
            font-weight: bold;
            color: ${isSuccess ? '#22c55e' : '#ef4444'};
            opacity: 0.1;
            z-index: 0;
            white-space: nowrap;
          }
          h2 {
            text-align: center;
            font-size: 18px;
            margin: 0;
            font-weight: bold;
            color: #1e293b;
            z-index: 1;
            position: relative;
          }
          .amount {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            margin: 16px 0;
            z-index: 1;
            position: relative;
            direction: ltr;
            display: flex;
            width: 100%;
            align-items: baseline;
            justify-content: center;
            gap: 6px;
          }
          .currency {
            font-size: 16px;
            margin-left: 0;
            color: #6b7280;
          }
          .price {
            font-size: 28px;
            font-weight: 800;
            color: #1e293b;
            direction: ltr;
          }
          .table {
            font-size: 14px;
            z-index: 1;
            position: relative;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            color: #374151;
            align-items: center;
          }
          .row span:first-child {
            font-weight: 500;
          }
          .row span:last-child {
            font-weight: 600;
            text-align: right;
            direction: rtl;
          }
          .total-row {
            border-top: 1px solid #ddd !important;
            padding-top: 12px !important;
            margin-top: 12px !important;
            background: #f8fafc !important;
            padding: 12px !important;
            margin: 12px -12px 0 -12px !important;
            border-radius: 8px !important;
            font-size: 16px !important;
            font-weight: bold !important;
            color: #1e293b !important;
          }
          .total-amount {
            direction: ltr !important;
            text-align: right !important;
            display: inline-flex;
            align-items: baseline;
            gap: 6px;
          }
          .total-amount .currency {
            margin-left: 4px;
            font-size: 14px;
          }
          .total-amount .price {
            font-size: 16px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="stamp">${isSuccess ? 'پرداخت شده' : 'پرداخت ناموفق'}</div>

          <div class="header">
            <img src="${logoUrl}" alt="لینکو" class="logo" crossorigin="anonymous" />
            <div class="icon">
              ${isSuccess 
                ? '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#22c55e"/><path d="M8 12.5l2.5 2.5L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
                : '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#ef4444"/><path d="M9 9l6 6M15 9l-6 6" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>'
              }
            </div>
          </div>

          <h2>${isSuccess ? 'پرداخت با موفقیت انجام شد' : 'پرداخت انجام نشد'}</h2>
          <div class="amount">
            <span class="currency">تومان</span>
            <span class="price">${formatPrice(tx.amount)}</span>
          </div>

          <div class="table">
            <div class="row">
              <span>نوع اشتراک:</span>
              <span>${formatPlanName(tx.planTitle || tx.plan || tx.title || tx.description || 'اشتراک')}</span>
            </div>
            <div class="row">
              <span>کد تراکنش:</span>
              <span>${tx.referenceId || tx.ref || tx.tracking_code || tx.id || 'نامشخص'}</span>
            </div>
            <div class="row">
              <span>روش پرداخت:</span>
              <span>${formatGatewayName(tx.paymentMethod || tx.method || tx.gateway)}</span>
            </div>
            <div class="row">
              <span>تاریخ:</span>
              <span>${formatPersianDate(tx.createdAt || tx.created_at || tx.date)}</span>
            </div>
            ${tx.time ? `<div class="row">
              <span>ساعت:</span>
              <span>${tx.time}</span>
            </div>` : ''}
            <div class="row total-row">
              <span>مبلغ کل:</span>
              <span class="total-amount">
                <span class="currency">تومان</span>
                <span class="price">${formatPrice(tx.amount)}</span>
              </span>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

onMounted(() => {
  fetchTransactions()
})
</script>
