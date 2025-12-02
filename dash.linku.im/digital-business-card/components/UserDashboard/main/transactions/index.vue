<template>
  <div>
    <h2 class="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
      <i class="ti ti-credit-card text-xl"></i>
      گزارش پرداخت‌ها
    </h2>

    <!-- ✅ فیلترها و جستجو -->
    <div class="bg-secondary border border-border rounded-xl p-4 mb-6">
      <div class="grid md:grid-cols-3 gap-4">
        <!-- جستجو -->
        <div class="relative">
          <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-primary opacity-50"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو در کد تراکنش، پلن..."
            class="w-full pr-10 pl-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-primary"
          />
        </div>

        <!-- فیلتر وضعیت -->
        <div class="relative">
          <i class="ti ti-filter absolute right-3 top-1/2 -translate-y-1/2 text-primary opacity-50"></i>
          <select
            v-model="statusFilter"
            class="w-full pr-10 pl-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-primary appearance-none cursor-pointer"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="موفق">موفق</option>
            <option value="ناموفق">ناموفق</option>
          </select>
          <i class="ti ti-chevron-down absolute left-3 top-1/2 -translate-y-1/2 text-primary opacity-50 pointer-events-none"></i>
        </div>

        <!-- فیلتر روش پرداخت -->
        <div class="relative">
          <i class="ti ti-credit-card absolute right-3 top-1/2 -translate-y-1/2 text-primary opacity-50"></i>
          <select
            v-model="methodFilter"
            class="w-full pr-10 pl-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-primary appearance-none cursor-pointer"
          >
            <option value="all">همه روش‌ها</option>
            <option value="درگاه بانکی">درگاه بانکی</option>
            <option value="کارت به کارت">کارت به کارت</option>
            <option value="کیف پول">کیف پول</option>
          </select>
          <i class="ti ti-chevron-down absolute left-3 top-1/2 -translate-y-1/2 text-primary opacity-50 pointer-events-none"></i>
        </div>
      </div>

      <!-- اطلاعات فیلتر -->
      <div v-if="filteredTransactions.length !== transactions.length && !loading" class="mt-3 flex items-center justify-between text-sm">
        <span class="text-primary opacity-70">
          <i class="ti ti-info-circle"></i>
          {{ filteredTransactions.length }} مورد از {{ transactions.length }} تراکنش نمایش داده می‌شود
        </span>
        <button
          @click="clearFilters"
          class="text-accent hover:underline flex items-center gap-1"
        >
          <i class="ti ti-x text-xs"></i>
          پاک کردن فیلترها
        </button>
      </div>
    </div>

    <!-- ✅ حالت لودینگ - اسکلتون -->
    <div v-if="loading" class="bg-secondary border border-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-primary border-b border-border">
            <tr>
              <th class="px-4 py-3 text-right text-sm font-medium text-primary">
                <div class="h-4 bg-primary rounded w-16 animate-pulse"></div>
              </th>
              <th class="px-4 py-3 text-right text-sm font-medium text-primary">
                <div class="h-4 bg-primary rounded w-20 animate-pulse"></div>
              </th>
              <th class="px-4 py-3 text-right text-sm font-medium text-primary">
                <div class="h-4 bg-primary rounded w-24 animate-pulse"></div>
              </th>
              <th class="px-4 py-3 text-right text-sm font-medium text-primary">
                <div class="h-4 bg-primary rounded w-20 animate-pulse"></div>
              </th>
              <th class="px-4 py-3 text-right text-sm font-medium text-primary">
                <div class="h-4 bg-primary rounded w-16 animate-pulse"></div>
              </th>
              <th class="px-4 py-3 text-right text-sm font-medium text-primary">
                <div class="h-4 bg-primary rounded w-20 animate-pulse"></div>
              </th>
              <th class="px-4 py-3 text-center text-sm font-medium text-primary">
                <div class="h-4 bg-primary rounded w-16 animate-pulse mx-auto"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 5" :key="i" class="border-b border-border">
              <td class="px-4 py-4"><div class="h-4 bg-primary rounded w-full animate-pulse"></div></td>
              <td class="px-4 py-4"><div class="h-4 bg-primary rounded w-full animate-pulse"></div></td>
              <td class="px-4 py-4"><div class="h-4 bg-primary rounded w-full animate-pulse"></div></td>
              <td class="px-4 py-4"><div class="h-4 bg-primary rounded w-full animate-pulse"></div></td>
              <td class="px-4 py-4"><div class="h-4 bg-primary rounded w-full animate-pulse"></div></td>
              <td class="px-4 py-4"><div class="h-4 bg-primary rounded w-full animate-pulse"></div></td>
              <td class="px-4 py-4"><div class="h-8 bg-primary rounded w-20 animate-pulse mx-auto"></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ✅ جدول تراکنش‌ها -->
    <div v-else-if="filteredTransactions.length" class="bg-secondary border border-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-primary border-b border-border">
            <tr>
              <th class="px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <i class="ti ti-package text-base"></i>
                  نوع اشتراک
                </div>
              </th>
              <th class="px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <i class="ti ti-coin text-base"></i>
                  مبلغ
                </div>
              </th>
              <th class="px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <i class="ti ti-receipt text-base"></i>
                  کد تراکنش
                </div>
              </th>
              <th class="px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <i class="ti ti-credit-card text-base"></i>
                  روش پرداخت
                </div>
              </th>
              <th class="px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <i class="ti ti-calendar text-base"></i>
                  تاریخ
                </div>
              </th>
              <th class="px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <i class="ti ti-info-circle text-base"></i>
                  وضعیت
                </div>
              </th>
              <th class="px-4 py-3 text-center text-sm font-medium text-primary whitespace-nowrap">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="tx in paginatedTransactions"
              :key="tx.id"
              class="border-b border-border hover:bg-primary transition-colors"
            >
              <!-- نوع اشتراک -->
              <td class="px-4 py-4 text-sm text-primary whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                    <i class="ti ti-crown text-white text-sm"></i>
                  </div>
                  <div>
                    <div class="font-medium">{{ tx.plan }}</div>
                    <div v-if="tx.discount" class="text-xs text-green-600">{{ tx.discount }} تخفیف</div>
                  </div>
                </div>
              </td>

              <!-- مبلغ -->
              <td class="px-4 py-4 text-sm whitespace-nowrap">
                <span class="font-bold text-green-600">{{ tx.amount.toLocaleString() }}</span>
                <span class="text-primary opacity-60 mr-1">تومان</span>
              </td>

              <!-- کد تراکنش -->
              <td class="px-4 py-4 text-sm text-primary font-mono whitespace-nowrap">
                {{ tx.ref }}
              </td>

              <!-- روش پرداخت -->
              <td class="px-4 py-4 text-sm text-primary whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <i class="ti ti-credit-card text-base opacity-60"></i>
                  {{ tx.method }}
                </div>
              </td>

              <!-- تاریخ -->
              <td class="px-4 py-4 text-sm text-primary whitespace-nowrap">
                {{ formatPersianDate(tx.date) }}
              </td>

              <!-- وضعیت -->
              <td class="px-4 py-4 text-sm whitespace-nowrap">
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="tx.status === 'موفق' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'"
                >
                  <i class="ti" :class="tx.status === 'موفق' ? 'ti-circle-check' : 'ti-alert-triangle'"></i>
                  {{ tx.status }}
                </span>
              </td>

              <!-- عملیات -->
              <td class="px-4 py-4 text-sm text-center whitespace-nowrap">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="openDetailModal(tx)"
                    class="w-8 h-8 rounded-lg border border-border hover:bg-primary transition-colors flex items-center justify-center group"
                    title="مشاهده جزئیات"
                  >
                    <i class="ti ti-eye text-base text-primary group-hover:text-accent"></i>
                  </button>
                  <button
                    @click="generateImage(tx)"
                    class="w-8 h-8 rounded-lg border border-border hover:bg-primary transition-colors flex items-center justify-center group"
                    title="دانلود رسید"
                  >
                    <i class="ti ti-download text-base text-primary group-hover:text-accent"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="border-t border-border px-4 py-3 flex items-center justify-between">
        <div class="text-sm text-primary opacity-70">
          نمایش {{ ((currentPage - 1) * perPage) + 1 }} تا {{ Math.min(currentPage * perPage, filteredTransactions.length) }} از {{ filteredTransactions.length }} مورد
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 border border-border rounded-lg text-sm text-primary hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="ti ti-chevron-right"></i>
          </button>
          <div class="flex items-center gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              class="w-8 h-8 rounded-lg text-sm transition-colors"
              :class="currentPage === page 
                ? 'accent-bg accent-text font-medium' 
                : 'border border-border text-primary hover:bg-primary'"
            >
              {{ page }}
            </button>
          </div>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 border border-border rounded-lg text-sm text-primary hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="ti ti-chevron-left"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ حالت خالی -->
    <div v-else class="flex flex-col items-center justify-center py-16 text-center bg-secondary border border-border rounded-xl">
      <div class="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4">
        <i class="ti ti-wallet-off text-5xl text-primary opacity-30"></i>
      </div>
      <h3 class="text-lg font-bold text-primary mb-2">
        {{ searchQuery || statusFilter !== 'all' || methodFilter !== 'all' ? 'نتیجه‌ای یافت نشد' : 'هیچ تراکنشی یافت نشد' }}
      </h3>
      <p class="text-sm text-primary opacity-60 max-w-sm">
        {{ searchQuery || statusFilter !== 'all' || methodFilter !== 'all' 
          ? 'با فیلترهای انتخابی هیچ تراکنشی یافت نشد. لطفا فیلترهای دیگری را امتحان کنید.' 
          : 'تاکنون هیچ تراکنش پرداختی ثبت نشده است. پس از خرید اشتراک، تراکنش‌های شما در اینجا نمایش داده می‌شود.' 
        }}
      </p>
      <button
        v-if="searchQuery || statusFilter !== 'all' || methodFilter !== 'all'"
        @click="clearFilters"
        class="mt-4 px-4 py-2 accent-bg accent-text rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        پاک کردن فیلترها
      </button>
    </div>

    <!-- ✅ مودال جزئیات -->
    <transition name="fade">
      <div v-if="selectedTransaction" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeDetailModal">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
        <div class="relative bg-secondary rounded-2xl shadow-xl p-6 w-full max-w-md z-50 border border-border">
          <button
            @click="closeDetailModal"
            class="absolute top-4 left-4 w-8 h-8 rounded-full hover:bg-primary transition-colors flex items-center justify-center"
          >
            <i class="ti ti-x text-xl text-primary"></i>
          </button>

          <h3 class="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <i class="ti ti-receipt text-2xl"></i>
            جزئیات تراکنش
          </h3>

          <div class="space-y-3">
            <div class="flex justify-between py-2 border-b border-border">
              <span class="text-primary opacity-70">نوع اشتراک:</span>
              <span class="font-medium text-primary">{{ selectedTransaction.plan }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-border">
              <span class="text-primary opacity-70">مبلغ:</span>
              <span class="font-bold text-green-600">{{ selectedTransaction.amount.toLocaleString() }} تومان</span>
            </div>
            <div class="flex justify-between py-2 border-b border-border">
              <span class="text-primary opacity-70">کد تراکنش:</span>
              <span class="font-mono text-primary">{{ selectedTransaction.ref }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-border">
              <span class="text-primary opacity-70">روش پرداخت:</span>
              <span class="text-primary">{{ selectedTransaction.method }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-border">
              <span class="text-primary opacity-70">تاریخ:</span>
              <span class="text-primary">{{ formatPersianDate(selectedTransaction.date) }}</span>
            </div>
            <div v-if="selectedTransaction.startDate" class="flex justify-between py-2 border-b border-border">
              <span class="text-primary opacity-70">تاریخ شروع:</span>
              <span class="text-primary">{{ formatPersianDate(selectedTransaction.startDate) }}</span>
            </div>
            <div v-if="selectedTransaction.endDate" class="flex justify-between py-2 border-b border-border">
              <span class="text-primary opacity-70">تاریخ پایان:</span>
              <span class="text-primary">{{ formatPersianDate(selectedTransaction.endDate) }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-primary opacity-70">وضعیت:</span>
              <span
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                :class="selectedTransaction.status === 'موفق' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'"
              >
                <i class="ti" :class="selectedTransaction.status === 'موفق' ? 'ti-circle-check' : 'ti-alert-triangle'"></i>
                {{ selectedTransaction.status }}
              </span>
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <button
              @click="generateImage(selectedTransaction)"
              class="flex-1 px-4 py-2.5 accent-bg accent-text rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <i class="ti ti-download"></i>
              دانلود رسید
            </button>
            <button
              @click="closeDetailModal"
              class="px-4 py-2.5 border border-border rounded-lg text-primary hover:bg-primary transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import moment from 'moment-jalaali'

let html2canvas = null
const transactions = ref([])
const loading = ref(true)
const selectedTransaction = ref(null)

// فیلترها
const searchQuery = ref('')
const statusFilter = ref('all')
const methodFilter = ref('all')

// Pagination
const currentPage = ref(1)
const perPage = ref(10)

// محاسبه تراکنش‌های فیلتر شده
const filteredTransactions = computed(() => {
  let result = transactions.value

  // فیلتر جستجو
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(tx => 
      tx.plan.toLowerCase().includes(query) ||
      tx.ref.toLowerCase().includes(query) ||
      tx.method.toLowerCase().includes(query)
    )
  }

  // فیلتر وضعیت
  if (statusFilter.value !== 'all') {
    result = result.filter(tx => tx.status === statusFilter.value)
  }

  // فیلتر روش پرداخت
  if (methodFilter.value !== 'all') {
    result = result.filter(tx => tx.method === methodFilter.value)
  }

  return result
})

// محاسبه تراکنش‌های صفحه فعلی
const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredTransactions.value.slice(start, end)
})

// تعداد صفحات
const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / perPage.value)
})

