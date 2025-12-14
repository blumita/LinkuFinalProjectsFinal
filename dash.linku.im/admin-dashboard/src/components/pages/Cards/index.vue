<template>
  <div class="p-4 sm:p-6 min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
    <!-- Success Message -->
    <div
      v-if="showSuccessMessage"
      class="fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex items-center gap-3 transition-all duration-300"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>{{ successMessage }}</span>
      <button
        @click="showSuccessMessage = false"
        class="text-white hover:text-green-200 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">مدیریت پروفایل‌های ویزیت</h1>
        <p class="text-gray-600 dark:text-gray-400">مدیریت و نمایش پروفایل‌های ویزیت دیجیتال</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Bulk Actions -->
        <div v-if="selectedCards.length > 0" class="flex items-center gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ selectedCards.length }} پروفایل انتخاب شده</span>
          <button
            @click="deleteSelectedCards"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 text-sm"
          >
            <i class="ti ti-trash text-lg"></i>
            حذف انتخاب شده
          </button>
          <button
            @click="clearSelection"
            class="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors duration-300 text-sm"
          >
            لغو انتخاب
          </button>
        </div>

        <router-link
          :to="{ name: 'create-card' }"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-xl transition-colors duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span class="hidden sm:inline">افزودن پروفایل جدید</span>
          <span class="sm:hidden">جدید</span>
        </router-link>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
      <!-- Skeleton Loader for Stats -->
      <template v-if="loading">
        <div v-for="i in 3" :key="i" class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 transition-colors duration-300 animate-pulse">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
              <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </template>

      <!-- Actual Stats Cards -->
      <template v-else>
        <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 transition-colors duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">همه پروفایل‌ها</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalCards }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 transition-colors duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">کارت‌های فعال</p>
              <p class="text-2xl font-bold text-green-600">{{ activeCardsCount }}</p>
            </div>
            <div class="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 transition-colors duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">کارت‌های غیرفعال</p>
              <p class="text-2xl font-bold text-red-600">{{ inactiveCardsCount }}</p>
            </div>
            <div class="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Advanced Search & Filters -->
    <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6 mb-8 transition-colors duration-300">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <!-- Profile ID Search -->
        <div class="lg:col-span-2">
          <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">جستجو بر اساس شناسه پروفایل</label>
          <div class="relative">
            <input
              v-model.trim="profileIdSearch"
              @input="searchByProfileId"
              placeholder="مثال: 04E1F322E81490"
              class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 pr-12 placeholder:text-gray-500 dark:text-gray-500"
            />
            <svg class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <div v-if="foundCard" class="mt-3 p-3 bg-green-50 border border-green-100 rounded-lg">
            <div class="font-semibold text-green-800">{{ foundCard.ownerName }}</div>
            <div class="text-sm text-green-600">شناسه لایسنس: {{ foundCard.qrLink.split('/').slice(-2, -1)[0] }}</div>
            <div class="text-sm text-green-600">مدل کارت: {{ foundCard.qrLink.split('/').pop() }}</div>
            <a :href="foundCard.qrLink" target="_blank" class="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1 mt-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              مشاهده کارت
            </a>
          </div>
          <div v-else-if="profileIdSearch" class="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
            کارتی با این شناسه پروفایل یافت نشد
          </div>
        </div>

        <!-- General Search -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">جستجو عمومی</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو در نام یا توضیحات..."
              class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 pr-12 placeholder:text-gray-500 dark:text-gray-500"
            >
            <svg class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">وضعیت</label>
          <div class="relative" @click="toggleStatusDropdown">
            <button
              class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 flex items-center justify-between"
              type="button"
            >
              <span>{{ getStatusLabel(statusFilter) }}</span>
              <svg class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': showStatusDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div v-if="showStatusDropdown" class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl z-10">
              <ul class="py-2">
                <li>
                  <button
                    @click="selectStatus('')"
                    class="w-full px-4 py-2 text-right hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150 text-gray-700 dark:text-gray-300"
                    :class="{ 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400': statusFilter === '' }"
                  >
                    همه وضعیت‌ها
                  </button>
                </li>
                <li>
                  <button
                    @click="selectStatus('active')"
                    class="w-full px-4 py-2 text-right hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                    :class="{ 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400': statusFilter === 'active' }"
                  >
                    فعال
                  </button>
                </li>
                <li>
                  <button
                    @click="selectStatus('inactive')"
                    class="w-full px-4 py-2 text-right hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                    :class="{ 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400': statusFilter === 'inactive' }"
                  >
                    غیرفعال
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden transition-colors duration-300">
      <!-- Loading Skeleton -->
      <template v-if="loading">
        <div class="p-6">
          <div class="animate-pulse space-y-4">
            <div v-for="i in 5" :key="i" class="flex items-center gap-4 p-4 border border-gray-200 dark:border-slate-700 rounded-xl">
              <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
              <div class="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </template>

      <!-- Mobile View -->
      <div v-else class="sm:hidden">
        <div class="divide-y border-gray-200 dark:border-slate-700">
          <div
            v-for="card in paginatedCards"
            :key="card.id"
            :class="['p-4 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-300', { 'bg-white dark:bg-slate-800': selectedCards.includes(card.id) }]"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3">
                <input
                  type="checkbox"
                  :checked="selectedCards.includes(card.id)"
                  @change="toggleCardSelection(card.id)"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-300 mt-1"
                >
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {{ getInitials(card.ownerName) }}
                </div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-white">{{ card.ownerName }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-500">{{ card.id }}</div>
                </div>
              </div>
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border"
                :class="[
                  card.status === 'active'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                ]"
              >
                {{ card.status === 'active' ? 'فعال' : 'غیرفعال' }}
              </span>
            </div>

            <div class="mb-3">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">شناسه لایسنس</div>
              <div class="font-mono text-sm bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded border border-gray-100 dark:border-gray-600 inline-block">
                {{ card.qrLink.split('/').slice(-2, -1)[0] }}
              </div>
            </div>

            <div class="mb-3">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">مدل کارت</div>
              <div class="font-mono text-sm bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded border border-gray-100 dark:border-gray-600 inline-block">
                {{ card.qrLink.split('/').pop() }}
              </div>
            </div>

            <div class="mb-3">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">لایسنس کارت</div>
              <div class="flex items-center gap-2">
                <div class="font-mono text-xs bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded border border-gray-100 dark:border-gray-600 flex-1 truncate">
                  {{ card.qrLink }}
                </div>
                <button
                  @click="copyToClipboard(card.qrLink)"
                  class="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 rounded transition-colors duration-150"
                  title="کپی لایسنس"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ card.createdAt }}</div>
              <div class="flex items-center gap-1">
                <router-link
                  :to="{ name: 'edit-card', params: { id: card.id } }"
                  class="inline-flex items-center px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors duration-150 border border-blue-500"
                  title="ویرایش"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </router-link>
                <button
                  @click="viewQR(card)"
                  class="inline-flex items-center px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded transition-colors duration-150 border border-purple-500"
                  title="مشاهده QR"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01m-5.01 0h.01"></path>
                  </svg>
                </button>
                <button
                  @click="deleteCard(card.id)"
                  class="inline-flex items-center px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors duration-150 border border-red-500"
                  title="حذف"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop View -->
      <div v-else class="hidden sm:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-100 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-700">
            <tr>
              <th class="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white w-12">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-300"
                >
              </th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">نام صاحب کارت</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">شناسه لایسنس</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">مدل کارت</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">لینک کامل</th>
              <th class="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">وضعیت</th>
              <th class="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">تاریخ ایجاد</th>
              <th class="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y border-gray-200 dark:border-slate-700">
            <tr
              v-for="card in paginatedCards"
              :key="card.id"
              :class="['hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-300', { 'bg-white dark:bg-slate-800': selectedCards.includes(card.id) }]"
            >
              <td class="px-6 py-4 text-center">
                <input
                  type="checkbox"
                  :checked="selectedCards.includes(card.id)"
                  @change="toggleCardSelection(card.id)"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-300"
                >
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {{ getInitials(card.ownerName) }}
                  </div>
                  <div>
                    <div class="font-semibold text-gray-900 dark:text-white">{{ card.ownerName }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-500">{{ card.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="font-mono text-sm bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-lg inline-block border-gray-200 dark:border-slate-700 border">
                  {{ card.qrLink.split('/').slice(-2, -1)[0] }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="font-mono text-sm bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-lg inline-block border-gray-200 dark:border-slate-700 border">
                  {{ card.qrLink.split('/').pop() }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="font-mono text-xs bg-gray-100 dark:bg-slate-700 px-3 py-2 rounded-lg border-gray-200 dark:border-slate-700 border max-w-xs truncate">
                    {{ card.qrLink }}
                  </div>
                  <button
                    @click="copyToClipboard(card.qrLink)"
                    class="p-2 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-300"
                    title="کپی لینک کامل"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                  :class="[
                    card.status === 'active'
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700'
                      : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700'
                  ]"
                >
                  {{ card.status === 'active' ? 'فعال' : 'غیرفعال' }}
                </span>
              </td>
              <td class="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                {{ card.createdAt }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-1">
                  <router-link
                    :to="{ name: 'edit-card', params: { id: card.id } }"
                    class="inline-flex items-center px-2.5 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded-md transition-colors duration-300 border border-gray-500"
                    title="ویرایش"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </router-link>
                  <button
                    @click="viewQR(card)"
                    class="inline-flex items-center px-2.5 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded-md transition-colors duration-300 border border-gray-500"
                    title="مشاهده QR"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01m-5.01 0h.01"></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteCard(card.id)"
                    class="inline-flex items-center px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition-colors duration-150 border border-red-500"
                    title="حذف"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
          نمایش {{ startItem }} تا {{ endItem }} از {{ filteredCards.length }} کارت
        </div>
        <div class="flex items-center gap-2 order-1 sm:order-2">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            قبلی
          </button>
          <div class="flex items-center gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              class="px-3 py-2 text-sm rounded-md transition-colors duration-300"
              :class="[
                currentPage === page
                  ? 'bg-gray-500 text-white border border-gray-500'
                  : 'border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
              ]"
            >
              {{ page }}
            </button>
          </div>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
          >
            بعدی
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredCards.length === 0" class="text-center py-16">
      <div class="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-gray-600">
        <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">هیچ کارتی یافت نشد</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">برای شروع، اولین کارت ویزیت خود را ایجاد کنید</p>
      <router-link
        :to="{ name: 'create-card' }"
        class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 border border-blue-600 inline-block"
      >
        ایجاد کارت جدید
      </router-link>
    </div>

    <!-- QR Modal -->
    <div
      v-if="showQRModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="backdrop-filter: blur(8px)"
    >
      <!-- Backdrop -->
      <div
        @click="showQRModal = false"
        class="absolute inset-0 bg-black/40"
      ></div>

      <!-- Modal Content -->
      <div
        @click.stop
        class="relative bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center transform transition-all duration-300 scale-100 border border-gray-100 dark:border-gray-700"
      >
        <div class="mb-6">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01m-5.01 0h.01"></path>
            </svg>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">QR کد کارت</h3>
          <p class="text-gray-600 dark:text-gray-300">{{ selectedCard?.ownerName }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">شناسه: {{ selectedCard ? selectedCard.qrLink.split('/').slice(-2, -1)[0] : '' }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">مدل: {{ selectedCard ? selectedCard.qrLink.split('/').pop() : '' }}</p>
        </div>

        <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-6 sm:p-8 rounded-2xl mb-6">
          <div v-if="selectedQRCode" class="mb-4">
            <img :src="selectedQRCode" alt="QR Code" class="mx-auto w-40 sm:w-48 h-40 sm:h-48 rounded-xl bg-white p-4">
          </div>
          <div v-else class="w-40 sm:w-48 h-40 sm:h-48 bg-white mx-auto rounded-xl flex items-center justify-center border-2 border-gray-200 dark:border-gray-500">
            <div class="text-center">
              <svg class="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 dark:text-gray-500 mb-2 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01m-5.01 0h.01"></path>
              </svg>
              <p class="text-gray-500 dark:text-gray-400 text-sm">در حال تولید QR کد...</p>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <button
            @click="downloadQRCode"
            class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2 border border-blue-500"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            دانلود QR کد
          </button>
          <button
            @click="showQRModal = false"
            class="w-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl transition-colors font-medium border border-gray-200 dark:border-gray-600"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import QRCode from 'qrcode'
import { copyToClipboard as copyText } from '@/utils/clipboard'
import { useCardsStore } from '@/stores/cards'

// Types - matching store Card interface
interface Card {
  id: string
  identifier: string
  ownerName: string
  mobile?: string
  description?: string
  cardType?: string
  license: string
  qrLink: string
  image?: string | null
  status: 'active' | 'inactive'
  isUsed: boolean
  createdAt: string
  activatedBy?: {
    id: number
    name: string
    email: string
    mobile?: string | null
    cardSlug: string
  } | null
}

defineOptions({
  name: 'CardsManagement'
})

// Store
const cardsStore = useCardsStore()

// Router
const route = useRoute()

// Search & Filter State
const profileIdSearch = ref('')
const foundCard = ref<null | Card>(null)
const searchQuery = ref('')
const statusFilter = ref('')
const showStatusDropdown = ref(false)

// Pagination State
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modal State
const showQRModal = ref(false)
const selectedCard = ref<Card | null>(null)
const selectedQRCode = ref<string>('')
const showSuccessMessage = ref(false)
const successMessage = ref('')

// Selection State
const selectedCards = ref<string[]>([])

// Get cards from store
const cards = computed(() => cardsStore.cards)
const loading = computed(() => cardsStore.loading)

// Computed Properties
const totalCards = computed(() => cards.value.length)

const activeCardsCount = computed(() => {
  return cards.value.filter(card => card.status === 'active').length
})

const inactiveCardsCount = computed(() => {
  return cards.value.filter(card => card.status === 'inactive').length
})

const filteredCards = computed(() => {
  if (loading.value) return []
  
  return cards.value.filter(card => {
    const matchesSearch = card.ownerName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         card.description?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         String(card.id).toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         card.qrLink?.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus = !statusFilter.value || card.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredCards.value.length / itemsPerPage.value)
})

const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredCards.value.slice(start, end)
})

const isAllSelected = computed(() => {
  return paginatedCards.value.length > 0 &&
         paginatedCards.value.every(card => selectedCards.value.includes(card.id))
})

const startItem = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, filteredCards.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const searchByProfileId = () => {
  const trimmed = profileIdSearch.value.trim().toLowerCase()
  if (!trimmed) {
    foundCard.value = null
    return
  }
  foundCard.value = cards.value.find(c => {
    // Extract license ID from URL: https://linku.im/04E1F322E81490/pqqr
    const parts = c.qrLink.split('/')
    const licenseId = parts[parts.length - 2]?.toLowerCase() || ''
    return licenseId.includes(trimmed)
  }) || null
}

const toggleStatusDropdown = () => {
  showStatusDropdown.value = !showStatusDropdown.value
}

const selectStatus = (status: string) => {
  statusFilter.value = status
  showStatusDropdown.value = false
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return 'فعال'
    case 'inactive': return 'غیرفعال'
    default: return 'همه وضعیت‌ها'
  }
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Watch for qrLink changes to auto-generate QR code
// Reset pagination when filters change
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
})

