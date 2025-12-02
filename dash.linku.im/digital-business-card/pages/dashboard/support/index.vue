<template>
  <div class="min-h-screen bg-background">
    <!-- Mobile Header -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div class="flex items-center justify-between px-4 h-16">
        <button @click="$router.back()" class="p-2 hover:bg-secondary rounded-lg transition-colors">
          <i class="ti ti-arrow-right text-primary text-xl"></i>
        </button>
        <h1 class="text-lg font-bold text-foreground">پشتیبانی</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="pt-[68px] pb-6 px-3">
      <div class="space-y-4">
        <!-- Online Support -->
        <NuxtLink 
          to="/dashboard/support/online"
          class="block bg-card rounded-2xl p-6 shadow-sm border border-border hover:bg-accent transition-all group"
        >
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
              <i class="ti ti-message-circle text-green-500 text-2xl"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-base font-semibold text-foreground mb-1">پشتیبانی آنلاین</h3>
              <p class="text-sm text-muted-foreground">گفتگو با تیم پشتیبانی</p>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i>
          </div>
        </NuxtLink>

        <!-- FAQ -->
        <NuxtLink 
          to="/dashboard/support/faq"
          class="block bg-card rounded-2xl p-6 shadow-sm border border-border hover:bg-accent transition-all group"
        >
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
              <i class="ti ti-help text-blue-500 text-2xl"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-base font-semibold text-foreground mb-1">سوالات متداول</h3>
              <p class="text-sm text-muted-foreground">پاسخ سوالات پرتکرار</p>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i>
          </div>
        </NuxtLink>

        <!-- Contact Support - Phone Call -->
        <a 
          :href="'tel:' + supportPhone"
          class="block bg-card rounded-2xl p-6 shadow-sm border border-border hover:bg-accent transition-all group"
        >
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
              <i class="ti ti-phone text-purple-500 text-2xl"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-base font-semibold text-foreground mb-1">تماس با پشتیبانی</h3>
              <p class="text-sm text-muted-foreground">{{ supportPhone }}</p>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i>
          </div>
        </a>
      </div>

      <!-- Contact Info -->
      <div class="mt-6 p-4 rounded-2xl bg-muted/50 border border-border">
        <p class="text-xs text-muted-foreground text-center mb-2">
          <i class="ti ti-clock text-sm ml-1"></i>
          {{ responseTime }}
        </p>
        <p class="text-xs text-muted-foreground text-center">
          <i class="ti ti-mail text-sm ml-1"></i>
          {{ supportEmail }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'default'
})

// Support info from API
const supportPhone = ref('021-12345678')
const supportEmail = ref('support@linku.im')
const responseTime = ref('پاسخگویی: شنبه تا چهارشنبه، ۹ صبح تا ۶ عصر')

// Fetch support settings from API
onMounted(async () => {
  try {
    const { data } = await useFetch('/api/support/info')
    if (data.value?.data) {
      if (data.value.data.phone) supportPhone.value = data.value.data.phone
      if (data.value.data.email) supportEmail.value = data.value.data.email
      if (data.value.data.responseTime) responseTime.value = data.value.data.responseTime
      if (data.value.data.workingHours) responseTime.value = data.value.data.workingHours
    }
  } catch (error) {
    console.error('Error fetching support settings:', error)
  }
})
</script>
