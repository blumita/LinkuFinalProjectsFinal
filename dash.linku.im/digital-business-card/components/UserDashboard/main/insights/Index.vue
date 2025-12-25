<script setup lang="ts">
import {ref, onMounted, watch, computed, markRaw, watchEffect} from 'vue'
import moment from 'moment'
import 'moment-jalaali'

import Filter from './Filter.vue'
import StatsCard from './StatsCard.vue'
import type {AxiosInstance} from "axios";
import {useFormStore, useUserStore} from "#imports";

const nuxtApp = useNuxtApp()
const $axios = nuxtApp.$axios as AxiosInstance
const formStore = useFormStore()
const cardId = ref('')
const statsCardsLoading = ref(true)
const linksLoading = ref(true)
const isLoading = ref(false)

// کارت فعلی از formStore (که توسط CardSelect در header تغییر می‌کنه)
const currentCard = computed(() => formStore.defaultCard)

// استور - فقط در client-side
const store = ref<any>(null)
const statsCards = computed(() => store.value?.statsCards || [])
const getLinks = computed(() => store.value?.getLinks || [])

// Initialize store only on client side
onMounted(async () => {
  if (process.client) {
    const {useStatsStore} = await import('@/stores/stats')
    store.value = useStatsStore()

    // Load initial data
    await applyFilter(selectedRange.value)
  }
})

// بازه زمانی انتخاب‌شده
const selectedRange = ref<'1day' | '7days' | '30days' | '90days'>('1day')

// لینک‌های پرکلیک (۵ لینک اول)
const visibleLinks = computed(() => {
  return getLinks.value.slice(0, 5)
})

// تشخیص پرو بودن فیلتر انتخاب‌شده
const isProFilter = computed(() => selectedRange.value !== '1day')
let rawLinks: any[] = [];
const clicksByDate = ref<Record<string, number>>({})
const viewsByDate = ref<Record<string, number>>({})


const applyFilter = async (key: string) => {
  if (!store.value) return
  statsCardsLoading.value = true
  linksLoading.value = true
  const days = parseInt(key)
  const from = moment().subtract(days, 'days').format('YYYY-MM-DD')
  const to = moment().format('YYYY-MM-DD')

  if (cardId.value) {
    try {
      const response = await $axios.get(`cards/${cardId.value}/views`, {
        params: {from, to}
      });
      // استفاده از لینک‌های کارت انتخاب شده
      rawLinks = Array.isArray(currentCard.value?.linksDataList) ?
          currentCard.value?.linksDataList?.map(link => formStore.normalizeLink(link)) : [];

      clicksByDate.value = response.data.data.clicks_by_date || {}
      viewsByDate.value = response.data.data.views_by_date || {}

    } catch (error) {
    }
  }

  store.value.setRange([from, to])
  store.value.generateMockData(clicksByDate.value, viewsByDate.value, rawLinks)

  statsCardsLoading.value = false
  linksLoading.value = false
}

// اجرای خودکار هنگام تغییر فیلتر
watch(selectedRange, (val) => {
  applyFilter(val)
})

// وقتی کارت انتخاب شده تغییر کرد (از طریق CardSelect در header)
watchEffect(() => {
  if (currentCard.value?.id) {
    cardId.value = currentCard.value.id
    applyFilter(selectedRange.value)
  }
})
import {useIconComponents} from '~/composables/useIconComponentsMap'

const {getIconComponent} = useIconComponents()

const userStore = useUserStore()
const isPro = computed(() => userStore.user?.isPro)

// بررسی اینکه آیا کاربر رنگ سفارشی انتخاب کرده
const hasCustomColor = computed(() => {
  return !!(formStore.iconColor?.background && 
      formStore.iconColor.background !== 'transparent')
})

// رنگ آیکون - فقط وقتی رنگ سفارشی انتخاب شده
const iconColor = computed(() => {
  if (hasCustomColor.value) {
    return formStore.iconColor.background
  }
  return undefined
})

</script>

