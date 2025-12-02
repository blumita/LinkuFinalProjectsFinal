<template>
  <div class="p-4 sm:p-6 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">مدیریت گزارش‌ها</h1>
      <div class="flex gap-3">
        <button
            @click="showExportModal = true"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
        >
          <i class="ti ti-file-export"></i>
          خروجی اکسل
        </button>
        <button
            @click="refreshReports"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
        >
          <i class="ti ti-refresh"></i>
          بروزرسانی
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 text-center">
        <div class="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mx-auto mb-2">
          <i class="ti ti-alert-triangle text-red-600 dark:text-red-400 text-sm"></i>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">گزارش‌های باز</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ openReports }}</p>
      </div>

      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 text-center">
        <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-2">
          <i class="ti ti-clock text-blue-600 dark:text-blue-400 text-sm"></i>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">در حال بررسی</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ reviewingReports }}</p>
      </div>

      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 text-center">
        <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-2">
          <i class="ti ti-check text-green-600 dark:text-green-400 text-sm"></i>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">حل شده</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ resolvedReports }}</p>
      </div>

      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 text-center">
        <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-2">
          <i class="ti ti-chart-bar text-purple-600 dark:text-purple-400 text-sm"></i>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">کل گزارش‌ها</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ totalReports }}</p>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">جستجو</label>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="شناسه گزارش، نام کاربر یا توضیحات..."
              class="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نوع گزارش</label>
          <div class="relative">
            <button
                @click="showTypeDropdown = !showTypeDropdown"
                class="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 text-right flex items-center justify-between"
            >
              <span class="flex items-center">
                <i :class="getTypeIcon(filterType)" class="ml-2"></i>
                {{ getTypeDisplayName(filterType) }}
              </span>
              <i class="ti ti-chevron-down transition-transform duration-200"
                 :class="{ 'rotate-180': showTypeDropdown }"></i>
            </button>
            <ul v-if="showTypeDropdown"
                class="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
              <li @click="selectType('')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white">
                <i class="ti ti-list ml-2 text-gray-500"></i>
                همه انواع
              </li>
              <li @click="selectType('spam')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white">
                <i class="ti ti-alert-triangle ml-2 text-red-500"></i>
                اسپم
              </li>
              <li @click="selectType('inappropriate')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white">
                <i class="ti ti-eye-off ml-2 text-orange-500"></i>
                محتوای نامناسب
              </li>
              <li @click="selectType('harassment')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white">
                <i class="ti ti-user-x ml-2 text-purple-500"></i>
                آزار و اذیت
              </li>
              <li @click="selectType('copyright')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white">
                <i class="ti ti-copyright ml-2 text-blue-500"></i>
                نقض حق نشر
              </li>
              <li @click="selectType('fake')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white">
                <i class="ti ti-mask ml-2 text-yellow-500"></i>
                پروفایل جعلی
              </li>
              <li @click="selectType('other')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white">
                <i class="ti ti-dots ml-2 text-gray-500"></i>
                سایر
              </li>
            </ul>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">وضعیت</label>
          <div class="relative">
            <button
                @click="showStatusDropdown = !showStatusDropdown"
                class="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 text-right flex items-center justify-between"
            >
              <span class="flex items-center">
                <i :class="getStatusIcon(filterStatus)" class="ml-2"></i>
                {{ getStatusDisplayName(filterStatus) }}
              </span>
              <i class="ti ti-chevron-down transition-transform duration-200"
                 :class="{ 'rotate-180': showStatusDropdown }"></i>
            </button>
            <ul v-if="showStatusDropdown"
                class="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
              <li @click="selectStatus('')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white">
                <i class="ti ti-list ml-2 text-gray-500"></i>
                همه وضعیت‌ها
              </li>
              <li @click="selectStatus('open')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white">
                <i class="ti ti-alert-circle ml-2 text-red-500"></i>
                باز
              </li>
              <li @click="selectStatus('reviewing')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white">
                <i class="ti ti-clock ml-2 text-blue-500"></i>
                در حال بررسی
              </li>
              <li @click="selectStatus('resolved')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white">
                <i class="ti ti-check ml-2 text-green-500"></i>
                حل شده
              </li>
              <li @click="selectStatus('rejected')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white">
                <i class="ti ti-x ml-2 text-gray-500"></i>
                رد شده
              </li>
            </ul>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">مرتب‌سازی</label>
          <div class="relative">
            <button
                @click="showSortDropdown = !showSortDropdown"
                class="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 text-right flex items-center justify-between"
            >
              <span class="flex items-center">
                <i :class="getSortIcon(sortBy)" class="ml-2"></i>
                {{ getSortDisplayName(sortBy) }}
              </span>
              <i class="ti ti-chevron-down transition-transform duration-200"
                 :class="{ 'rotate-180': showSortDropdown }"></i>
            </button>
            <ul v-if="showSortDropdown"
                class="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
              <li @click="selectSort('created_desc')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white">
                <i class="ti ti-sort-descending ml-2 text-blue-500"></i>
                جدیدترین
              </li>
              <li @click="selectSort('created_asc')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white">
                <i class="ti ti-sort-ascending ml-2 text-blue-500"></i>
                قدیمی‌ترین
              </li>
              <li @click="selectSort('priority_desc')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white">
                <i class="ti ti-alert-triangle ml-2 text-red-500"></i>
                اولویت بالا
              </li>
              <li @click="selectSort('updated_desc')"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex items-center text-gray-900 dark:text-white">
                <i class="ti ti-refresh ml-2 text-green-500"></i>
                آخرین بروزرسانی
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Reports Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
          v-for="report in filteredReports"
          :key="report.id"
          class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-all duration-300"
      >
        <!-- Report Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                 :class="getPriorityClass(report.priority)">
              <i class="ti ti-alert-triangle text-white text-sm"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-semibold text-gray-900 dark:text-white">گزارش #{{ report.id }}</h3>
                <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-lg"
                    :class="getTypeClass(report.type)"
                >
                  {{ getTypeName(report.type) }}
                </span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ report.reporterName }}</p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button
                @click="resolveReport(report)"
                class="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-300"
                title="حل کردن"
            >
              <i class="ti ti-check text-lg"></i>
            </button>
            <button
                @click="rejectReport(report)"
                class="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-300"
                title="رد کردن"
            >
              <i class="ti ti-x text-lg"></i>
            </button>
          </div>
        </div>

        <!-- Report Target -->
        <div class="mb-3">
          <p class="text-sm text-gray-700 dark:text-gray-300">
            <strong>هدف:</strong> {{ report.targetName }}
          </p>
        </div>

        <!-- Report Description -->
        <div class="mb-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ report.description }}</p>
        </div>

        <!-- Report Status & Actions -->
        <div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-600">
          <span
              class="inline-flex px-3 py-1 text-sm font-semibold rounded-lg"
              :class="getStatusClass(report.status)"
          >
            {{ getStatusName(report.status) }}
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatDate(report.createdAt) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex items-center justify-center">
      <div class="flex items-center gap-2">
        <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
        >
          قبلی
        </button>
        <span class="text-sm text-gray-700 dark:text-gray-300 px-4">صفحه {{ currentPage }} از {{ totalPages }}</span>
        <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
        >
          بعدی
        </button>
      </div>
    </div>

    <!-- Export Excel Modal -->
    <div v-if="showExportModal"
         class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
          class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl w-full max-w-md shadow-2xl border border-white/20 dark:border-slate-700/50">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-slate-700/50">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">خروجی اکسل گزارش‌ها</h2>
          <button @click="showExportModal = false"
                  class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-slate-700/50 transition-all">
            <i class="ti ti-x text-xl"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-5">
          <!-- تعداد رکورد -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تعداد رکورد</label>
            <div class="relative">
              <button
                  @click="showCountDropdown = !showCountDropdown"
                  class="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all text-right flex items-center justify-between"
              >
                <span class="flex items-center">
                  <i class="ti ti-list-numbers ml-2 text-green-600"></i>
                  {{ getCountDisplayName(exportSettings.count) }}
                </span>
                <i class="ti ti-chevron-down transition-transform duration-200"
                   :class="{ 'rotate-180': showCountDropdown }"></i>
              </button>
              <ul v-if="showCountDropdown"
                  class="absolute top-full left-0 right-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 rounded-xl mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
                <li @click="selectCount(50)"
                    class="px-4 py-3 hover:bg-gray-100/50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center text-gray-900 dark:text-white">
                  <i class="ti ti-list-numbers ml-2 text-green-600"></i>
                  50 رکورد
                </li>
                <li @click="selectCount(100)"
                    class="px-4 py-3 hover:bg-gray-100/50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center text-gray-900 dark:text-white">
                  <i class="ti ti-list-numbers ml-2 text-green-600"></i>
                  100 رکورد
                </li>
                <li @click="selectCount(200)"
                    class="px-4 py-3 hover:bg-gray-100/50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center text-gray-900 dark:text-white">
                  <i class="ti ti-list-numbers ml-2 text-green-600"></i>
                  200 رکورد
                </li>
                <li @click="selectCount(500)"
                    class="px-4 py-3 hover:bg-gray-100/50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center text-gray-900 dark:text-white">
                  <i class="ti ti-list-numbers ml-2 text-green-600"></i>
                  500 رکورد
                </li>
                <li @click="selectCount('all')"
                    class="px-4 py-3 hover:bg-gray-100/50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center text-gray-900 dark:text-white">
                  <i class="ti ti-infinity ml-2 text-green-600"></i>
                  همه رکوردها
                </li>
              </ul>
            </div>
          </div>

          <!-- تاریخ شروع -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">از تاریخ</label>
            <input
                v-model="exportSettings.startDate"
                type="text"
                placeholder="1403/01/01"
                class="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                dir="ltr"
            />
          </div>

          <!-- تاریخ پایان -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تا تاریخ</label>
            <input
                v-model="exportSettings.endDate"
                type="text"
                placeholder="1403/12/29"
                class="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                dir="ltr"
            />
          </div>

          <!-- فرمت فایل -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">فرمت فایل</label>
            <div class="relative">
              <button
                  @click="showFormatDropdown = !showFormatDropdown"
                  class="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all text-right flex items-center justify-between"
              >
                <span class="flex items-center">
                  <i :class="getFormatIcon(exportSettings.format)" class="ml-2"></i>
                  {{ getFormatDisplayName(exportSettings.format) }}
                </span>
                <i class="ti ti-chevron-down transition-transform duration-200"
                   :class="{ 'rotate-180': showFormatDropdown }"></i>
              </button>
              <ul v-if="showFormatDropdown"
                  class="absolute top-full left-0 right-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 rounded-xl mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
                <li @click="selectFormat('xlsx')"
                    class="px-4 py-3 hover:bg-gray-100/50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center text-gray-900 dark:text-white">
                  <i class="ti ti-file-spreadsheet ml-2 text-green-600"></i>
                  اکسل (.xlsx)
                </li>
                <li @click="selectFormat('csv')"
                    class="px-4 py-3 hover:bg-gray-100/50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center text-gray-900 dark:text-white">
                  <i class="ti ti-file-text ml-2 text-blue-600"></i>
                  CSV (.csv)
                </li>
              </ul>
            </div>
          </div>
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
import {ref, computed, onMounted} from 'vue'
import {useReportStore} from "@/stores/report.ts";
import jalaali from "jalaali-js";

