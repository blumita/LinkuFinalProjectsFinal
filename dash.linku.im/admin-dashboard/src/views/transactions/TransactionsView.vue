<template>
  <div class="p-4 sm:p-6 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">مدیریت تراکنش‌ها</h1>
        <p class="text-gray-600 dark:text-gray-400">پیگیری و مدیریت تراکنش‌های خرید اشتراک</p>
      </div>
      <div class="flex gap-3 flex-wrap">
        <button
          @click="showExportModal = true"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
        >
          <i class="ti ti-file-export"></i>
          <span class="hidden sm:inline">خروجی اکسل</span>
          <span class="sm:hidden">اکسل</span>
        </button>
        <button
          @click="refreshTransactions"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
        >
          <i class="ti ti-refresh"></i>
          <span class="hidden sm:inline">بروزرسانی</span>
          <span class="sm:hidden">بروز</span>
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 text-center">
        <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-2">
          <i class="ti ti-currency-rial text-green-600 dark:text-green-400 text-sm"></i>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">کل درآمد</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatCurrency(stats.totalRevenue) }}</p>
      </div>

      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 text-center">
        <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-2">
          <i class="ti ti-shopping-cart text-blue-600 dark:text-blue-400 text-sm"></i>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">کل تراکنش‌ها</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ stats.totalTransactions }}</p>
      </div>

      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 text-center">
        <div class="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mx-auto mb-2">
          <i class="ti ti-calendar text-amber-600 dark:text-amber-400 text-sm"></i>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">این ماه</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatCurrency(stats.monthlyRevenue) }}</p>
      </div>

      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 text-center">
        <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-2">
          <i class="ti ti-percentage text-purple-600 dark:text-purple-400 text-sm"></i>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">نرخ موفقیت</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ stats.successRate }}%</p>
      </div>
    </div>

    <!-- Filters & Search -->
    <!-- Desktop Filters -->
    <div class="hidden sm:block bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 sm:p-6 mb-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <i class="ti ti-filter text-blue-500"></i>
          فیلترهای جستجو
        </h3>
        <button
          @click="clearFilters"
          class="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <i class="ti ti-x text-sm"></i>
          پاک کردن همه
        </button>
      </div>

      <!-- Mobile-first responsive layout -->
      <div class="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:gap-4">
        <!-- Search Input -->
        <div class="sm:col-span-2 lg:col-span-1 xl:col-span-1">
          <label class="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center gap-1">
            <i class="ti ti-search text-gray-400 text-sm"></i>
            جستجو
          </label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="کد تراکنش، نام کاربر یا ایمیل..."
            class="w-full bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>

        <!-- Status Filter -->
        <div>
          <label class="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center gap-1">
            <i class="ti ti-flag text-gray-400 text-sm"></i>
            وضعیت
          </label>
          <div class="relative dropdown-container">
            <button
              @click="showStatusDropdown = !showStatusDropdown"
              class="w-full bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-right flex items-center justify-between hover:bg-gray-100 dark:hover:bg-slate-600"
            >
              <span class="flex items-center truncate">
                <i :class="getStatusIcon(filterStatus)" class="ml-2 text-sm"></i>
                <span class="truncate">{{ getStatusDisplayName(filterStatus) }}</span>
              </span>
              <i class="ti ti-chevron-down transition-transform duration-200 text-gray-400 flex-shrink-0 mr-1" :class="{ 'rotate-180': showStatusDropdown }"></i>
            </button>
            <ul v-if="showStatusDropdown" class="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg mt-1 shadow-lg z-30 max-h-60 overflow-y-auto">
              <li @click="selectStatus('')" class="px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white transition-colors">
                <i class="ti ti-list ml-2 text-gray-500 text-sm"></i>
                <span class="text-sm">همه وضعیت‌ها</span>
              </li>
              <li @click="selectStatus('success')" class="px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white transition-colors">
                <i class="ti ti-check ml-2 text-green-500 text-sm"></i>
                <span class="text-sm">موفق</span>
              </li>
              <li @click="selectStatus('failed')" class="px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white transition-colors">
                <i class="ti ti-x ml-2 text-red-500 text-sm"></i>
                <span class="text-sm">ناموفق</span>
              </li>
              <li @click="selectStatus('pending')" class="px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white transition-colors">
                <i class="ti ti-clock ml-2 text-yellow-500 text-sm"></i>
                <span class="text-sm">در انتظار</span>
              </li>
              <li @click="selectStatus('refunded')" class="px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white transition-colors">
                <i class="ti ti-arrow-back ml-2 text-orange-500 text-sm"></i>
                <span class="text-sm">بازگشت داده شده</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Payment Method Filter -->
        <div>
          <label class="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center gap-1">
            <i class="ti ti-credit-card text-gray-400 text-sm"></i>
            درگاه پرداخت
          </label>
          <div class="relative dropdown-container">
            <button
              @click="showPaymentDropdown = !showPaymentDropdown"
              class="w-full bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-right flex items-center justify-between hover:bg-gray-100 dark:hover:bg-slate-600"
            >
              <span class="flex items-center truncate">
                <i :class="getPaymentIcon(filterPaymentMethod)" class="ml-2 text-sm"></i>
                <span class="truncate">{{ getPaymentDisplayName(filterPaymentMethod) }}</span>
              </span>
              <i class="ti ti-chevron-down transition-transform duration-200 text-gray-400 flex-shrink-0 mr-1" :class="{ 'rotate-180': showPaymentDropdown }"></i>
            </button>
            <ul v-if="showPaymentDropdown" class="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg mt-1 shadow-lg z-30 max-h-60 overflow-y-auto">
              <li @click="selectPayment('')" class="px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white transition-colors">
                <i class="ti ti-list ml-2 text-gray-500 text-sm"></i>
                <span class="text-sm">همه درگاه‌ها</span>
              </li>
              <li @click="selectPayment('zarinpal')" class="px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white transition-colors">
                <i class="ti ti-brand-mastercard ml-2 text-green-500 text-sm"></i>
                <span class="text-sm">زرین‌پال</span>
              </li>
              <li @click="selectPayment('mellat')" class="px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white transition-colors">
                <i class="ti ti-building-bank ml-2 text-blue-500 text-sm"></i>
                <span class="text-sm">بانک ملت</span>
              </li>
              <li @click="selectPayment('pasargad')" class="px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white transition-colors">
                <i class="ti ti-building-bank ml-2 text-purple-500 text-sm"></i>
                <span class="text-sm">پاسارگاد</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Date From -->
        <div>
          <label class="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center gap-1">
            <i class="ti ti-calendar text-gray-400 text-sm"></i>
            از تاریخ
          </label>
          <div class="date-picker-wrapper">
            <date-picker
              v-model="dateFrom"
              format="YYYY/MM/DD"
              display-format="jYYYY/jMM/jDD"
              :editable="false"
              :clearable="true"
              placeholder="انتخاب تاریخ شروع"
              class="w-full"
              :class-name="'date-picker-custom'"
              :input-class="'w-full bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300'"
            />
          </div>
        </div>

        <!-- Date To -->
        <div>
          <label class="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center gap-1">
            <i class="ti ti-calendar-check text-gray-400 text-sm"></i>
            تا تاریخ
          </label>
          <div class="date-picker-wrapper">
            <date-picker
              v-model="dateTo"
              format="YYYY/MM/DD"
              display-format="jYYYY/jMM/jDD"
              :editable="false"
              :clearable="true"
              placeholder="انتخاب تاریخ پایان"
              class="w-full"
              :class-name="'date-picker-custom'"
              :input-class="'w-full bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300'"
            />
          </div>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs text-gray-500 dark:text-gray-400 mb-1">فیلترهای فعال:</span>
          <div class="flex flex-wrap gap-2">
            <span v-if="searchQuery" class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-xs">
              <i class="ti ti-search text-xs"></i>
              جستجو: {{ searchQuery }}
              <button @click="searchQuery = ''" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                <i class="ti ti-x text-xs"></i>
              </button>
            </span>
            <span v-if="filterStatus" class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg text-xs">
              <i :class="getStatusIcon(filterStatus)" class="text-xs"></i>
              {{ getStatusDisplayName(filterStatus) }}
              <button @click="filterStatus = ''" class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200">
                <i class="ti ti-x text-xs"></i>
              </button>
            </span>
            <span v-if="filterPaymentMethod" class="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-lg text-xs">
              <i class="ti ti-credit-card text-xs"></i>
              {{ getPaymentDisplayName(filterPaymentMethod) }}
              <button @click="filterPaymentMethod = ''" class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200">
                <i class="ti ti-x text-xs"></i>
              </button>
            </span>
            <span v-if="dateFrom || dateTo" class="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-lg text-xs">
              <i class="ti ti-calendar text-xs"></i>
              تاریخ: {{ formatDateRange() }}
              <button @click="dateFrom = null; dateTo = null" class="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200">
                <i class="ti ti-x text-xs"></i>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Simple Search -->
    <div class="sm:hidden bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 mb-4 mobile-filter-container">
      <div class="flex items-center gap-3 mb-3">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو در تراکنش‌ها..."
            class="w-full bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
        </div>
        <div class="flex gap-2">
          <button
            @click="showQuickFilter = !showQuickFilter"
            class="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-3 py-2.5 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-slate-600 relative"
          >
            <i class="ti ti-adjustments text-lg"></i>
            <span v-if="hasActiveFilters" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{{ activeFiltersCount }}</span>
          </button>
          <button
            @click="clearFilters"
            v-if="hasActiveFilters"
            class="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-2.5 rounded-lg transition-all hover:bg-red-200 dark:hover:bg-red-900/50"
          >
            <i class="ti ti-x text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Quick Filter Options -->
      <div v-if="showQuickFilter" class="border-t border-gray-200 dark:border-slate-700 pt-3 space-y-3">
        <!-- Status Filter -->
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">وضعیت</label>
          <div class="flex gap-2 overflow-x-auto pb-1">
            <button
              @click="filterStatus = ''"
              :class="[
                'flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                !filterStatus ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              ]"
            >
              همه
            </button>
            <button
              @click="filterStatus = 'success'"
              :class="[
                'flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1',
                filterStatus === 'success' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              ]"
            >
              <i class="ti ti-check text-xs"></i>
              موفق
            </button>
            <button
              @click="filterStatus = 'failed'"
              :class="[
                'flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1',
                filterStatus === 'failed' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              ]"
            >
              <i class="ti ti-x text-xs"></i>
              ناموفق
            </button>
            <button
              @click="filterStatus = 'pending'"
              :class="[
                'flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1',
                filterStatus === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              ]"
            >
              <i class="ti ti-clock text-xs"></i>
              در انتظار
            </button>
          </div>
        </div>

        <!-- Payment Method Filter -->
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">درگاه پرداخت</label>
          <div class="flex gap-2 overflow-x-auto pb-1">
            <button
              @click="filterPaymentMethod = ''"
              :class="[
                'flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                !filterPaymentMethod ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              ]"
            >
              همه
            </button>
            <button
              @click="filterPaymentMethod = 'zarinpal'"
              :class="[
                'flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                filterPaymentMethod === 'zarinpal' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              ]"
            >
              زرین‌پال
            </button>
            <button
              @click="filterPaymentMethod = 'mellat'"
              :class="[
                'flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                filterPaymentMethod === 'mellat' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              ]"
            >
              ملت
            </button>
            <button
              @click="filterPaymentMethod = 'pasargad'"
              :class="[
                'flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                filterPaymentMethod === 'pasargad' ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              ]"
            >
              پاسارگاد
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Transactions Grid -->
    <div class="mb-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
      <span>
        نمایش {{ paginatedTransactions.length }} از {{ filteredTransactions.length }} تراکنش
        <span v-if="filteredTransactions.length !== transactions.length" class="text-blue-600 dark:text-blue-400">
          (فیلتر شده از {{ transactions.length }})
        </span>
      </span>
      <span v-if="hasActiveFilters" class="text-orange-600 dark:text-orange-400 flex items-center gap-1">
        <i class="ti ti-filter text-sm"></i>
        {{ activeFiltersCount }} فیلتر فعال
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <!-- Empty State -->
      <div v-if="filteredTransactions.length === 0" class="col-span-full">
        <div class="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
            <i class="ti ti-search text-gray-400 text-2xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">تراکنشی یافت نشد</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">
            هیچ تراکنشی با معیارهای جستجوی شما یافت نشد
          </p>
          <button
            @click="clearFilters"
            v-if="hasActiveFilters"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto"
          >
            <i class="ti ti-x"></i>
            پاک کردن فیلترها
          </button>
        </div>
      </div>

      <!-- Transaction Cards -->
      <div
        v-else
        v-for="transaction in paginatedTransactions"
        :key="transaction.id"
        class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
      >
        <!-- Background Pattern -->
        <div class="absolute top-0 right-0 w-20 h-20 opacity-5">
          <i :class="getStatusIcon(transaction.status)" class="text-6xl text-gray-400"></i>
        </div>

        <!-- Transaction Header -->
        <div class="flex items-start justify-between mb-4 relative z-10">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                 :class="getStatusBackgroundClass(transaction.status)">
              <i :class="getStatusIcon(transaction.status)" class="text-white text-lg"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white text-lg">{{ transaction.transactionId }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">{{ transaction.username }}</p>
            </div>
          </div>
          <span
            class="inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm"
            :class="getStatusClasses(transaction.status)"
          >
            {{ getStatusText(transaction.status) }}
          </span>
        </div>

        <!-- Transaction Details -->
        <div class="space-y-3 mb-4">
          <div class="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">طرح اشتراک</span>
              <i class="ti ti-crown text-yellow-500"></i>
            </div>
            <p class="font-semibold text-gray-900 dark:text-white">{{ transaction.planTitle }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ transaction.planDuration }}</p>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">مبلغ پرداختی</span>
            <div class="text-left">
              <span class="text-lg font-bold text-gray-900 dark:text-white">{{ formatCurrency(transaction.amount) }}</span>
              <div v-if="transaction.originalAmount && transaction.originalAmount !== transaction.amount" class="text-xs text-gray-500 dark:text-gray-400 line-through">
                {{ formatCurrency(transaction.originalAmount) }}
              </div>
            </div>
          </div>

          <div v-if="transaction.discountCode" class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-orange-700 dark:text-orange-300">کد تخفیف</span>
              <i class="ti ti-discount text-orange-500"></i>
            </div>
            <code class="text-sm font-mono bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-2 py-1 rounded block">
              {{ transaction.discountCode }}
            </code>
            <p class="text-xs text-orange-600 dark:text-orange-400 mt-1">
              تخفیف: {{ formatCurrency(transaction.discountAmount || 0) }}
            </p>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">درگاه پرداخت</span>
            <div class="flex items-center gap-2">
              <div :class="['w-3 h-3 rounded-full shadow-sm', getPaymentMethodColor(transaction.paymentMethod)]"></div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ getPaymentMethodName(transaction.paymentMethod) }}</span>
            </div>
          </div>
        </div>

        <!-- Transaction Footer -->
        <div class="flex items-center justify-between pt-3 mt-4 border-t border-gray-200 dark:border-slate-600">
          <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <i class="ti ti-calendar text-sm"></i>
            {{ formatDate(transaction.createdAt) }}
          </span>
          <div class="flex items-center gap-1">
            <button
              @click="viewTransaction(transaction)"
              class="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300"
              title="مشاهده جزئیات"
            >
              <i class="ti ti-eye text-lg"></i>
            </button>
            <button
              v-if="transaction.status === 'success'"
              @click="refundTransaction(transaction)"
              class="p-2 text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-300"
              title="بازگشت مبلغ"
            >
              <i class="ti ti-arrow-back text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex items-center justify-center">
      <div class="flex items-center gap-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="flex items-center gap-1 px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <i class="ti ti-chevron-right text-sm"></i>
          <span class="hidden sm:inline">قبلی</span>
        </button>

        <!-- Page info - more compact on mobile -->
        <div class="flex items-center gap-1 px-2 sm:px-4">
          <span class="text-sm text-gray-700 dark:text-gray-300">
            <span class="sm:hidden">{{ currentPage }}/{{ totalPages }}</span>
            <span class="hidden sm:inline">صفحه {{ currentPage }} از {{ totalPages }}</span>
          </span>
        </div>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="flex items-center gap-1 px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <span class="hidden sm:inline">بعدی</span>
          <i class="ti ti-chevron-left text-sm"></i>
        </button>
      </div>
    </div>

    <!-- Transaction Detail Modal -->
        <div v-if="showDetailModal" @click="showDetailModal = false" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div @click.stop class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl w-full max-w-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-slate-700/50">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">جزئیات تراکنش</h2>
          <button @click="showDetailModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-slate-700/50 transition-all">
            <i class="ti ti-x text-xl"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div v-if="selectedTransaction" class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">کد تراکنش</label>
              <p class="text-lg font-mono bg-gray-100 dark:bg-slate-700 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white">{{ selectedTransaction.transactionId }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">وضعیت</label>
              <span :class="['inline-flex px-3 py-1 text-sm font-semibold rounded-full', getStatusClasses(selectedTransaction.status)]">
                <i :class="getStatusIcon(selectedTransaction.status)" class="ml-1"></i>
                {{ getStatusText(selectedTransaction.status) }}
              </span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نام کاربر</label>
              <p class="text-sm text-gray-900 dark:text-white font-medium">{{ selectedTransaction.username }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">طرح اشتراک</label>
              <p class="text-sm text-gray-900 dark:text-white">{{ selectedTransaction.planTitle }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ selectedTransaction.planDuration }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">درگاه پرداخت</label>
              <div class="flex items-center gap-2">
                <div :class="['w-3 h-3 rounded-full', getPaymentMethodColor(selectedTransaction.paymentMethod)]"></div>
                <span class="text-sm text-gray-900 dark:text-white">{{ getPaymentMethodName(selectedTransaction.paymentMethod) }}</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">مبلغ نهایی</label>
              <p class="text-lg font-bold text-green-600 dark:text-green-400">{{ formatCurrency(selectedTransaction.amount) }}</p>
            </div>

            <div v-if="selectedTransaction.originalAmount && selectedTransaction.originalAmount !== selectedTransaction.amount">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">مبلغ اولیه</label>
              <p class="text-sm text-gray-500 dark:text-gray-400 line-through">{{ formatCurrency(selectedTransaction.originalAmount) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تاریخ تراکنش</label>
              <p class="text-sm text-gray-900 dark:text-white flex items-center gap-1">
                <i class="ti ti-calendar text-gray-400"></i>
                {{ formatDate(selectedTransaction.createdAt) }}
              </p>
            </div>
          </div>

          <div v-if="selectedTransaction.discountCode" class="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
            <h4 class="text-sm font-bold text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-2">
              <i class="ti ti-discount text-orange-600"></i>
              اطلاعات تخفیف
            </h4>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-orange-700 dark:text-orange-300 mb-1">کد تخفیف</p>
                <code class="bg-orange-200 dark:bg-orange-800/80 text-orange-800 dark:text-orange-200 px-2 py-1 rounded font-mono text-sm block">{{ selectedTransaction.discountCode }}</code>
              </div>
              <div>
                <p class="text-xs text-orange-700 dark:text-orange-300 mb-1">مبلغ تخفیف</p>
                <p class="text-sm font-bold text-orange-800 dark:text-orange-200">{{ formatCurrency(selectedTransaction.discountAmount || 0) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200/50 dark:border-slate-700/50">
          <button
            @click="showDetailModal = false"
            class="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100/80 dark:bg-slate-700/80 hover:bg-gray-200/80 dark:hover:bg-slate-600/80 rounded-xl transition-all backdrop-blur-sm"
          >
            بستن
          </button>
          <button
            v-if="selectedTransaction && selectedTransaction.status === 'success'"
            @click="refundTransaction(selectedTransaction); showDetailModal = false"
            class="px-5 py-2.5 bg-orange-600/90 hover:bg-orange-700/90 text-white rounded-xl transition-all backdrop-blur-sm shadow-lg flex items-center gap-2"
          >
            <i class="ti ti-arrow-back"></i>
            بازگشت مبلغ
          </button>
        </div>
      </div>
    </div>

    <!-- Export Excel Modal -->
    <div v-if="showExportModal" @click="showExportModal = false" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div @click.stop class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl w-full max-w-md shadow-2xl border border-white/20 dark:border-slate-700/50">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-slate-700/50">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">خروجی اکسل تراکنش‌ها</h2>
          <button @click="showExportModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-slate-700/50 transition-all">
            <i class="ti ti-x text-xl"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <p class="text-gray-600 dark:text-gray-400 text-center">
            آیا می‌خواهید تراکنش‌های فیلتر شده را دانلود کنید؟
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-500 text-center mt-2">
            {{ filteredTransactions.length }} تراکنش
          </p>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200/50 dark:border-slate-700/50">
          <button
            @click="showExportModal = false"
            class="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100/80 dark:bg-slate-700/80 hover:bg-gray-200/80 dark:hover:bg-slate-600/80 rounded-xl transition-all backdrop-blur-sm"
          >
            انصراف
          </button>
          <button
            @click="exportToExcel"
            class="px-5 py-2.5 bg-green-600/90 hover:bg-green-700/90 text-white rounded-xl transition-all backdrop-blur-sm shadow-lg flex items-center gap-2"
          >
            <i class="ti ti-download"></i>
            دانلود
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAlert } from '@/composables/useAlert'
import DatePicker from 'vue3-persian-datetime-picker'
import '@/assets/vue3-persian-datetime-picker-dark.css'
import {useTransactionStore} from "@/stores/transactions.ts";
import jalaali from "jalaali-js";

defineOptions({
  name: 'TransactionsView'
})

const { showSuccess, showDeleteConfirm } = useAlert()

interface Transaction {
  id: number
  transactionId: string
  username: string
  userEmail: string
  planTitle: string
  planDuration: string
  amount: number
  originalAmount?: number
  discountCode?: string
  discountAmount?: number
  paymentMethod: 'zarinpal' | 'mellat' | 'pasargad'
  status: 'success' | 'failed' | 'pending' | 'refunded'
  createdAt: string
}

// Reactive data
const searchQuery = ref('')
const filterStatus = ref('')
const filterPaymentMethod = ref('')
const dateFrom = ref<string | Date | null>(null)
const dateTo = ref<string | Date | null>(null)
const currentPage = ref(1)
const itemsPerPage = 6
const showDetailModal = ref(false)
const showExportModal = ref(false)
const selectedTransaction = ref<Transaction | null>(null)

// Dropdown states
const showStatusDropdown = ref(false)
const showPaymentDropdown = ref(false)
const showQuickFilter = ref(false)
const transactionsStore=useTransactionStore()
const stats = computed(() => ({
  totalRevenue: transactionsStore.totalRevenue,
  totalTransactions: transactionsStore.totalTransactions,
  monthlyRevenue: transactionsStore.monthlyRevenue,
  successRate: transactionsStore.successRate
}))
const toJalaali = (gregorianDate: string | Date): string => {
  const dateStr = typeof gregorianDate === 'string'
      ? gregorianDate
      : gregorianDate.toISOString().split('T')[0] // "YYYY-MM-DD"

  const [gy, gm, gd] = dateStr.split('-').map(Number)
  const { jy, jm, jd } = jalaali.toJalaali(gy, gm, gd)
  return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`
}
const formatDate = (date: string | null | undefined): string => {
  if (!date || typeof date !== 'string' || date.trim() === '') return ''

  const normalized = normalizePersianDigits(date)

  if (/^(13|14)\d{2}\/\d{1,2}\/\d{1,2}$/.test(normalized)) {
    return date
  }

  return toJalaali(date)
}
const normalizePersianDigits = (str: string): string => {
  return str.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
}

// Sample transactions data
const transactions=computed(()=>transactionsStore.transactions)
// Computed properties
const filteredTransactions = computed(() => {
  let filtered = [...transactions.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t =>
      t.transactionId.toLowerCase().includes(query) ||
      t.username.toLowerCase().includes(query) ||
      t.userEmail.toLowerCase().includes(query)
    )
  }

  if (filterStatus.value) {
    filtered = filtered.filter(t => t.status === filterStatus.value)
  }

  if (filterPaymentMethod.value) {
    filtered = filtered.filter(t => t.paymentMethod === filterPaymentMethod.value)
  }

  // Date filtering with Persian date picker
  if (dateFrom.value || dateTo.value) {
    filtered = filtered.filter(t => {
      const transactionDate = t.createdAt.split(' ')[0] // Get date part only (1403/04/22)

      // Simple string comparison for Persian dates
      if (dateFrom.value) {
        const fromDateStr = dateFrom.value.toString()
        if (transactionDate < fromDateStr) return false
      }

      if (dateTo.value) {
        const toDateStr = dateTo.value.toString()
        if (transactionDate > toDateStr) return false
      }

      return true
    })
  }

  return filtered
})

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTransactions.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage))

// Helper Functions
const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('fa-IR')} تومان`
}

const getStatusClasses = (status: string): string => {
  const classes = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    refunded: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: string): string => {
  const texts = {
    success: 'موفق',
    failed: 'ناموفق',
    pending: 'در انتظار',
    refunded: 'بازگشت داده شده'
  }
  return texts[status as keyof typeof texts] || 'نامشخص'
}

const getStatusIcon = (status: string): string => {
  const icons = {
    success: 'ti ti-check',
    failed: 'ti ti-x',
    pending: 'ti ti-clock',
    refunded: 'ti ti-arrow-back'
  }
  return icons[status as keyof typeof icons] || 'ti ti-help'
}

const getStatusBackgroundClass = (status: string): string => {
  const classes = {
    success: 'bg-green-500',
    failed: 'bg-red-500',
    pending: 'bg-yellow-500',
    refunded: 'bg-orange-500'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-500'
}

const getPaymentMethodName = (method: string): string => {
  const names = {
    zarinpal: 'زرین‌پال',
    mellat: 'بانک ملت',
    pasargad: 'پاسارگاد'
  }
  return names[method as keyof typeof names] || method
}

const getPaymentMethodColor = (method: string): string => {
  const colors = {
    zarinpal: 'bg-green-500',
    mellat: 'bg-blue-500',
    pasargad: 'bg-purple-500'
  }
  return colors[method as keyof typeof colors] || 'bg-gray-500'
}

// Dropdown helper functions
const getStatusDisplayName = (status: string): string => {
  if (!status) return 'همه وضعیت‌ها'
  return getStatusText(status)
}

const selectStatus = (status: string) => {
  filterStatus.value = status
  showStatusDropdown.value = false
}

const getPaymentDisplayName = (method: string): string => {
  if (!method) return 'همه درگاه‌ها'
  return getPaymentMethodName(method)
}

const getPaymentIcon = (method: string): string => {
  if (!method) return 'ti ti-list text-gray-500'
  const icons = {
    zarinpal: 'ti ti-brand-mastercard text-green-500',
    mellat: 'ti ti-building-bank text-blue-500',
    pasargad: 'ti ti-building-bank text-purple-500'
  }
  return icons[method as keyof typeof icons] || 'ti ti-list text-gray-500'
}

const selectPayment = (method: string) => {
  filterPaymentMethod.value = method
  showPaymentDropdown.value = false
}

// Action Functions
const refreshTransactions = () => {
  // Simulate API call to refresh transactions
  console.log('تراکنش‌ها بروزرسانی شدند')
}

// Helper computed for active filters
const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || filterStatus.value || filterPaymentMethod.value || dateFrom.value || dateTo.value)
})

// Count active filters
const activeFiltersCount = computed(() => {
  let count = 0
  if (searchQuery.value) count++
  if (filterStatus.value) count++
  if (filterPaymentMethod.value) count++
  if (dateFrom.value || dateTo.value) count++
  return count
})

// Format date range for display
const formatDateRange = () => {
  if (dateFrom.value && dateTo.value) {
    return `${dateFrom.value} تا ${dateTo.value}`
  } else if (dateFrom.value) {
    return `از ${dateFrom.value}`
  } else if (dateTo.value) {
    return `تا ${dateTo.value}`
  }
  return ''
}

const clearFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterPaymentMethod.value = ''
  dateFrom.value = null
  dateTo.value = null
  currentPage.value = 1
}

const viewTransaction = (transaction: Transaction) => {
  selectedTransaction.value = transaction
  showDetailModal.value = true
}

const refundTransaction = async (transaction: Transaction) => {
  try {
    const confirmed = await showDeleteConfirm(
      'بازگشت تراکنش',
      `آیا از بازگشت مبلغ ${formatCurrency(transaction.amount)} به کاربر ${transaction.username} اطمینان دارید؟`,
      transaction.transactionId
    )

    if (confirmed) {
      transaction.status = 'refunded'
      showSuccess('بازگشت موفق', 'مبلغ تراکنش با موفقیت بازگشت داده شد')
    }
  } catch (error) {
    console.error('Error refunding transaction:', error)
  }
}

const exportToExcel = () => {
  try {
    // Create export data
    const exportData = filteredTransactions.value.map(transaction => ({
      'کد تراکنش': transaction.transactionId,
      'نام کاربر': transaction.username,
      'ایمیل': transaction.userEmail,
      'طرح اشتراک': transaction.planTitle,
      'مدت اشتراک': transaction.planDuration,
      'مبلغ نهایی': transaction.amount,
      'مبلغ اولیه': transaction.originalAmount || transaction.amount,
      'کد تخفیف': transaction.discountCode || '',
      'مبلغ تخفیف': transaction.discountAmount || 0,
      'درگاه پرداخت': getPaymentMethodName(transaction.paymentMethod),
      'وضعیت': getStatusText(transaction.status),
      'تاریخ ایجاد': transaction.createdAt
    }))

    // Create CSV
    const headers = Object.keys(exportData[0]).join(',')
    const rows = exportData.map(row =>
      Object.values(row).map(val =>
        `"${String(val).replace(/"/g, '""')}"`
      ).join(',')
    )
    const csvContent = [headers, ...rows].join('\n')

    // Download
    const now = new Date()
    const timestamp = now.toLocaleDateString('fa-IR').replace(/\//g, '-') + '_' +
                     now.getHours().toString().padStart(2, '0') + '-' +
                     now.getMinutes().toString().padStart(2, '0')
    const fileName = `تراکنش‌ها_${timestamp}.csv`

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    link.click()
    URL.revokeObjectURL(link.href)

    console.log(`✅ ${exportData.length} تراکنش با موفقیت دانلود شد`)
    showExportModal.value = false
  } catch (error) {
    console.error('Error exporting transactions:', error)
  }
}

// Outside click functionality
const handleOutsideClick = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown-container')) {
    showStatusDropdown.value = false
    showPaymentDropdown.value = false
  }
  if (!target.closest('.mobile-filter-container')) {
    showQuickFilter.value = false
  }
}
onMounted(async () => {
  await transactionsStore.fetchTransactions()

  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<style scoped>
/* Custom date picker styles */
:deep(.date-picker-custom) {
  width: 100%;
}

:deep(.date-picker-custom .mx-input) {
  width: 100% !important;
  background-color: rgb(249 250 251);
  border: 1px solid rgb(229 231 235);
  color: rgb(17 24 39);
  border-radius: 0.5rem;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  transition: all 0.3s;
}

:deep(.dark .date-picker-custom .mx-input) {
  background-color: rgb(51 65 85);
  border-color: rgb(71 85 105);
  color: rgb(255 255 255);
}

:deep(.date-picker-custom .mx-input:focus) {
  outline: none;
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.5);
}

:deep(.date-picker-custom .mx-input::placeholder) {
  color: rgb(156 163 175);
}

:deep(.dark .date-picker-custom .mx-input::placeholder) {
  color: rgb(107 114 128);
}

/* Responsive improvements */
@media (max-width: 640px) {
  :deep(.date-picker-custom .mx-input) {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* Dropdown improvements for mobile */
.dropdown-container ul {
  max-height: 50vh;
}

@media (max-width: 640px) {
  .dropdown-container ul {
    position: fixed;
    left: 1rem;
    right: 1rem;
    top: auto;
    max-height: 40vh;
    z-index: 50;
  }

  /* Smooth scrolling on mobile */
  .grid {
    scroll-behavior: smooth;
  }

  /* Better touch targets */
  button {
    min-height: 44px;
  }

  /* Improved horizontal scroll for filters */
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .overflow-x-auto::-webkit-scrollbar {
    display: none;
  }
}

/* Loading skeleton animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Enhanced focus states for accessibility */
button:focus-visible,
input:focus-visible {
  outline: 2px solid rgb(59 130 246);
  outline-offset: 2px;
}

/* Better mobile tap highlights */
@media (max-width: 640px) {
  button, a {
    -webkit-tap-highlight-color: rgba(59, 130, 246, 0.2);
  }
}
</style>

