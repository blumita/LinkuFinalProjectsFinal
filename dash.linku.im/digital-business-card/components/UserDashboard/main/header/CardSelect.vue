<template>
  <div ref="dropdownRef" class="relative z-50 w-20 md:w-72 text-sm text-right rtl">
    <!-- دکمه -->
    <button
      @click="toggleMenu"
      class="w-full rounded-full border border-gray-300 px-4 py-1.5 flex items-center justify-between bg-white"
    >
      <div class="flex items-center gap-2 overflow-hidden">
        <img
          v-if="selectedCard?.avatar"
          :src="selectedCard.avatar"
          class="w-6 h-6 rounded-full object-cover"
        />
        <span v-else class="bg-gray-100 rounded-full w-7 h-7 flex items-center justify-center">
          <i class="ti ti-user text-xl text-gray-400" />
        </span>
        <span class="truncate font-medium hidden md:block text-gray-700">
          {{ selectedCard?.userName || selectedCard?.name || 'پروفایل من' }}
        </span>
        <span
          v-if="selectedCard?.id === form.defaultCard?.id"
          class="text-xs font-semibold bg-gray-100 text-black px-2 py-0.5 rounded-full hidden md:inline"
        >
          فعال
        </span>
      </div>
      <i class="ti ti-chevron-down text-xs" />
    </button>

    <!-- منو -->
    <div
      v-if="menuOpen && !isMobile"
      class="absolute mt-4 left-0 w-72 bg-white border rounded-xl shadow-xl z-50"
    >
      <!-- کارت فعلی -->
      <div v-if="selectedCard" class="px-4 py-3 border-b">
        <h3 class="text-xs text-gray-500 mb-2 flex items-center gap-1">
          <i class="ti ti-eye" /> در حال مشاهده
        </h3>
        <div class="flex items-center gap-2">
          <img
            v-if="selectedCard.avatar"
            :src="selectedCard.avatar"
            class="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p class="font-medium text-gray-700">{{ selectedCard.userName || selectedCard.name || 'پروفایل من' }}</p>
            <p class="text-xs text-gray-500">@{{ selectedCard.slug }}</p>
          </div>
        </div>
      </div>

      <!-- لیست کارت‌ها -->
      <div class="px-4 py-3 border-b max-h-40 overflow-y-auto">
        <h3 class="text-xs text-gray-500 mb-2 flex items-center gap-1">
          <i class="ti ti-id" /> کارت‌های دیگر
        </h3>
        <div class="space-y-3">
          <div
            v-for="card in otherCards"
            :key="card.id"
            @click="selectCard(card)"
            class="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
          >
            <img
              v-if="card.avatar"
              :src="card.avatar"
              class="w-8 h-8 rounded-full object-cover"
            />
            <div class="flex-1">
              <p class="font-medium flex items-center gap-1 text-gray-700">
                {{ card.userName || card.name || card.slug || 'بدون نام' }}
                <span
                  v-if="card.id === form.defaultCard?.id"
                  class="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full"
                >
                  فعال
                </span>
              </p>
              <p v-if="card.slug" class="text-xs text-gray-500">@{{ card.slug }}</p>
            </div>
            <i v-if="card.id === selectedCard?.id" class="ti ti-check text-green-600" />
          </div>
        </div>
        <p v-if="otherCards.length === 0" class="text-xs text-gray-500 text-center py-2">
          کارت دیگری وجود ندارد
        </p>
      </div>

      <!-- دکمه افزودن -->
      <div class="p-4">
        <button
          @click="goToAddCard"
          class="w-full bg-black text-white py-2 rounded-full flex items-center justify-center gap-2"
        >
          <i class="ti ti-plus" /> ایجاد پروفایل جدید
        </button>
      </div>
    </div>

    <!-- باتم شیت موبایل -->
    <UiBottomSheet
      :visible="menuOpen && isMobile"
      title="انتخاب کارت"
      height-class="max-h-[calc(100vh-80px)]"
      content-padding="p-4"
      @close="menuOpen = false"
    >
      <!-- کارت فعلی -->
      <div v-if="selectedCard" class="mb-6 transform transition-all duration-200">
        <h3 class="text-sm text-gray-500 mb-3 flex items-center gap-2">
          <i class="ti ti-eye" /> در حال مشاهده
        </h3>
        <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
          <img
            v-if="selectedCard.avatar"
            :src="selectedCard.avatar"
            class="w-12 h-12 rounded-full object-cover shadow-sm"
          />
          <span v-else class="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
            <i class="ti ti-user text-2xl text-gray-400" />
          </span>
          <div class="flex-1">
            <p class="font-semibold text-base text-gray-800">{{ selectedCard.name || selectedCard.slug || 'کارت من' }}</p>
            <p v-if="selectedCard.description" class="text-sm text-gray-500">{{ selectedCard.description }}</p>
          </div>
        </div>
      </div>

      <!-- لیست کارت‌های دیگر -->
      <div v-if="otherCards.length > 0" class="mb-6">
        <h3 class="text-sm text-gray-500 mb-3 flex items-center gap-2">
          <i class="ti ti-id" /> کارت‌های دیگر
        </h3>
        <div class="space-y-2">
          <div
            v-for="card in otherCards"
            :key="card.id"
            @click="selectCard(card)"
            class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100 p-4 rounded-xl transition-all duration-150 transform hover:scale-[0.98]"
          >
            <img
              v-if="card.avatar"
              :src="card.avatar"
              class="w-12 h-12 rounded-full object-cover shadow-sm"
            />
            <span v-else class="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
              <i class="ti ti-user text-2xl text-gray-400" />
            </span>
            <div class="flex-1">
              <p class="font-semibold text-base text-gray-800">{{ card.name || card.slug || 'بدون نام' }}</p>
              <p v-if="card.description" class="text-sm text-gray-500">{{ card.description }}</p>
            </div>
            <i v-if="card.id === selectedCard?.id" class="ti ti-check text-green-600 text-xl" />
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-gray-500 text-center py-4 mb-6">
        کارت دیگری وجود ندارد
      </p>

      <!-- دکمه افزودن -->
      <button
        @click="goToAddCard"
        class="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 text-base font-medium transition-all duration-200 transform active:scale-[0.98] shadow-lg"
      >
        <i class="ti ti-plus" /> ایجاد پروفایل جدید
      </button>
    </UiBottomSheet>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useFormStore } from '~/stores/form'
