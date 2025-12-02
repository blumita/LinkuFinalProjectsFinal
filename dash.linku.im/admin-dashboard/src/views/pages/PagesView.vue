<template>
  <div class="w-full p-4">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">مدیریت صفحات</h1>

    <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">لیست صفحات</h2>
        <router-link
          to="/pages/create"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <i class="ti ti-plus"></i>
          افزودن صفحه
        </router-link>
      </div>

      <!-- Search and Filter -->
      <div class="mb-4 flex flex-col sm:flex-row gap-3">
        <div class="flex-1">
          <div class="relative">
            <i class="ti ti-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو در صفحات..."
              class="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="published">منتشر شده</option>
          <option value="draft">پیش‌نویس</option>
        </select>
      </div>

      <!-- Pages List -->
      <div class="max-h-[70vh] overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-slate-600 dark:scrollbar-track-slate-800">
        <ul class="space-y-3">
          <li v-for="page in filteredPages" :key="page.id"
              class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <!-- Page Info -->
              <div class="flex-1">
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h3 class="font-semibold text-gray-900 dark:text-white text-lg">{{ page.title }}</h3>
                  <span :class="[
                    'px-2 py-1 rounded text-xs font-medium inline-block w-fit',
                    page.status === 'published'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  ]">
                    {{ page.status === 'published' ? 'منتشر شده' : 'پیش‌نویس' }}
                  </span>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span class="flex items-center gap-1">
                    <i class="ti ti-calendar text-xs"></i>
                    {{ page.updatedAt }}
                  </span>
                  <span class="flex items-center gap-1">
                    <i class="ti ti-eye text-xs"></i>
                    {{ page.views || 0 }} بازدید
                  </span>
                  <span class="flex items-center gap-1">
                    <i class="ti ti-link text-xs"></i>
                    /{{ page.slug }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 justify-end">
                <router-link
                  :to="`/pages/${page.id}/edit`"
                  class="flex items-center gap-1 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                  title="ویرایش"
                >
                  <i class="ti ti-edit"></i>
                  <span class="hidden sm:inline">ویرایش</span>
                </router-link>
                <button
                  @click="deletePage(page)"
                  class="flex items-center gap-1 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  title="حذف"
                >
                  <i class="ti ti-trash"></i>
                  <span class="hidden sm:inline">حذف</span>
                </button>
              </div>
            </div>
          </li>
        </ul>

        <!-- Empty State -->
        <div v-if="filteredPages.length === 0" class="text-center py-12">
          <i class="ti ti-file-text text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            {{ searchQuery || statusFilter ? 'نتیجه‌ای یافت نشد' : 'هیچ صفحه‌ای یافت نشد' }}
          </h3>
          <p class="text-gray-500 dark:text-gray-500 mb-4">
            {{ searchQuery || statusFilter ? 'فیلترها را تغییر دهید یا جستجوی جدیدی انجام دهید' : 'برای شروع، اولین صفحه خود را ایجاد کنید' }}
          </p>
          <router-link
            v-if="!searchQuery && !statusFilter"
            to="/pages/create"
            class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            <i class="ti ti-plus"></i>
            ایجاد صفحه اول
          </router-link>
          <button
            v-else
            @click="clearFilters"
            class="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            <i class="ti ti-filter-off"></i>
            پاک کردن فیلترها
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAlert } from '@/composables/useAlert'

defineOptions({
  name: 'PagesView'
})

const { showAlert } = useAlert()

// Search and filter state
const searchQuery = ref('')
const statusFilter = ref('')

// Sample data
const pages = ref([
  {
    id: 1,
    title: 'درباره ما',
    slug: 'about-us',
    status: 'published',
    updatedAt: '1403/08/15',
    views: 1254,
    content: 'محتوای صفحه درباره ما...'
  },
  {
    id: 2,
    title: 'تماس با ما',
    slug: 'contact-us',
    status: 'published',
    updatedAt: '1403/08/12',
    views: 892,
    content: 'اطلاعات تماس...'
  },
  {
    id: 3,
    title: 'شرایط و قوانین',
    slug: 'terms-and-conditions',
    status: 'draft',
    updatedAt: '1403/08/10',
    views: 156,
    content: 'شرایط و قوانین استفاده...'
  },
  {
    id: 4,
    title: 'حریم خصوصی',
    slug: 'privacy-policy',
    status: 'published',
    updatedAt: '1403/08/08',
    views: 743,
    content: 'سیاست حریم خصوصی...'
  },
  {
    id: 5,
    title: 'راهنمای استفاده',
    slug: 'user-guide',
    status: 'draft',
    updatedAt: '1403/08/05',
    views: 234,
    content: 'راهنمای کامل استفاده از سیستم...'
  },
  {
    id: 6,
    title: 'سوالات متداول',
    slug: 'faq',
    status: 'published',
    updatedAt: '1403/08/03',
    views: 543,
    content: 'پاسخ به سوالات متداول کاربران...'
  },
  {
    id: 7,
    title: 'بلاگ',
    slug: 'blog',
    status: 'draft',
    updatedAt: '1403/08/01',
    views: 89,
    content: 'آخرین اخبار و مقالات...'
  },
  {
    id: 8,
    title: 'خدمات',
    slug: 'services',
    status: 'published',
    updatedAt: '1403/07/28',
    views: 1234,
    content: 'فهرست خدمات ما...'
  },
  {
    id: 9,
    title: 'نمونه کارها',
    slug: 'portfolio',
    status: 'published',
    updatedAt: '1403/07/25',
    views: 876,
    content: 'نمونه کارهای انجام شده...'
  },
  {
    id: 10,
    title: 'همکاری با ما',
    slug: 'careers',
    status: 'draft',
    updatedAt: '1403/07/20',
    views: 234,
    content: 'فرصت‌های شغلی...'
  },
  {
    id: 11,
    title: 'داستان ما',
    slug: 'our-story',
    status: 'published',
    updatedAt: '1403/07/15',
    views: 654,
    content: 'داستان شروع کسب و کار...'
  },
  {
    id: 12,
    title: 'تیم ما',
    slug: 'our-team',
    status: 'published',
    updatedAt: '1403/07/10',
    views: 432,
    content: 'معرفی اعضای تیم...'
  }
])

// Filtered pages based on search and status
const filteredPages = computed(() => {
  let result = pages.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(page =>
      page.title.toLowerCase().includes(query) ||
      page.slug.toLowerCase().includes(query) ||
      page.content.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (statusFilter.value) {
    result = result.filter(page => page.status === statusFilter.value)
  }

  return result
})

// Clear search and filter
const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
}

const deletePage = (page: { id: number; title: string; slug: string; status: string; updatedAt: string; views: number; content: string }) => {
  showAlert({
    title: 'تایید حذف',
    message: 'آیا از حذف این صفحه اطمینان دارید؟',
    type: 'delete',
    showCancel: true
  }).then((confirmed) => {
    if (confirmed) {
      const index = pages.value.findIndex(p => p.id === page.id)
      if (index > -1) {
        pages.value.splice(index, 1)
        showAlert({ title: 'موفقیت', message: 'صفحه با موفقیت حذف شد', type: 'success' })
      }
    }
  })
}
</script>
