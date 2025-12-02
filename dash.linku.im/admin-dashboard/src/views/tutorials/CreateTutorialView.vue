<template>
  <div class="w-full p-4 sm:p-6 lg:p-8">
    <div class="w-full">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <router-link
            to="/tutorials"
            class="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <i class="ti ti-arrow-right text-gray-600 dark:text-gray-400 text-xl"></i>
          </router-link>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ isEdit ? 'ویرایش ویدیو آموزشی' : 'ایجاد ویدیو آموزشی جدید' }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              {{ isEdit ? 'ویرایش اطلاعات ویدیو' : 'ویدیوی آموزشی جدیدی برای کاربران ایجاد کنید' }}
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            @click="saveTutorial(false)"
            :disabled="saving"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
          >
            ذخیره پیش‌نویس
          </button>
          <button
            @click="saveTutorial(true)"
            :disabled="saving"
            class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <i v-if="saving" class="ti ti-loader animate-spin"></i>
            <i v-else class="ti ti-check"></i>
            {{ isEdit ? 'بروزرسانی' : 'انتشار' }}
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loadingTutorial" class="flex justify-center items-center py-24">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
        <span class="mr-3 text-gray-600 dark:text-gray-400">در حال بارگذاری...</span>
      </div>

      <!-- Form -->
      <div v-else class="space-y-6">
        <!-- عنوان و URL -->
        <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                عنوان ویدیو *
              </label>
              <input
                v-model="tutorial.title"
                @input="generateSlug"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="مثال: راهنمای فعال‌سازی محصولات لینکو"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                نشانی URL
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2.5 text-gray-500 text-sm">/tutorial/</span>
                <input
                  v-model="tutorial.slug"
                  type="text"
                  class="w-full pl-24 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="activate-products"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- لینک ویدیو و تامبنیل -->
        <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <i class="ti ti-video text-purple-600"></i>
            اطلاعات ویدیو
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                لینک ویدیو *
              </label>
              <input
                v-model="tutorial.video_url"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://www.aparat.com/v/... یا https://youtube.com/..."
              />
              <p class="text-xs text-gray-500 mt-1">
                لینک ویدیو از آپارات، یوتیوب یا هر سرویس دیگر
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                لینک تصویر پیش‌نمایش
              </label>
              <input
                v-model="tutorial.thumbnail"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
          </div>
          <!-- Preview -->
          <div v-if="tutorial.thumbnail || tutorial.video_url" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              پیش‌نمایش
            </label>
            <div class="aspect-video max-w-md rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700">
              <img 
                v-if="tutorial.thumbnail" 
                :src="tutorial.thumbnail" 
                :alt="tutorial.title"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <i class="ti ti-video text-5xl text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- دسته‌بندی و مدت زمان و ترتیب -->
        <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                دسته‌بندی
              </label>
              <input
                v-model="tutorial.category"
                type="text"
                list="categories"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="مثال: فعال‌سازی"
              />
              <datalist id="categories">
                <option value="فعال‌سازی"></option>
                <option value="آموزش استفاده"></option>
                <option value="تنظیمات"></option>
                <option value="رفع مشکلات"></option>
                <option value="سایر"></option>
              </datalist>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                مدت زمان (ثانیه)
              </label>
              <input
                v-model.number="tutorial.duration"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="120"
              />
              <p class="text-xs text-gray-500 mt-1">
                {{ tutorial.duration ? formatDuration(tutorial.duration) : '00:00' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ترتیب نمایش
              </label>
              <input
                v-model.number="tutorial.order"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <!-- توضیحات -->
        <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            توضیحات ویدیو
          </label>
          <textarea
            v-model="tutorial.description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="توضیح کاملی درباره این ویدیوی آموزشی بنویسید..."
          ></textarea>
        </div>

        <!-- وضعیت -->
        <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">وضعیت انتشار</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ tutorial.is_active ? 'این ویدیو فعال است و برای کاربران نمایش داده می‌شود' : 'این ویدیو غیرفعال است و نمایش داده نمی‌شود' }}
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="tutorial.is_active"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                {{ tutorial.is_active ? 'فعال' : 'غیرفعال' }}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAlert } from '@/composables/useAlert'

defineOptions({
  name: 'CreateTutorialView'
})

const { showAlert } = useAlert()
const route = useRoute()
const router = useRouter()
const { appContext } = getCurrentInstance()!
const api = appContext.config.globalProperties.$axios

// Check if editing existing tutorial
const isEdit = ref(false)
const tutorialId = ref<string | null>(null)
const loadingTutorial = ref(false)
const saving = ref(false)

const tutorial = ref({
  title: '',
  slug: '',
  description: '',
  video_url: '',
  thumbnail: '',
  duration: 0,
  category: '',
  order: 0,
  is_active: true
})

// Format duration
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Generate slug from title
const generateSlug = () => {
  if (tutorial.value.title && !isEdit.value) {
    tutorial.value.slug = tutorial.value.title
      .toLowerCase()
      .replace(/[^\w\u0600-\u06FF\s-]/g, '') // Keep Persian characters
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

// Load existing tutorial
const loadTutorial = async (id: string) => {
  loadingTutorial.value = true
  try {
    const response = await api.get(`/user/admin/tutorial/show/${id}`)
    const data = response.data

    tutorial.value = {
      title: data.title || '',
      slug: data.slug || '',
      description: data.description || '',
      video_url: data.video_url || '',
      thumbnail: data.thumbnail || '',
      duration: data.duration || 0,
      category: data.category || '',
      order: data.order || 0,
      is_active: data.is_active ?? true
    }
  } catch (error) {
    console.error('Error loading tutorial:', error)
    showAlert({ title: 'خطا', message: 'خطا در بارگذاری ویدیو', type: 'error' })
    router.push('/tutorials')
  } finally {
    loadingTutorial.value = false
  }
}

// Save tutorial
const saveTutorial = async (publish = true) => {
  if (!tutorial.value.title.trim()) {
    showAlert({ title: 'خطا', message: 'لطفا عنوان ویدیو را وارد کنید', type: 'error' })
    return
  }

  if (!tutorial.value.video_url.trim()) {
    showAlert({ title: 'خطا', message: 'لطفا لینک ویدیو را وارد کنید', type: 'error' })
    return
  }

  saving.value = true
  try {
    const payload = {
      title: tutorial.value.title,
      slug: tutorial.value.slug || null,
      description: tutorial.value.description || null,
      video_url: tutorial.value.video_url,
      thumbnail: tutorial.value.thumbnail || null,
      duration: tutorial.value.duration || null,
      category: tutorial.value.category || null,
      order: tutorial.value.order || 0,
      is_active: publish ? tutorial.value.is_active : false
    }

    if (isEdit.value && tutorialId.value) {
      await api.put(`/user/admin/tutorial/update/${tutorialId.value}`, payload)
      showAlert({ title: 'موفقیت', message: 'ویدیو با موفقیت بروزرسانی شد', type: 'success' })
    } else {
      await api.post('/user/admin/tutorial/store', payload)
      showAlert({ title: 'موفقیت', message: 'ویدیو با موفقیت ایجاد شد', type: 'success' })
    }

    // Redirect to tutorials list
    setTimeout(() => {
      router.push('/tutorials')
    }, 1500)
  } catch (error: unknown) {
    console.error('Error saving tutorial:', error)
    const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'خطا در ذخیره ویدیو'
    showAlert({ title: 'خطا', message: errorMessage, type: 'error' })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  // Check if editing
  if (route.params.id) {
    isEdit.value = true
    tutorialId.value = route.params.id as string
    await loadTutorial(tutorialId.value)
  }
})
</script>