const deleteCard = (cardId: string) => {
  if (confirm('آیا از حذف این کارت اطمینان دارید؟')) {
    const index = cards.value.findIndex(c => c.id === cardId)
    if (index !== -1) {
      cards.value.splice(index, 1)
    }
  }
}

// Selection Functions
const toggleCardSelection = (cardId: string) => {
  const index = selectedCards.value.indexOf(cardId)
  if (index > -1) {
    selectedCards.value.splice(index, 1)
  } else {
    selectedCards.value.push(cardId)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedCards.value = []
  } else {
    selectedCards.value = paginatedCards.value.map(card => card.id)
  }
}

const clearSelection = () => {
  selectedCards.value = []
}

const deleteSelectedCards = () => {
  if (selectedCards.value.length === 0) return

  if (confirm(`آیا از حذف ${selectedCards.value.length} کارت انتخاب شده اطمینان دارید؟`)) {
    selectedCards.value.forEach(cardId => {
      const index = cards.value.findIndex(c => c.id === cardId)
      if (index !== -1) {
        cards.value.splice(index, 1)
      }
    })
    selectedCards.value = []
    successMessage.value = 'کارت‌های انتخاب شده با موفقیت حذف شدند'
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  }
}

const viewQR = async (card: Card) => {
  selectedCard.value = card

  try {
    // Create QR code canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // Generate basic QR code with higher resolution for modal
    await QRCode.toCanvas(canvas, card.qrLink, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    // Add logo in center
    const logo = new Image()
    logo.crossOrigin = 'anonymous'

    logo.onload = () => {
      // Calculate logo size (about 15% of QR code size)
      const logoSize = canvas.width * 0.15
      const x = (canvas.width - logoSize) / 2
      const y = (canvas.height - logoSize) / 2

      // Create white background circle for logo
      ctx!.fillStyle = 'white'
      ctx!.beginPath()
      ctx!.arc(canvas.width / 2, canvas.height / 2, logoSize / 2 + 8, 0, 2 * Math.PI)
      ctx!.fill()

      // Draw logo
      ctx!.drawImage(logo, x, y, logoSize, logoSize)

      // Convert to data URL
      selectedQRCode.value = canvas.toDataURL()
    }

    logo.onerror = () => {
      // If logo fails to load, use QR without logo
      selectedQRCode.value = canvas.toDataURL()
    }

    // Try to load logo
    logo.src = new URL('/src/assets/images/logo20.png', import.meta.url).href

  } catch (error) {
    console.error('Error generating QR code:', error)
    // Fallback to simple QR code
    try {
      const qrCodeUrl = await QRCode.toDataURL(card.qrLink, {
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      selectedQRCode.value = qrCodeUrl
    } catch (fallbackError) {
      console.error('Fallback QR generation failed:', fallbackError)
    }
  }

  showQRModal.value = true
}

const downloadQRCode = () => {
  if (!selectedQRCode.value || !selectedCard.value) return

  const link = document.createElement('a')
  link.download = `qr-code-${selectedCard.value.id}.png`
  link.href = selectedQRCode.value
  link.click()
}

const copyToClipboard = async (text: string) => {
  try {
    await copyText(text)
    successMessage.value = 'لینک با موفقیت کپی شد'
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  } catch (err) {
    console.error('Failed to copy: ', err)
    successMessage.value = 'خطا در کپی کردن'
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  }
}

// Close dropdown when clicking outside
onMounted(async () => {
  // Fetch cards from API
  await cardsStore.fetchCards()

  // Dark mode is now handled in Header component
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target?.closest('.relative')) {
      showStatusDropdown.value = false
    }
  })

  if (route.query.success) {
    successMessage.value = route.query.success as string
    showSuccessMessage.value = true

    // Auto hide after 5 seconds
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 5000)
  }
})
</script>
