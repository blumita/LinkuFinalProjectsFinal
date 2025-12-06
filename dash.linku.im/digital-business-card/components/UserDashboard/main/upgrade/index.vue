<template>
  <div class="space-y-4">
    <div
        v-if="loading"
        class="relative rounded-2xl overflow-hidden bg-gradient-to-b from-gray-200 to-white py-16 px-4 animate-pulse">
      <div class="absolute inset-0 bg-gray-300 opacity-20"></div>
      <div class="relative z-10 text-center space-y-3">
        <div class="h-6 w-1/3 mx-auto bg-gray-300 rounded"></div>
        <div class="h-4 w-2/3 mx-auto bg-gray-200 rounded"></div>
        <div class="h-3 w-1/2 mx-auto bg-gray-100 rounded"></div>
      </div>
    </div>
    <div v-else>
      <div class="relative rounded-2xl overflow-hidden bg-gradient-to-b from-gray-200 to-white py-16 px-4">

        <!-- پس‌زمینه‌ی تصویری محو -->
        <div class="absolute inset-0 z-0 opacity-20">
          <img src="/assets/logo/permium.png" alt="کاربران" class="w-full h-full object-cover"/>
        </div>

        <!-- متن روی زمینه -->
        <div class="relative z-10 text-center text-gray-800">
          <h2 class="text-3xl font-bold mb-4">خرید اشتراک لینکو</h2>
          <p class="text-lg font-medium text-gray-600">با خرید اشتراک <span class="font-bold text-black">لینکو</span> از
            مزایای پیشرفته و امکانات ویژه بهره‌مند شوید.</p>
          <p class="text-sm text-gray-500 mt-2">دسترسی سریع‌تر، امکانات اختصاصی، و تجربه‌ای حرفه‌ای‌تر برای کاربران
            ویژه.</p>
        </div>
      </div>


      <div v-if="isPro"
           class="relative bg-gradient-to-b from-gray-300 to-gray-100 rounded-2xl p-6 mt-12 max-w-7xl mx-auto flex items-center justify-between">
        <!-- متن فارسی -->
        <div class="flex flex-col items-end justify-center text-gray-600">
          <div class="flex items-end  space-x-2">
            <span class="text-[52px] font-bold text-gray-500 leading-none">{{ daysLeft }}</span>
            <div class="flex items-center leading-none text-right">
              <span class="text-sm">روز از اشتراک شما باقی مانده</span>

            </div>
          </div>
          <p class="text-xs mt-2 text-gray-500">می‌توانید زمان اشتراک خود را افزایش دهید:</p>
        </div>

        <!-- آیکون ساعت -->
        <div class="w-40 h-40 -mt-30 mr-2 rotate-[15deg]">
          <img src="~/assets/logo/clock.png" alt="آیکون ساعت با تاج" class="w-full h-full object-contain">
        </div>
      </div>
    </div>


    <!-- پلن‌ها -->
    <div class="grid lg:grid-cols-4 gap-6">
      <template v-if="loading">
        <div
            v-for="i in 4"
            :key="i"
            class="rounded-xl p-4 bg-gradient-to-b from-gray-200 to-gray-100 animate-pulse h-40">
          <div class="h-5 w-1/3 bg-gray-300 rounded mb-3"></div>
          <div class="h-4 w-1/4 bg-gray-200 rounded mb-3"></div>
          <div class="h-6 w-2/3 bg-gray-300 rounded mb-3"></div>
          <div class="h-8 w-full bg-gray-200 rounded"></div>
        </div>
      </template>
      <template v-else>
        <div
            v-for="plan in plans"
            :key="plan.id"
            @click="planStore.selectPlan(plan.id)"
            :class="[
        'rounded-xl p-6 cursor-pointer transition-all text-center relative shadow-md border flex flex-col items-center justify-center space-y-4',
        planStore.selectedPlanId === plan.id ? 'ring-2 ring-yellow-300 scale-[1.02] shadow-lg' : '',
        plan.popularity === 'recommended'
          ? 'bg-gradient-to-b from-[#D4AF37] to-[#B8860B] text-white border-yellow-600'
          : 'bg-gradient-to-b from-[#444] to-[#222] text-white border-gray-600'
      ]"
        >
          <!-- عنوان -->
          <p class="font-bold text-2xl">{{ plan.title }}</p>
          <p v-if="plan.subtitle" class="text-sm hidden opacity-80">{{ plan.subtitle }}</p>

          <!-- تخفیف -->
          <p
              v-if="plan.discount !== 0"
              class="text-lg text-center bg-white/20 px-6 py-1.5 rounded-full w-fit mx-auto tracking-wide"
          >
            {{ plan.discount }}٪ تخفیف
          </p>

          <!-- قیمت -->
          <div class="flex flex-col items-center space-y-2">
            <p class="text-lg font-semibold opacity-90">هر ماه</p>

            <p
                v-if="['ماه', '3ماه', '6ماه', 'سال'].includes(plan.duration)"
                class="text-3xl font-extrabold opacity-95"
            >
              {{ Math.round(finalMonthlyPrice(plan)).toLocaleString('fa-IR') }} تومان
            </p>
          </div>

          <!-- دکمه سفارش -->
          <NuxtLink
              :to="{
          name: 'dashboard-checkout',
          query: {
            id: plan.id,
            discountCode: discountCode.trim(),
            discountValue: discountValue,
            discountType: discountType.trim()
          }
        }"
              class="block w-full"
          >
            <button
                class="w-full py-2 mt-3 bg-white text-black font-bold rounded hover:bg-yellow-100 transition"
            >
              سفارش
            </button>
          </NuxtLink>
        </div>
      </template>


    </div>

    <!-- کد تخفیف -->
    <div class="bg-white border rounded-lg shadow">
      <button
          @click="showDiscount = !showDiscount"
          class="w-full flex items-center justify-between px-4 py-3 font-bold text-gray-800 text-right"
      >
        <span>کد تخفیف خرید اشتراک خود را وارد کنید.</span>
        <i class="ti ti-percentage text-xl text-gray-500"></i>
      </button>

      <transition name="fade">
        <div v-show="showDiscount" class="border-t p-4 flex gap-2 items-center">
          <button
              @click="applyDiscount"
              class="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded"
          >
            تایید کد
          </button>
          <input
              type="text"
              v-model="discountCode"
              class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
              placeholder="مثلاً: OFF50"
          />
        </div>
      </transition>
    </div>

    <!-- ویژگی‌ها -->
    <div class="space-y-3">
      <h3 class="text-lg font-semibold text-gray-800 text-right">ویژگی‌های اشتراک</h3>
      <div v-if="loading" class="space-y-2">
        <div v-for="i in 4" :key="i" class="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div v-else class="bg-white rounded-xl border overflow-hidden divide-y divide-gray-200">
        <NuxtLink
            v-for="item in features"
            :key="item.slug"
            :to="{ path: '/dashboard/upgrade/feature', query: { slug: item.slug } }"
            class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition no-underline"
        >
          <div class="flex items-center gap-3 text-gray-800">
            <i :class="`ti ${item.icon} text-lg text-gray-600`"></i>
            <span class="text-sm font-medium">{{ item.title }}</span>
          </div>
          <i class="ti ti-chevron-left text-gray-400 text-base"></i>
        </NuxtLink>
      </div>
    </div>

    <!-- دکمه پشتیبانی شناور -->
    <div class="fixed bottom-4 left-4 z-50">
      <button
          @click="supportPopup = true"
          class="bg-black hover:bg-gray-800 text-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2"
      >
        <i class="ti ti-headset"></i>
        پشتیبانی
      </button>
    </div>

    <!-- پنجره پشتیبانی -->
    <transition name="fade">
      <div
          v-if="supportPopup"
          class="fixed bottom-24 left-4 z-50 w-80 bg-white border border-gray-300 rounded-xl shadow-lg p-4 space-y-4"
      >
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-gray-800">پشتیبانی</h3>
          <button @click="supportPopup = false">
            <i class="ti ti-x text-gray-500 hover:text-red-500"></i>
          </button>
        </div>

        <div class="space-y-3 text-sm text-gray-700">
          <div class="flex items-center gap-2">
            <i class="ti ti-mail text-gray-500"></i>
            <span><strong>ایمیل:</strong> {{ supportStore.support.email }}</span>
          </div>

          <div class="flex items-center gap-2">
            <i class="ti ti-phone text-gray-500"></i>
            <span><strong>تلفن:</strong> {{ supportStore.support.phone }}</span>
          </div>

          <div class="flex items-center gap-2">
            <i class="ti ti-send text-gray-500"></i>
            <span><strong>تلگرام:</strong> {{ supportStore.support.socialMediaLink }}</span>
          </div>

          <div class="flex items-center gap-2">
            <i class="ti ti-help text-gray-500"></i>
            <NuxtLink
                to="/dashboard/support/faq"
                class="text-yellow-600 hover:underline transition-colors"
            >
              پرسش‌های متداول
            </NuxtLink>
          </div>
        </div>

      </div>
    </transition>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useToast} from '~/composables/useToast'
