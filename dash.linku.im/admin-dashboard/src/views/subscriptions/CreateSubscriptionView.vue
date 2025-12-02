<template>
  <div class="w-full p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-3">
        <router-link
            to="/subscriptions"
            class="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <i class="ti ti-arrow-right text-gray-600 dark:text-gray-400 text-xl"></i>
        </router-link>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEdit ? 'ویرایش طرح اشتراک' : 'ایجاد طرح اشتراک جدید' }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            {{ isEdit ? 'ویرایش طرح اشتراک موجود' : 'طرح اشتراک جدیدی برای کاربران ایجاد کنید' }}
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
          {{ isEdit ? 'بروزرسانی' : 'انتشار طرح' }}
        </button>
      </div>
    </div>

    <!-- Form -->
    <div v-if="plan" class="space-y-6">
      <!-- اطلاعات کلی -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <i class="ti ti-info-circle text-blue-600"></i>
          اطلاعات کلی
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              نام طرح *
            </label>
            <input
                v-model="plan.title"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: طرح پایه"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              شناسه طرح (Slug) *
            </label>
            <input
                v-model="plan.slug"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="basic-plan"
            />
          </div>
        </div>

        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            توضیحات کوتاه
          </label>
          <input
              v-model="plan.subtitle"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="مثال: مناسب برای شروع کار"
          />
        </div>

        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            توضیحات کامل
          </label>
          <textarea
              v-model="plan.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="توضیحات کامل از این طرح اشتراک"
          ></textarea>
        </div>
      </div>
      <!-- قیمت‌گذاری -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <i class="ti ti-currency-rial text-green-600"></i>
          قیمت‌گذاری
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- قیمت اصلی -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              قیمت اصلی (تومان) *
            </label>
            <input
                v-model.number="plan.price"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: 99000"
            />
          </div>

          <!-- تخفیف -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تخفیف (درصد)
            </label>
            <input
                v-model.number="plan.discount"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: 10000"
            />
          </div>

          <!-- دوره زمانی -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              دوره زمانی *
            </label>
            <select
                v-model="plan.duration"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ماه">ماهانه</option>
              <option value="3ماه">سه ماهه</option>
              <option value="6ماه">شش ماهه</option>
              <option value="سال">سالانه</option>
            </select>
          </div>
        </div>

        <!-- قیمت نهایی نمایش -->
        <div class="mt-4 text-right">
          <p class="text-gray-700 dark:text-gray-300 text-sm">
            قیمت نهایی:
            <span class="font-semibold text-green-600 dark:text-green-400 text-base">
        {{ formatCurrency(finalPrice) }}
      </span>
          </p>
        </div>
      </div>


      <!-- ویژگی‌ها -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <i class="ti ti-list-check text-purple-600"></i>
            ویژگی‌های طرح
          </h3>
          <button
              @click="addFeature"
              class="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-1"
          >
            <i class="ti ti-plus"></i>
            افزودن ویژگی
          </button>
        </div>

        <div class="space-y-3">
          <div
              v-for="(feature, index) in planStore.features"
              :key="index"
              class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
          >
            <i class="ti ti-check text-green-600 dark:text-green-400"></i>
            <input
                v-model="feature.title"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="عنوان ویژگی"
            />
            <button
                @click="removeFeature(index)"
                class="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
            >
              <i class="ti ti-trash text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="planStore.features.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          <i class="ti ti-list-check text-3xl mb-2"></i>
          <p>هنوز ویژگی‌ای اضافه نشده</p>
        </div>
      </div>

      <!-- تنظیمات انتشار -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <i class="ti ti-settings text-gray-600"></i>
          تنظیمات انتشار
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              وضعیت
            </label>
            <select
                v-model="plan.active"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">پیش‌نویس</option>
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              محبوبیت
            </label>
            <select
                v-model="plan.popularity"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="normal">عادی</option>
              <option value="recommended">پیشنهادی</option>
              <option value="highlighted">محبوب</option>
            </select>
          </div>
        </div>

        <!-- پیش‌نمایش -->
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">پیش‌نمایش طرح</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">مشاهده طرح قبل از انتشار</p>
            </div>
            <button
                @click="preview"
                class="px-4 py-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center gap-2"
            >
              <i class="ti ti-eye"></i>
              پیش‌نمایش
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useAlert} from '@/composables/useAlert'
import {usePlanStore} from "@/stores/plan.ts";

defineOptions({
  name: 'CreateSubscriptionView'
})
const {showAlert} = useAlert()
const route = useRoute()
const router = useRouter()

// Check if editing existing plan
const isEdit = ref(false)
const planId = ref<string | null>(null)

interface Feature {
  id: number
  title: string
  description: string
}

const planStore = usePlanStore()
const plan = computed(() => {
  return planStore.selectedPlan
})

// Feature management
const addFeature = () => {
  planStore.features.push({
    id: Date.now(),
    title: '',
    description: ''
  })
}

