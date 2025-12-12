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
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">مدیریت کارت‌های ویزیت</h1>
        <p class="text-gray-600 dark:text-gray-400">مدیریت و نمایش کارت‌های ویزیت دیجیتال مشتریان</p>
      </div>
      <div class="flex items-center gap-3 flex-wrap">
        <!-- Import Button -->
        <button
          @click="showImportModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-xl transition-colors duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
          <span class="hidden sm:inline">ورودی</span>
        </button>

        <!-- Export Excel Button -->
        <button
          @click="showExcelExportModal = true"
          class="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-3 rounded-xl transition-colors duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span class="hidden sm:inline">خروجی اکسل</span>
          <span class="sm:hidden">اکسل</span>
        </button>

        <!-- Bulk QR Download Button -->
        <button
          @click="showBulkDownloadModal = true"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-3 rounded-xl transition-colors duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          <span class="hidden sm:inline">دانلود دسته‌ای QR</span>
          <span class="sm:hidden">دانلود QR</span>
        </button>

        <!-- Bulk Actions -->
        <div v-if="selectedCards.length > 0" class="flex items-center gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ selectedCards.length }} کارت انتخاب شده</span>
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
          <span class="hidden sm:inline">ایجاد کارت</span>
          <span class="sm:hidden">جدید</span>
        </router-link>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 transition-colors duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">همه کارت‌ها</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ cards.length }}</p>
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
    </div>

    <!-- Advanced Search & Filters -->
    <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6 mb-8 transition-colors duration-300">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <!-- License ID Search -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">جستجو با لایسنس</label>
          <div class="relative">
            <input
              v-model.trim="licenseSearch"
              placeholder="مثال: byli6oxl"
              class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 pr-12 placeholder:text-gray-500 dark:text-gray-500"
            />
            <svg class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
            </svg>
          </div>
        </div>

        <!-- Profile ID Search -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">جستجو با شناسه پروفایل</label>
          <div class="relative">
            <input
              v-model.trim="profileIdSearch"
              placeholder="مثال: 04E1F322E81490"
              class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 pr-12 placeholder:text-gray-500 dark:text-gray-500"
            />
            <svg class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
          </div>
        </div>

        <!-- General Search -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">جستجو عمومی</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="نام، توضیحات، لینک..."
              class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 pr-12 placeholder:text-gray-500 dark:text-gray-500"
            >
            <svg class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

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
        <!-- used filter -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">استفاده شده/نشده</label>
          <div class="relative">
            <button
                @click="toggleUsedDropdown"
                class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 flex items-center justify-between"
                type="button"
            >
              <span>{{ getUsedLabel(usedFilter) }}</span>
              <svg class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': showUsedDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <div v-if="showUsedDropdown" class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl z-10">
              <ul class="py-2">
                <li>
                  <button
                      @click="selectUsed('')"
                      class="w-full px-4 py-2 text-right hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150 text-gray-700 dark:text-gray-300"
                      :class="{ 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400': usedFilter === '' }"
                  >
                    همه
                  </button>
                </li>
                <li>
                  <button
                      @click="selectUsed('used')"
                      class="w-full px-4 py-2 text-right hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                      :class="{ 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400': usedFilter === 'used' }"
                  >
                    استفاده شده
                  </button>
                </li>
                <li>
                  <button
                      @click="selectUsed('unused')"
                      class="w-full px-4 py-2 text-right hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                      :class="{ 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400': usedFilter === 'unused' }"
                  >
                    استفاده نشده
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Data Cards -->
    <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 transition-colors duration-300">
      <!-- Select All Header -->
      <div v-if="filteredCards.length > 0" class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            :checked="isAllSelected"
            @change="toggleSelectAll"
            class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-300"
          >
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            انتخاب همه ({{ filteredCards.length }} کارت)
          </label>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ selectedCards.length }} کارت انتخاب شده
        </div>
      </div>

      <!-- Modern Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="card in paginatedCards"
          :key="card.id"
          class="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 group"
        >
          <!-- Card Top Bar with Card Number -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-white text-sm font-bold font-mono">شماره {{ parseInt(card.identifier.replace('CV-', '')) }}</span>
            </div>
            <input
              type="checkbox"
              :checked="selectedCards.includes(card.id)"
              @change="toggleCardSelection(card.id)"
              class="w-4 h-4 text-blue-600 border-white/50 rounded focus:ring-blue-500 bg-white/20"
            >
          </div>

          <!-- Card Body -->
          <div class="p-4">
            <!-- License & Model in compact view -->
            <div class="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div class="bg-gray-50 dark:bg-slate-700/50 rounded-lg px-2 py-1.5">
                <span class="text-gray-400 dark:text-gray-500 block mb-0.5">لایسنس</span>
                <div class="flex items-center gap-1">
                  <span class="text-gray-700 dark:text-gray-300 font-mono truncate block flex-1">{{ card.qrLink.split('/').slice(-2, -1)[0] }}</span>
                  <button
                    @click="copyToClipboard(card.qrLink.split('/').slice(-2, -1)[0])"
                    class="p-0.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-shrink-0"
                    title="کپی لایسنس"
                  >
                    <i class="ti ti-copy text-xs"></i>
                  </button>
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-slate-700/50 rounded-lg px-2 py-1.5">
                <span class="text-gray-400 dark:text-gray-500 block">مدل</span>
                <span class="text-gray-700 dark:text-gray-300 font-mono truncate block">{{ card.qrLink.split('/').pop() }}</span>
              </div>
            </div>

            <!-- Link with copy button -->
            <div class="mb-3">
              <div class="bg-gray-50 dark:bg-slate-700/50 rounded-lg px-3 py-2">
                <div class="flex items-center gap-2 mb-1">
                  <i class="ti ti-link text-blue-600 dark:text-blue-400 text-sm"></i>
                  <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">لینک پروفایل</span>
                </div>
                <div class="flex items-center gap-2">
                  <a
                    :href="card.qrLink"
                    target="_blank"
                    class="flex-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 truncate block"
                    :title="card.qrLink"
                  >
                    {{ card.qrLink }}
                  </a>
                  <button
                    @click="copyToClipboard(card.qrLink)"
                    class="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors flex-shrink-0"
                    title="کپی لینک"
                  >
                    <i class="ti ti-copy text-sm"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Status Badges -->
            <div class="flex flex-wrap gap-1.5 mb-3">
              <span
                class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium"
                :class="[
                  card.status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                ]"
              >
                <i :class="card.status === 'active' ? 'ti ti-check' : 'ti ti-x'" class="text-[8px] ml-1"></i>
                {{ card.status === 'active' ? 'فعال' : 'غیرفعال' }}
              </span>
              <span
                class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium"
                :class="[
                  card.isUsed
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                ]"
              >
                <i :class="card.isUsed ? 'ti ti-user-check' : 'ti ti-user-x'" class="text-[8px] ml-1"></i>
                {{ card.isUsed ? 'استفاده شده' : 'بدون استفاده' }}
              </span>
            </div>

            <!-- Activated By Section -->
            <div v-if="card.activatedBy" class="mb-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800/30">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  <i class="ti ti-user-check text-lg"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">فعال‌شده توسط</span>
                    <a
                      :href="`https://linku.im/${card.activatedBy.cardSlug}`"
                      target="_blank"
                      class="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      title="مشاهده پروفایل"
                    >
                      <i class="ti ti-external-link text-xs"></i>
                    </a>
                  </div>
                  <p class="text-sm font-semibold text-emerald-900 dark:text-emerald-200 mb-1">{{ card.activatedBy.name }}</p>
                  <div class="space-y-1">
                    <div v-if="card.activatedBy.mobile" class="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300">
                      <i class="ti ti-phone text-xs"></i>
                      <span class="font-mono">{{ card.activatedBy.mobile }}</span>
                    </div>
                    <div v-if="card.activatedBy.email" class="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300">
                      <i class="ti ti-mail text-xs"></i>
                      <span class="truncate" :title="card.activatedBy.email">{{ card.activatedBy.email }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Date & Actions -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
              <span class="text-[10px] text-gray-400 dark:text-gray-500">
                {{ card.createdAt }}
              </span>
              <div class="flex items-center gap-1">
                <router-link
                  :to="{ name: 'edit-card', params: { id: card.id } }"
                  class="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  title="ویرایش"
                >
                  <i class="ti ti-edit text-sm"></i>
                </router-link>
                <button
                  @click="viewQR(card)"
                  class="p-1.5 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                  title="QR کد"
                >
                  <i class="ti ti-qrcode text-sm"></i>
                </button>
                <button
                  @click="deleteCard(card.id)"
                  class="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="حذف"
                >
                  <i class="ti ti-trash text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modern Pagination -->
      <div v-if="filteredCards.length > 0" class="mt-8 flex items-center justify-between">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          نمایش {{ startItem }} تا {{ endItem }} از {{ filteredCards.length }} کارت
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            :class="[
              'px-3 py-2 rounded-lg transition-colors',
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
            ]"
          >
            <i class="ti ti-chevron-right text-sm"></i>
          </button>

          <span class="text-sm text-gray-600 dark:text-gray-400 px-2">
            صفحه {{ currentPage }} از {{ totalPages }}
          </span>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="[
              'px-3 py-2 rounded-lg transition-colors',
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
            ]"
          >
            <i class="ti ti-chevron-left text-sm"></i>
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

    <!-- Bulk Download Modal -->
    <div
      v-if="showBulkDownloadModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="backdrop-filter: blur(8px)"
    >
      <!-- Backdrop -->
      <div
        @click="showBulkDownloadModal = false"
        class="absolute inset-0 bg-black/40"
      ></div>

      <!-- Modal Content -->
      <div
        @click.stop
        class="relative bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full transform transition-all duration-300 scale-100 border border-gray-100 dark:border-gray-700"
      >
        <div class="mb-6 text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">دانلود دسته‌ای QR کد</h3>
          <p class="text-gray-600 dark:text-gray-300">محدوده کارت‌ها را برای دانلود انتخاب کنید</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">تعداد کل کارت‌ها: {{ filteredCards.length }}</p>
        </div>

        <!-- Range Selection -->
        <div class="space-y-4 mb-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">از شماره</label>
              <input
                v-model.number="bulkDownloadFrom"
                type="number"
                min="1"
                :max="filteredCards.length"
                class="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="1"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">تا شماره</label>
              <input
                v-model.number="bulkDownloadTo"
                type="number"
                min="1"
                :max="filteredCards.length"
                class="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                :placeholder="filteredCards.length.toString()"
              />
            </div>
          </div>

          <!-- Quick Selection Buttons -->
          <div class="flex flex-wrap gap-2">
            <button
              @click="setQuickRange(1, 10)"
              class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 transition-colors text-sm"
            >
              ۱ تا ۱۰
            </button>
            <button
              @click="setQuickRange(1, 20)"
              class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 transition-colors text-sm"
            >
              ۱ تا ۲۰
            </button>
            <button
              @click="setQuickRange(1, 50)"
              class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 transition-colors text-sm"
            >
              ۱ تا ۵۰
            </button>
            <button
              @click="setQuickRange(1, 100)"
              class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 transition-colors text-sm"
            >
              ۱ تا ۱۰۰
            </button>
            <button
              @click="setQuickRange(1, filteredCards.length)"
              class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 transition-colors text-sm"
            >
              همه
            </button>
          </div>

          <!-- Summary -->
          <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
            <div class="flex justify-between items-center">
              <span class="text-purple-700 dark:text-purple-300">تعداد QR کد برای دانلود:</span>
              <span class="font-bold text-purple-900 dark:text-purple-100 text-lg">{{ bulkDownloadCount }}</span>
            </div>
          </div>
        </div>

        <!-- Progress Bar (when downloading) -->
        <div v-if="isDownloadingBulk" class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">در حال پردازش...</span>
            <span class="text-sm font-bold text-purple-600 dark:text-purple-400">{{ bulkDownloadProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              class="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
              :style="{ width: bulkDownloadProgress + '%' }"
            ></div>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">{{ bulkDownloadStatus }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button
            @click="downloadBulkQRCodes"
            :disabled="isDownloadingBulk || bulkDownloadCount === 0"
            class="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <svg v-if="!isDownloadingBulk" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isDownloadingBulk ? 'در حال دانلود...' : 'دانلود فایل ZIP' }}
          </button>
          <button
            @click="showBulkDownloadModal = false"
            :disabled="isDownloadingBulk"
            class="w-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl transition-colors font-medium border border-gray-200 dark:border-gray-600"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>

    <!-- Excel Export Modal -->
    <div
      v-if="showExcelExportModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="backdrop-filter: blur(8px)"
    >
      <!-- Backdrop -->
      <div
        @click="showExcelExportModal = false"
        class="absolute inset-0 bg-black/40"
      ></div>

      <!-- Modal Content -->
      <div
        @click.stop
        class="relative bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full transform transition-all duration-300 scale-100 border border-gray-100 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
      >
        <div class="mb-6 text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">خروجی اکسل</h3>
          <p class="text-gray-600 dark:text-gray-300">تنظیمات خروجی را انتخاب کنید</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">تعداد کل کارت‌ها: {{ filteredCards.length }}</p>
        </div>

        <!-- Range Selection -->
        <div class="space-y-4 mb-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">از شماره</label>
              <input
                v-model.number="excelExportFrom"
                type="number"
                min="1"
                :max="filteredCards.length"
                class="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="1"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">تا شماره</label>
              <input
                v-model.number="excelExportTo"
                type="number"
                min="1"
                :max="filteredCards.length"
                class="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                :placeholder="filteredCards.length.toString()"
              />
            </div>
          </div>

          <!-- Quick Selection Buttons -->
          <div class="flex flex-wrap gap-2">
            <button
              @click="setExcelQuickRange(1, 10)"
              class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 transition-colors text-sm"
            >
              ۱ تا ۱۰
            </button>
            <button
              @click="setExcelQuickRange(1, 50)"
              class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 transition-colors text-sm"
            >
              ۱ تا ۵۰
            </button>
            <button
              @click="setExcelQuickRange(1, 100)"
              class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 transition-colors text-sm"
            >
              ۱ تا ۱۰۰
            </button>
            <button
              @click="setExcelQuickRange(1, filteredCards.length)"
              class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 transition-colors text-sm"
            >
              همه
            </button>
          </div>
        </div>

        <!-- Column Selection -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">ستون‌های خروجی</label>
          <div class="grid grid-cols-2 gap-3">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="excelExportColumns.rowNumber" class="w-4 h-4 text-green-600 rounded focus:ring-green-500">
              <span class="text-sm text-gray-700 dark:text-gray-300">ردیف</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="excelExportColumns.licenseId" class="w-4 h-4 text-green-600 rounded focus:ring-green-500">
              <span class="text-sm text-gray-700 dark:text-gray-300">شناسه لایسنس</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="excelExportColumns.cardModel" class="w-4 h-4 text-green-600 rounded focus:ring-green-500">
              <span class="text-sm text-gray-700 dark:text-gray-300">مدل کارت</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="excelExportColumns.qrLink" class="w-4 h-4 text-green-600 rounded focus:ring-green-500">
              <span class="text-sm text-gray-700 dark:text-gray-300">لینک کارت</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="excelExportColumns.status" class="w-4 h-4 text-green-600 rounded focus:ring-green-500">
              <span class="text-sm text-gray-700 dark:text-gray-300">وضعیت</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="excelExportColumns.isUsed" class="w-4 h-4 text-green-600 rounded focus:ring-green-500">
              <span class="text-sm text-gray-700 dark:text-gray-300">استفاده شده</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="excelExportColumns.ownerName" class="w-4 h-4 text-green-600 rounded focus:ring-green-500">
              <span class="text-sm text-gray-700 dark:text-gray-300">نام صاحب کارت</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="excelExportColumns.mobile" class="w-4 h-4 text-green-600 rounded focus:ring-green-500">
              <span class="text-sm text-gray-700 dark:text-gray-300">شماره موبایل</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="excelExportColumns.createdAt" class="w-4 h-4 text-green-600 rounded focus:ring-green-500">
              <span class="text-sm text-gray-700 dark:text-gray-300">تاریخ ایجاد</span>
            </label>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 mb-6">
          <div class="flex justify-between items-center">
            <span class="text-green-700 dark:text-green-300">تعداد کارت برای خروجی:</span>
            <span class="font-bold text-green-900 dark:text-green-100 text-lg">{{ excelExportCount }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button
            @click="exportToExcel"
            :disabled="excelExportCount === 0"
            class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            دانلود فایل اکسل
          </button>
          <button
            @click="showExcelExportModal = false"
            class="w-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl transition-colors font-medium border border-gray-200 dark:border-gray-600"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div
      v-if="showImportModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="backdrop-filter: blur(8px)"
    >
      <!-- Backdrop -->
      <div
        @click="showImportModal = false"
        class="absolute inset-0 bg-black/40"
      ></div>

      <!-- Modal Content -->
      <div
        @click.stop
        class="relative bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full transform transition-all duration-300 scale-100 border border-gray-100 dark:border-gray-700"
      >
        <div class="mb-6 text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">ورودی کارت‌ها</h3>
          <p class="text-gray-600 dark:text-gray-300">فایل JSON یا CSV حاوی اطلاعات کارت‌ها را انتخاب کنید</p>
        </div>

        <div class="space-y-4">
          <!-- Import Mode -->
          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">حالت ورودی</label>
            <select v-model="importMode" class="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <option value="append">اضافه به داده‌های موجود</option>
              <option value="replace">جایگزینی کامل (حذف همه قبلی‌ها)</option>
            </select>
          </div>

          <!-- File Upload -->
          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">فایل ورودی</label>
            <input
              type="file"
              @change="handleImportFileSelect"
              accept=".json,.csv,.txt"
              class="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">فرمت‌های پشتیبانی شده: JSON, CSV</p>
          </div>

          <!-- Warning for replace mode -->
          <div v-if="importMode === 'replace'" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p class="text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
              <i class="ti ti-alert-triangle"></i>
              <strong>هشدار:</strong> این حالت همه کارت‌های موجود را حذف می‌کند!
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3 mt-6">
          <button
            @click="importCards"
            :disabled="!importFile || isImporting"
            class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <svg v-if="!isImporting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isImporting ? 'در حال ورودی...' : 'آپلود و ورودی' }}
          </button>
          <button
            @click="showImportModal = false"
            :disabled="isImporting"
            class="w-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl transition-colors font-medium border border-gray-200 dark:border-gray-600"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import QRCode from 'qrcode'
import {useCardsStore} from "@/stores/cards.ts";
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import type { AxiosInstance } from 'axios'
defineOptions({
  name: 'CardsManagement'
})

const { appContext } = getCurrentInstance()!
const axios = appContext.config.globalProperties.$axios as AxiosInstance
interface ActivatedBy {
  id: number
  name: string
  email: string
  mobile?: string | null
  cardSlug: string
}

interface Card {
  id: string
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
  identifier: string
  activatedBy?: ActivatedBy | null
}

// Router
const route = useRoute()

// Search & Filter State
const licenseSearch = ref('')
const profileIdSearch = ref('')
const searchQuery = ref('')
const statusFilter = ref('')
const usedFilter = ref('')
const showStatusDropdown = ref(false)
const showUsedDropdown = ref(false)
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
const cardStore = useCardsStore()
const cards = computed(() => cardStore.cards)

// Bulk Download State
const showBulkDownloadModal = ref(false)
const bulkDownloadFrom = ref(1)
const bulkDownloadTo = ref(20)
const isDownloadingBulk = ref(false)
const bulkDownloadProgress = ref(0)
const bulkDownloadStatus = ref('')

// Excel Export State
const showExcelExportModal = ref(false)
const excelExportFrom = ref(1)
const excelExportTo = ref(20)
const excelExportColumns = ref({
  rowNumber: true,
  licenseId: true,
  cardModel: true,
  qrLink: true,
  status: true,
  isUsed: true,
  ownerName: false,
  mobile: false,
  createdAt: false
})

// Import State
const showImportModal = ref(false)
const importMode = ref('append')
const importFile = ref<File | null>(null)
const isImporting = ref(false)

// Bulk Download Computed
const bulkDownloadCount = computed(() => {
  const from = Math.max(1, Math.min(bulkDownloadFrom.value, filteredCards.value.length))
  const to = Math.max(1, Math.min(bulkDownloadTo.value, filteredCards.value.length))
  if (from > to) return 0
  return to - from + 1
})

// Excel Export Computed
const excelExportCount = computed(() => {
  const from = Math.max(1, Math.min(excelExportFrom.value, filteredCards.value.length))
  const to = Math.max(1, Math.min(excelExportTo.value, filteredCards.value.length))
  if (from > to) return 0
  return to - from + 1
})

const setExcelQuickRange = (from: number, to: number) => {
  excelExportFrom.value = from
  excelExportTo.value = Math.min(to, filteredCards.value.length)
}
onMounted(() => {
  cardStore.fetchCards()
})
// Computed Properties
const activeCardsCount = computed(() => {
  return cards.value.filter(card => card.status === 'active').length
})

const inactiveCardsCount = computed(() => {
  return cards.value.filter(card => card.status === 'inactive').length
})

const filteredCards = computed(() => {
  const result = cards.value.filter(card => {
    // Extract license ID from URL
    const urlParts = card.qrLink.split('/')
    const licenseId = urlParts[urlParts.length - 2] || ''

    // License ID search
    const matchesLicense = !licenseSearch.value ||
                          licenseId.toLowerCase().includes(licenseSearch.value.toLowerCase())

    // Profile ID search (same as license for now, but kept separate for future)
    const matchesProfileId = !profileIdSearch.value ||
                            licenseId.toLowerCase().includes(profileIdSearch.value.toLowerCase())

    // General search
    const matchesSearch = !searchQuery.value ||
                         card.ownerName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         card.description?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         card.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         card.qrLink.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         licenseId.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus = !statusFilter.value || card.status === statusFilter.value

    const matchesUsed = !usedFilter.value
        ? true
        : (usedFilter.value === 'used' ? !!card.isUsed : !card.isUsed)

    return matchesLicense && matchesProfileId && matchesSearch && matchesStatus && matchesUsed
  })

  // Sort by identifier descending (newest/highest number first)
  result.sort((a, b) => {
    const numA = parseInt(a.identifier.replace('CV-', '')) || 0
    const numB = parseInt(b.identifier.replace('CV-', '')) || 0
    return numB - numA
  })

  return result
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

// Methods

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
// toggle for used dropdown
const toggleUsedDropdown = () => {
  showUsedDropdown.value = !showUsedDropdown.value
  // close status dropdown if open (optional UX consistency)
  if (showUsedDropdown.value) showStatusDropdown.value = false
}
const selectUsed = (used: string) => {
  usedFilter.value = used
  showUsedDropdown.value = false
  currentPage.value = 1
}
const getUsedLabel = (used: string) => {
  switch (used) {
    case 'used': return 'استفاده شده'
    case 'unused': return 'استفاده نشده'
    default: return 'همه وضعیت‌ها'
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Watch for qrLink changes to auto-generate QR code
// Reset pagination when filters change
watch([searchQuery, statusFilter, usedFilter], () => {
  currentPage.value = 1
})

const deleteCard = async (cardId: string) => {
  if (confirm('آیا از حذف این کارت اطمینان دارید؟')) {
    await cardStore.deleteCard(cardId)
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

const deleteSelectedCards = async () => {
  if (selectedCards.value.length === 0) return
  console.log('deleteSelectedCards',selectedCards.value)
  const confirmed = confirm(`آیا از حذف ${selectedCards.value.length} کارت انتخاب شده اطمینان دارید؟`)
  if (!confirmed) return

  try {
    // فراخوانی متد حذف از store
    await cardStore.deleteSelectedCards(selectedCards.value)

    // پاک‌سازی انتخاب‌ها و نمایش پیام موفقیت
    selectedCards.value = []
    successMessage.value = 'کارت‌های انتخاب شده با موفقیت حذف شدند'
    showSuccessMessage.value = true

    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  } catch (error) {
    console.error('❌ خطا در حذف کارت‌ها:', error)
    //errorMessage.value = 'خطا در حذف کارت‌ها. لطفاً دوباره تلاش کنید.'
    //showErrorMessage.value = true

    /*setTimeout(() => {
      showErrorMessage.value = false
    }, 3000)*/
  }
}


const viewQR = async (card: Card) => {
  selectedCard.value = card

  try {
    const canvas = document.createElement('canvas')

    await QRCode.toCanvas(canvas, card.qrLink, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    selectedQRCode.value = canvas.toDataURL()
  } catch (error) {
    console.error('Error generating QR code:', error)

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

  const doc = new jsPDF()

  // اضافه کردن تصویر QR به PDF
  doc.addImage(
      selectedQRCode.value, // داده base64 تصویر QR
      'PNG',                // فرمت تصویر
      50, 20,               // موقعیت X, Y
      100, 100              // عرض و ارتفاع در mm
  )

  doc.save(`qr-code-${selectedCard.value.id}.pdf`)
}


const copyToClipboard = async (text: string) => {
  console.log(text);
  try {
    await navigator.clipboard.writeText(text)
    successMessage.value = 'لینک با موفقیت کپی شد'
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

// Bulk Download Functions
const setQuickRange = (from: number, to: number) => {
  bulkDownloadFrom.value = from
  bulkDownloadTo.value = Math.min(to, filteredCards.value.length)
}

const generateQRCodeDataUrl = async (url: string): Promise<string> => {
  return await QRCode.toDataURL(url, {
    width: 512,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  })
}

const downloadBulkQRCodes = async () => {
  const from = Math.max(1, bulkDownloadFrom.value)
  const to = Math.min(bulkDownloadTo.value, filteredCards.value.length)

  if (from > to || to < 1) {
    successMessage.value = 'محدوده انتخابی نامعتبر است'
    showSuccessMessage.value = true
    return
  }

  isDownloadingBulk.value = true
  bulkDownloadProgress.value = 0
  bulkDownloadStatus.value = 'در حال آماده‌سازی...'

  try {
    const zip = new JSZip()
    const cardsToDownload = filteredCards.value.slice(from - 1, to)
    const total = cardsToDownload.length

    for (let i = 0; i < total; i++) {
      const card = cardsToDownload[i]
      const cardNumber = from + i // شماره کارت از محدوده انتخابی

      // استخراج شناسه لایسنس و مدل کارت از لینک QR
      const licenseId = card.qrLink.split('/').slice(-2, -1)[0] || card.id
      const cardModel = card.qrLink.split('/').pop() || 'unknown'

      // نام فایل: شماره_شناسه‌لایسنس_مدل.png
      const fileName = `${cardNumber}_${licenseId}_${cardModel}.png`

      bulkDownloadStatus.value = `در حال ایجاد QR کد ${i + 1} از ${total}...`

      // تولید QR کد
      const qrDataUrl = await generateQRCodeDataUrl(card.qrLink)

      // تبدیل Data URL به blob و اضافه به ZIP
      const base64Data = qrDataUrl.split(',')[1]
      zip.file(fileName, base64Data, { base64: true })

      // آپدیت پیشرفت
      bulkDownloadProgress.value = Math.round(((i + 1) / total) * 90)
    }

    bulkDownloadStatus.value = 'در حال ایجاد فایل ZIP...'
    bulkDownloadProgress.value = 95

    // ایجاد و دانلود فایل ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' })

    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(zipBlob)
    downloadLink.download = `qr-codes-${from}-to-${to}.zip`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(downloadLink.href)

    bulkDownloadProgress.value = 100
    bulkDownloadStatus.value = 'دانلود کامل شد!'

    // بستن مودال و نمایش پیام موفقیت
    setTimeout(() => {
      showBulkDownloadModal.value = false
      isDownloadingBulk.value = false
      bulkDownloadProgress.value = 0
      successMessage.value = `${total} QR کد با موفقیت دانلود شد`
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 5000)
    }, 1000)

  } catch (error) {
    console.error('Error creating bulk QR codes:', error)
    bulkDownloadStatus.value = 'خطا در ایجاد فایل ZIP'
    isDownloadingBulk.value = false
  }
}

// Export to Excel Function
const exportToExcel = () => {
  const from = Math.max(1, excelExportFrom.value)
  const to = Math.min(excelExportTo.value, filteredCards.value.length)

  if (from > to || to < 1) {
    successMessage.value = 'محدوده انتخابی نامعتبر است'
    showSuccessMessage.value = true
    return
  }

  const cardsToExport = filteredCards.value.slice(from - 1, to)

  if (cardsToExport.length === 0) {
    successMessage.value = 'هیچ کارتی برای خروجی وجود ندارد'
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
    return
  }

  // Prepare data for Excel based on selected columns
  const excelData = cardsToExport.map((card, index) => {
    const licenseId = card.qrLink.split('/').slice(-2, -1)[0] || ''
    const cardModel = card.qrLink.split('/').pop() || ''
    const rowNum = from + index

    const row: Record<string, string | number | boolean> = {}

    if (excelExportColumns.value.rowNumber) row['ردیف'] = rowNum
    if (excelExportColumns.value.licenseId) row['شناسه لایسنس'] = licenseId
    if (excelExportColumns.value.cardModel) row['مدل کارت'] = cardModel
    if (excelExportColumns.value.qrLink) row['لینک کارت'] = card.qrLink
    if (excelExportColumns.value.status) row['وضعیت'] = card.status === 'active' ? 'فعال' : 'غیرفعال'
    if (excelExportColumns.value.isUsed) row['استفاده شده'] = card.isUsed ? 'بله' : 'خیر'
    if (excelExportColumns.value.ownerName) row['نام صاحب کارت'] = card.ownerName
    if (excelExportColumns.value.mobile) row['شماره موبایل'] = card.mobile || ''
    if (excelExportColumns.value.createdAt) row['تاریخ ایجاد'] = card.createdAt

    return row
  })

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData)

  // Set column widths dynamically
  const colWidths: { wch: number }[] = []
  if (excelExportColumns.value.rowNumber) colWidths.push({ wch: 6 })
  if (excelExportColumns.value.licenseId) colWidths.push({ wch: 20 })
  if (excelExportColumns.value.cardModel) colWidths.push({ wch: 12 })
  if (excelExportColumns.value.qrLink) colWidths.push({ wch: 45 })
  if (excelExportColumns.value.status) colWidths.push({ wch: 10 })
  if (excelExportColumns.value.isUsed) colWidths.push({ wch: 12 })
  if (excelExportColumns.value.ownerName) colWidths.push({ wch: 25 })
  if (excelExportColumns.value.mobile) colWidths.push({ wch: 15 })
  if (excelExportColumns.value.createdAt) colWidths.push({ wch: 15 })
  worksheet['!cols'] = colWidths

  // Create workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'کارت‌های ویزیت')

  // Generate filename with date and range
  const now = new Date()
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const filename = `cards-${from}-to-${to}-${dateStr}.xlsx`

  // Download file
  XLSX.writeFile(workbook, filename)

  showExcelExportModal.value = false
  successMessage.value = `${cardsToExport.length} کارت به فایل اکسل خروجی گرفته شد`
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 5000)
}

// Import Functions
const handleImportFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  importFile.value = target.files?.[0] || null
}

const importCards = async () => {
  if (!importFile.value) return

  if (importMode.value === 'replace') {
    if (!confirm('آیا از جایگزینی کامل کارت‌ها اطمینان دارید؟ همه کارت‌های موجود حذف خواهند شد!')) {
      return
    }
  }

  try {
    isImporting.value = true
    const formData = new FormData()
    formData.append('file', importFile.value)
    formData.append('mode', importMode.value)

    const response = await axios.post('/user/admin/backup/import/cards', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    showImportModal.value = false
    importFile.value = null
    successMessage.value = response.data.message || 'ورودی کارت‌ها با موفقیت انجام شد'
    showSuccessMessage.value = true

    // Refresh cards list
    cardStore.fetchCards()

    setTimeout(() => {
      showSuccessMessage.value = false
    }, 5000)
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    successMessage.value = err.response?.data?.message || 'خطا در ورودی کارت‌ها'
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 5000)
  } finally {
    isImporting.value = false
  }
}

// Close dropdown when clicking outside
onMounted(() => {
  // Dark mode is now handled in Header component

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target?.closest('.relative')) {
      showStatusDropdown.value = false
      showUsedDropdown.value = false
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