defineOptions({
  name: 'ReportsManagement'
})

interface Report {
  id: number
  reporterName: string
  reporterEmail: string
  type: 'spam' | 'inappropriate' | 'harassment' | 'copyright' | 'fake' | 'other'
  status: 'open' | 'reviewing' | 'resolved' | 'rejected'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  targetType: 'profile' | 'link' | 'content'
  targetName: string
  targetUrl: string
  description: string
  evidence?: string[]
  adminNotes?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
}

// Reactive data
const searchQuery = ref('')
const filterType = ref('')
const filterStatus = ref('')
const sortBy = ref('created_desc')
const currentPage = ref(1)
const itemsPerPage = 6
const showExportModal = ref(false)
const reportStore = useReportStore()
// Dropdown states
const showTypeDropdown = ref(false)
const showStatusDropdown = ref(false)
const showSortDropdown = ref(false)
const showCountDropdown = ref(false)
const showFormatDropdown = ref(false)

// Export settings
const exportSettings = ref({
  count: 100 as number | 'all',
  startDate: '',
  endDate: '',
  format: 'xlsx' as 'xlsx' | 'csv'
})

// Sample data
/*const reports = ref<Report[]>([
  {
    id: 1001,
    reporterName: 'احمد محمدی',
    reporterEmail: 'ahmad@example.com',
    type: 'spam',
    status: 'open',
    priority: 'high',
    targetType: 'profile',
    targetName: 'پروفایل مشکوک',
    targetUrl: 'https://linku.ir/suspicious_user',
    description: 'این پروفایل محتوای اسپم می‌فرستد و کاربران را آزار می‌دهد. پیام‌های تکراری و غیرضروری ارسال می‌کند.',
    evidence: ['screenshot1.jpg', 'screenshot2.jpg'],
    createdAt: '1403/04/20',
    updatedAt: '1403/04/20'
  },
  {
    id: 1002,
    reporterName: 'فاطمه احمدی',
    reporterEmail: 'fateme@example.com',
    type: 'inappropriate',
    status: 'reviewing',
    priority: 'urgent',
    targetType: 'content',
    targetName: 'محتوای نامناسب',
    targetUrl: 'https://linku.ir/inappropriate_content',
    description: 'محتوای غیراخلاقی و نامناسب که باید سریع بررسی شود. این محتوا قوانین جامعه را نقض می‌کند.',
    evidence: ['evidence1.png'],
    adminNotes: 'در حال بررسی توسط تیم محتوا',
    createdAt: '1403/04/19',
    updatedAt: '1403/04/21'
  },
  {
    id: 1003,
    reporterName: 'علی رضایی',
    reporterEmail: 'ali@example.com',
    type: 'harassment',
    status: 'resolved',
    priority: 'medium',
    targetType: 'profile',
    targetName: 'کاربر متخلف',
    targetUrl: 'https://linku.ir/harassing_user',
    description: 'این کاربر دیگران را آزار می‌دهد و پیام‌های ناپسند ارسال می‌کند.',
    resolvedAt: '1403/04/22',
    createdAt: '1403/04/18',
    updatedAt: '1403/04/22'
  },
  {
    id: 1004,
    reporterName: 'مریم کریمی',
    reporterEmail: 'maryam@example.com',
    type: 'copyright',
    status: 'open',
    priority: 'low',
    targetType: 'link',
    targetName: 'لینک نقض حق نشر',
    targetUrl: 'https://linku.ir/copyright_violation',
    description: 'این لینک به محتوای نقض حق نشر اشاره می‌کند و باید بررسی شود.',
    createdAt: '1403/04/17',
    updatedAt: '1403/04/17'
  },
  {
    id: 1005,
    reporterName: 'حسن محمدی',
    reporterEmail: 'hassan@example.com',
    type: 'fake',
    status: 'rejected',
    priority: 'medium',
    targetType: 'profile',
    targetName: 'پروفایل جعلی مشکوک',
    targetUrl: 'https://linku.ir/fake_profile',
    description: 'این پروفایل جعلی است و از هویت دیگران سوءاستفاده می‌کند.',
    adminNotes: 'پس از بررسی، پروفایل معتبر تشخیص داده شد',
    createdAt: '1403/04/16',
    updatedAt: '1403/04/21'
  }
])*/
const reports = computed(() => reportStore.reports)
// Computed properties for statistics
const openReports = computed(()=>reportStore.openReports)
const reviewingReports = computed(()=>reportStore.reviewingReports)
const resolvedReports = computed(()=>reportStore.resolvedReports)
const totalReports = computed(()=>reportStore.totalReports)

