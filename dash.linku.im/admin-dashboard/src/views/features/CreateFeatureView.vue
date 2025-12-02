<template>
  <div class="w-full p-4 sm:p-6 lg:p-8">
    <div class="w-full">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <router-link
            to="/features"
            class="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <i class="ti ti-arrow-right text-gray-600 dark:text-gray-400 text-xl"></i>
          </router-link>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ isEdit ? 'ویرایش ویژگی' : 'ایجاد ویژگی جدید' }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              {{ isEdit ? 'ویرایش اطلاعات ویژگی' : 'ویژگی جدیدی برای اشتراک ایجاد کنید' }}
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            @click="saveFeature(false)"
            :disabled="saving"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
          >
            ذخیره پیش‌نویس
          </button>
          <button
            @click="saveFeature(true)"
            :disabled="saving"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <i v-if="saving" class="ti ti-loader animate-spin"></i>
            <i v-else class="ti ti-check"></i>
            {{ isEdit ? 'بروزرسانی' : 'انتشار' }}
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loadingFeature" class="flex justify-center items-center py-24">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span class="mr-3 text-gray-600 dark:text-gray-400">در حال بارگذاری...</span>
      </div>

      <!-- Form -->
      <div v-else class="space-y-6">
        <!-- عنوان و URL و آیکون -->
        <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                عنوان ویژگی *
              </label>
              <input
                v-model="feature.title"
                @input="generateSlug"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: آمار بازدید پیشرفته"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                نشانی URL *
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2.5 text-gray-500 text-sm">/feature/</span>
                <input
                  v-model="feature.slug"
                  type="text"
                  class="w-full pl-20 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="advanced-stats"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                آیکون (کلاس Tabler)
              </label>
              <div class="flex gap-2">
                <input
                  v-model="feature.icon"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ti ti-chart-bar"
                />
                <div class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-slate-600 rounded-lg">
                  <i v-if="feature.icon" :class="feature.icon" class="text-xl text-blue-600"></i>
                  <i v-else class="ti ti-sparkles text-xl text-gray-400"></i>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                از <a href="https://tabler.io/icons" target="_blank" class="text-blue-600 hover:underline">tabler.io/icons</a> استفاده کنید
              </p>
            </div>
          </div>
        </div>

        <!-- توضیح کوتاه و ترتیب -->
        <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="md:col-span-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                توضیح کوتاه
              </label>
              <textarea
                v-model="feature.description"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="توضیح کوتاهی درباره این ویژگی بنویسید..."
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ترتیب نمایش
              </label>
              <input
                v-model.number="feature.order"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <!-- ویرایشگر محتوا -->
        <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <div class="p-4 border-b border-gray-200 dark:border-slate-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <i class="ti ti-edit text-blue-600"></i>
              توضیحات کامل ویژگی
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              توضیحات کامل و جامعی درباره این ویژگی بنویسید. می‌توانید از تصاویر، ویدیو و قالب‌بندی متنوع استفاده کنید.
            </p>
          </div>
          <div class="p-6">
            <!-- TinyMCE Editor -->
            <Editor
              v-model="feature.content"
              api-key="q73k3x1x774256zfffsmbxvapssvjhgtmbybfwmj0fot2zu9"
              :init="editorConfig"
            />
          </div>
        </div>

        <!-- وضعیت -->
        <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">وضعیت انتشار</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ feature.is_active ? 'این ویژگی فعال است و در سایت نمایش داده می‌شود' : 'این ویژگی غیرفعال است و نمایش داده نمی‌شود' }}
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="feature.is_active"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                {{ feature.is_active ? 'فعال' : 'غیرفعال' }}
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
import Editor from '@tinymce/tinymce-vue'

defineOptions({
  name: 'CreateFeatureView'
})

const { showAlert } = useAlert()
const route = useRoute()
const router = useRouter()
const { appContext } = getCurrentInstance()!
const api = appContext.config.globalProperties.$axios

// Check if editing existing feature
const isEdit = ref(false)
const featureId = ref<string | null>(null)
const loadingFeature = ref(false)
const saving = ref(false)

