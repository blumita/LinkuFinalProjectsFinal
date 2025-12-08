<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
    <!-- کارت‌ها -->
    <div
        v-for="card in filteredCards"
        :key="card.id"
        class="bg-white rounded-3xl p-0 flex flex-col items-center text-center border-0 shadow-none overflow-hidden relative"
    >
      <!-- کاور -->
      <div
          class="w-full h-32 md:h-36 bg-[#F7F6F8] rounded-t-3xl overflow-hidden flex items-center justify-center relative">
        <ClientOnly><img v-if="card.cover"
                         :src="card.cover"
                         class="object-cover w-full h-full"
                         alt="coverImage"/>
          <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold text-lg"
          >
          </div>
        </ClientOnly>
        
        <!-- Badge وضعیت کارت -->
        <div class="absolute top-3 right-3 z-10">
          <button
            @click.stop="toggleCardStatus(card)"
            :class="[
              'px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all shadow-md',
              card.isActive 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-400 text-white hover:bg-gray-500'
            ]"
          >
            <i :class="card.isActive ? 'ti ti-circle-check' : 'ti ti-circle-x'"></i>
            {{ card.isActive ? 'فعال' : 'غیرفعال' }}
          </button>
        </div>
      </div>

      <!-- آواتار و بج -->
      <div class="relative flex flex-col items-center -mt-12 z-10">
        <div
            class="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white flex items-center justify-center">
          <ClientOnly><img v-if="card.avatar"
                           :src="card.avatar"
                           class="object-cover w-full h-full"
                           alt="avatarImage"/>

            <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-3xl font-bold"
            >
              <i class="ti ti-user"></i>
            </div>

          </ClientOnly>
        </div>
        <div class="absolute -bottom-1 -left-2 w-8 h-8 rounded-full overflow-hidden border-2 border-white bg-black flex items-center justify-center text-xs text-white">
          <ClientOnly>
            <img v-if="card.logo" :src="card.logo" class="object-cover w-full h-full" alt="logoImage"/>
            <div
                v-else
                class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 flex items-center justify-center text-black text-lg"
            >
              <i class="ti ti-crown"></i> <!-- یا هر آیکون دلخواه -->
            </div>

          </ClientOnly>
        </div>
      </div>

      <!-- نام و توضیح -->
      <div class="mt-2 mb-2 flex flex-col items-center">
        <h2 class="font-bold text-lg md:text-xl text-black leading-tight">
          {{ card.nameFa || card.userName }}
        </h2>
        <p class="text-gray-500 text-sm md:text-base mt-1">
          {{ card.descFa || card.desc || card.email || card.bio }}
        </p>
      </div>

      <!-- دکمه‌ها -->
      <div class="flex gap-2 mt-2 mb-4">
        <button
            class="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
            @click="editCard(card.id,card.slug)"
            :disabled="loadingCardId === card.id"
        >
          <template v-if="loadingCardId === card.id">
            <i class="ti ti-loader animate-spin text-sm"></i>
            در حال ورود...
          </template>
          <template v-else>
            <i class="ti ti-edit text-base"></i>
            ویرایش کارت
          </template>
        </button>
        <button
            class="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
            @click="$emit('open-share', card)"
        >
          <i class="ti ti-share text-base"></i>
          اشتراک ‌گذاری کارت
        </button>
      </div>
    </div>

    <!-- ساخت کارت جدید -->
    <div
        class="bg-white rounded-3xl h-70 p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-200 transition border-2 border-dashed border-gray-200"
        @click="handleAddCardClick"
    >
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl text-gray-700 mb-2"
           :class="!userStore.user.isPro ? 'opacity-50 grayscale cursor-not-allowed' : ''">
        <i class="ti ti-plus"></i>
      </div>
      <p class="mt-2 font-medium text-gray-500">ساخت کارت جدید</p>
    </div>
  </div>
  
  <!-- Modal تایید تغییر وضعیت -->
  <Teleport to="body">
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showConfirmModal = false"
    >
      <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div class="flex items-center gap-3 mb-4">
          <div :class="[
            'w-12 h-12 rounded-full flex items-center justify-center',
            confirmModalData.newStatus ? 'bg-green-100' : 'bg-red-100'
          ]">
            <i :class="[
              'text-2xl',
              confirmModalData.newStatus ? 'ti ti-circle-check text-green-600' : 'ti ti-circle-x text-red-600'
            ]"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-800">
            {{ confirmModalData.newStatus ? 'فعال‌سازی کارت' : 'غیرفعال‌سازی کارت' }}
          </h3>
        </div>
        
        <p class="text-gray-600 mb-2">
          {{ confirmModalData.newStatus 
            ? 'آیا از فعال‌سازی این کارت مطمئن هستید؟' 
            : 'آیا از غیرفعال‌سازی این کارت مطمئن هستید؟'
          }}
        </p>
        
        <p v-if="!confirmModalData.newStatus" class="text-sm text-red-600 mb-6">
          ⚠️ توجه: کارت غیرفعال برای دیگران قابل مشاهده نخواهد بود.
        </p>
        
        <div class="flex gap-3">
          <button
            @click="showConfirmModal = false"
            class="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            انصراف
          </button>
          <button
            @click="confirmToggleStatus"
            :class="[
              'flex-1 px-4 py-2.5 rounded-xl font-medium transition text-white',
              confirmModalData.newStatus 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            ]"
          >
            {{ confirmModalData.newStatus ? 'فعال کن' : 'غیرفعال کن' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
  </div>
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useFormStore} from "~/stores/form.js";
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";
import {useUserStore} from "~/stores/user.js";
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle') // یا 'ti-lock', 'ti-check', هر چی خواستی
const showInfoToast = (message, icon = 'ti-check') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000) // بعد از ۳ ثانیه بسته می‌شه
}
const props = defineProps({
  search: {
    type: String,
    default: ''
  }
})

