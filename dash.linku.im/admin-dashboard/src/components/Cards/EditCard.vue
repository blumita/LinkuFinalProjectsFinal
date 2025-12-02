<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 p-4 sm:p-6">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 transition-colors duration-300">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="p-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-600 dark:text-gray-300 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <i class="ti ti-arrow-right text-xl"></i>
          </button>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">ویرایش کارت ویزیت</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">اطلاعات کارت ویزیت خود را ویرایش و بهروزرسانی کنید</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-12 text-center transition-colors duration-300">
        <div class="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
        <p class="text-gray-600 dark:text-gray-400">اطلاعات کارت در حال بارگذاری است...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-12 text-center transition-colors duration-300">
        <div class="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="ti ti-exclamation-circle text-3xl text-red-600"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">خطا در بارگذاری</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error }}</p>
        <button
          @click="loadCard"
          class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
        >
          <i class="ti ti-refresh mr-2"></i>
          تلاش مجدد
        </button>
      </div>

      <!-- Edit Form -->
      <form v-else @submit.prevent="saveCard" class="space-y-8">
        <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 transition-colors duration-300">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <!-- Left Column - Form Fields -->
            <div class="space-y-6">
              <!-- Owner Name -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">نام صاحب کارت</label>
                <input
                  v-model="cardForm.ownerName"
                  type="text"
                  required
                  readonly
                  placeholder="نام صاحب کارت را وارد کنید..."
                  class="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400"
                >
              </div>

              <!-- Card Type -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">نوع کارت</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    v-for="cardType in products"
                    :key="cardType.id"
                    class="relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md"
                    :class="cardForm.cardType === cardType.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg'
                      : 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-600'"
                  >
                    <input
                      v-model="cardForm.cardType"
                      type="radio"
                      :value="cardType.id"
                      readonly
                      disabled
                      class="sr-only"
                    >
                    <div class="flex items-center gap-3">
                      <img :src="cardType.image" :alt="cardType.name" class="w-10 h-10 object-contain">
                      <span class="font-medium text-sm" :class="cardForm.cardType === cardType.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'">
                        {{ cardType.name }}
                      </span>
                    </div>
                    <!-- Selected Indicator -->
                    <div v-if="cardForm.cardType === cardType.id" class="absolute top-2 left-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <i class="ti ti-check text-white text-xs"></i>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Customer Mobile -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">شماره موبایل مشتری</label>
                <input
                  v-model="cardForm.mobile"
                  type="tel"
                  inputmode="tel"
                  pattern="09[0-9]{9}"
                  maxlength="11"
                  placeholder="مثال: 09123456789"
                  readonly
                  class="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 font-mono ltr"
                >
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                  <i class="ti ti-info-circle text-blue-500"></i>
                  شماره موبایل مشتری برای ارتباط و اطلاع‌رسانی
                </p>
              </div>

              <!-- License -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">شناسه لایسنس کارت</label>
                <div class="flex gap-3 items-center">
                  <input
                    v-model="cardForm.license"
                    type="text"
                    readonly
                    placeholder="04E1F322E81490"
                    class="flex-1 px-4 py-4 bg-gray-100 dark:bg-slate-600 border border-gray-200 dark:border-slate-500 text-gray-700 dark:text-gray-200 rounded-xl font-mono text-sm cursor-not-allowed"
                  >
                  <button
                    type="button"
                    @click="generateLicense"
                    disabled
                    class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    title="تولید شناسه جدید"
                  >
                    <i class="ti ti-key text-lg"></i>
                  </button>
                  <button
                    type="button"
                    @click="copyToClipboard(cardForm.license)"
                    class="p-4 bg-gray-100 dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500 text-gray-600 dark:text-gray-300 rounded-xl transition-all duration-300"
                    title="کپی شناسه لایسنس"
                  >
                    <i class="ti ti-copy text-lg"></i>
                  </button>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                  <i class="ti ti-shield-check text-green-500"></i>
                  شناسه منحصر به فرد 8 کاراکتری برای این کارت
                </p>
              </div>

              <!-- QR Link -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">لینک QR کد</label>
                <div class="flex gap-3 items-center">
                  <input
                    v-model="cardForm.qrLink"
                    type="url"
                    readonly
                    required
                    placeholder="https://linku.im/04E1F322E81490/pqqr"
                    class="flex-1 px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400"
                  >
                  <button
                    type="button"
                    @click="generateRandomLink"
                    disabled
                    class="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-4 rounded-xl opacity-50 cursor-not-allowed"
                    title="تولید لینک تصادفی"
                  >
                    <i class="ti ti-refresh text-lg"></i>
                  </button>
                  <button
                    type="button"
                    @click="copyToClipboard(cardForm.qrLink)"
                    class="p-4 bg-gray-100 dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500 text-gray-600 dark:text-gray-300 rounded-xl transition-all duration-300"
                    title="کپی لینک"
                  >
                    <i class="ti ti-copy text-lg"></i>
                  </button>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                  <i class="ti ti-info-circle text-blue-500"></i>
                  لینک منحصر به فرد برای QR کد شما
                </p>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">وضعیت کارت</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label class="relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md" :class="cardForm.status === 'active' ? 'border-green-500 bg-green-50 dark:bg-green-900/30 shadow-lg' : 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 hover:border-green-300 dark:hover:border-green-600'">
                    <input
                      v-model="cardForm.status"
                      type="radio"
                      value="active"
                      class="sr-only"
                    >
                    <div class="flex items-center gap-3">
                      <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="cardForm.status === 'active' ? 'border-green-500 bg-green-500' : 'border-gray-300 dark:border-gray-600'">
                        <div v-if="cardForm.status === 'active'" class="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span class="font-medium" :class="cardForm.status === 'active' ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'">فعال</span>
                    </div>
                    <!-- Selected Indicator -->
                    <div v-if="cardForm.status === 'active'" class="absolute top-2 left-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <i class="ti ti-check text-white text-xs"></i>
                    </div>
                  </label>

                  <label class="relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md" :class="cardForm.status === 'inactive' ? 'border-red-500 bg-red-50 dark:bg-red-900/30 shadow-lg' : 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 hover:border-red-300 dark:hover:border-red-600'">
                    <input
                      v-model="cardForm.status"
                      type="radio"
                      value="inactive"
                      class="sr-only"
                    >
                    <div class="flex items-center gap-3">
                      <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="cardForm.status === 'inactive' ? 'border-red-500 bg-red-500' : 'border-gray-300 dark:border-gray-600'">
                        <div v-if="cardForm.status === 'inactive'" class="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span class="font-medium" :class="cardForm.status === 'inactive' ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'">غیرفعال</span>
                    </div>
                    <!-- Selected Indicator -->
                    <div v-if="cardForm.status === 'inactive'" class="absolute top-2 left-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <i class="ti ti-check text-white text-xs"></i>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Right Column - QR Preview -->
            <div class="space-y-6">
              <!-- QR Code Preview -->
              <div v-if="cardForm.qrLink">
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">پیش‌نمایش QR کد</label>
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 border-2 border-gray-200 dark:border-slate-600 p-8 rounded-2xl text-center transition-all duration-300 hover:shadow-lg">
                  <div v-if="qrCodeDataURL" class="mb-6">
                    <img :src="qrCodeDataURL" alt="QR Code" class="mx-auto w-56 h-56 rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl">
                  </div>
                  <div v-else class="w-56 h-56 bg-gray-200 dark:bg-slate-600 mx-auto rounded-2xl flex items-center justify-center mb-6 border-4 border-white dark:border-slate-800">
                    <i class="ti ti-qrcode text-6xl text-gray-400 dark:text-gray-500"></i>
                  </div>

                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">QR کد آماده است!</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">این QR کد را دانلود کرده و روی کارت خود چاپ کنید</p>

                  <div class="flex gap-3 justify-center">
                    <button
                      v-if="qrCodeDataURL"
                      type="button"
                      @click="downloadQRCode"
                      class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <i class="ti ti-download text-lg"></i>
                      دانلود QR کد
                    </button>
                    <button
                      type="button"
                      @click="copyToClipboard(cardForm.qrLink)"
                      class="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <i class="ti ti-copy text-lg"></i>
                      کپی لینک
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 transition-colors duration-300">
          <div class="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              @click="goBack"
              :disabled="saving"
              class="px-8 py-4 border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
            >
              <i class="ti ti-x mr-2"></i>
              انصراف
            </button>

            <button
              type="submit"
              :disabled="saving"
              class="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl order-1 sm:order-2"
            >
              <i v-if="saving" class="ti ti-loader-2 text-lg animate-spin"></i>
              <i v-else class="ti ti-check text-lg"></i>
              {{ saving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Success Toast -->
    <div v-if="copyMessage" class="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-xl animate-fade-in flex items-center gap-2">
      <i class="ti ti-check-circle text-xl"></i>
      {{ copyMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, reactive, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import QRCode from 'qrcode'
import {useCardsStore} from "@/stores/cards.ts";
import {useProductStore} from "@/stores/product.ts";

// Router and Route
const router = useRouter()
const route = useRoute()
const isGeneratingLicense = ref(false)
// State
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const cardId = ref(route.params.id as string)
const qrCodeDataURL = ref<string>('')
// Form data
const cardForm = reactive({
  ownerName: '',
  mobile: '',
  cardType: 'card', // نوع کارت
  qrLink: '',
  license: '',
  status: 'active' as 'active' | 'inactive'
})
const productStore=useProductStore()
const products = productStore.products
console.log('products',products)
// Sample data (در پروژه واقعی از API دریافت می‌شود)
const cardStore = useCardsStore()
const cards = cardStore.cards

// Watch for qrLink changes to auto-generate QR code
watch(() => cardForm.qrLink, async (newLink) => {
  if (newLink) {
    await generateQRCode()
  }
})

// Methods
const loadCard = async () => {
  loading.value = true
  error.value = ''

  try {
    // پیدا کردن کارت بر اساس ID
    const card = cards.find(c => Number(c.id) === Number(cardId.value))

    if (!card) {
      throw new Error('کارت مورد نظر یافت نشد')
    }

    // پر کردن فرم با اطلاعات کارت
    cardForm.ownerName = card.ownerName
    cardForm.mobile = card.mobile || ''
    cardForm.cardType = card.cardType || 'card'
    cardForm.qrLink = card.qrLink
    cardForm.license = card.license
    cardForm.status = card.status

    // تولید QR کد
    await generateQRCode()

  } catch (err: unknown) {
    error.value = (err as Error).message || 'خطا در بارگذاری اطلاعات کارت'
  } finally {
    loading.value = false
  }
}

const generateRandomLink = () => {
  //cardForm.qrLink = `https://linku.im/${licenseId}/${cardModel}`
  //cardForm.license = licenseId
}
const { appContext } = getCurrentInstance()!
const axios = appContext.config.globalProperties.$axios

const generateLicense = async () => {
  if (cardForm.status == 'active') {
    isGeneratingLicense.value = false

    const selectedCardType = products.find(p => String(p.id) === String(cardForm.cardType))

    const res = await axios.post(`user/admin/generateLicense/${cardId.value}`)
    isGeneratingLicense.value = true
    const licenseId=res.data.licenseId
    cardForm.license = licenseId

    // اگر قبلاً QR Link داشته، آن را هم به‌روزرسانی کن
    if (cardForm.qrLink) {
      const parts = cardForm.qrLink.split('/')
      const cardModel = parts[parts.length - 1] || Math.random().toString(36).substr(2, 4).toLowerCase()
      cardForm.qrLink = `https://linku.im/profile/${licenseId}/${cardModel}`
    }
  }

}

const generateQRCode = async () => {
  if (!cardForm.qrLink) return

  try {
    // Generate QR code without logo
    qrCodeDataURL.value = await QRCode.toDataURL(cardForm.qrLink, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    qrCodeDataURL.value = ''
  }
}

const downloadQRCode = () => {
  if (!qrCodeDataURL.value) return

  const link = document.createElement('a')
  link.download = `qr-code-${cardId.value}.png`
  link.href = qrCodeDataURL.value
  link.click()
}

const saveCard = async () => {
  saving.value = true

  try {
    const cardform = { ...cardForm }

    // فراخوانی API برای ویرایش کارت
    await cardStore.updateCard(cardId.value, cardform)

    // بازگشت به صفحه کارت‌ها با پیام موفقیت
    await router.push({
      name: 'cards',
      query: {
        success: 'کارت با موفقیت ویرایش شد'
      }
    })

  } catch (err: unknown) {
    error.value = (err as Error).message || 'خطا در ذخیره اطلاعات'
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push({ name: 'cards' })
}

// Copy to clipboard helper
const copyMessage = ref('');
const copyToClipboard = (text: string) => {
  if (!text) return;
  navigator.clipboard.writeText(text);
  copyMessage.value = 'کپی شد!';
  setTimeout(() => {
    copyMessage.value = '';
  }, 1500);
};

// Lifecycle
onMounted(async () => {
  await loadCard()
  await productStore.fetchProducts()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.3s;
}
</style>