import {useUserStore} from "~/stores/user.js";
import {usePlanStore} from "~/stores/plan.js";
import {useSupportStore} from "~/stores/support.js";

const {error, success} = useToast()


const showDiscount = ref(false)
const supportPopup = ref(false)
const discountApplied = ref(false)
//const discountPercent = 50
const daysLeft = ref(0)
const planStore = usePlanStore()
const userStore = useUserStore()
const loading = ref(true)
const discountCode = ref("")
const discountValue=ref(0)
const discountType=ref('')

const isPro = computed(() => userStore.user?.isPro)

const plans = computed(() => planStore.plans)

const features = computed(() => planStore.features)

const applyDiscount = async () => {
  try {
    const res = await $axios.post('/discount/validate',
        {
          code: discountCode.value.trim()
        })
    if (res.data.success) {
      discountApplied.value = true
      discountValue.value=res.data.data.value
      discountType.value=res.data.data.type
      success("کد تخفیف معتبر و روی سفارش اعمال خواهد شد", "تخفیف با موفقیت بازیابی شد")
    } else {
      error("کد تخفیف نامعتبر", "کد وارد شده معتبر نیست، لطفاً دوباره تلاش کنید")
      discountApplied.value = false
    }
  } catch (err) {
    throw err
  }
}

const finalPrice = (plan) => {
  const isSelected = planStore.selectedPlanId === plan.id
  const hasDiscount = discountApplied.value

  if (!isSelected || !hasDiscount) {
    return plan.price
  }

  const planLevelDiscount = plan.discount
  let discountedPrice = Math.round(plan.price * (1 - planLevelDiscount / 100))

  if (discountType.value === 'percentage') {
    discountedPrice *= (1 - discountValue.value / 100)
  } else if (discountType.value === 'fixed') {
    discountedPrice = Math.max(0, discountedPrice - discountValue.value)
  }

  return Math.round(discountedPrice)
}

