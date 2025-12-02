<template>
  <div>
    <!-- عنوان و بازگشت -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <i class="ti ti-inbox text-2xl text-primary"></i>
        <h1 class="text-2xl font-bold text-primary">صندوق دریافتی</h1>
      </div>
      <button
          v-if="currentTab"
          @click="currentTab = ''"
          class="flex items-center gap-1 text-sm text-primary hover:text-accent transition"
      >
        <i class="ti ti-arrow-left text-base"></i>
        بازگشت
      </button>
    </div>

    <!-- اسکلتون لودر کارت‌ها -->
    <div v-if="loading && !currentTab" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
          v-for="i in 6"
          :key="i"
          class="flex items-center justify-between bg-secondary border border-border rounded-xl px-4 py-6 shadow-sm"
      >
        <div class="flex items-center gap-3 flex-1">
          <div class="space-y-2 flex-1">
            <div class="h-4 bg-accent-bg/50 rounded w-24 animate-pulse"></div>
            <div class="h-3 bg-accent-bg/30 rounded w-16 animate-pulse" style="animation-delay: 0.1s"></div>
          </div>
        </div>
        <div class="w-6 h-6 bg-accent-bg/40 rounded animate-pulse" style="animation-delay: 0.2s"></div>
      </div>
    </div>

    <!-- کارت‌ها -->
    <div v-else-if="!currentTab" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
          v-for="tab in tabs"
          :key="tab.name"
          @click="tab.count === 0 ? null : currentTab = tab.name"
          :class="['flex items-center justify-between bg-secondary border border-border rounded-xl px-4 py-6 shadow-sm transition',
           tab.count === 0 ? 'cursor-not-allowed opacity-50 pointer-events-none': 'cursor-pointer hover:border-accent hover:shadow-md'
           ]"
      >
        <div class="flex items-center gap-3">
          <div>
            <p class="font-semibold text-sm text-primary">{{ tab.name }}</p>
            <p class="text-xs text-primary opacity-60">{{ tab.count }} {{ tab.name === 'نظرسنجی' ? 'رأی' : 'پیام' }}</p>
          </div>
        </div>
        <span class="text-primary opacity-50 text-xl"><i class="ti ti-arrow-left"/></span>
      </div>
    </div>

    <!-- محتوای تب فعال -->
    <div
        v-if="currentTab"
        class="bg-secondary border border-border p-4 rounded-lg shadow-sm transition-opacity duration-300 ease-in-out"
    >
      <component
          :is="tabComponents[currentTab]"
          @update-tab="handleTabUpdate"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, markRaw, watch} from 'vue'
import TaseShans from './tabs/LuckyDice.vue'
import TokhmeMoreghShans from './tabs/LuckyEgg.vue'
import Nazarsanji from './tabs/Poll.vue'
import FormEttelaat from './tabs/InfoForm.vue'
import JabeheySoalat from './tabs/QuestionBox.vue'
import CharkheShans from './tabs/SpinWheel.vue'
import {useFormStore} from "~/stores/form.js";
import {useNuxtApp} from "nuxt/app";
import {fetchInfoFormCount} from '@/components/UserDashboard/main/inbox/tabs/InfoForm.vue'
import {fetchPollCount} from "~/components/UserDashboard/main/inbox/tabs/Poll.vue";
import {fetchPeopleLuckyEgg} from "~/components/UserDashboard/main/inbox/tabs/LuckyEgg.vue";
import {fetchPeopleLuckyWheel} from "~/components/UserDashboard/main/inbox/tabs/SpinWheel.vue";
import {fetchPeopleLuckyDice} from "~/components/UserDashboard/main/inbox/tabs/LuckyDice.vue";
import {fetchQuestionBox} from "~/components/UserDashboard/main/inbox/tabs/QuestionBox.vue";

const currentTab = ref('')
const loading = ref(true)

const tabs = reactive([
  {name: 'تاس شانس', count: 0},
  {name: 'تخم‌مرغ شانس', count: 0},
  {name: 'چرخ شانس', count: 0},
  {name: 'فرم اطلاعات', count: 0},
  {name: 'جعبه سوالات', count: 0},
  {name: 'نظرسنجی', count: 0}
])

const tabComponents = {
  'تاس شانس': markRaw(TaseShans),
  'تخم‌مرغ شانس': markRaw(TokhmeMoreghShans),
  'نظرسنجی': markRaw(Nazarsanji),
  'فرم اطلاعات': markRaw(FormEttelaat),
  'جعبه سوالات': markRaw(JabeheySoalat),
  'چرخ شانس': markRaw(CharkheShans)
}
const updateTabCount = (tabName, count) => {
  const tab = tabs.find(t => t?.name === tabName)
  if (tab) tab.count = count
}

const formStore = useFormStore()
const {$axios} = useNuxtApp()

watchEffect(async () => {
  const cardId = formStore.defaultCard?.id
  if (!cardId) {
    loading.value = false
    return
  }

  loading.value = true
  
  try {
    // فرم اطلاعات
    const infoStats = await fetchInfoFormCount(cardId, $axios)
    updateTabCount('فرم اطلاعات', infoStats.totalCount)

    // نظرسنجی
    const pollStats = await fetchPollCount(cardId, $axios)
    updateTabCount('نظرسنجی', pollStats)

    // تاس شانس
    const diceStats = await fetchPeopleLuckyDice(cardId, $axios)
    updateTabCount('تاس شانس', diceStats.totalCount)

    // تخم‌مرغ شانس
    const eggStats = await fetchPeopleLuckyEgg(cardId, $axios)
    updateTabCount('تخم‌مرغ شانس', eggStats.totalCount)

    // چرخ شانس
    const wheelStats = await fetchPeopleLuckyWheel(cardId, $axios)
    updateTabCount('چرخ شانس', wheelStats.totalCount)

    // جعبه سوالات
    const questionStats = await fetchQuestionBox(cardId, $axios)
    updateTabCount('جعبه سوالات', questionStats.totalCount)

    // پاک‌سازی نشان‌گر کلی
    formStore.setInboxBadge(0)
  } catch (error) {
  } finally {
    loading.value = false
  }
})

</script>

<style scoped>
/* اگر لازم بود استایل‌های سفارشی اضافه کن */
</style>