<template>
  <div v-if="store && statsCards && getLinks" class="px-4 pb-24 pt-4">
    <!-- فیلتر بازه زمانی -->
    <Filter v-model="selectedRange" :username="userStore.user?.name"/>

    <!-- کارت‌های آمار -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      <template v-if="statsCards.length > 0">
        <StatsCard
            v-for="card in statsCards"
            :key="card.key"
            v-show="!isProFilter || isPro"
            :label="card.label"
            :value="card.value"
            :trend="card.trend"
            :tooltip="card.tooltip"
            :loading="isLoading"
        />
      </template>
      <template v-else-if="statsCardsLoading">
        <!-- loader کارت‌ها -->
        <div 
            v-for="n in 3" 
            :key="n" 
            class="border border-border rounded-xl p-4 text-center shadow-sm bg-card min-h-[160px] animate-pulse"
        >
          <div class="flex justify-end mb-1">
            <div class="w-4 h-4 rounded-full bg-muted"></div>
          </div>
          <div class="h-7 w-16 bg-muted mx-auto my-2 rounded"></div>
          <div class="h-4 w-20 bg-muted/70 mx-auto my-2 rounded"></div>
          <div class="h-[50px] w-full bg-muted/50 rounded mt-2"></div>
        </div>
      </template>
      <template v-else>
        <div
            class="col-span-2 md:col-span-3 flex flex-col items-center justify-center bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border border-border text-foreground rounded-xl p-6 text-center text-base font-bold gap-3 min-h-[160px] shadow-md">
          <img src="/vip.png" alt="پرو" class="w-10 h-10 mb-2"/>
          <span class="flex items-center gap-2 justify-center">
            <i class="ti ti-lock text-2xl text-primary"></i>
            برای مشاهده آمار این بازه زمانی، <span class="mx-1 text-primary font-semibold">اشتراک پرو</span> تهیه کنید.
          </span>
        </div>
      </template>
    </div>

    <!-- لینک‌ها -->
    <div class="bg-card rounded-xl border border-border p-4 space-y-4 mt-6">
      <h2 class="text-sm font-bold text-foreground flex items-center gap-2">
        تعامل با لینک‌ها
        <span class="ml-2 text-xs font-normal text-muted-foreground">({{ visibleLinks.length }} لینک)</span>
      </h2>

      <template v-if="visibleLinks.length > 0">
        <div
            v-for="(item, index) in visibleLinks"
            :key="index"
            v-show="index < 3 || isPro"
            class="flex items-center justify-between bg-muted/50 p-3 rounded-xl"
        >
          <div class="flex items-center gap-3">
            <!-- آیکون دقیقاً مثل LinkItem.vue -->
            <div class="relative w-10 h-10 rounded-xl flex items-center justify-center bg-white">
              <!-- Dynamic icon component -->
              <component
                  v-if="getIconComponent(item.icon)"
                  :is="markRaw(<Object>getIconComponent(item.icon))"
                  :size="32"
                  :color="hasCustomColor ? iconColor : undefined"
                  :filled="hasCustomColor"
              />
              <!-- Fallback to image (customIcon) -->
              <img
                  v-else-if="item.customIcon"
                  :src="item.customIcon"
                  class="w-full h-full object-contain"
                  alt="icon"
              />
              <!-- Default fallback -->
              <i v-else class="ti ti-link text-gray-400 text-xl"/>
            </div>
            <div class="flex flex-col text-sm">
              <span class="font-semibold text-foreground">{{ item.label }}</span>
            </div>
          </div>
          <div class="text-xs text-muted-foreground">{{ item.clicks }} کلیک</div>
        </div>

        <div
            v-if="visibleLinks.length > 3 && !isPro"
            class="bg-gradient-to-r from-muted via-muted/80 to-muted border border-border text-foreground rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-3 shadow-sm"
        >
          <img src="/vip.png" alt="پرو" class="w-6 h-6"/>
          <span class="flex flex-col items-start gap-1 text-right">
            <span class="flex items-center gap-1">
              <i class="ti ti-lock text-muted-foreground text-base"></i>
              برای مشاهده آمار بیشتر،
              <span class="text-primary font-semibold underline decoration-dotted">نسخه پرو</span>
              را تهیه کنید!
            </span>
            <span class="text-xs text-muted-foreground mt-1">{{ visibleLinks.length - 3 }} لینک دیگر قابل نمایش نیست.</span>
          </span>
        </div>
      </template>

      <template v-else-if="linksLoading">
        <!-- loader لینک‌ها -->
        <div v-for="n in 3" :key="n" class="flex items-center justify-between bg-muted/50 p-3 rounded-xl animate-pulse">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white"></div>
            <div class="h-4 w-24 bg-muted rounded"></div>
          </div>
          <div class="h-3 w-12 bg-muted/70 rounded"></div>
        </div>
      </template>

      <template v-else>
        <div
            class="bg-muted/50 border border-border text-muted-foreground rounded-xl px-4 py-6 text-sm font-semibold text-center">
          برای دیدن لینک‌های آماری این بازه، ابتدا اشتراک <span class="text-primary">پرو</span> تهیه کنید.
        </div>
      </template>
    </div>
  </div>
  <div v-else class="px-4 pb-24 pt-4">
    <!-- لودینگ شیک با اسکلت‌های متحرک -->
    
    <!-- اسکلتون فیلتر -->
    <div class="w-full space-y-4 animate-pulse">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-2">
        <div class="h-6 w-40 bg-muted rounded mx-auto sm:mx-0"></div>
        <div class="flex flex-wrap justify-center sm:justify-end gap-2">
          <div v-for="n in 4" :key="n" class="h-9 w-16 bg-muted rounded-full"></div>
        </div>
      </div>
    </div>
    
    <!-- اسکلتون کارت‌های آمار -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      <div
          v-for="n in 3"
          :key="n"
          class="border border-border rounded-xl p-4 text-center shadow-sm bg-card min-h-[160px] animate-pulse"
      >
        <div class="flex justify-end mb-1">
          <div class="w-4 h-4 rounded-full bg-muted"></div>
        </div>
        <div class="h-7 w-16 bg-muted mx-auto my-2 rounded"></div>
        <div class="h-4 w-20 bg-muted/70 mx-auto my-2 rounded"></div>
        <div class="h-[50px] w-full bg-muted/50 rounded mt-2"></div>
      </div>
    </div>
    
    <!-- اسکلتون بخش لینک‌ها -->
    <div class="bg-card rounded-xl border border-border p-4 space-y-4 mt-6 animate-pulse">
      <div class="flex items-center gap-2">
        <div class="h-4 w-24 bg-muted rounded"></div>
        <div class="h-3 w-12 bg-muted/70 rounded"></div>
      </div>
      <div v-for="n in 3" :key="n" class="flex items-center justify-between bg-muted/50 p-3 rounded-xl">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white"></div>
          <div class="h-4 w-24 bg-muted rounded"></div>
        </div>
        <div class="h-3 w-12 bg-muted/70 rounded"></div>
      </div>
    </div>
  </div>

</template>