import {fetchInfoFormCount} from "~/components/UserDashboard/main/inbox/tabs/InfoForm.vue";
import {fetchPollCount} from "~/components/UserDashboard/main/inbox/tabs/Poll.vue";
import {fetchPeopleLuckyDice} from "~/components/UserDashboard/main/inbox/tabs/LuckyDice.vue";
import {fetchPeopleLuckyEgg} from "~/components/UserDashboard/main/inbox/tabs/LuckyEgg.vue";
import {fetchPeopleLuckyWheel} from "~/components/UserDashboard/main/inbox/tabs/SpinWheel.vue";
import {useNuxtApp} from "#app";
// Use Nuxt's navigateTo instead of vue-router
const form = useFormStore()

const menuOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const isMobile = ref(false)

const selectedCard = computed(() => form.defaultCard || { id: 'default', name: 'کارت من', avatar: null, isDefault: false, description: 'پیش‌فرض' })
const otherCards = computed(() => {
  if (!form.cards || !selectedCard.value) return []
  return form.cards.filter(c => c.id !== selectedCard.value?.id)
})

const toggleMenu = (e: Event) => {
  e.stopPropagation()
  menuOpen.value = !menuOpen.value
}

const selectCard = async (card: any) => {
  form.setDefaultCard(card.id)
  form.setAboutFrom(card.id) // لود اطلاعات کارت جدید
  menuOpen.value = false
  //
  const cardId = form.defaultCard?.id
  if (!cardId) return
  const {$axios} = useNuxtApp()

  const infoCount = await fetchInfoFormCount(cardId, $axios)
  const pollCount = await fetchPollCount(cardId, $axios)
  const luckyDiceCount = await fetchPeopleLuckyDice(cardId, $axios)
  const luckyEggCount = await fetchPeopleLuckyEgg(cardId, $axios)
  const spinWheelCount = await fetchPeopleLuckyWheel(cardId, $axios)

  const total = infoCount + pollCount + luckyDiceCount + luckyEggCount + spinWheelCount
  form.setInboxBadge(total)
  //
}

const goToAddCard = async () => {
  const userStore = useUserStore()
  const isPro = userStore.user?.isPro || false
  const cardCount = userStore.cards?.length || 0

  // کاربر رایگان: فقط 1 کارت - کاربر پرو: حداکثر 5 کارت
  if (!isPro && cardCount >= 1) {
    showInfoToast('کاربران رایگان فقط می‌توانند یک کارت ایجاد کنند. برای ساخت کارت‌های بیشتر به اشتراک Pro نیاز دارید', 'ti-lock')
    menuOpen.value = false
  } else if (isPro && cardCount >= 5) {
    showInfoToast('شما به حداکثر تعداد مجاز کارت (5 کارت) رسیده‌اید', 'ti-alert-circle')
    menuOpen.value = false
  } else {
    menuOpen.value = false
    await navigateTo('/dashboard/add-card')
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (!dropdownRef.value?.contains(e.target as Node)) {
    menuOpen.value = false
  }
}

// تشخیص موبایل (عرض کمتر از 768px)
function checkMobile() {
  if (process.client) {
    isMobile.value = window.innerWidth < 768
  }
}

onMounted(() => {
  if (process.client) {
    document.addEventListener('click', handleClickOutside)
    checkMobile()
    window.addEventListener('resize', checkMobile)
  }
})

onBeforeUnmount(() => {
  if (process.client) {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('resize', checkMobile)
  }
})
</script>
