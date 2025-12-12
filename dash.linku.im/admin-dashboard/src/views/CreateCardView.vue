<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 p-4 sm:p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 transition-colors duration-300">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">ایجاد کارت ویزیت</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">کارت‌های ویزیت جدید ایجاد کنید</p>
          </div>
          <router-link
              :to="{ name: 'cards' }"
              class="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 px-4 py-2 rounded-lg transition-all duration-300 font-medium flex items-center gap-2 text-sm"
          >
            <i class="ti ti-arrow-left"></i>
            بازگشت
          </router-link>
        </div>
      </div>

      <!-- Card Creation Form -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div class="p-6">
          <form @submit.prevent="createCard" class="space-y-5">
            <!-- License Generation Toggle -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">نوع تولید لایسنس</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="cardForm.isAutoGenerate = true"
                  :class="[
                    'flex items-center justify-center gap-2 p-4 border-2 rounded-xl transition-all duration-300',
                    cardForm.isAutoGenerate
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-md'
                      : 'border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                  ]"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <span class="text-sm font-medium">خودکار (سیستم تولید کند)</span>
                </button>
                <button
                  type="button"
                  @click="cardForm.isAutoGenerate = false"
                  :class="[
                    'flex items-center justify-center gap-2 p-4 border-2 rounded-xl transition-all duration-300',
                    !cardForm.isAutoGenerate
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 shadow-md'
                      : 'border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-orange-300'
                  ]"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                  <span class="text-sm font-medium">دستی (خودم وارد می‌کنم)</span>
                </button>
              </div>
            </div>

            <!-- Auto Generate Info -->
            <div v-if="cardForm.isAutoGenerate" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p class="text-blue-700 dark:text-blue-400 text-sm flex items-center gap-2">
                <i class="ti ti-info-circle"></i>
                لایسنس به صورت خودکار توسط سیستم تولید خواهد شد
              </p>
            </div>

            <!-- Manual License Input -->
            <div v-if="!cardForm.isAutoGenerate">
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">شناسه لایسنس (Slug) <span class="text-red-500">*</span></label>
              <div class="flex gap-2">
                <input
                  v-model="cardForm.license"
                  type="text"
                  placeholder="مثال: byli6oxl"
                  class="flex-1 px-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  @click="checkLicenseExists"
                  :disabled="isCheckingLicense || !cardForm.license.trim()"
                  class="px-4 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  title="بررسی تکراری نبودن"
                >
                  <i v-if="!isCheckingLicense" class="ti ti-search"></i>
                  <i v-else class="ti ti-loader animate-spin"></i>
                  <span class="hidden sm:inline">بررسی</span>
                </button>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">فقط حروف انگلیسی، اعداد و - یا _ مجاز است</p>
              <!-- License Check Status -->
              <div v-if="licenseCheckStatus" class="mt-2">
                <p v-if="licenseCheckStatus === 'available'" class="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <i class="ti ti-check"></i>
                  این لایسنس قابل استفاده است
                </p>
                <p v-else-if="licenseCheckStatus === 'exists'" class="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <i class="ti ti-x"></i>
                  این لایسنس قبلاً ثبت شده است
                </p>
                <p v-else-if="licenseCheckStatus === 'invalid'" class="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                  <i class="ti ti-alert-triangle"></i>
                  فرمت لایسنس نامعتبر است
                </p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">محصول <span class="text-red-500">*</span></label>
              <div class="grid grid-cols-3 gap-3">
                <div v-for="product in products" :key="product.id" @click="cardForm.productUnitId = product.id" :class="['relative cursor-pointer rounded-lg border-2 p-4 transition-all', cardForm.productUnitId === product.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' : 'border-gray-200 dark:border-slate-600']">
                  <div class="text-center">
                    <img :src="product.image" :alt="product.name" class="w-12 h-12 mx-auto mb-2 object-contain" />
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ product.name }}</h3>
                  </div>
                  <div v-if="cardForm.productUnitId === product.id" class="absolute -top-1 -left-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><i class="ti ti-check text-white text-xs"></i></div>
                </div>
              </div>
            </div>
            <div v-if="formError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p class="text-red-700 dark:text-red-400 text-sm">{{ formError }}</p>
            </div>
            <div class="flex gap-3 pt-5 border-t border-gray-200 dark:border-slate-700">
              <button type="submit" :disabled="isCreating || (!cardForm.isAutoGenerate && licenseCheckStatus === 'exists')" class="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2">
                <i v-if="!isCreating" class="ti ti-plus"></i>
                <i v-else class="ti ti-loader animate-spin"></i>
                {{ isCreating ? 'در حال ایجاد...' : 'ایجاد کارت' }}
              </button>
              <router-link :to="{ name: 'cards' }" class="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium flex items-center justify-center gap-2"><i class="ti ti-x"></i>انصراف</router-link>
            </div>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, onMounted, computed, getCurrentInstance} from 'vue'