const {$axios} = useNuxtApp();

async function checkStatusSubscription() {

  const response = await $axios.get('user/subscription/status')

  if (response.data?.success) {
    const value = response.data.data.total_remaining_days
    daysLeft.value = Math.round(value)
  }
}

async function supportInfo(){

  const response = await $axios.get('support/info')


}
const supportStore = useSupportStore()

onMounted(async () => {
  await supportStore.fetchSupport()
  loading.value = true
  await checkStatusSubscription()
  const res = await planStore.fetchPlans()
  if (res) {
    loading.value = false
  } else {
    loading.value = false
  }
})
const finalMonthlyPrice = (plan) => {
  const isSelected = planStore.selectedPlanId === plan.id
  let price = plan.price
  // تخفیف پلن
  if (plan.discount) {
    price = Math.round(price * (1 - plan.discount / 100))
  }

  // تخفیف کد
  if (discountApplied.value) {
    if (discountType.value === 'percentage') {
      price = Math.round(price * (1 - discountValue.value / 100))
    } else if (discountType.value === 'fixed') {
      price = Math.max(0, price - discountValue.value)
    }
  }

  // تبدیل به مبلغ ماهانه
  let months = 1
  switch (plan.duration) {
    case 'ماه': months = 1; break
    case '3ماه': months = 3; break
    case '6ماه': months = 6; break
    case 'سال': months = 12; break
  }
  return Math.round(price / months)
}


</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>