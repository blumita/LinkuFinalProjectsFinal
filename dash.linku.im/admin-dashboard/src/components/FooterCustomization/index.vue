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
    <div class="mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">سفارشی‌سازی Footer</h1>
      <p class="text-gray-600 dark:text-gray-400">جستجو و تنظیم footer سفارشی برای هر پروفایل</p>
    </div>

    <!-- Search Section -->
    <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">جستجوی پروفایل</h2>
      <div class="flex gap-4">
        <div class="flex-1">
          <input
            v-model="searchSlug"
            @keyup.enter="searchProfile"
            type="text"
            placeholder="شناسه پروفایل (slug) را وارد کنید"
            class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
          />
        </div>
        <button
          @click="searchProfile"
          :disabled="isSearching || !searchSlug.trim()"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl transition-colors duration-300 flex items-center gap-2"
        >
          <svg v-if="isSearching" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          جستجو
        </button>
      </div>
    </div>

    <!-- Profile Info & Footer Form -->
    <div v-if="foundCard" class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">اطلاعات پروفایل</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نام پروفایل</label>
          <div class="text-gray-900 dark:text-white">{{ foundCard.name || '-' }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">شناسه (Slug)</label>
          <div class="text-gray-900 dark:text-white">{{ foundCard.slug || '-' }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نام کاربر</label>
          <div class="text-gray-900 dark:text-white">{{ foundCard.userName || '-' }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">لینک پروفایل</label>
          <a :href="foundCard.url" target="_blank" class="text-blue-600 hover:underline">{{ foundCard.url }}</a>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-slate-700 pt-6 mt-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">تنظیمات Footer سفارشی</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          در صورت خالی بودن، footer پیش‌فرض "ساخته شده با لینکو" نمایش داده می‌شود.
        </p>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              متن Footer
            </label>
            <input
              v-model="footerText"
              type="text"
              placeholder="مثال: ساخته شده با لینکو"
              maxlength="100"
              class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            />
            <p class="text-xs text-gray-500 mt-1">{{ footerText.length }}/100</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              لینک Footer
            </label>
            <input
              v-model="footerUrl"
              type="url"
              placeholder="مثال: https://linkutag.com"
              maxlength="500"
              class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            />
            <p class="text-xs text-gray-500 mt-1">{{ footerUrl.length }}/500</p>
          </div>

          <div class="flex gap-4">
            <button
              @click="saveFooter"
              :disabled="isSaving"
              class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl transition-colors duration-300 flex items-center gap-2"
            >
              <svg v-if="isSaving" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              ذخیره
            </button>
            <button
              @click="clearFooter"
              :disabled="isSaving"
              class="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl transition-colors duration-300"
            >
              پاک کردن
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found Message -->
    <div v-if="searchPerformed && !foundCard && !isSearching" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center">
      <p class="text-yellow-800 dark:text-yellow-200">پروفایلی با این شناسه یافت نشد.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getCurrentInstance } from 'vue'
import type { AxiosInstance, AxiosError } from 'axios'

defineOptions({
  name: 'FooterCustomization'
})

interface CardData {
  id: string | number
  slug: string
  name: string
  userName?: string
  url?: string
  customFooterText?: string | null
  customFooterUrl?: string | null
  [key: string]: unknown
}

const { appContext } = getCurrentInstance()!
const axios = appContext.config.globalProperties.$axios as AxiosInstance

const searchSlug = ref('')
const foundCard = ref<CardData | null>(null)
const isSearching = ref(false)
const isSaving = ref(false)
const searchPerformed = ref(false)
const showSuccessMessage = ref(false)
const successMessage = ref('')

const footerText = ref('')
const footerUrl = ref('')

const searchProfile = async () => {
  if (!searchSlug.value.trim()) return

  isSearching.value = true
  searchPerformed.value = true
  foundCard.value = null

  try {
    const res = await axios.get(`user/admin/cards/search/${searchSlug.value.trim()}`)
    if (res.data.success && res.data.data) {
      foundCard.value = res.data.data
      footerText.value = res.data.data.customFooterText || ''
      footerUrl.value = res.data.data.customFooterUrl || ''
    } else {
      foundCard.value = null
    }
  } catch (error) {
    console.error('خطا در جستجو:', error)
    foundCard.value = null
  } finally {
    isSearching.value = false
  }
}

const saveFooter = async () => {
  if (!foundCard.value) return

  isSaving.value = true

  try {
    const res = await axios.put(`user/admin/cards/${foundCard.value.id}/updateFooter`, {
      customFooterText: footerText.value.trim() || null,
      customFooterUrl: footerUrl.value.trim() || null,
    })

    if (res.data.success) {
      successMessage.value = 'Footer با موفقیت ذخیره شد.'
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)

      // آپدیت اطلاعات کارت
      foundCard.value = res.data.data
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    console.error('خطا در ذخیره:', error)
    alert('خطا در ذخیره footer: ' + (axiosError.response?.data?.message || axiosError.message || 'خطای نامشخص'))
  } finally {
    isSaving.value = false
  }
}

const clearFooter = async () => {
  if (!foundCard.value) return
  if (!confirm('آیا از پاک کردن footer سفارشی اطمینان دارید؟')) return

  footerText.value = ''
  footerUrl.value = ''
  await saveFooter()
}
</script>

