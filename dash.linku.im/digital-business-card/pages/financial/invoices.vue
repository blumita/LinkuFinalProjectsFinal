<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-card border-b divide-border">
      <div class="flex items-center justify-between px-4 h-16">
        <button @click="navigateTo('/financial')" class="p-2 hover:bg-secondary rounded-lg transition-colors">
          <i class="ti ti-arrow-right text-primary text-xl"></i>
        </button>
        <h1 class="text-lg font-bold text-primary">فاکتورها و صورتحساب</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Invoices Content -->
    <div class="pt-20 pb-24 px-6">
      <!-- Loading State -->
      <div v-if="!isDataLoaded" class="space-y-6 animate-pulse">
        <!-- Filters Skeleton -->
        <div class="flex items-center gap-3 overflow-x-auto pb-2">
          <div v-for="n in 4" :key="n" class="flex-shrink-0 w-20 h-8 bg-muted rounded-xl"></div>
        </div>

        <!-- Invoices List Skeleton -->
        <div class="space-y-4">
          <div v-for="n in 6" :key="n" class="bg-card border border-border p-4 rounded-xl">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1 space-y-2">
                <div class="flex items-center gap-2">
                  <div class="h-4 w-24 bg-muted rounded"></div>
                  <div class="w-16 h-5 bg-muted rounded-full"></div>
                </div>
                <div class="h-3 w-20 bg-muted-foreground/20 rounded"></div>
                <div class="h-3 w-16 bg-muted-foreground/20 rounded"></div>
              </div>
              <div class="text-right space-y-1">
                <div class="h-5 w-20 bg-muted rounded"></div>
                <div class="h-3 w-12 bg-muted-foreground/20 rounded"></div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-muted rounded"></div>
                <div class="w-8 h-8 bg-muted rounded"></div>
              </div>
              <div class="h-8 w-20 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <template v-else>
        <div class="mb-6">
          <div class="flex items-center gap-3 overflow-x-auto pb-2">
            <button
              v-for="filter in invoiceFilters"
              :key="filter.value"
              @click="selectedFilter = filter.value"
              :class="[
                'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                selectedFilter === filter.value
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              ]"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <!-- Invoices List -->
        <div class="space-y-4">
        <div 
          v-for="invoice in filteredInvoices" 
          :key="invoice.id"
          class="bg-card border border-border/20 p-4 rounded-xl hover:bg-card/80 transition-colors"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h5 class="font-medium text-foreground">فاکتور #{{ invoice.invoiceNumber }}</h5>
                <span :class="[
                  'text-xs px-2 py-1 rounded-full',
                  getStatusClass(invoice.status)
                ]">
                  {{ getStatusText(invoice.status) }}
                </span>
              </div>
              <p class="text-sm text-muted-foreground mb-2">{{ invoice.description }}</p>
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <span>تاریخ صدور: {{ invoice.issueDate }}</span>
                <span>سررسید: {{ invoice.dueDate }}</span>
              </div>
            </div>
            <div class="text-left">
              <p class="text-lg font-bold text-foreground">{{ formatPrice(invoice.amount) }}</p>
            </div>
          </div>
          
          <div class="flex items-center justify-between pt-3 border-t border-border/20">
            <div class="flex items-center gap-3">
              <button 
                @click="downloadInvoice(invoice.id)"
                class="flex items-center gap-1 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
                title="دانلود PDF"
              >
                <i class="ti ti-download text-base"></i>
                <span class="hidden sm:inline">دانلود</span>
              </button>
              <button 
                @click="viewInvoice(invoice.id)"
                class="flex items-center gap-1 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
                title="مشاهده جزئیات"
              >
                <i class="ti ti-eye text-base"></i>
                <span class="hidden sm:inline">جزئیات</span>
              </button>
            </div>
            <div class="flex items-center gap-2">
              <i :class="getPaymentMethodIcon(invoice.paymentMethod) + ' text-muted-foreground text-sm'"></i>
              <span class="text-xs text-muted-foreground">{{ invoice.paymentMethod }}</span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredInvoices.length === 0" class="text-center py-12">
          <div class="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ti ti-file-invoice text-3xl text-muted-foreground"></i>
          </div>
          <h3 class="text-lg font-medium text-foreground mb-2">فاکتوری یافت نشد</h3>
          <p class="text-sm text-muted-foreground">در این بازه زمانی فاکتوری صادر نشده است</p>
        </div>
      </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useFinancialStore } from '~/stores/financial'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'default',
  middleware: 'require-activated'
})

const financialStore = useFinancialStore()
const toast = useToast()

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' ریال'
}

// Data
const isDataLoaded = ref(false)
const selectedFilter = ref('all')

// Filter options
const invoiceFilters = [
  { label: 'همه', value: 'all' },
  { label: 'پرداخت شده', value: 'paid' },
  { label: 'در انتظار', value: 'pending' },
  { label: 'منقضی', value: 'overdue' }
]

// Computed
const filteredInvoices = computed(() => {
  return financialStore.getInvoicesByStatus(selectedFilter.value)
})

const downloadInvoice = async (invoiceId: string | number) => {
  try {
    await financialStore.downloadInvoice(invoiceId)
    toast.success('فاکتور با موفقیت دانلود شد')
  } catch (error) {
    toast.error('خطا در دانلود فاکتور')
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

const getStatusText = (status: string): string => {
  const texts: { [key: string]: string } = {
    paid: 'پرداخت شده',
    pending: 'در انتظار',
    overdue: 'منقضی',
    cancelled: 'لغو شده'
  }
  return texts[status] || 'نامشخص'
}

const getPaymentMethodIcon = (method: string): string => {
  const icons: { [key: string]: string } = {
    'کارت بانکی': 'ti ti-credit-card',
    'کیف پول': 'ti ti-wallet',
    'انتقال بانکی': 'ti ti-building-bank'
  }
  return icons[method] || 'ti ti-payment'
}

const viewInvoice = (invoiceId: string | number) => {
  navigateTo(`/financial/invoice/${invoiceId}`)
}

// Lifecycle
onMounted(async () => {
  isDataLoaded.value = false
  await financialStore.fetchInvoices()
  isDataLoaded.value = true
})
</script>

<style scoped>
/* Custom scrollbar for filters */
.overflow-x-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.overflow-x-auto::-webkit-scrollbar {
  display: none;
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