const filteredReports = computed(() => {
  let filtered = [...reports.value]

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(report =>
        report.id.toString().includes(searchQuery.value) ||
        report.reporterName.includes(searchQuery.value) ||
        report.targetName.includes(searchQuery.value) ||
        report.description.includes(searchQuery.value)
    )
  }

  // Filter by type
  if (filterType.value) {
    filtered = filtered.filter(report => report.type === filterType.value)
  }

  // Filter by status
  if (filterStatus.value) {
    filtered = filtered.filter(report => report.status === filterStatus.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'created_desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'created_asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'priority_desc':
        const priorityOrder = {urgent: 4, high: 3, medium: 2, low: 1}
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'updated_desc':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      default:
        return 0
    }
  })

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  let filtered = [...reports.value]

  if (searchQuery.value) {
    filtered = filtered.filter(report =>
        report.id.toString().includes(searchQuery.value) ||
        report.reporterName.includes(searchQuery.value) ||
        report.targetName.includes(searchQuery.value) ||
        report.description.includes(searchQuery.value)
    )
  }

  if (filterType.value) {
    filtered = filtered.filter(report => report.type === filterType.value)
  }

  if (filterStatus.value) {
    filtered = filtered.filter(report => report.status === filterStatus.value)
  }

  return Math.ceil(filtered.length / itemsPerPage)
})

