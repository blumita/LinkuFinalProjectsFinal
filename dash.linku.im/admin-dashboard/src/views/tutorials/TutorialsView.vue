<template>
  <div class="w-full p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">مدیریت ویدیوهای آموزشی</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">ویدیوهای آموزشی برای کاربران را مدیریت کنید</p>
      </div>
      <router-link
        to="/tutorials/create"
        class="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25 font-medium"
      >
        <i class="ti ti-plus text-lg"></i>
        افزودن ویدیو
      </router-link>
    </div>

    <!-- Filters Card -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1">
          <div class="relative">
            <i class="ti ti-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو در ویدیوها..."
              class="w-full pr-10 pl-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 transition-all"
              @input="() => fetchTutorials()"
            >
          </div>
        </div>
        <select
          v-model="categoryFilter"
          class="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 transition-all cursor-pointer"
          @change="() => fetchTutorials()"
        >
          <option value="">همه دسته‌بندی‌ها</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <select
          v-model="statusFilter"
          class="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 transition-all cursor-pointer"
          @change="() => fetchTutorials()"
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col justify-center items-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-purple-600 border-t-transparent mb-4"></div>
      <span class="text-gray-500 dark:text-gray-400">در حال بارگذاری...</span>
    </div>

    <!-- Tutorials Grid -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div 
          v-for="tutorial in filteredTutorials" 
          :key="tutorial.id"
          class="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300"
        >
          <!-- Thumbnail -->
          <div class="relative aspect-video bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
            <img 
              v-if="tutorial.thumbnail" 
              :src="tutorial.thumbnail" 
              :alt="tutorial.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <i class="ti ti-video text-5xl text-purple-400/50"></i>
            </div>
            <!-- Duration Badge -->
            <div v-if="tutorial.duration" class="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
              {{ formatDuration(tutorial.duration) }}
            </div>
            <!-- Play Button Overlay -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <div class="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <i class="ti ti-player-play text-2xl text-purple-600 mr-[-2px]"></i>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <!-- Header -->
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="font-bold text-gray-900 dark:text-white line-clamp-2">{{ tutorial.title }}</h3>
              <span :class="[
                'px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
                tutorial.is_active
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              ]">
                {{ tutorial.is_active ? 'فعال' : 'غیرفعال' }}
              </span>
            </div>

            <!-- Category -->
            <div v-if="tutorial.category" class="mb-2">
              <span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                {{ tutorial.category }}
              </span>
            </div>

            <!-- Description -->
            <p v-if="tutorial.description" class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
              {{ tutorial.description }}
            </p>
            <p v-else class="text-sm text-gray-400 dark:text-gray-500 mb-3 italic">
              بدون توضیحات
            </p>

            <!-- Meta -->
            <div class="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
              <span class="flex items-center gap-1">
                <i class="ti ti-sort-ascending"></i>
                ترتیب: {{ tutorial.order }}
              </span>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between">
              <button
                @click="toggleStatus(tutorial)"
                :class="[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  tutorial.is_active
                    ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                    : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                ]"
              >
                <i :class="tutorial.is_active ? 'ti ti-eye-off' : 'ti ti-eye'" class="text-base"></i>
                {{ tutorial.is_active ? 'غیرفعال' : 'فعال' }}
              </button>
              <div class="flex items-center gap-1">
                <a
                  :href="tutorial.video_url"
                  target="_blank"
                  class="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all"
                  title="مشاهده ویدیو"
                >
                  <i class="ti ti-external-link text-lg"></i>
                </a>
                <router-link
                  :to="`/tutorials/${tutorial.id}/edit`"
                  class="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                  title="ویرایش"
                >
                  <i class="ti ti-edit text-lg"></i>
                </router-link>
                <button
                  @click="deleteTutorial(tutorial)"
                  class="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  title="حذف"
                >
                  <i class="ti ti-trash text-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.lastPage > 1" class="flex justify-center items-center gap-3 mt-8">
        <button
          @click="goToPage(pagination.currentPage - 1)"
          :disabled="pagination.currentPage === 1"
          class="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          <i class="ti ti-chevron-right"></i>
        </button>
        <span class="text-sm text-gray-600 dark:text-gray-400 px-4">
          صفحه {{ pagination.currentPage }} از {{ pagination.lastPage }}
        </span>
        <button
          @click="goToPage(pagination.currentPage + 1)"
          :disabled="pagination.currentPage === pagination.lastPage"
          class="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          <i class="ti ti-chevron-left"></i>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredTutorials.length === 0" class="text-center py-16">
        <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
          <i class="ti ti-video text-4xl text-gray-400 dark:text-gray-500"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {{ searchQuery || statusFilter || categoryFilter ? 'نتیجه‌ای یافت نشد' : 'هیچ ویدیویی یافت نشد' }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
          {{ searchQuery || statusFilter || categoryFilter ? 'فیلترها را تغییر دهید یا جستجوی جدیدی انجام دهید' : 'برای شروع، اولین ویدیوی آموزشی خود را ایجاد کنید' }}
        </p>
        <router-link
          v-if="!searchQuery && !statusFilter && !categoryFilter"
          to="/tutorials/create"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25 font-medium"
        >
          <i class="ti ti-plus"></i>
          ایجاد ویدیوی اول
        </router-link>
        <button
          v-else
          @click="clearFilters"
          class="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium"
        >
          <i class="ti ti-filter-off"></i>
          پاک کردن فیلترها
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useAlert } from '@/composables/useAlert'

