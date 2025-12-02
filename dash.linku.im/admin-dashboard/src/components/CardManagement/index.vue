<template>
  <div class="p-6 min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">مدیریت انواع کارت</h1>
      <p class="text-gray-600 dark:text-gray-400">مدیریت انواع کارت‌های موجود برای ایجاد پروفایل</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">کل محصولات</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ products.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <i class="ti ti-package text-xl text-blue-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">محصولات فعال</p>
            <p class="text-2xl font-bold text-green-600">{{ products.filter(p => p.status === 'active').length }}</p>
          </div>
          <div class="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <i class="ti ti-check text-xl text-green-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">محصولات غیرفعال</p>
            <p class="text-2xl font-bold text-red-600">{{ products.filter(p => p.status === 'inactive').length }}</p>
          </div>
          <div class="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            <i class="ti ti-x text-xl text-red-600"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Management -->
    <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-2">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">لیست محصولات</h2>
        <button
            @click="openAddModal"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <i class="ti ti-plus text-sm"></i>
          افزودن محصول
        </button>
      </div>

      <!-- Products Grid -->
      <div v-if="products.length === 0" class="text-center py-12">
        <i class="ti ti-package text-4xl text-gray-400 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">محصولی وجود ندارد</h3>
        <p class="text-gray-500 dark:text-gray-400">اولین محصول خود را اضافه کنید</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <div
            v-for="product in products"
            :key="product.id"
            class="border border-gray-200 dark:border-slate-700 rounded-2xl hover:shadow-lg transition-all group p-4 sm:p-6 flex flex-col"
        >
          <!-- Product Image -->
          <div class="relative mb-4">
            <div class="w-full h-32 sm:h-40 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden">
              <img
                  v-if="product.image"
                  :src="product.image"
                  :alt="product.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
              >
              <div v-else class="w-full h-full flex items-center justify-center">
                <i class="ti ti-photo text-3xl text-gray-400"></i>
              </div>
            </div>

            <!-- Status Badge -->
            <div class="absolute top-2 right-2">
              <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold"
                  :class="product.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
              >
                {{ product.status === 'active' ? 'فعال' : 'غیرفعال' }}
              </span>
            </div>
          </div>

          <!-- Product Info -->
          <div class="mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ product.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">شناسه: {{ product.id }}</p>
            <p v-if="product.description" class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {{ product.description }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-2">
            <button
                @click="editProduct(product)"
                class="w-full sm:w-auto flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm flex items-center justify-center gap-1"
            >
              <i class="ti ti-edit text-sm"></i>
              ویرایش
            </button>
            <button
                @click="toggleStatus(product.id)"
                class="w-full sm:w-auto flex-1 px-3 py-2 transition-colors text-sm flex items-center justify-center gap-1"
                :class="product.status === 'active'
                ? 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                : 'bg-green-100 hover:bg-green-200 text-green-700'"
            >
              <i :class="product.status === 'active' ? 'ti ti-eye-off' : 'ti ti-eye'" class="text-sm"></i>
              {{ product.status === 'active' ? 'غیرفعال' : 'فعال' }}
            </button>
            <button
                @click="deleteProduct(product.id)"
                class="w-full sm:w-auto px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm"
            >
              <i class="ti ti-trash text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 dark:border-slate-700">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ editingProduct ? 'ویرایش محصول' : 'افزودن محصول جدید' }}
          </h3>
        </div>

        <form @submit.prevent="saveProduct" class="p-6">
          <div class="space-y-6">
            <!-- Product ID -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                شناسه محصول <span class="text-red-500">*</span>
              </label>
              <input
                  v-model="form.identifier"
                  type="text"
                  required
                  :disabled="!!editingProduct"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  placeholder="مثال: card-premium"
              >
              <p class="text-xs text-gray-500 mt-1">شناسه یکتا برای محصول (فقط حروف انگلیسی، اعداد و خط تیره)</p>
            </div>

            <!-- Product Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                نام محصول <span class="text-red-500">*</span>
              </label>
              <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="مثال: کارت پروفایل طلایی"
              >
            </div>

            <!-- Product Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">توضیحات</label>
              <textarea
                  v-model="form.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="توضیحات مختصر در مورد محصول..."
              ></textarea>
            </div>

            <!-- Image Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تصویر محصول</label>

              <!-- Current Image Preview -->
              <div v-if="form.image" class="mb-4">
                <div class="relative inline-block">
                  <img :src="form.image" alt="پیش‌نمایش" class="w-32 h-32 object-cover rounded-lg border">
                  <button
                      type="button"
                      @click="form.image = ''"
                      class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <i class="ti ti-x text-xs"></i>
                  </button>
                </div>
              </div>

              <!-- Upload Options -->
              <div class="space-y-3">
                <div>
                  <input
                      type="file"
                      ref="fileInput"
                      @change="handleFileUpload"
                      accept="image/*"
                      class="hidden"
                  >
                  <button
                      type="button"
                      @click="triggerFileInput"
                      class="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400"
                  >
                    <i class="ti ti-upload text-lg"></i>
                    <span>انتخاب فایل تصویر</span>
                  </button>
                </div>

                <div class="text-center text-gray-500">یا</div>

                <div>
                  <input
                      v-model="form.image"
                      type="url"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="لینک تصویر (مثال: https://example.com/image.jpg)"
                  >
                </div>
              </div>

              <p class="text-xs text-gray-500 mt-2">فرمت‌های مجاز: JPG, PNG, GIF (حداکثر 5 مگابایت)</p>
            </div>

            <!-- Product Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">وضعیت</label>
              <div class="flex gap-4">
                <label class="flex items-center">
                  <input
                      v-model="form.status"
                      type="radio"
                      value="active"
                      class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  >
                  <span class="mr-2 text-sm text-gray-700 dark:text-gray-300">فعال</span>
                </label>
                <label class="flex items-center">
                  <input
                      v-model="form.status"
                      type="radio"
                      value="inactive"
                      class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  >
                  <span class="mr-2 text-sm text-gray-700 dark:text-gray-300">غیرفعال</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="flex justify-end gap-3 mt-8">
            <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors"
            >
              انصراف
            </button>
            <button
                type="submit"
                :disabled="isSaving"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <i v-if="!isSaving" class="ti ti-check text-sm"></i>
              <svg v-else class="w-4 h-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                   viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span>
                    {{ isSaving ? (editingProduct ? 'در حال به‌روزرسانی...' : 'در حال افزودن...') :
                     (editingProduct ? 'به‌روزرسانی' : 'افزودن محصول') }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center ml-3">
              <i class="ti ti-trash text-red-600"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">حذف محصول</h3>
          </div>

          <p class="text-gray-600 dark:text-gray-300 mb-6">
            آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟ این عمل قابل بازگشت نیست.
          </p>

          <div class="flex justify-end gap-3">
            <button
                @click="showDeleteModal = false; productToDelete = null"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              انصراف
            </button>
            <button
                @click="confirmDelete"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, computed} from 'vue'