// Methods
const getTypeClass = (type: Report['type']) => {
  const classes: Record<Report['type'], string> = {
    spam: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    inappropriate: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    harassment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    copyright: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    fake: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return classes[type]
}

const getTypeName = (type: Report['type']) => {
  const names: Record<Report['type'], string> = {
    spam: 'اسپم',
    inappropriate: 'نامناسب',
    harassment: 'آزار',
    copyright: 'حق نشر',
    fake: 'جعلی',
    other: 'سایر'
  }
  return names[type]
}

const getStatusClass = (status: Report['status']) => {
  const classes: Record<Report['status'], string> = {
    open: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return classes[status]
}

const getStatusName = (status: Report['status']) => {
  const names: Record<Report['status'], string> = {
    open: 'باز',
    reviewing: 'در حال بررسی',
    resolved: 'حل شده',
    rejected: 'رد شده'
  }
  return names[status]
}

const getPriorityClass = (priority: Report['priority']) => {
  const classes: Record<Report['priority'], string> = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500'
  }
  return classes[priority]
}

const getPriorityName = (priority: Report['priority']) => {
  const names: Record<Report['priority'], string> = {
    low: 'کم',
    medium: 'متوسط',
    high: 'بالا',
    urgent: 'فوری'
  }
  return names[priority]
}

// Report actions
const resolveReport =async (report: Report) => {
  report.status = 'resolved'
  await reportStore.toggleReportStatus(report.id,report.status)
  report.resolvedAt = new Date().toLocaleDateString('fa-IR')
  report.updatedAt = new Date().toLocaleDateString('fa-IR')
}

const rejectReport = async (report: Report) => {
  report.status = 'rejected'
  await reportStore.toggleReportStatus(report.id,report.status)
  report.updatedAt = new Date().toLocaleDateString('fa-IR')
}

const refreshReports = () => {
  // Simulate API call to refresh reports
  console.log('گزارش‌ها بروزرسانی شدند')
}

// Export functions
const exportToExcel = () => {
  try {
    // Filter data based on date range and count
    let dataToExport = [...reports.value]

    // Apply date filter if provided (simplified approach)
    if (exportSettings.value.startDate || exportSettings.value.endDate) {
      dataToExport = dataToExport.filter(report => {
        // Simple string comparison for Persian dates (1403/04/20 format)
        const reportDate = report.createdAt
        const startDate = exportSettings.value.startDate
        const endDate = exportSettings.value.endDate

        if (startDate && reportDate < startDate) return false
        if (endDate && reportDate > endDate) return false
        return true
      })
    }

    // Apply count limit
    if (exportSettings.value.count !== 'all') {
      dataToExport = dataToExport.slice(0, Number(exportSettings.value.count))
    }

    // Validate data before export
    if (dataToExport.length === 0) {
      console.warn('هیچ گزارشی برای خروجی یافت نشد!')
      return
    }

    // Convert to Excel format with proper Persian support
    const excelData = dataToExport.map(report => ({
      'شناسه گزارش': report.id || '',
      'گزارش‌دهنده': report.reporterName || '',
      'ایمیل گزارش‌دهنده': report.reporterEmail || '',
      'نوع گزارش': getTypeName(report.type) || '',
      'وضعیت': getStatusName(report.status) || '',
      'اولویت': getPriorityName(report.priority) || '',
      'نوع هدف': getTargetTypeName(report.targetType) || '',
      'نام هدف': report.targetName || '',
      'URL هدف': report.targetUrl || '',
      'توضیحات': report.description || '',
      'یادداشت مدیر': report.adminNotes || '',
      'تاریخ ایجاد': report.createdAt || '',
      'آخرین بروزرسانی': report.updatedAt || '',
      'تاریخ حل': report.resolvedAt || ''
    }))

    // Create and download file with proper timestamp
    const now = new Date()
    const timestamp = now.toLocaleDateString('fa-IR').replace(/\//g, '-') + '_' +
        now.getHours().toString().padStart(2, '0') + '-' +
        now.getMinutes().toString().padStart(2, '0')
    const fileName = `گزارش‌ها_${timestamp}.${exportSettings.value.format}`

    if (exportSettings.value.format === 'xlsx') {
      // For XLSX format - create proper Excel file
      const csvContent = convertToCSV(excelData)
      downloadAsExcel(csvContent, fileName)
      console.log(`✅ ${dataToExport.length} گزارش با موفقیت دانلود شد`)
    } else {
      // For CSV format
      const csv = convertToCSV(excelData)
      downloadCSV(csv, fileName)
      console.log(`✅ ${dataToExport.length} گزارش با موفقیت دانلود شد`)
    }

    showExportModal.value = false
  } catch (error) {
    console.error('Error exporting data:', error)
    console.error('❌ خطا در خروجی گیری داده‌ها! لطفاً دوباره تلاش کنید.')
  }
}

// Helper function to get target type name
const getTargetTypeName = (type: string) => {
  const names: Record<string, string> = {
    profile: 'پروفایل',
    link: 'لینک',
    content: 'محتوا'
  }
  return names[type] || type
}

const convertToCSV = (data: Record<string, string | number>[]) => {
  if (data.length === 0) return ''

  // Create CSV with proper Persian support
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map(row =>
      Object.values(row).map(val =>
          `"${String(val).replace(/"/g, '""')}"`
      ).join(',')
  )
  return [headers, ...rows].join('\n')
}

const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob(['\uFEFF' + csv], {type: 'text/csv;charset=utf-8;'})
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

const downloadAsExcel = (csvContent: string, filename: string) => {
  // Create Excel-compatible file with proper Persian encoding
  const excelContent = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <meta name="ProgId" content="Excel.Sheet">
      <meta name="Generator" content="Microsoft Excel 15">
      <style>
        .text { mso-number-format:"\\@"; }
        .number { mso-number-format:"0"; }
        .date { mso-number-format:"yyyy/mm/dd"; }
      </style>
    </head>
    <body>
      <table border="1" dir="rtl">
        ${csvContent.split('\n').map(row =>
          '<tr>' + row.split(',').map(cell =>
              `<td class="text">${cell.replace(/"/g, '')}</td>`
          ).join('') + '</tr>'
  ).join('')}
      </table>
    </body>
  </html>`

  const blob = new Blob(['\uFEFF' + excelContent], {
    type: 'application/vnd.ms-excel;charset=utf-8;'
  })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename.replace('.xlsx', '.xls')
  link.click()
  URL.revokeObjectURL(link.href)
}

// Dropdown helper functions
const getTypeIcon = (type: string) => {
  if (!type) return 'ti ti-list text-gray-500'
  const icons: Record<string, string> = {
    spam: 'ti ti-alert-triangle text-red-500',
    inappropriate: 'ti ti-eye-off text-orange-500',
    harassment: 'ti ti-user-x text-purple-500',
    copyright: 'ti ti-copyright text-blue-500',
    fake: 'ti ti-mask text-yellow-500',
    other: 'ti ti-dots text-gray-500'
  }
  return icons[type] || 'ti ti-list text-gray-500'
}

const getTypeDisplayName = (type: string) => {
  if (!type) return 'همه انواع'
  const names: Record<string, string> = {
    spam: 'اسپم',
    inappropriate: 'محتوای نامناسب',
    harassment: 'آزار و اذیت',
    copyright: 'نقض حق نشر',
    fake: 'پروفایل جعلی',
    other: 'سایر'
  }
  return names[type] || 'همه انواع'
}

const selectType = (type: string) => {
  filterType.value = type
  showTypeDropdown.value = false
}

const getStatusIcon = (status: string) => {
  if (!status) return 'ti ti-list text-gray-500'
  const icons: Record<string, string> = {
    open: 'ti ti-alert-circle text-red-500',
    reviewing: 'ti ti-clock text-blue-500',
    resolved: 'ti ti-check text-green-500',
    rejected: 'ti ti-x text-gray-500'
  }
  return icons[status] || 'ti ti-list text-gray-500'
}

const getStatusDisplayName = (status: string) => {
  if (!status) return 'همه وضعیت‌ها'
  const names: Record<string, string> = {
    open: 'باز',
    reviewing: 'در حال بررسی',
    resolved: 'حل شده',
    rejected: 'رد شده'
  }
  return names[status] || 'همه وضعیت‌ها'
}

const selectStatus = (status: string) => {
  filterStatus.value = status
  showStatusDropdown.value = false
}

const getSortIcon = (sort: string) => {
  const icons: Record<string, string> = {
    created_desc: 'ti ti-sort-descending text-blue-500',
    created_asc: 'ti ti-sort-ascending text-blue-500',
    priority_desc: 'ti ti-alert-triangle text-red-500',
    updated_desc: 'ti ti-refresh text-green-500'
  }
  return icons[sort] || 'ti ti-sort-descending text-blue-500'
}

const getSortDisplayName = (sort: string) => {
  const names: Record<string, string> = {
    created_desc: 'جدیدترین',
    created_asc: 'قدیمی‌ترین',
    priority_desc: 'اولویت بالا',
    updated_desc: 'آخرین بروزرسانی'
  }
  return names[sort] || 'جدیدترین'
}

const selectSort = (sort: string) => {
  sortBy.value = sort
  showSortDropdown.value = false
}

const getCountDisplayName = (count: number | 'all') => {
  return count === 'all' ? 'همه رکوردها' : `${count} رکورد`
}

const selectCount = (count: number | 'all') => {
  exportSettings.value.count = count
  showCountDropdown.value = false
}

const getFormatIcon = (format: string) => {
  const icons: Record<string, string> = {
    xlsx: 'ti ti-file-spreadsheet text-green-600',
    csv: 'ti ti-file-text text-blue-600'
  }
  return icons[format] || 'ti ti-file-spreadsheet text-green-600'
}

const getFormatDisplayName = (format: string) => {
  const names: Record<string, string> = {
    xlsx: 'اکسل (.xlsx)',
    csv: 'CSV (.csv)'
  }
  return names[format] || 'اکسل (.xlsx)'
}

const selectFormat = (format: 'xlsx' | 'csv') => {
  exportSettings.value.format = format
  showFormatDropdown.value = false
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
onMounted(async () => {
  await reportStore.fetchReports()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