defineOptions({
  name: 'TutorialsView'
})

const { appContext } = getCurrentInstance()!
const api = appContext.config.globalProperties.$axios

interface Tutorial {
  id: number
  title: string
  slug: string
  description: string | null
  video_url: string
  thumbnail: string | null
  duration: number | null
  category: string | null
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

const { showAlert } = useAlert()

// State
const tutorials = ref<Tutorial[]>([])
const categories = ref<string[]>([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const pagination = ref({
  currentPage: 1,
  lastPage: 1,
  perPage: 10,
  total: 0
})

// Computed
const filteredTutorials = computed(() => {
  let result = tutorials.value

  if (statusFilter.value === 'active') {
    result = result.filter(t => t.is_active)
  } else if (statusFilter.value === 'inactive') {
    result = result.filter(t => !t.is_active)
  }

  if (categoryFilter.value) {
    result = result.filter(t => t.category === categoryFilter.value)
  }

  return result
})

// Format duration
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Fetch tutorials from API
const fetchTutorials = async (page = 1) => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', String(page))
    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }
    if (categoryFilter.value) {
      params.append('category', categoryFilter.value)
    }

    const response = await api.get(`/user/admin/tutorial/list?${params.toString()}`)
    const data = response.data

    tutorials.value = data.data || []
    pagination.value = {
      currentPage: data.current_page || 1,
      lastPage: data.last_page || 1,
      perPage: data.per_page || 10,
      total: data.total || 0
    }
  } catch (error) {
    console.error('Error fetching tutorials:', error)
    showAlert({ title: 'خطا', message: 'خطا در دریافت لیست ویدیوها', type: 'error' })
  } finally {
    loading.value = false
  }
}

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await api.get('/user/admin/tutorial/categories')
    categories.value = response.data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// Toggle tutorial status
const toggleStatus = async (tutorial: Tutorial) => {
  try {
    await api.patch(`/user/admin/tutorial/${tutorial.id}/status`)
    tutorial.is_active = !tutorial.is_active
    showAlert({
      title: 'موفقیت',
      message: `وضعیت ویدیو "${tutorial.title}" تغییر کرد`,
      type: 'success'
    })
  } catch (error) {
    console.error('Error toggling status:', error)
    showAlert({ title: 'خطا', message: 'خطا در تغییر وضعیت ویدیو', type: 'error' })
  }
}

// Delete tutorial
const deleteTutorial = (tutorial: Tutorial) => {
  showAlert({
    title: 'تایید حذف',
    message: `آیا از حذف ویدیو "${tutorial.title}" اطمینان دارید؟`,
    type: 'delete',
    showCancel: true
  }).then(async (confirmed) => {
    if (confirmed) {
      try {
        await api.delete(`/user/admin/tutorial/delete/${tutorial.id}`)
        tutorials.value = tutorials.value.filter(t => t.id !== tutorial.id)
        showAlert({ title: 'موفقیت', message: 'ویدیو با موفقیت حذف شد', type: 'success' })
      } catch (error) {
        console.error('Error deleting tutorial:', error)
        showAlert({ title: 'خطا', message: 'خطا در حذف ویدیو', type: 'error' })
      }
    }
  })
}

// Go to page
const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    fetchTutorials(page)
  }
}

// Clear filters
const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  categoryFilter.value = ''
  fetchTutorials()
}

onMounted(() => {
  fetchTutorials()
  fetchCategories()
})
</script>
