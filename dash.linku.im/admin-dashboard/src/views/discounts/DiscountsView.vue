<template>
  <div class="w-full p-4 sm:p-6 lg:p-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">مدیریت کدهای تخفیف</h1>
      <p class="text-gray-600 dark:text-gray-400">ایجاد و مدیریت کدهای تخفیف برای اشتراک ویژه</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 sm:p-3 rounded-full bg-blue-100 dark:bg-blue-900 flex-shrink-0">

            <i class="ti ti-discount text-blue-600 dark:text-blue-400 text-lg sm:text-xl"></i>
          </div>
          <div class="mr-3 sm:mr-4 min-w-0">
            <p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">کل کدها</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{{ discountCodes.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 sm:p-3 rounded-full bg-green-100 dark:bg-green-900 flex-shrink-0">
            <i class="ti ti-check text-green-600 dark:text-green-400 text-lg sm:text-xl"></i>
          </div>
          <div class="mr-3 sm:mr-4 min-w-0">
            <p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">فعال</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{{ activeDiscounts }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 sm:p-3 rounded-full bg-orange-100 dark:bg-orange-900 flex-shrink-0">
            <i class="ti ti-shopping-cart text-orange-600 dark:text-orange-400 text-lg sm:text-xl"></i>
          </div>
          <div class="mr-3 sm:mr-4 min-w-0">
            <p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">استفاده شده</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{{ totalUsed }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 sm:p-3 rounded-full bg-purple-100 dark:bg-purple-900 flex-shrink-0">
            <i class="ti ti-currency-rial text-purple-600 dark:text-purple-400 text-lg sm:text-xl"></i>
          </div>
          <div class="mr-3 sm:mr-4 min-w-0">
            <p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">صرفه‌جویی</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{{
                formatCurrency(totalSavings)
              }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div  class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <!-- Header -->
      <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">لیست کدهای تخفیف</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">مجموع {{ filteredDiscounts.length }} کد تخفیف</p>
          </div>
          <button @click="showAddModal = true"
                  class="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <i class="ti ti-plus"></i>
            <span>کد تخفیف جدید</span>
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="relative">
            <i class="ti ti-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
            <input v-model="searchQuery" type="text" placeholder="جستجو کد، عنوان..."
                   class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
          </div>

          <div class="relative dropdown-container">
            <button
                @click="showTypeDropdown = !showTypeDropdown"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-right flex items-center justify-between"
            >
              <span>{{ getTypeDisplayName(filterType) }}</span>
              <i class="ti ti-chevron-down transition-transform duration-200"
                 :class="{ 'rotate-180': showTypeDropdown }"></i>
            </button>
            <ul v-if="showTypeDropdown"
                class="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg mt-1 shadow-lg z-20 max-h-60 overflow-y-auto">
              <li @click="selectType('')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-gray-900 dark:text-white">
                همه انواع
              </li>
              <li @click="selectType('percentage')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-gray-900 dark:text-white">
                درصدی
              </li>
              <li @click="selectType('fixed')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-gray-900 dark:text-white">
                مقدار ثابت
              </li>
            </ul>
          </div>

          <div class="relative dropdown-container">
            <button
                @click="showStatusDropdown = !showStatusDropdown"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-right flex items-center justify-between"
            >
              <span>{{ getStatusDisplayName(filterStatus) }}</span>
              <i class="ti ti-chevron-down transition-transform duration-200"
                 :class="{ 'rotate-180': showStatusDropdown }"></i>
            </button>
            <ul v-if="showStatusDropdown"
                class="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg mt-1 shadow-lg z-20 max-h-60 overflow-y-auto">
              <li @click="selectStatus('')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-gray-900 dark:text-white">
                همه وضعیت‌ها
              </li>
              <li @click="selectStatus('active')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-gray-900 dark:text-white">
                فعال
              </li>
              <li @click="selectStatus('inactive')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-gray-900 dark:text-white">
                غیرفعال
              </li>
              <li @click="selectStatus('expired')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-gray-900 dark:text-white">
                منقضی شده
              </li>
            </ul>
          </div>

          <div class="relative dropdown-container">
            <button
                @click="showSortDropdown = !showSortDropdown"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-right flex items-center justify-between"
            >
              <span>{{ getSortDisplayName(sortBy) }}</span>
              <i class="ti ti-chevron-down transition-transform duration-200"
                 :class="{ 'rotate-180': showSortDropdown }"></i>
            </button>
            <ul v-if="showSortDropdown"
                class="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg mt-1 shadow-lg z-20 max-h-60 overflow-y-auto">
              <li @click="selectSort('created_desc')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-gray-900 dark:text-white">
                جدیدترین
              </li>
              <li @click="selectSort('created_asc')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-gray-900 dark:text-white">
                قدیمی‌ترین
              </li>
              <li @click="selectSort('usage_desc')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-gray-900 dark:text-white">
                پراستفاده‌ترین
              </li>
              <li @click="selectSort('expiry_asc')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-gray-900 dark:text-white">
                زودتر منقضی
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Discount Codes List -->
      <div class="p-2">
        <!-- Desktop Table View -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                کد تخفیف
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                عنوان
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                نوع تخفیف
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                میزان تخفیف
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                استفاده
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                انقضا
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                وضعیت
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                عملیات
              </th>
            </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="discount in paginatedDiscounts" :key="discount.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-900">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div v-if="(discount as any).icon" class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                    <img :src="(discount as any).icon" class="w-full h-full object-cover" alt="Icon" />
                  </div>
                  <div v-else class="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900 flex-shrink-0">
                    <i class="ti ti-discount-2 text-blue-600 dark:text-blue-400 text-xl"></i>
                  </div>
                  <code
                      class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-mono text-sm">
                    {{ discount.code }}
                  </code>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ discount.title }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ discount.description }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    discount.type === 'percentage' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200']">
                    {{ discount.type === 'percentage' ? 'درصدی' : 'مقدار ثابت' }}
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ discount.type === 'percentage' ? `${discount.value}%` : formatCurrency(discount.value) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ discount.usedCount }} / {{ discount.maxUsage || '∞' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatDate(discount.expiryDate) || 'بدون انقضا' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span
                      :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', getStatusClasses(discount)]">
                    {{ getStatusText(discount) }}
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <button @click="editDiscount(discount)"
                          class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    <i class="ti ti-edit"></i>
                  </button>
                  <button @click="toggleDiscountStatus(discount)"
                          class="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300">
                    <i class="ti ti-power"></i>
                  </button>
                  <button @click="deleteDiscount(discount)"
                          class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    <i class="ti ti-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="lg:hidden space-y-4">
          <div v-for="discount in paginatedDiscounts" :key="discount.id"
               class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <!-- Header with Icon, Code and Status -->
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div v-if="(discount as any).icon" class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                  <img :src="(discount as any).icon" class="w-full h-full object-cover" alt="Icon" />
                </div>
                <div v-else class="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900 flex-shrink-0">
                  <i class="ti ti-discount-2 text-blue-600 dark:text-blue-400 text-xl"></i>
                </div>
                <code
                    class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-mono text-sm">
                  {{ discount.code }}
                </code>
              </div>
              <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', getStatusClasses(discount)]">
                {{ getStatusText(discount) }}
              </span>
            </div>

            <!-- Title and Description -->
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ discount.title }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ discount.description }}</p>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span class="text-gray-500 dark:text-gray-400">نوع تخفیف:</span>
                <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-2',
                  discount.type === 'percentage' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200']">
                  {{ discount.type === 'percentage' ? 'درصدی' : 'مقدار ثابت' }}
                </span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">میزان:</span>
                <span class="text-gray-900 dark:text-white font-medium mr-2">
                  {{ discount.type === 'percentage' ? `${discount.value}%` : formatCurrency(discount.value) }}
                </span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">استفاده:</span>
                <span class="text-gray-900 dark:text-white font-medium mr-2">
                  {{ discount.usedCount }} / {{ discount.maxUsage || '∞' }}
                </span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">انقضا:</span>
                <span class="text-gray-900 dark:text-white font-medium mr-2">
                  {{ formatDate(discount.expiryDate) || 'بدون انقضا' }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button @click="editDiscount(discount)"
                      class="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                <i class="ti ti-edit"></i>
                <span>ویرایش</span>
              </button>
              <button @click="toggleDiscountStatus(discount)"
                      class="flex items-center gap-1 px-3 py-2 text-sm text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors">
                <i class="ti ti-power"></i>
                <span>{{ discount.active ? 'غیرفعال' : 'فعال' }}</span>
              </button>
              <button @click="deleteDiscount(discount)"
                      class="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                <i class="ti ti-trash"></i>
                <span>حذف</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Enhanced Pagination -->
        <div v-if="totalPages > 1"
             class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
          <!-- Page Info -->
          <div class="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
            نمایش {{ ((currentPage - 1) * itemsPerPage) + 1 }} تا
            {{ Math.min(currentPage * itemsPerPage, filteredDiscounts.length) }} از {{ filteredDiscounts.length }} مورد
          </div>

          <!-- Pagination Controls -->
          <div class="flex items-center gap-2 order-1 sm:order-2">
            <!-- First Page -->
            <button
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                class="hidden sm:flex px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i class="ti ti-chevrons-right"></i>
            </button>

            <!-- Previous Page -->
            <button
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="flex items-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i class="ti ti-chevron-right ml-1"></i>
              <span class="hidden sm:inline">قبلی</span>
            </button>

            <!-- Page Numbers -->
            <div class="hidden sm:flex items-center gap-1">
              <template v-for="page in visiblePages" :key="page">
                <button
                    v-if="page !== '...'"
                    @click="currentPage = Number(page)"
                    :class="[
                    'px-3 py-2 text-sm rounded-lg transition-colors',
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  {{ page }}
                </button>
                <span v-else class="px-2 text-gray-400">...</span>
              </template>
            </div>

            <!-- Current Page Display for Mobile -->
            <div class="sm:hidden flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
              {{ currentPage }} / {{ totalPages }}
            </div>

            <!-- Next Page -->
            <button
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="flex items-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span class="hidden sm:inline">بعدی</span>
              <i class="ti ti-chevron-left mr-1"></i>
            </button>

            <!-- Last Page -->
            <button
                @click="currentPage = totalPages"
                :disabled="currentPage === totalPages"
                class="hidden sm:flex px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i class="ti ti-chevrons-left"></i>
            </button>
          </div>

          <!-- Items Per Page -->
          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 order-3">
            <span class="hidden sm:inline">تعداد در صفحه:</span>
            <div class="relative dropdown-container">
              <button
                  @click="showItemsPerPageDropdown = !showItemsPerPageDropdown"
                  class="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span>{{ itemsPerPage }}</span>
                <i class="ti ti-chevron-down text-xs transition-transform duration-200"
                   :class="{ 'rotate-180': showItemsPerPageDropdown }"></i>
              </button>
              <ul v-if="showItemsPerPageDropdown"
                  class="absolute bottom-full left-0 mb-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-20 min-w-[80px]">
                <li v-for="size in [5, 10, 25, 50]" :key="size"
                    @click="changeItemsPerPage(size)"
                    class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-gray-900 dark:text-white text-center"
                    :class="{ 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': itemsPerPage === size }"
                >
                  {{ size }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" @click="closeModals"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div @click.stop
           class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ editingDiscount ? 'ویرایش کد تخفیف' : 'افزودن کد تخفیف جدید' }}
          </h3>
        </div>

        <form @submit.prevent="saveDiscount" class="p-4 sm:p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">کد تخفیف *</label>
            <input v-model="formData.code" type="text" required :disabled="!!editingDiscount"
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عنوان *</label>
            <input v-model="formData.title" type="text" required
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">توضیحات</label>
            <textarea v-model="formData.description" rows="3"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"></textarea>
          </div>

          <!-- Banner Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">بنر تبلیغاتی</label>
            <div class="space-y-2">
              <input
                type="file"
                @change="handleBannerUpload"
                accept="image/*"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:ml-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer hover:file:bg-blue-600"
              />
              <div v-if="bannerPreview || formData.banner" class="relative w-full h-32 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                <img :src="bannerPreview || formData.banner" class="w-full h-full object-cover" alt="Banner preview" />
                <button
                  type="button"
                  @click="removeBanner"
                  class="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                >
                  <i class="ti ti-x text-sm"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Icon Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">آیکون</label>
            <div class="space-y-2">
              <input
                type="file"
                @change="handleIconUpload"
                accept="image/*"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:ml-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer hover:file:bg-blue-600"
              />
              <div v-if="iconPreview || formData.icon" class="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                <img :src="iconPreview || formData.icon" class="w-full h-full object-cover" alt="Icon preview" />
                <button
                  type="button"
                  @click="removeIcon"
                  class="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                >
                  <i class="ti ti-x text-xs"></i>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نوع تخفیف *</label>
            <div class="relative dropdown-container">
              <button
                  @click="showModalTypeDropdown = !showModalTypeDropdown"
                  type="button"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-right flex items-center justify-between"
              >
                <span>{{ formData.type === 'percentage' ? 'درصدی' : 'مقدار ثابت' }}</span>
                <i class="ti ti-chevron-down transition-transform duration-200"
                   :class="{ 'rotate-180': showModalTypeDropdown }"></i>
              </button>
              <ul v-if="showModalTypeDropdown"
                  class="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg mt-1 shadow-lg z-30 max-h-60 overflow-y-auto">
                <li @click="selectModalType('percentage')"
                    class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-gray-900 dark:text-white">
                  درصدی
                </li>
                <li @click="selectModalType('fixed')"
                    class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-gray-900 dark:text-white">
                  مقدار ثابت
                </li>
              </ul>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              میزان تخفیف * {{ formData.type === 'percentage' ? '(%)' : '(تومان)' }}
            </label>
            <input v-model.number="formData.value" type="number" required :min="0"
                   :max="formData.type === 'percentage' ? 100 : undefined"
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">حداکثر استفاده</label>
            <input v-model.number="formData.maxUsage" type="number" min="1"
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                   placeholder="برای بدون محدودیت خالی بگذارید">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تاریخ انقضا</label>
            <date-picker
                v-model="formData.expiryDate"
                format="jYYYY/jMM/jDD"
                display-format="jYYYY/jMM/jDD"
                placeholder="تاریخ انقضا"
                class="dark-datepicker w-full"
            />
          </div>

          <div class="flex items-center justify-end gap-3 pt-4">
            <button type="button" @click="closeModals"
                    class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              لغو
            </button>
            <button type="submit"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {{ editingDiscount ? 'ویرایش' : 'افزودن' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from 'vue'
import {useAlert} from '@/composables/useAlert'
import DatePicker from 'vue3-persian-datetime-picker'
import {useDiscountStore} from "@/stores/discount.ts";
import jalaali from 'jalaali-js';

defineOptions({
  name: 'DiscountsView'
})

const {showSuccess, showDeleteConfirm} = useAlert()

interface DiscountCode {
  id: number
  code: string
  title: string
  description: string
  type: 'percentage' | 'fixed'
  value: number
  maxUsage?: number
  usedCount: number
  expiryDate?: string
  active: boolean
  createdAt: string
  banner?: string
  icon?: string
}

// Reactive data
const searchQuery = ref('')
const filterType = ref('')
const filterStatus = ref('')
const sortBy = ref('created_desc')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showAddModal = ref(false)
const showEditModal = ref(false)
const showTypeDropdown = ref(false)
const showStatusDropdown = ref(false)
const showSortDropdown = ref(false)
const showModalTypeDropdown = ref(false)
const showItemsPerPageDropdown = ref(false)
const editingDiscount = ref<DiscountCode | null>(null)
const discountStore = useDiscountStore()

const formData = ref({
  code: '',
  title: '',
  description: '',
  type: 'percentage' as 'percentage' | 'fixed',
  value: 0,
  maxUsage: undefined as number | undefined,
  expiryDate: '',
  banner: null as string | null,
  icon: null as string | null
})

// File upload refs
const bannerFile = ref<File | null>(null)
const iconFile = ref<File | null>(null)
const bannerPreview = ref<string | null>(null)
const iconPreview = ref<string | null>(null)

// Sample data
const discountCodes = computed(()=>discountStore.discounts)

// Computed properties
const activeDiscounts = computed(() => discountCodes.value.filter(d => d.active && !isExpired(d)).length)
const totalUsed = computed(() => discountCodes.value.reduce((sum, d) => sum + d.usedCount, 0))
const totalSavings = computed(() => discountCodes.value.reduce((sum, d) => {
  if (d.type === 'percentage') {
    // Assuming average purchase of 100k toman
    return sum + (d.usedCount * 100000 * (d.value / 100))
  } else {
    return sum + (d.usedCount * d.value)
  }
}, 0))

const filteredDiscounts = computed(() => {
  let filtered = [...discountCodes.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(d =>
        d.code.toLowerCase().includes(query) ||
        d.title.toLowerCase().includes(query)
    )
  }

  if (filterType.value) {
    filtered = filtered.filter(d => d.type === filterType.value)
  }

  if (filterStatus.value) {
    filtered = filtered.filter(d => {
      if (filterStatus.value === 'active') return d.active && !isExpired(d)
      if (filterStatus.value === 'inactive') return !d.active
      if (filterStatus.value === 'expired') return isExpired(d)
      return true
    })
  }

  // Sort
  switch (sortBy.value) {
    case 'created_desc':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'created_asc':
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case 'usage_desc':
      filtered.sort((a, b) => b.usedCount - a.usedCount)
      break
    case 'expiry_asc':
      filtered.sort((a, b) => {
        if (!a.expiryDate && !b.expiryDate) return 0
        if (!a.expiryDate) return 1
        if (!b.expiryDate) return -1
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
      })
      break
  }

  return filtered
})

const paginatedDiscounts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredDiscounts.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredDiscounts.value.length / itemsPerPage.value))

