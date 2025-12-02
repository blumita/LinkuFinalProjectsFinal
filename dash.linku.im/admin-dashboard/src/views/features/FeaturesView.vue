<template>
  <div class="w-full p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">مدیریت ویژگی‌ها</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">ویژگی‌های اشتراک ویژه را مدیریت کنید</p>
      </div>
      <router-link
        to="/features/create"
        class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 font-medium"
      >
        <i class="ti ti-plus text-lg"></i>
        افزودن ویژگی
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
              placeholder="جستجو در ویژگی‌ها..."
              class="w-full pr-10 pl-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
              @input="() => fetchFeatures()"
            >
          </div>
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all cursor-pointer"
          @change="() => fetchFeatures()"
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col justify-center items-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mb-4"></div>
      <span class="text-gray-500 dark:text-gray-400">در حال بارگذاری...</span>
    </div>

    <!-- Features Grid -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div 
          v-for="feature in filteredFeatures" 
          :key="feature.id"
          class="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 flex items-center justify-center">
                <i v-if="feature.icon" :class="feature.icon" class="text-blue-600 dark:text-blue-400 text-2xl"></i>
                <i v-else class="ti ti-star text-blue-600 dark:text-blue-400 text-2xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 dark:text-white">{{ feature.title }}</h3>
                <span class="text-xs text-gray-400 dark:text-gray-500">{{ feature.slug }}</span>
              </div>
            </div>
            <span :class="[
              'px-2.5 py-1 rounded-full text-xs font-medium',
              feature.is_active
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            ]">
              {{ feature.is_active ? 'فعال' : 'غیرفعال' }}
            </span>
          </div>

          <!-- Description -->
          <p v-if="feature.description" class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
            {{ feature.description }}
          </p>
          <p v-else class="text-sm text-gray-400 dark:text-gray-500 mb-4 italic">
            بدون توضیحات
          </p>

          <!-- Meta -->
          <div class="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
            <span class="flex items-center gap-1">
              <i class="ti ti-sort-ascending"></i>
              ترتیب: {{ feature.order }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between">
            <button
              @click="toggleStatus(feature)"
              :class="[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                feature.is_active
                  ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                  : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
              ]"
            >
              <i :class="feature.is_active ? 'ti ti-eye-off' : 'ti ti-eye'" class="text-base"></i>
              {{ feature.is_active ? 'غیرفعال' : 'فعال' }}
            </button>
            <div class="flex items-center gap-1">
              <router-link
                :to="`/features/${feature.id}/edit`"
                class="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                title="ویرایش"
              >
                <i class="ti ti-edit text-lg"></i>
              </router-link>
              <button
                @click="deleteFeature(feature)"
                class="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                title="حذف"
              >
                <i class="ti ti-trash text-lg"></i>
              </button>
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
      <div v-if="!loading && filteredFeatures.length === 0" class="text-center py-16">
        <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
          <i class="ti ti-sparkles text-4xl text-gray-400 dark:text-gray-500"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {{ searchQuery || statusFilter ? 'نتیجه‌ای یافت نشد' : 'هیچ ویژگی‌ای یافت نشد' }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
          {{ searchQuery || statusFilter ? 'فیلترها را تغییر دهید یا جستجوی جدیدی انجام دهید' : 'برای شروع، اولین ویژگی خود را ایجاد کنید' }}
        </p>
        <router-link
          v-if="!searchQuery && !statusFilter"
          to="/features/create"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 font-medium"
        >
          <i class="ti ti-plus"></i>
          ایجاد ویژگی اول
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
  name: 'FeaturesView'
})

const { appContext } = getCurrentInstance()!
const api = appContext.config.globalProperties.$axios

interface Feature {
  id: number
  title: string
  slug: string
  icon: string | null
  description: string | null
  content: string | null
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

const { showAlert } = useAlert()

// State
const features = ref<Feature[]>([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const pagination = ref({
  currentPage: 1,
  lastPage: 1,
  perPage: 10,
  total: 0
})

// Computed
const filteredFeatures = computed(() => {
  let result = features.value

  if (statusFilter.value === 'active') {
    result = result.filter(f => f.is_active)
  } else if (statusFilter.value === 'inactive') {
    result = result.filter(f => !f.is_active)
  }

  return result
})

// Fetch features from API
const fetchFeatures = async (page = 1) => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', String(page))
    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }

    const response = await api.get(`/user/admin/feature/list?${params.toString()}`)
    const data = response.data

    features.value = data.data || []
    pagination.value = {
      currentPage: data.current_page || 1,
      lastPage: data.last_page || 1,
      perPage: data.per_page || 10,
      total: data.total || 0
    }
  } catch (error) {
    console.error('Error fetching features:', error)
    showAlert({ title: 'خطا', message: 'خطا در دریافت لیست ویژگی‌ها', type: 'error' })
  } finally {
    loading.value = false
  }
}

// Toggle feature status
const toggleStatus = async (feature: Feature) => {
  try {
    await api.patch(`/user/admin/feature/${feature.id}/status`)
    feature.is_active = !feature.is_active
    showAlert({
      title: 'موفقیت',
      message: `وضعیت ویژگی "${feature.title}" تغییر کرد`,
      type: 'success'
    })
  } catch (error) {
    console.error('Error toggling status:', error)
    showAlert({ title: 'خطا', message: 'خطا در تغییر وضعیت ویژگی', type: 'error' })
  }
}

// Delete feature
const deleteFeature = (feature: Feature) => {
  showAlert({
    title: 'تایید حذف',
    message: `آیا از حذف ویژگی "${feature.title}" اطمینان دارید؟`,
    type: 'delete',
    showCancel: true
  }).then(async (confirmed) => {
    if (confirmed) {
      try {
        await api.delete(`/user/admin/feature/delete/${feature.id}`)
        features.value = features.value.filter(f => f.id !== feature.id)
        showAlert({ title: 'موفقیت', message: 'ویژگی با موفقیت حذف شد', type: 'success' })
      } catch (error) {
        console.error('Error deleting feature:', error)
        showAlert({ title: 'خطا', message: 'خطا در حذف ویژگی', type: 'error' })
      }
    }
  })
}

// Go to page
const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    fetchFeatures(page)
  }
}

// Clear filters
const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  fetchFeatures()
}

onMounted(() => {
  fetchFeatures()
})
</script>
