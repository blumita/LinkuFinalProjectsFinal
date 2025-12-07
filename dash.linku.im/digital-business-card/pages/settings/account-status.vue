<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
      <div class="flex items-center h-14 px-4 max-w-5xl mx-auto">
        <button
          @click="() => goBack('/settings')"
          class="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-accent transition-colors"
        >
          <i class="ti ti-arrow-right text-xl"></i>
        </button>
        <h1 class="flex-1 text-lg font-semibold text-foreground">وضعیت حساب</h1>
      </div>
    </div>

    <!-- Content -->
    <div class="pt-[76px] pb-20 px-4 lg:px-6 space-y-4">
      <!-- کارت پیشرفت -->
      <div class="bg-card rounded-2xl p-4 lg:p-6 border border-border shadow-sm">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <i class="ti ti-chart-line text-primary text-xl lg:text-2xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-foreground text-base lg:text-lg">پیشرفت کلی</h3>
              <p class="text-xs text-muted-foreground">{{ completed }} از {{ total }} مرحله</p>
            </div>
          </div>
          <div class="text-2xl lg:text-3xl font-bold text-primary">{{ progress }}٪</div>
        </div>
        
        <!-- نوار پیشرفت -->
        <div class="w-full h-2.5 lg:h-3 rounded-full bg-muted overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-500 bg-primary"
            :style="{ width: progress + '%' }"
          />
        </div>

        <p class="text-xs text-muted-foreground mt-3 text-center">
          {{ total - completed }} مرحله باقی‌مانده برای تکمیل پروفایل
        </p>
      </div>

      <!-- توضیحات -->
      <div class="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
        <div class="flex gap-3">
          <i class="ti ti-info-circle text-xl text-blue-500 mt-0.5"></i>
          <div>
            <h4 class="font-semibold text-foreground mb-1">چرا باید پروفایل را تکمیل کنم؟</h4>
            <p class="text-sm text-muted-foreground leading-relaxed">
              تکمیل پروفایل به شما کمک می‌کند تا بیشترین بازدید و تعامل را از کارت دیجیتال خود دریافت کنید.
            </p>
          </div>
        </div>
      </div>

      <!-- لیست وظایف - Grid در دسکتاپ -->
      <div class="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        <h3 class="font-bold text-foreground px-2 lg:col-span-2">چک‌لیست تکمیل</h3>
        
        <!-- آیتم: تصویر پروفایل -->
        <div 
          class="bg-card rounded-2xl p-3 lg:p-4 border transition-all cursor-pointer hover:shadow-md"
          :class="actionHandlers.profile.status === 'done' 
            ? 'border-green-500/30 bg-green-500/5' 
            : 'border-primary/30 hover:border-primary/50'"
          @click="navigateTo(`/dashboard/edit-card?id=${defaultCard?.id}&tab=about`)"
        >
          <div class="flex items-center gap-3 lg:gap-4">
            <div 
              class="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              :class="actionHandlers.profile.status === 'done' ? 'bg-green-500/20' : 'bg-primary/10'"
            >
              <i 
                class="ti text-xl lg:text-2xl"
                :class="actionHandlers.profile.status === 'done' ? 'ti-check text-green-500' : 'ti-user-plus text-primary'"
              ></i>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-foreground text-sm lg:text-base">افزودن تصویر پروفایل</h4>
              <p class="text-xs lg:text-sm text-muted-foreground mt-0.5">تصویر خود را اضافه کنید</p>
            </div>
            <i class="ti ti-chevron-left text-lg lg:text-xl text-muted-foreground flex-shrink-0"></i>
          </div>
        </div>

        <!-- آیتم: افزودن لینک -->
        <div 
          class="bg-card rounded-2xl p-3 lg:p-4 border transition-all cursor-pointer hover:shadow-md"
          :class="actionHandlers.link.status === 'done' 
            ? 'border-green-500/30 bg-green-500/5' 
            : 'border-primary/30 hover:border-primary/50'"
          @click="navigateTo(`/dashboard/edit-card?id=${defaultCard?.id}&tab=links`)"
        >
          <div class="flex items-center gap-3 lg:gap-4">
            <div 
              class="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              :class="actionHandlers.link.status === 'done' ? 'bg-green-500/20' : 'bg-primary/10'"
            >
              <i 
                class="ti text-xl lg:text-2xl"
                :class="actionHandlers.link.status === 'done' ? 'ti-check text-green-500' : 'ti-link text-primary'"
              ></i>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-foreground">افزودن اولین لینک</h4>
              <p class="text-sm text-muted-foreground mt-0.5">لینک شبکه‌های اجتماعی را اضافه کنید</p>
            </div>
            <i class="ti ti-chevron-left text-xl text-muted-foreground"></i>
          </div>
        </div>

        <!-- آیتم: نقشه (غیرفعال) -->
        <div 
          class="bg-card rounded-2xl p-4 border border-border opacity-50 cursor-not-allowed"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              <i class="ti ti-map-pin text-2xl text-muted-foreground"></i>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-foreground">تنظیم نقشه</h4>
              <p class="text-sm text-muted-foreground mt-0.5">به زودی فعال می‌شود</p>
            </div>
            <i class="ti ti-lock text-xl text-muted-foreground"></i>
          </div>
        </div>

        <!-- آیتم: عضویت حرفه‌ای -->
        <div 
          class="bg-card rounded-2xl p-4 border transition-all hover:shadow-md"
          :class="actionHandlers.pro.status === 'done' 
            ? 'border-green-500/30 bg-green-500/5' 
            : 'border-primary/30 bg-primary/5 hover:border-primary/50 cursor-pointer'"
          @click="actionHandlers.pro.status !== 'done' && navigateTo('/dashboard/checkout')"
        >
          <div class="flex items-center gap-4">
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              :class="actionHandlers.pro.status === 'done' ? 'bg-green-500/20' : 'bg-primary/20'"
            >
              <i 
                class="ti text-2xl"
                :class="actionHandlers.pro.status === 'done' ? 'ti-check text-green-500' : 'ti-crown text-primary'"
              ></i>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-foreground">عضویت حرفه‌ای</h4>
              <p class="text-sm text-muted-foreground mt-0.5">
                {{ actionHandlers.pro.status === 'done' ? subscriptionStatusText : 'دسترسی به امکانات ویژه' }}
              </p>
            </div>
            <i 
              class="ti text-lg lg:text-xl flex-shrink-0"
              :class="actionHandlers.pro.status === 'done' ? 'ti-circle-check text-green-500' : 'ti-chevron-left text-primary'"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFormStore } from '~/stores/form'