const formStore = useFormStore()
const router = useRouter()
const loadingCardId = ref(null)
const showConfirmModal = ref(false)
const confirmModalData = ref({ card: null, newStatus: false })
// داده نمونه (تست) کارت‌ها

const cards = computed(() => formStore.cards)

const filteredCards = computed(() => {
  const query = props.search?.trim().toLowerCase() || ''
  if (!query) return cards.value

  return cards.value.filter(({nameFa, descFa, name, email}) => {
    return [nameFa, descFa, name, email].some(field =>
        field?.toLowerCase().includes(query)
    )
  })
})
const userStore=useUserStore()

function handleAddCardClick() {
  const isPro = userStore.user.isPro
  const cardCount = userStore.cards.length

  // کاربر رایگان: فقط 1 کارت - کاربر پرو: حداکثر 5 کارت
  if (!isPro && cardCount >= 1) {
    showInfoToast('کاربران رایگان فقط می‌توانند یک کارت ایجاد کنند. برای ساخت کارت‌های بیشتر به اشتراک Pro نیاز دارید', 'ti-lock')
  } else if (isPro && cardCount >= 5) {
    showInfoToast('شما به حداکثر تعداد مجاز کارت (5 کارت) رسیده‌اید', 'ti-alert-circle')
  } else {
    navigateTo('/dashboard/add-card')
  }
}


async function toggleCardStatus(card) {
  const newStatus = !card.isActive
  confirmModalData.value = { card, newStatus }
  showConfirmModal.value = true
}

async function confirmToggleStatus() {
  const { card, newStatus } = confirmModalData.value
  showConfirmModal.value = false
  
  try {
    const { $axios } = useNuxtApp()
    await $axios.put(`cards/${card.id}/toggle-active`)
    
    // بروزرسانی وضعیت کارت در لیست
    card.isActive = newStatus
    
    showInfoToast(
      newStatus ? 'کارت با موفقیت فعال شد' : 'کارت با موفقیت غیرفعال شد', 
      newStatus ? 'ti-circle-check' : 'ti-circle-x'
    )
  } catch (error) {
    showInfoToast('خطا در تغییر وضعیت کارت', 'ti-alert-circle')
  }
}

async function editCard(id,slug) {

  if (loadingCardId.value !== null) return

  loadingCardId.value = id

  await router.push({
    path: '/dashboard/edit-card',
    query: {id,slug}
  })

  loadingCardId.value = null
}
</script>
