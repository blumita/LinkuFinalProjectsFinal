<template>
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

  if (isPro && cardCount <= 5) {
    navigateTo('/dashboard/add-card')
  } else {
    if (cardCount === 5) {
      showInfoToast('شما به حداکثر تعداد مجاز کارت رسیده‌اید', 'ti-lock')
    } else {
      showInfoToast('برای ساخت کارت جدید نیاز به اشتراک Pro دارید', 'ti-lock')
    }
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