// صفحات قابل نمایش در pagination
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// پاک کردن فیلترها
const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  methodFilter.value = 'all'
  currentPage.value = 1
}

// باز کردن مودال جزئیات
const openDetailModal = (transaction) => {
  selectedTransaction.value = transaction
}

// بستن مودال جزئیات
const closeDetailModal = () => {
  selectedTransaction.value = null
}

function toEnglishDigits(str) {
  // تبدیل اعداد فارسی و عربی به انگلیسی
  return str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
            .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
}

function formatPersianDate(date) {
  // اگر تاریخ میلادی بود، تبدیل به شمسی کن و به صورت YYYY/MM/DD نمایش بده
  const m = moment(date, 'YYYY/MM/DD');
  if (m.isValid()) {
    return toEnglishDigits(m.format('jYYYY/jMM/jDD'));
  }
  return toEnglishDigits(date.replace(/\s*/g, ''));
}

onMounted(async () => {
  if (process.client) {
    const module = await import('html2canvas')
    html2canvas = module.default
  }
  
  // شروع لودینگ
  loading.value = true
  try {
    transactions.value = await fetchTransactions()
  } catch (error) {
  } finally {
    loading.value = false
  }
})

function generateImage(tx) {
  if (!html2canvas) return;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.top = "-9999px";
  iframe.style.width = "500px";
  iframe.style.height = "450px";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const taxAmount = Math.round(tx.amount * 0.1);
  const totalPrice = tx.amount + taxAmount;
  const isSuccess = tx.status === 'موفق';

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <html dir="rtl">
      <head>
        <style>
          @font-face {
            font-family: 'ShabnamFd';
            src: url('/fonts/Shabnam-FD.woff2') format('woff2');
          }
          body {
            margin: 0;
            padding: 0;
            background: transparent;
            font-family: 'ShabnamFd', Tahoma, sans-serif;
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
            height: 32px;
          }
          .icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: ${isSuccess ? "#22c55e" : "#ef4444"};
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .icon svg {
            width: 24px;
            height: 24px;
          }
          .stamp {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-15deg);
            font-size: 28px;
            font-weight: bold;
            color: ${isSuccess ? "#22c55e" : "#ef4444"};
            opacity: 0.1;
            z-index: 0;
          }
          h2 {
            text-align: center;
            font-size: 18px;
            margin: 0;
            font-weight: bold;
            color: #1e293b;
          }
          .amount {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            margin: 16px 0;
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
          }
          .row span:first-child {
            font-weight: 500;
          }
          .footer {
            margin-top: 24px;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
            border-top: 1px solid #eee;
            padding-top: 12px;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="stamp">${isSuccess ? "پرداخت شده" : "پرداخت ناموفق"}</div>

          <div class="header">
            <img src="/logo/logo.png" class="logo" />
            <div class="icon">
              ${
                isSuccess
                  ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5"/></svg>`
                  : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
              }
            </div>
          </div>

          <h2>${isSuccess ? "پرداخت با موفقیت انجام شد" : "پرداخت انجام نشد"}</h2>
          <div class="amount">${tx.amount.toLocaleString()} تومان</div>

          <div class="table">
            <div class="row"><span>نوع اشتراک:</span><span>${tx.plan}</span></div>
            <div class="row"><span>کد تراکنش:</span><span>${tx.ref}</span></div>
            <div class="row"><span>روش پرداخت:</span><span>${tx.method}</span></div>
            <div class="row"><span>تاریخ:</span><span>${formatPersianDate(tx.date)}</span></div>
            ${tx.startDate ? `<div class="row"><span>تاریخ شروع اشتراک:</span><span>${formatPersianDate(tx.startDate)}</span></div>` : ''}
            ${tx.endDate ? `<div class="row"><span>تاریخ پایان اشتراک:</span><span>${formatPersianDate(tx.endDate)}</span></div>` : ''}            <div class="row"><span><strong>مبلغ کل:</strong></span><span><strong>${totalPrice.toLocaleString()} تومان</strong></span></div>
          </div>

          <div class="footer">
            لینکو : <strong>linku.im</strong><br/>
            ساده، هوشمند، همیشه همراه 🎯
          </div>
        </div>
      </body>
    </html>
  `);
  doc.close();

  iframe.onload = () => {
    html2canvas(iframe.contentDocument.body, {
      backgroundColor: null,
      useCORS: true,
      scale: 2
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `receipt_${tx.ref}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      document.body.removeChild(iframe);
    });
  };
}

const { $axios } = useNuxtApp()
const { toPersian } = useFormatters()

async function fetchTransactions() {
  try {
    const response = await $axios.get('transactions/list');

    // تبدیل اعداد به فارسی در تمام آبجکت‌ها
    return response.data.data.map(item => {
      return {
        ...item,
        plan: toPersian(item.plan),
        amount: toPersian(item.amount),
        ref: toPersian(item.ref),
        startDate: item.startDate,

        endDate: item.endDate,
        date: item.date,
        discount: toPersian(item.discount),
        status: item.status === 'success' ? "موفق" : "ناموفق",
      };
    });
  } catch (error) {
    return [];
  }
}
</script>

<style scoped>
/* حذف مارکر پیش‌فرض details */
summary::-webkit-details-marker {
  display: none;
}

/* انیمیشن مودال */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* اسکرول افقی جدول */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(128, 128, 128, 0.3);
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(128, 128, 128, 0.5);
}
</style>