import { useUserStore } from '~/stores/user'

definePageMeta({
  middleware: 'require-activated',
  layout: 'default'
})

const router = useRouter()
const formStore = useFormStore()
const userStore = useUserStore()
const { goBack } = useSafeNavigation()

const defaultCard = computed(() => formStore.defaultCard)
const user = computed(() => userStore.user || {})

const actionHandlers = computed(() => ({
  profile: {
    status: defaultCard.value?.avatar ? 'done' : 'pending',
  },
  link: {
    status: defaultCard.value?.linksDataList && defaultCard.value.linksDataList.length > 0 ? 'done' : 'pending',
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

// محاسبه روزهای باقی‌مانده اشتراک
const subscriptionStatusText = computed(() => {
  if (!user.value?.isPro) return 'دسترسی به امکانات ویژه'
  
  // بررسی روزهای باقی‌مانده
  const daysRemaining = user.value.daysRemaining || user.value.days_remaining
  if (daysRemaining !== undefined && daysRemaining !== null) {
    if (daysRemaining > 30) {
      const months = Math.floor(daysRemaining / 30)
      return `${months} ماه باقی‌مانده`
    }
    return `${daysRemaining} روز باقی‌مانده`
  }
  
  // بررسی تاریخ انقضا
  const endDate = user.value.subscriptionEndDate || user.value.subscription_end_date
  if (endDate) {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays > 30) {
      const months = Math.floor(diffDays / 30)
      return `${months} ماه باقی‌مانده`
    } else if (diffDays > 0) {
      return `${diffDays} روز باقی‌مانده`
    } else {
      return 'اشتراک منقضی شده'
    }
  }
  
  return 'شما عضو پرمیوم هستید'
})
</script>