const feature = ref({
  title: '',
  slug: '',
  icon: '',
  description: '',
  content: '',
  order: 0,
  is_active: true
})

// TinyMCE configuration with API key
const editorConfig = {
  height: 500,
  menubar: true,
  directionality: 'rtl',
  language: 'fa',
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons'
  ],
  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
           'forecolor backcolor | alignleft aligncenter alignright alignjustify | ' +
           'bullist numlist outdent indent | link image media table | ' +
           'emoticons charmap | removeformat code fullscreen',
  content_style: `
    body {
      font-family: 'Shabnam', 'Vazirmatn', Arial, sans-serif;
      font-size: 14px;
      direction: rtl;
      text-align: right;
      line-height: 1.8;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    p { margin: 0.5em 0; }
    h1, h2, h3, h4, h5, h6 { margin: 1em 0 0.5em; }
  `,
  image_advtab: true,
  automatic_uploads: true,
  file_picker_types: 'image',
  file_picker_callback: function (callback: (url: string) => void, value: string, meta: { filetype: string }) {
    if (meta.filetype === 'image') {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')

      input.onchange = function (e: Event) {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]

        if (file) {
          const reader = new FileReader()
          reader.onload = function (e: ProgressEvent<FileReader>) {
            callback(e.target?.result as string)
          }
          reader.readAsDataURL(file)
        }
      }

      input.click()
    }
  }
}

// Generate slug from title
const generateSlug = () => {
  if (feature.value.title && !isEdit.value) {
    feature.value.slug = feature.value.title
      .toLowerCase()
      .replace(/[^\w\u0600-\u06FF\s-]/g, '') // Keep Persian characters
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

// Load existing feature
const loadFeature = async (id: string) => {
  loadingFeature.value = true
  try {
    const response = await api.get(`/user/admin/feature/show/${id}`)
    const data = response.data

    feature.value = {
      title: data.title || '',
      slug: data.slug || '',
      icon: data.icon || '',
      description: data.description || '',
      content: data.content || '',
      order: data.order || 0,
      is_active: data.is_active ?? true
    }
  } catch (error) {
    console.error('Error loading feature:', error)
    showAlert({ title: 'خطا', message: 'خطا در بارگذاری ویژگی', type: 'error' })
    router.push('/features')
  } finally {
    loadingFeature.value = false
  }
}

// Save feature
const saveFeature = async (publish = true) => {
  if (!feature.value.title.trim()) {
    showAlert({ title: 'خطا', message: 'لطفا عنوان ویژگی را وارد کنید', type: 'error' })
    return
  }

  if (!feature.value.slug.trim()) {
    showAlert({ title: 'خطا', message: 'لطفا نشانی URL را وارد کنید', type: 'error' })
    return
  }

  saving.value = true
  try {
    const payload = {
      title: feature.value.title,
      slug: feature.value.slug,
      icon: feature.value.icon || null,
      description: feature.value.description || null,
      content: feature.value.content || null,
      order: feature.value.order || 0,
      is_active: publish ? feature.value.is_active : false
    }

    if (isEdit.value && featureId.value) {
      await api.put(`/user/admin/feature/update/${featureId.value}`, payload)
      showAlert({ title: 'موفقیت', message: 'ویژگی با موفقیت بروزرسانی شد', type: 'success' })
    } else {
      await api.post('/user/admin/feature/store', payload)
      showAlert({ title: 'موفقیت', message: 'ویژگی با موفقیت ایجاد شد', type: 'success' })
    }

    // Redirect to features list
    setTimeout(() => {
      router.push('/features')
    }, 1500)
  } catch (error: unknown) {
    console.error('Error saving feature:', error)
    const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'خطا در ذخیره ویژگی'
    showAlert({ title: 'خطا', message: errorMessage, type: 'error' })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  // Check if editing
  if (route.params.id) {
    isEdit.value = true
    featureId.value = route.params.id as string
    await loadFeature(featureId.value)
  }
})
</script>
