<template>
  <div class="w-full transition-all duration-300">
    <!-- فیلتر بازه زمانی و دیت‌پیکر شمسی -->
    <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">بازه زمانی:</span>
        <div class="flex gap-2 items-center flex-wrap">
          <date-picker
            v-model="dateRange.start"
            format="jYYYY/jMM/jDD"
            display-format="jYYYY/jMM/jDD"
            placeholder="از تاریخ"
            class="dark-datepicker"
          />
          <span class="text-gray-600 dark:text-gray-400">تا</span>
          <date-picker
            v-model="dateRange.end"
            format="jYYYY/jMM/jDD"
            display-format="jYYYY/jMM/jDD"
            placeholder="تا تاریخ"
            class="dark-datepicker"
          />
        </div>
      </div>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="option in filterOptions"
          :key="option.value"
          @click="selectedFilter = option.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
            selectedFilter === option.value
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
          ]"
        >
          <i v-if="option.icon" :class="option.icon"></i>
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- آمارهای کلی -->
    <div v-if="filteredStats.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 mb-8">
      <div v-for="stat in filteredStats" :key="stat.title"
           class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <i v-if="stat.icon" :class="[stat.icon, 'text-blue-600 dark:text-blue-400 text-xl']"></i>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm">{{ stat.title }}</h3>
          </div>
        </div>
        <div class="mb-3">
          <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</span>
        </div>
        <div class="mb-3" v-if="stat.chartData">
          <ApexChart
            :series="[{ name: stat.title, data: stat.chartData }]"
            :categories="stat.categories || []"
            type="line"
            :height="40"
            :color="stat.trend === 'up' ? '#22c55e' : '#ef4444'"
            :showFill="false"
            :smooth="true"
          />
        </div>
        <div class="flex items-center gap-1">
          <i v-if="stat.trend === 'up'" class="ti ti-arrow-up-right text-green-500"></i>
          <i v-else-if="stat.trend === 'down'" class="ti ti-arrow-down-right text-red-500"></i>
          <span :class="[
            'text-xs font-medium',
            stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          ]">
            {{ stat.trend === 'up' ? 'صعودی' : 'نزولی' }}
          </span>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center h-40 text-gray-600 dark:text-gray-400 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 mb-8">
      <i class="ti ti-database-off text-4xl mb-2"></i>
      <span>داده‌ای در این بازه زمانی موجود نیست</span>
    </div>

    <!-- گرید اصلی -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
      <!-- کارت‌های ایجاد شده -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <h2 class="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <i class="ti ti-credit-card text-blue-600"></i>
            کارت‌های ایجاد شده
          </h2>
          <button class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            افزودن کارت جدید
          </button>
        </div>
        <div class="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600">
          <div v-for="card in cards" :key="card.id"
               class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border-b border-gray-100 dark:border-slate-700 last:border-b-0">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <i class="ti ti-credit-card text-blue-600 dark:text-blue-400"></i>
              </div>
              <div>
                <span class="font-medium text-gray-900 dark:text-white">{{ card.title }}</span>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ card.createdAt }}</p>
              </div>
            </div>
            <button class="text-sm text-gray-500 hover:text-blue-600 transition-colors">
              <i class="ti ti-external-link"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- گزارشات تخلف -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <h2 class="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <i class="ti ti-alert-triangle text-red-600"></i>
            گزارشات تخلف
          </h2>
          <span class="text-sm text-red-600 font-medium">{{ reports.length }} مورد</span>
        </div>
        <div class="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600">
          <div v-for="report in reports" :key="report.id"
               class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border-b border-gray-100 dark:border-slate-700 last:border-b-0">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                <i class="ti ti-alert-triangle text-red-600 dark:text-red-400"></i>
              </div>
              <div>
                <span class="font-medium text-gray-900 dark:text-white">{{ report.message }}</span>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ report.date }}</p>
              </div>
            </div>
            <button class="text-sm text-gray-500 hover:text-red-600 transition-colors">
              <i class="ti ti-eye"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- آمارهای تفصیلی -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- اشتراک ویژه -->
      <div class="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <i class="ti ti-crown text-yellow-500 text-xl"></i>
            اشتراک ویژه
          </h3>
        </div>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-700 dark:text-gray-300">اعضای ویژه:</span>
            <span class="font-bold text-yellow-700 dark:text-yellow-400 text-lg">{{ premiumMembersCount }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-700 dark:text-gray-300">درآمد کل:</span>
            <span class="font-bold text-green-700 dark:text-green-400 text-lg">{{ totalSubscriptionRevenue }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-700 dark:text-gray-300">اشتراک فعال:</span>
            <span class="font-bold text-blue-700 dark:text-blue-400 text-lg">{{ activeSubscriptions }}</span>
          </div>
        </div>
      </div>

      <!-- کدهای تخفیف -->
      <div class="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <i class="ti ti-discount text-purple-500 text-xl"></i>
            کدهای تخفیف
          </h3>
        </div>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-700 dark:text-gray-300">کدهای فعال:</span>
            <span class="font-bold text-green-700 dark:text-green-400 text-lg">{{ activeDiscounts }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-700 dark:text-gray-300">استفاده شده:</span>
            <span class="font-bold text-blue-700 dark:text-blue-400 text-lg">{{ usedDiscounts }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-700 dark:text-gray-300">صرفه‌جویی:</span>
            <span class="font-bold text-purple-700 dark:text-purple-400 text-lg">{{ totalSavings }}</span>
          </div>
        </div>
      </div>

      <!-- تراکنش‌ها -->
      <div class="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <i class="ti ti-credit-card text-blue-500 text-xl"></i>
            تراکنش‌ها
          </h3>
        </div>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-700 dark:text-gray-300">موفق:</span>
            <span class="font-bold text-green-700 dark:text-green-400 text-lg">{{ successfulTransactions }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-700 dark:text-gray-300">ناموفق:</span>
            <span class="font-bold text-red-700 dark:text-red-400 text-lg">{{ failedTransactions }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-700 dark:text-gray-300">در انتظار:</span>
            <span class="font-bold text-yellow-700 dark:text-yellow-400 text-lg">{{ pendingTransactions }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ApexChart from './ApexChart.vue'
import DatePicker from 'vue3-persian-datetime-picker'

defineOptions({
  name: 'DashboardPage'
})

const filterOptions = [
  { label: 'یک هفته اخیر', value: 'week', icon: 'ti ti-calendar' },
  { label: 'یک ماه اخیر', value: 'month', icon: 'ti ti-calendar' },
  { label: 'سه ماه اخیر', value: '3month', icon: 'ti ti-calendar' },
]
const selectedFilter = ref('month')
const dateRange = ref({ start: '', end: '' })

// داده تستی برای هر بازه
const statsData = {
  week: [
    {
      title: 'کارت‌های ایجاد شده',
      value: 2,
      trend: 'up',
      icon: 'ti ti-credit-card',
      chartData: [1, 2, 2, 2, 2, 2, 2],
      categories: ['01','02','03','04','05','06','07'],
    },
    {
      title: 'کاربران عادی',
      value: 1,
      trend: 'down',
      icon: 'ti ti-user',
      chartData: [0, 1, 1, 1, 1, 1, 1],
      categories: ['01','02','03','04','05','06','07'],
    },
    {
      title: 'کاربران ویژه',
      value: 0,
      trend: 'up',
      icon: 'ti ti-star',
      chartData: [0, 0, 0, 0, 0, 0, 0],
      categories: ['01','02','03','04','05','06','07'],
    },
    {
      title: 'کاربران ثبت‌نامی جدید',
      value: 1,
      trend: 'down',
      icon: 'ti ti-user-plus',
      chartData: [0, 1, 0, 0, 0, 0, 0],
      categories: ['01','02','03','04','05','06','07'],
    },
    {
      title: 'درآمد اشتراک ویژه',
      value: '150,000 تومان',
      trend: 'up',
      icon: 'ti ti-crown',
      chartData: [20000, 50000, 80000, 100000, 120000, 150000, 150000],
      categories: ['01','02','03','04','05','06','07'],
    },
    {
      title: 'کدهای تخفیف فعال',
      value: 3,
      trend: 'up',
      icon: 'ti ti-discount',
      chartData: [1, 2, 2, 3, 3, 3, 3],
      categories: ['01','02','03','04','05','06','07'],
    },
  ],
  month: [
    {
      title: 'کارت‌های ایجاد شده',
      value: 5,
      trend: 'up',
      icon: 'ti ti-credit-card',
      chartData: [2, 3, 4, 5, 6, 7, 8],
      categories: ['01','05','10','15','20','25','30'],
    },
    {
      title: 'کاربران عادی',
      value: 5,
      trend: 'up',
      icon: 'ti ti-user',
      chartData: [1, 2, 2, 3, 4, 4, 5],
      categories: ['01','05','10','15','20','25','30'],
    },
    {
      title: 'کاربران ویژه',
      value: 5,
      trend: 'down',
      icon: 'ti ti-star',
      chartData: [0, 1, 2, 2, 3, 4, 4],
      categories: ['01','05','10','15','20','25','30'],
    },
    {
      title: 'کاربران ثبت‌نامی جدید',
      value: 5,
      trend: 'up',
      icon: 'ti ti-user-plus',
      chartData: [3, 2, 1, 2, 3, 2, 1],
      categories: ['01','05','10','15','20','25','30'],
    },
    {
      title: 'درآمد اشتراک ویژه',
      value: '2,500,000 تومان',
      trend: 'up',
      icon: 'ti ti-crown',
      chartData: [200000, 500000, 800000, 1200000, 1800000, 2200000, 2500000],
      categories: ['01','05','10','15','20','25','30'],
    },
    {
      title: 'کدهای تخفیف استفاده شده',
      value: 12,
      trend: 'up',
      icon: 'ti ti-discount',
      chartData: [2, 4, 6, 8, 10, 11, 12],
      categories: ['01','05','10','15','20','25','30'],
    },
  ],
  '3month': [
    {
      title: 'کارت‌های ایجاد شده',
      value: 12,
      trend: 'down',
      icon: 'ti ti-credit-card',
      chartData: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      categories: ['01','05','10','15','20','25','30','35','40','45','50','55'],
    },
    {
      title: 'کاربران عادی',
      value: 8,
      trend: 'up',
      icon: 'ti ti-user',
      chartData: [1, 2, 2, 3, 4, 4, 5, 6, 7, 7, 8, 8],
      categories: ['01','05','10','15','20','25','30','35','40','45','50','55'],
    },
    {
      title: 'کاربران ویژه',
      value: 7,
      trend: 'down',
      icon: 'ti ti-star',
      chartData: [0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7],
      categories: ['01','05','10','15','20','25','30','35','40','45','50','55'],
    },
    {
      title: 'کاربران ثبت‌نامی جدید',
      value: 6,
      trend: 'up',
      icon: 'ti ti-user-plus',
      chartData: [3, 2, 1, 2, 3, 2, 1, 2, 2, 2, 2, 2],
      categories: ['01','05','10','15','20','25','30','35','40','45','50','55'],
    },
    {
      title: 'درآمد اشتراک ویژه',
      value: '8,750,000 تومان',
      trend: 'up',
      icon: 'ti ti-crown',
      chartData: [500000, 1200000, 2100000, 3500000, 4800000, 6200000, 7100000, 7800000, 8200000, 8500000, 8650000, 8750000],
      categories: ['01','05','10','15','20','25','30','35','40','45','50','55'],
    },
    {
      title: 'کل تراکنش‌ها',
      value: 45,
      trend: 'up',
      icon: 'ti ti-credit-card',
      chartData: [5, 8, 12, 18, 25, 32, 35, 38, 41, 43, 44, 45],
      categories: ['01','05','10','15','20','25','30','35','40','45','50','55'],
    },
  ],
}

const filteredStats = computed(() => {
  if (dateRange.value.start && dateRange.value.end) {
    return []
  }
  return statsData[selectedFilter.value as keyof typeof statsData] || []
})

const cards = ref([
  { id: 1, title: 'کارت اول', createdAt: '1403/04/01', value: 10 },
  { id: 2, title: 'کارت دوم', createdAt: '1403/04/05', value: 15 },
  { id: 3, title: 'کارت سوم', createdAt: '1403/04/10', value: 8 },
  { id: 4, title: 'کارت چهارم', createdAt: '1403/04/15', value: 20 },
  { id: 5, title: 'کارت پنجم', createdAt: '1403/04/20', value: 12 }
])

const reports = ref([
  { id: 1, message: 'تخلف ثبت شده توسط کاربر X', date: '1403/04/01', value: 2 },
  { id: 2, message: 'تخلف ثبت شده توسط کاربر Y', date: '1403/04/05', value: 1 },
  { id: 3, message: 'تخلف ثبت شده توسط کاربر Z', date: '1403/04/10', value: 3 },
  { id: 4, message: 'تخلف ثبت شده توسط کاربر W', date: '1403/04/15', value: 2 },
  { id: 5, message: 'تخلف ثبت شده توسط کاربر V', date: '1403/04/20', value: 1 }
])

// آمارهای اشتراک و تراکنش
const premiumMembersCount = ref(25)
const totalSubscriptionRevenue = ref('8,750,000 تومان')
const activeSubscriptions = ref(18)

const activeDiscounts = ref(7)
const usedDiscounts = ref(42)
const totalSavings = ref('1,200,000 تومان')

const successfulTransactions = ref(38)
const failedTransactions = ref(5)
const pendingTransactions = ref(2)
</script>

<style>


.vpd-actions button {
  background: #111 !important;
  color: #fff !important;
  border: none !important;
  border-radius: 12px !important;
  box-shadow: none !important;
  transition: background 0.2s;
  display: flex;
 margin-right: 5px !important;}

.vpd-icon-btn{
  background: #111 !important;
  color: #fff !important;
  border: none !important;
  border-top-right-radius: 12px !important;
  border-bottom-right-radius: 12px !important;
  box-shadow: none !important;
  transition: background 0.2s;
}

/* پس‌زمینه دکمه‌های فیلتر روشن با متن تیره */
.filter-btn {
  background: #f8f9fa !important;
  color: #333 !important;
  border: 1px solid #e5e5e5 !important;
  border-radius: 12px !important;
  box-shadow: none !important;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  margin-left: 0.5rem;
  margin-right: 0;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: #e9ecef !important;
  border-color: #d1d5db !important;
}
.filter-btn:last-child {
  margin-left: 0;
}
.filter-btn i {
  margin-left: 0.5rem;
  font-size: 1.1em;
  display: flex;
  align-items: center;
}

/* استایل‌های قبلی دکمه‌های فیلتر */
.flex.gap-2 > .filter-btn {
  margin-left: 0.5rem;
  margin-right: 0;
}
.flex.gap-2 > .filter-btn:last-child {
  margin-left: 0;
}

.form-control{padding: 5px !important;
  border-top-left-radius: 12px !important;
  border-bottom-left-radius: 12px !important;
}


.vpd-day-effect {
  border-radius: 50% !important;
}
/* حذف دارک مد سراسری از دیت‌پیکر */
.dark-datepicker .vpd-input-group,
.dark-datepicker .vpd-input,
.dark-datepicker .vpd-picker,
.dark-datepicker .vpd-content,
.dark-datepicker .vpd-calendar,
.dark-datepicker .vpd-title {
  background: #fff !important;
  color: #222 !important;
  border-color: #eee !important;
}
.dark-datepicker .vpd-input {
  color: #222 !important;
  min-width: 120px;
  text-align: center;
}
/* حذف کامل دارک مد از دیت‌پیکر */
.dark-datepicker {
  background: unset !important;
  color: unset !important;
}
/* فاصله بین دو دیت‌پیکر */
.dark-datepicker + span,
span + .dark-datepicker {
  margin-right: 0.5rem;
  margin-left: 0.5rem;
}
/* فاصله بین دکمه‌های فیلتر */
.flex.gap-2 > .filter-btn {
  margin-left: 0.5rem;
  margin-right: 0;
}
.flex.gap-2 > .filter-btn:last-child {
  margin-left: 0;
}
/* حذف border و shadow اضافی از فیلد دیت‌پیکر */
.dark-datepicker .vpd-input-group:focus-within,
.dark-datepicker .vpd-input:focus {
  box-shadow: none !important;
  border-color: #bbb !important;
}

.vpd-container {
  overflow: hidden;
  position: relative;
  border-radius: 20px;
}

.vpd-dir-rtl .vpd-next {
    float: left;
    display: flex !important
;
    align-items: center !important;
    justify-content: center;
    background: #f6f6f6 !important;
}

.vpd-dir-rtl .vpd-prev {
    float: right;
    display: flex !important
;
    align-items: center !important;
    justify-content: center;
    background: #f6f6f6 !important;
}

.vpd-header,.vpd-day-effect {
  background-color: black !important;
}

.vpd-month-list .vpd-addon-list-item {
    height: 54px;
    line-height: 46px;
    border-radius: 10px !important;
}


.vpd-addon-list-item.vpd-selected {
    font-weight: 700;
    background-color: #e3e3e3;
    color: black !important;
}
</style>