// Pagination helper for visible page numbers
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    // Show all pages if total is 7 or less
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Show first page
    pages.push(1)

    if (current <= 4) {
      // Show pages 2, 3, 4, 5, ..., last
      for (let i = 2; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // Show 1, ..., last-4, last-3, last-2, last-1, last
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Show 1, ..., current-1, current, current+1, ..., last
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

// Functions
const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('fa-IR')} تومان`
}

const isExpired = (discount: DiscountCode): boolean => {
  if (!discount.expiryDate) return false
  return new Date(discount.expiryDate) < new Date()
}

const getStatusClasses = (discount: DiscountCode): string => {
  if (isExpired(discount)) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  if (discount.active) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const getStatusText = (discount: DiscountCode): string => {
  if (isExpired(discount)) return 'منقضی شده'
  if (discount.active) return 'فعال'
  return 'غیرفعال'
}

const editDiscount = async (discount: DiscountCode) => {
  editingDiscount.value = discount
  formData.value = {
    code: discount.code,
    title: discount.title,
    description: discount.description,
    type: discount.type,
    value: discount.value,
    maxUsage: discount.maxUsage,
    expiryDate: discount.expiryDate || '',
    banner: (discount as any).banner || null,
    icon: (discount as any).icon || null
  }
  
  // Load existing images for preview
  bannerPreview.value = null
  iconPreview.value = null
  bannerFile.value = null
  iconFile.value = null
  
  showEditModal.value = true
}
const normalizePersianDigits = (str: string): string => {
  return str.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
}

const toGregorian = (shamsiDate: string): string => {
  if (!shamsiDate || typeof shamsiDate !== 'string') return ''

  const normalized = normalizePersianDigits(shamsiDate)
  const parts = normalized.split('/')
  if (parts.length !== 3) return ''

  const [jy, jm, jd] = parts.map(Number)
  if (!jy || !jm || !jd) return ''

  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd)
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`
}

