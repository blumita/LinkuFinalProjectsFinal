<template>
  <div class="min-h-screen w-full transition-all duration-300">
    <!-- فیلتر بازه زمانی و دیت‌پیکر شمسی -->
    <div class="flex flex-wrap gap-2 items-center justify-between mb-4">
      <div class="flex gap-2 items-center">
        <date-picker
          v-model="dateRange.start"
          format="jYYYY/jMM/jDD"
          display-format="jYYYY/jMM/jDD"
          placeholder="از تاریخ "
          class="dark-datepicker"
        />
        <span class="mx-1 text-gray-600 dark:text-gray-400">تا</span>
        <date-picker
          v-model="dateRange.end"
          format="jYYYY/jMM/jDD"
          display-format="jYYYY/jMM/jDD"
          placeholder="تا تاریخ "
          class="dark-datepicker"
        />
      </div>
      <div class="flex gap-2">
        <button
          v-for="option in filterOptions"
          :key="option.value"
          @click="selectedFilter = option.value"
          :class="['transition-colors duration-300 flex items-center', selectedFilter === option.value ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white']"
        >
          <i v-if="option.icon" :class="['ml-2', option.icon]"></i>
          {{ option.label }}
        </button>
      </div>
    </div>
    <!-- آمارهای کلی بالا -->
    <div v-if="filteredStats.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 mb-8">
      <div v-for="stat in filteredStats" :key="stat.title" class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl flex flex-col items-end">
        <div class="flex items-center w-full justify-between mb-2 p-4">
          <span class="flex items-center text-lg font-bold text-gray-900 dark:text-white">
            <i v-if="stat.icon" :class="['ml-2', stat.icon]"></i>
            {{ stat.title }}
          </span>
          <span class="text-2xl font-extrabold text-gray-900 dark:text-white">{{ stat.value }}</span>
        </div>
        <div class="w-full mb-2">
          <ApexChart
            :series="[{ name: stat.title, data: stat.chartData ? stat.chartData : [stat.value] }]"
            :categories="stat.categories ? stat.categories : ['']"
            type="line"
            :height="50"
            :color="stat.trend === 'up' ? '#22c55e' : '#ef4444'"
            :showFill="false"
            :smooth="true"
          />
        </div>
        <span v-if="stat.trend === 'up'" class="text-green-500 flex items-center text-xs font-bold p-4">
          <i class="ti ti-arrow-up-right ml-1"></i>صعودی
        </span>
        <span v-else-if="stat.trend === 'down'" class="text-red-500 flex items-center text-xs font-bold p-4">
          <i class="ti ti-arrow-down-right ml-1"></i>نزولی
        </span>
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center h-40 text-gray-600 dark:text-gray-400">
      <i class="ti ti-database-off text-4xl mb-2"></i>
      <span>داده‌ای در این بازه زمانی موجود نیست</span>
    </div>
        <!-- گرید پروفایل‌های ایجاد شده و گزارشات تخلف -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- پروفایل‌های ایجاد شده (لیست پروفایل بزرگ) -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <h2 class="font-bold text-lg text-gray-900 dark:text-white">پروفایل‌های ایجاد شده</h2>
          <button class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">افزودن پروفایل جدید</button>
        <ul class="divide-y divide-gray-200 dark:divide-slate-700 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent" style="max-height: 300px; overflow-y: auto;">
          <li v-for="card in cards" :key="card.id">
            <router-link
              :to="`/profile/${card.id}`"
              class="flex items-center justify-between px-6 py-4 dm-hover-bg transition cursor-pointer no-underline text-gray-900 dark:text-white"
            >
              <div class="flex items-center gap-3">
                <i class="ti ti-credit-card text-xl text-gray-600 dark:text-gray-400"></i>
                <span class="font-medium">{{ card.title }}</span>
              </div>
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ card.createdAt }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      <!-- گزارشات تخلف (لیست بزرگ) -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-0 flex flex-col">
        <div class="p-6 border-gray-200 dark:border-slate-700 border-b flex items-center justify-between">
          <h2 class="font-bold text-lg text-gray-900 dark:text-white">گزارشات تخلف</h2>
        </div>
        <ul class="divide-y divide-gray-200 dark:divide-slate-700 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent" style="max-height: 300px; overflow-y: auto;">
          <li v-for="report in reports" :key="report.id">
            <router-link
              :to="`/reports/${report.id}`"
              class="flex items-center justify-between px-6 py-4 dm-hover-bg transition cursor-pointer no-underline text-gray-900 dark:text-white"
            >
              <div class="flex items-center gap-3">
                <i class="ti ti-alert-triangle text-xl text-red-400"></i>
                <span class="font-medium">{{ report.message }}</span>
              </div>
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ report.date }}</span>
            </router-link>
          </li>
        </ul>
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
      title: 'پروفایل‌های ایجاد شده',
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
  ],
  month: [
    {
      title: 'پروفایل‌های ایجاد شده',
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
  ],
  '3month': [
    {
      title: 'پروفایل‌های ایجاد شده',
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
  ],
}

const filteredStats = computed(() => {
  if (dateRange.value.start && dateRange.value.end) {
    return []
  }
  return statsData[selectedFilter.value as keyof typeof statsData] || []
})

const cards = ref([
  { id: 1, title: 'پروفایل اول', createdAt: '1403/04/01', value: 10 },
  { id: 2, title: 'پروفایل دوم', createdAt: '1403/04/05', value: 15 },
  { id: 3, title: 'پروفایل سوم', createdAt: '1403/04/10', value: 8 },
  { id: 4, title: 'پروفایل چهارم', createdAt: '1403/04/15', value: 20 },
  { id: 5, title: 'پروفایل پنجم', createdAt: '1403/04/20', value: 12 }
])

const reports = ref([
  { id: 1, message: 'تخلف ثبت شده توسط کاربر X', date: '1403/04/01', value: 2 },
  { id: 2, message: 'تخلف ثبت شده توسط کاربر Y', date: '1403/04/05', value: 1 },
  { id: 3, message: 'تخلف ثبت شده توسط کاربر Z', date: '1403/04/10', value: 3 },
  { id: 4, message: 'تخلف ثبت شده توسط کاربر W', date: '1403/04/15', value: 2 },
  { id: 5, message: 'تخلف ثبت شده توسط کاربر V', date: '1403/04/20', value: 1 }
])
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
/* حذف استایل قبلی دکمه‌ها */
button,
button[class*="blue"],
button[class*="#0057ff"] {
  background: unset !important;
  color: unset !important;
  border-color: unset !important;
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
