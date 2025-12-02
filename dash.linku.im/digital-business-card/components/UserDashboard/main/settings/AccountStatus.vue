<template>
  <div class="space-y-6">
    <!-- هدر -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-primary flex items-center gap-2 justify-center">
        <i class="ti ti-dashboard text-3xl"></i>
        وضعیت حساب
      </h2>
      <p class="text-sm text-primary opacity-70 mt-2">
        برای گرفتن بیشترین نتیجه از کارت دیجیتال لینکو، این چک‌لیست را کامل کنید
      </p>
    </div>

    <!-- نوار پیشرفت -->
    <div class="bg-secondary rounded-xl p-6 border border-border">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-medium text-primary">پیشرفت کلی</span>
        <span class="text-2xl font-bold text-primary">{{ progress }}٪</span>
      </div>
      
      <div class="w-full h-4 rounded-full bg-primary overflow-hidden">
        <div 
          class="h-full accent-bg rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          :style="{ width: progress + '%' }"
        >
          <div class="absolute inset-0 bg-white/20 animate-shimmer"></div>
        </div>
      </div>

      <div class="flex justify-between text-xs text-primary opacity-60 mt-3">
        <span>{{ completed }} از {{ total }} مرحله تکمیل شده</span>
        <span>{{ total - completed }} مرحله باقی‌مانده</span>
      </div>
    </div>

    <!-- چک‌لیست -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ChecklistCard
          v-for="(item, id) in actionHandlers"
          :key="id"
          :icon="getIconById(id)"
          :title="getTitleById(id)"
          :description="getDescriptionById(id)"
          :action="getActionLabelById(id)"
          :status="item.status"
          :to="getLinkById(id)"
          :disabled="item.disabled"
          @actionClick="item.handler"
      />
    </div>
  </div>
</template>

<script setup>
import ChecklistCard from '~/components/UserDashboard/main/ProgressBar/ChecklistCard.vue'
import {useFormStore} from "~/stores/form.js"
import {useUserStore} from "~/stores/user.js"

const formStore = useFormStore()
const defaultCard = computed(() => formStore.defaultCard)
const userStore = useUserStore()
const user = computed(() => userStore.user || {})

const checklistMeta = {
  profile: {
    icon: "ti ti-user-plus",
    title: "افزودن تصویر پروفایل",
    description: "تصویر خود را اضافه کنید تا کارت جذاب‌تر شود",
    action: "افزودن تصویر",
    to: `/dashboard/edit-card?id=${defaultCard.value?.id}&tab=about`,
  },
  link: {
    icon: "ti ti-link",
    title: "افزودن اولین لینک",
    description: "لینک شبکه‌های اجتماعی خود را اضافه کنید",
    action: "افزودن لینک",
    to: `/dashboard/edit-card?id=${defaultCard.value?.id}&tab=links`,
  },
  map: {
    icon: "ti ti-map-pin",
    title: "تنظیم نقشه",
    description: "مکان خود را اضافه کرده و شبکه خود را توسعه دهید",
    action: "ورود به نقشه",
  },
  pro: {
    icon: "ti ti-rocket",
    title: "عضویت حرفه‌ای",
    description: "با خرید نسخه حرفه‌ای، امکانات بیشتری فعال می‌شود",
    action: "ارتقا به حرفه‌ای",
    to: "/dashboard/upgrade",
  }
}

const getTitleById = id => checklistMeta[id].title
const getDescriptionById = id => checklistMeta[id].description
const getIconById = id => checklistMeta[id].icon
const getActionLabelById = id => checklistMeta[id].action
const getLinkById = id => checklistMeta[id].to

const actionHandlers = computed(() => ({
  profile: {
    status: defaultCard.value?.avatar ? 'done' : 'pending',
  },
  link: {
    status: defaultCard.value?.linksDataList ? 'done' : 'pending',
  },
  map: {
    status: 'pending',
    disabled: true
  },
  pro: {
    status: user.value?.isPro ? 'done' : 'pending',
  }
}))

const total = computed(() => Object.keys(actionHandlers.value).length)
const completed = computed(() => Object.values(actionHandlers.value).filter(item => item.status === 'done').length)
const progress = computed(() => Math.round((completed.value / total.value) * 100))
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