const removeFeature = (index: number) => {
  planStore.features.splice(index, 1)
}

// Save as draft
const saveDraft = () => {
  if (plan.value) {
    plan.value.active = 'draft'
  }

  savePlan()
}

// Publish plan
const publish = () => {
  if (plan.value) {
    savePlan()
  }
}

// Save plan
const savePlan = async () => {
  if (!plan.value?.title.trim()) {
    await showAlert({title: 'خطا', message: 'لطفا نام طرح را وارد کنید', type: 'error'})
    return
  }

  if (!plan.value?.slug.trim()) {
    await showAlert({title: 'خطا', message: 'لطفا شناسه طرح را وارد کنید', type: 'error'})
    return
  }

  if (plan.value?.price <= 0) {
    await showAlert({title: 'خطا', message: 'لطفا قیمت معتبری وارد کنید', type: 'error'})
    return
  }

  /*if (planStore.features.length === 0) {
    await showAlert({title: 'خطا', message: 'لطفا حداقل یک ویژگی اضافه کنید', type: 'error'})
    return
  }*/

  // Save logic here...
  const action = isEdit.value ? 'بروزرسانی' : 'ایجاد'

  const payload = {
    ...plan.value,
    price: plan.value?.price || 0,
    duration: plan.value?.duration,
    active: plan.value?.active,
    popularity: plan.value?.popularity,
    features: planStore.features.map(f => ({
      id: f.id,
      title: f.title.trim(),
      description: f.description ? f.description.trim() : ''
    }))
  }
  if (action === "بروزرسانی") await planStore.updatePlan(plan.value?.id, payload)
  if (action === "ایجاد") await planStore.createPlan(payload)
  await showAlert({
    title: 'موفقیت',
    message: `طرح اشتراک با موفقیت ${action} شد`,
    type: 'success'
  })

  // Redirect to plans list
  setTimeout(() => {
    router.push('/subscriptions')
  }, 1500)
}

// Preview plan
const preview = () => {
  const formatCurrency = (amount: number | any): string => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
  }

  const previewWindow = window.open('', '_blank')
  if (previewWindow) {
    const content = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <title>پیش‌نمایش طرح ${plan.value?.title}</title>
        <style>
          body {
            font-family: 'Shabnam', Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
            direction: rtl;
            text-align: right;
            background: #f8fafc;
          }
          .plan-card {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            max-width: 400px;
            margin: 0 auto;
          }
          .plan-title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 5px;
          }
          .plan-subtitle {
            color: #6b7280;
            margin-bottom: 20px;
          }
          .plan-price {
            font-size: 32px;
            font-weight: bold;
            color: #059669;
            margin-bottom: 20px;
          }
          .plan-price small {
            font-size: 14px;
            color: #6b7280;
          }
          .features {
            list-style: none;
            padding: 0;
          }
          .features li {
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
            display: flex;
            align-items: center;
          }
          .check-icon {
            color: #10b981;
            margin-left: 8px;
          }
          .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            margin-top: 20px;
          }
          .status.active { background: #d1fae5; color: #065f46; }
          .status.draft { background: #fef3c7; color: #92400e; }
        </style>
      </head>
      <body>
        <div class="plan-card">
          <h1 class="plan-title">${plan.value?.title}</h1>
          <p class="plan-subtitle">${plan.value?.subtitle}</p>
          <div class="plan-price">
            ${formatCurrency(plan.value?.price)}
            <small>/ ${plan.value?.duration}</small>
          </div>
          ${plan.value?.description ? `<p style="margin-bottom: 20px; color: #4b5563;">${plan.value?.description}</p>` : ''}
          <ul class="features">
            ${planStore.features.map(feature =>
        `<li><span class="check-icon">✓</span> ${feature.title}</li>`
    ).join('')}
          </ul>
          <span class="status ${plan.value?.active}">
            ${plan.value?.active === 'active' ? 'فعال' : plan.value?.active === 'draft' ? 'پیش‌نویس' : 'غیرفعال'}
          </span>
        </div>
      </body>
      </html>
    `
    previewWindow.document.write(content)
    previewWindow.document.close()
  }
}
// 💰 محاسبه قیمت نهایی
const finalPrice = computed(() => {
  const base = plan.value?.price || 0
  const discount = plan.value?.discount || 0
  const discountAmount = (base * discount) / 100
  return Math.max(base - discountAmount, 0)
})

// 💸 فرمت نمایش تومان
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
}

onMounted(async () => {
  await planStore.fetchPlans()
  // Initialize
  if (route.params.id) {
    isEdit.value = true
    planId.value = route.params.id as string
    planStore.selectPlan(Number(planId.value))
    planStore.featurePlan(Number(planId.value))

    // Load existing plan data here...
  } else {
    // 👇 برای حالت ایجاد پلن جدید
    planStore.resetPlan()
  }
})
</script>