const toJalaali = (gregorianDate: string | Date): string => {
  const dateStr = typeof gregorianDate === 'string'
      ? gregorianDate
      : gregorianDate.toISOString().split('T')[0] // "YYYY-MM-DD"

  const [gy, gm, gd] = dateStr.split('-').map(Number)
  const { jy, jm, jd } = jalaali.toJalaali(gy, gm, gd)
  return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`
}

const formatDate = (date: string | null | undefined): string => {
  if (!date || typeof date !== 'string' || date.trim() === '') return 'بدون انقضا'

  const normalized = normalizePersianDigits(date)

  if (/^(13|14)\d{2}\/\d{1,2}\/\d{1,2}$/.test(normalized)) {
    return date
  }

  return toJalaali(date)
}

// Image upload handlers
const handleBannerUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    bannerFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      bannerPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleIconUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    iconFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      iconPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeBanner = () => {
  bannerFile.value = null
  bannerPreview.value = null
  formData.value.banner = null
}

const removeIcon = () => {
  iconFile.value = null
  iconPreview.value = null
  formData.value.icon = null
}

// مثال استفاده
const saveDiscount = async () => {
  // Build FormData if there are image files
  const hasImages = bannerFile.value || iconFile.value
  
  if (editingDiscount.value) {
    // Update existing
    if (hasImages) {
      const formDataObj = new FormData()
      formDataObj.append('code', formData.value.code)
      formDataObj.append('title', formData.value.title)
      formDataObj.append('description', formData.value.description || '')
      formDataObj.append('type', formData.value.type)
      formDataObj.append('value', formData.value.value.toString())
      if (formData.value.maxUsage) {
        formDataObj.append('maxUsage', formData.value.maxUsage.toString())
      }
      if (formData.value.expiryDate) {
        formDataObj.append('expiryDate', toGregorian(formData.value.expiryDate))
      }
      if (bannerFile.value) {
        formDataObj.append('banner', bannerFile.value)
      }
      if (iconFile.value) {
        formDataObj.append('icon', iconFile.value)
      }
      
      await discountStore.updateDiscount(editingDiscount.value.id, formDataObj as any)
    } else {
      await discountStore.updateDiscount(editingDiscount.value.id, formData.value)
    }
    
    Object.assign(editingDiscount.value, formData.value)
    await showSuccess('ویرایش موفق', 'کد تخفیف با موفقیت ویرایش شد')
  } else {
    // Add new
    if (hasImages) {
      const formDataObj = new FormData()
      formDataObj.append('code', formData.value.code)
      formDataObj.append('title', formData.value.title)
      formDataObj.append('description', formData.value.description || '')
      formDataObj.append('type', formData.value.type)
      formDataObj.append('value', formData.value.value.toString())
      if (formData.value.maxUsage) {
        formDataObj.append('maxUsage', formData.value.maxUsage.toString())
      }
      if (formData.value.expiryDate) {
        formDataObj.append('expiryDate', toGregorian(formData.value.expiryDate))
      }
      if (bannerFile.value) {
        formDataObj.append('banner', bannerFile.value)
      }
      if (iconFile.value) {
        formDataObj.append('icon', iconFile.value)
      }
      
      await discountStore.createDiscount(formDataObj as any)
    } else {
      const newDiscount: DiscountCode = {
        id: Date.now(),
        ...formData.value,
        usedCount: 0,
        active: true,
        createdAt: new Date().toISOString().split('T')[0] ,// "2025-10-25"
        expiryDate: toGregorian(formData.value.expiryDate)
      }
      await discountStore.createDiscount(newDiscount)
    }
    
    await showSuccess('افزودن موفق', 'کد تخفیف با موفقیت اضافه شد')
  }

  closeModals()
}

const toggleDiscountStatus = (discount: DiscountCode) => {
  discount.active = !discount.active
  discountStore.toggleDiscountStatus(discount.id,discount.active)
  showSuccess('تغییر وضعیت', `کد تخفیف ${discount.active ? 'فعال' : 'غیرفعال'} شد`)
}

const deleteDiscount = async (discount: DiscountCode) => {
  try {
    const confirmed = await showDeleteConfirm(
        'حذف کد تخفیف',
        `آیا از حذف کد تخفیف "${discount.code}" اطمینان دارید؟`,
        discount.title
    )

    if (confirmed) {
      await discountStore.deleteDiscount(discount.id)
      const index = discountCodes.value.findIndex(d => d.id === discount.id)
      if (index > -1) {
        discountCodes.value.splice(index, 1)
        await showSuccess('حذف موفق', 'کد تخفیف با موفقیت حذف شد')
      }
    }
  } catch (error) {
    console.error('Error deleting discount:', error)
  }
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingDiscount.value = null
  
  // Clear image states
  bannerFile.value = null
  iconFile.value = null
  bannerPreview.value = null
  iconPreview.value = null
  
  if (showAddModal.value === false) {
    /*formData.value = {
      code: '',
      title: '',
      description: '',
      type: 'percentage',
      value: 0,
      maxUsage: undefined,
      expiryDate: ''
    }*/
  }
}

// Dropdown helper functions
const getTypeDisplayName = (type: string): string => {
  switch (type) {
    case 'percentage':
      return 'درصدی'
    case 'fixed':
      return 'مقدار ثابت'
    default:
      return 'همه انواع'
  }
}

const selectType = (type: string) => {
  filterType.value = type
  showTypeDropdown.value = false
}

const selectStatus = (status: string) => {
  filterStatus.value = status
  showStatusDropdown.value = false
}

const selectSort = (sort: string) => {
  sortBy.value = sort
  showSortDropdown.value = false
}

const getStatusDisplayName = (status: string): string => {
  switch (status) {
    case 'active':
      return 'فعال'
    case 'inactive':
      return 'غیرفعال'
    case 'expired':
      return 'منقضی شده'
    default:
      return 'همه وضعیت‌ها'
  }
}

const getSortDisplayName = (sort: string): string => {
  switch (sort) {
    case 'created_desc':
      return 'جدیدترین'
    case 'created_asc':
      return 'قدیمی‌ترین'
    case 'usage_desc':
      return 'پراستفاده‌ترین'
    case 'expiry_asc':
      return 'زودتر منقضی'
    default:
      return 'جدیدترین'
  }
}

const selectModalType = (type: 'percentage' | 'fixed') => {
  formData.value.type = type
  showModalTypeDropdown.value = false
}

// Pagination functions
const changeItemsPerPage = (size: number) => {
  itemsPerPage.value = size
  currentPage.value = 1
  showItemsPerPageDropdown.value = false
}

// Outside click functionality
const handleOutsideClick = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown-container')) {
    showTypeDropdown.value = false
    showStatusDropdown.value = false
    showSortDropdown.value = false
    showModalTypeDropdown.value = false
    showItemsPerPageDropdown.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', handleOutsideClick)
  await discountStore.fetchDiscounts()
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<style>
/* Persian DatePicker Styles */
.dark-datepicker .vpd-input-group,
.dark-datepicker .vpd-input,
.dark-datepicker .vpd-picker,
.dark-datepicker .vpd-content,
.dark-datepicker .vpd-calendar,
.dark-datepicker .vpd-title {
  background: #fff !important;
  color: #222 !important;
  border-color: #d1d5db !important;
}

.dark-datepicker .vpd-input {
  color: #222 !important;
  min-width: 120px;
  text-align: center;
  padding: 8px 12px !important;
  border-radius: 8px !important;
}

.vpd-container {
  overflow: hidden;
  position: relative;
  border-radius: 12px;
}

.vpd-dir-rtl .vpd-next {
  float: left;
  display: flex !important;
  align-items: center !important;
  justify-content: center;
  background: #f6f6f6 !important;
}

.vpd-dir-rtl .vpd-prev {
  float: right;
  display: flex !important;
  align-items: center !important;
  justify-content: center;
  background: #f6f6f6 !important;
}

.vpd-header,
.vpd-day-effect {
  background-color: #3b82f6 !important;
}

.vpd-addon-list-item.vpd-selected {
  font-weight: 700;
  background-color: #3b82f6 !important;
  color: white !important;
}

.vpd-month-list .vpd-addon-list-item {
  height: 54px;
  line-height: 46px;
  border-radius: 10px !important;
}
</style>
