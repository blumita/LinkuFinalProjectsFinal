<template>
  <div class="w-full p-4 sm:p-6 lg:p-8">
    <div class="w-full">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-3">
        <router-link
          to="/pages"
          class="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <i class="ti ti-arrow-right text-gray-600 dark:text-gray-400 text-xl"></i>
        </router-link>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEdit ? 'ویرایش صفحه' : 'ایجاد صفحه جدید' }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            {{ isEdit ? 'ویرایش محتوای صفحه' : 'صفحه جدیدی برای وب‌سایت ایجاد کنید' }}
          </p>
        </div>
      </div>
      <div class="flex gap-3">
        <button
          @click="saveDraft"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
        >
          ذخیره پیش‌نویس
        </button>
        <button
          @click="publish"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <i class="ti ti-check"></i>
          {{ isEdit ? 'بروزرسانی' : 'انتشار' }}
        </button>
      </div>
    </div>

    <!-- Form -->
    <div class="space-y-6">
      <!-- عنوان و URL -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              عنوان صفحه *
            </label>
            <input
              v-model="page.title"
              @input="generateSlug"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="عنوان صفحه را وارد کنید"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL صفحه *
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-gray-500 text-sm">yoursite.com/</span>
              <input
                v-model="page.slug"
                type="text"
                class="w-full pl-28 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="url-safhe"
              />
            </div>
          </div>
        </div>
      </div>



      <!-- ویرایشگر محتوا -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div class="p-4 border-b border-gray-200 dark:border-slate-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <i class="ti ti-edit text-blue-600"></i>
            محتوای صفحه
          </h3>
        </div>
        <div class="p-6">
          <!-- TinyMCE Editor -->
          <Editor
            v-model="page.content"
            :api-key="tinyMCEApiKey"
            :init="editorConfig"
          />
        </div>
      </div>


    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAlert } from '@/composables/useAlert'
import Editor from '@tinymce/tinymce-vue'
import type { BlobInfo, FilePickerMeta, TinyMCEEditor } from '@tinymce/tinymce-vue'

defineOptions({
  name: 'CreatePageView'
})

const { showAlert } = useAlert()
const route = useRoute()
const router = useRouter()

// Check if editing existing page
const isEdit = ref(false)
const pageId = ref<string | null>(null)

const page = ref({
  title: '',
  slug: '',
  content: '',
  metaDescription: '',
  keywords: '',
  status: 'draft',
  category: ''
})

// TinyMCE configuration
const tinyMCEApiKey = 'no-api-key' // For development, use 'no-api-key'. For production, get a free key from tiny.cloud

const editorConfig = {
  height: 500,
  menubar: true,
  directionality: 'rtl',
  language: 'fa',
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
    'template', 'codesample', 'hr', 'pagebreak', 'nonbreaking'
  ],
  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
           'link image media table mergetags | addcomment showcomments | ' +
           'spellcheckdialog a11ycheck typography | align lineheight | ' +
           'checklist numlist bullist indent outdent | emoticons charmap | removeformat',
  content_style: `
    body {
      font-family: 'Shabnam', Arial, sans-serif;
      font-size: 14px;
      direction: rtl;
      text-align: right;
    }
    img {
      max-width: 100%;
      height: auto;
    }
  `,
  image_advtab: true,
  image_uploadtab: true,
  automatic_uploads: true,
  file_picker_types: 'image',
  file_picker_callback: function (callback: (url: string) => void, value: string, meta: FilePickerMeta) {
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
  },
  images_upload_handler: function (blobInfo: BlobInfo, success: (url: string) => void, failure: (msg: string) => void) {
    // Convert blob to base64
    const reader = new FileReader()
    reader.onload = function() {
      success(reader.result as string)
    }
    reader.onerror = function() {
      failure('خطا در آپلود تصویر')
    }
    reader.readAsDataURL(blobInfo.blob())
  },
  setup: function (editor: TinyMCEEditor) {
    editor.on('change', function () {
      page.value.content = editor.getContent()
    })
  }
}

// Generate slug from title
const generateSlug = () => {
  if (page.value.title && !isEdit.value) {
    page.value.slug = page.value.title
      .toLowerCase()
      .replace(/[^\w\u0600-\u06FF\s-]/g, '') // Keep Persian characters
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

// Save as draft
const saveDraft = () => {
  page.value.status = 'draft'
  savePage()
}

// Publish page
const publish = () => {
  page.value.status = 'published'
  savePage()
}

// Save page
const savePage = () => {
  if (!page.value.title.trim()) {
    showAlert({ title: 'خطا', message: 'لطفا عنوان صفحه را وارد کنید', type: 'error' })
    return
  }

  if (!page.value.slug.trim()) {
    showAlert({ title: 'خطا', message: 'لطفا URL صفحه را وارد کنید', type: 'error' })
    return
  }

  // Save logic here...
  const action = isEdit.value ? 'بروزرسانی' : 'ایجاد'
  showAlert({
    title: 'موفقیت',
    message: `صفحه با موفقیت ${action} شد`,
    type: 'success'
  })

  // Redirect to pages list
  setTimeout(() => {
    router.push('/pages')
  }, 1500)
}

onMounted(async () => {
  // Check if editing
  if (route.params.id) {
    isEdit.value = true
    pageId.value = route.params.id as string
    // Load existing page data here...
  }
})
</script>