import {useRouter} from 'vue-router'
import {useAlert} from '@/composables/useAlert'
import {useProductStore} from "@/stores/product.ts";
import {useCardsStore} from "@/stores/cards.ts";

defineOptions({
  name: 'CreateCardView'
})

const router = useRouter()
const {showSuccess, showError} = useAlert()

const productStore = useProductStore();
const cardStore = useCardsStore()
const products = computed(()=>productStore.products);

const {appContext} = getCurrentInstance()!
const axios = appContext.config.globalProperties.$axios

// Simple Card Form
const cardForm = ref({
  license: '',
  productUnitId: '',
  isAutoGenerate: true // پیش‌فرض خودکار
})
const isCreating = ref(false)
const formError = ref('')
const isCheckingLicense = ref(false)
const licenseCheckStatus = ref<'available' | 'exists' | 'invalid' | null>(null)

// Check if license exists
const checkLicenseExists = async () => {
  const license = cardForm.value.license.trim()
  if (!license) {
    licenseCheckStatus.value = null
    return
  }

  // بررسی فرمت لاتین
  const slugPattern = /^[a-zA-Z0-9-_]+$/
  if (!slugPattern.test(license)) {
    licenseCheckStatus.value = 'invalid'
    return
  }

  isCheckingLicense.value = true
  try {
    const response = await axios.get(`v1/cards/check-license/${license}`)
    if (response.data?.exists) {
      licenseCheckStatus.value = 'exists'
    } else {
      licenseCheckStatus.value = 'available'
    }
  } catch (error: any) {
    // اگر 404 برگشت یعنی لایسنس موجود نیست و قابل استفاده است
    if (error.response?.status === 404) {
      licenseCheckStatus.value = 'available'
    } else {
      licenseCheckStatus.value = null
    }
  } finally {
    isCheckingLicense.value = false
  }
}

// Create Card (both auto and manual)
const createCard = async () => {
  if (!cardForm.value.productUnitId) {
    formError.value = 'لطفا محصول را انتخاب کنید'
    return
  }

  // اگر خودکار است
  if (cardForm.value.isAutoGenerate) {
    isCreating.value = true
    formError.value = ''
    try {
      const response = await cardStore.createAutoCard({
        product_unit_id: cardForm.value.productUnitId
      })
      if (response.success) {
        await showSuccess('موفق!', 'کارت با موفقیت ایجاد شد')
        await router.push({ name: 'cards' })
      } else {
        formError.value = response.message || 'خطا در ایجاد کارت'
      }
    } catch (error: any) {
      formError.value = error.response?.data?.message || 'خطا در ایجاد کارت'
    } finally {
      isCreating.value = false
    }
    return
  }

  // ایجاد دستی
  if (!cardForm.value.license.trim()) {
    formError.value = 'لطفا شناسه لایسنس را وارد کنید'
    return
  }
  // بررسی فرمت لاتین
  const slugPattern = /^[a-zA-Z0-9-_]+$/
  if (!slugPattern.test(cardForm.value.license.trim())) {
    formError.value = 'شناسه فقط باید شامل حروف انگلیسی، اعداد و - یا _ باشد'
    return
  }

  isCreating.value = true
  formError.value = ''
  try {
    const response = await cardStore.createManualCard({
      slug: cardForm.value.license.trim(),
      product_unit_id: cardForm.value.productUnitId
    })
    if (response.success) {
      await showSuccess('موفق!', 'کارت با موفقیت ایجاد شد')
      await router.push({ name: 'cards' })
    } else {
      formError.value = response.message || 'خطا در ایجاد کارت'
    }
  } catch (error: any) {
    formError.value = error.response?.data?.message || 'خطا در ایجاد کارت'
  } finally {
    isCreating.value = false
  }
}

// Watch for license input changes to reset check status
watch(() => cardForm.value.license, () => {
  licenseCheckStatus.value = null
})

// Generate initial random link
onMounted(async () => {
  await productStore.fetchProducts()
})
</script>