import {useProductStore} from "@/stores/product.ts";
import type {Product, ProductResult} from "@/types/product.ts";
import InfoToast from "@/components/InfoToast.vue";

defineOptions({
  name: 'CardManagementComponent'
})
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle') // یا 'ti-lock', 'ti-check', هر چی خواستی
const showInfoToast = (message: string, icon = 'ti-lock') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000) // بعد از ۳ ثانیه بسته می‌شه
}

// State
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingProduct = ref<Product | null>(null)
const productToDelete = ref<string | null>(null)
const fileInput = ref<HTMLInputElement>()
const isSaving = ref(false)

// Form data
const form = reactive({
  id: '',
  identifier: '',
  name: '',
  description: '',
  image: '',
  status: 'active' as 'active' | 'inactive'
})

// Sample products data

const products = computed(() => productStore.products)

// Methods
const openAddModal = () => {
  editingProduct.value = null
  resetForm()
  showModal.value = true
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  form.id = product.id
  form.identifier = product.identifier
  form.name = product.name
  form.description = product.description || ''
  form.image = product.image || ''
  form.status = product.status
  showModal.value = true
}

const toggleStatus = async (id: string) => {
  try {
    await productStore.toggleStatus(id)
  } catch (error) {
    console.error('❌ خطا در تغییر وضعیت محصول:', error)
  }
}

const confirmDelete = async () => {
  if (productToDelete.value) {
    try {
      await productStore.deleteProduct(productToDelete.value)
      showDeleteModal.value = false
      productToDelete.value = null
    } catch (error) {
      console.error('❌ خطا در حذف محصول:', error)
    }
  }
}

const deleteProduct = (id: string) => {
  productToDelete.value = id
  showDeleteModal.value = true
}
onMounted(() => {
  productStore.fetchProducts()
})

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // In a real app, you would upload this to a server
    // For now, we'll create a local URL
    const reader = new FileReader()
    reader.onload = (e) => {
      form.image = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const productStore = useProductStore()

const saveProduct = async () => {

  try {
    isSaving.value = true
    let response:ProductResult
    if (editingProduct.value) {
      response = await productStore.updateProduct(form.id, form)

    } else {
      response = await productStore.addProduct(form)

    }
    if(response.success){

      showModal.value = false
      showInfoToast(response.message,toastIcon.value);

    }else{
      showInfoToast(response.message,toastIcon.value);
    }

  } catch (error) {
    console.error('❌ خطا در ذخیره محصول:', error)
  } finally {
    isSaving.value = false
  }
}


const closeModal = () => {
  showModal.value = false
  editingProduct.value = null
  resetForm()
}

const resetForm = () => {
  form.id = ''
  form.name = ''
  form.description = ''
  form.image = ''
  form.status = 'active'
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}
</script>
