<template>
  <div class="min-h-screen bg-background">
    <!-- Mobile Layout - بدون Bottom Navigation -->
    <div class="lg:hidden flex flex-col min-h-screen">
      <!-- Header ثابت -->
      <div class="fixed top-0 left-0 right-0 w-full bg-background/95 backdrop-blur-lg border-b border-border z-50">
        <div class="flex items-center justify-between w-full px-4 py-3">
          <div class="flex items-center gap-3">
            <button @click="() => goBack('/profile')" class="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 hover:bg-accent transition-colors">
              <i class="ti ti-arrow-right text-xl text-foreground"></i>
            </button>
            <h1 class="text-lg font-bold text-foreground">فرم ارتباط</h1>
          </div>
        </div>
      </div>

      <!-- محتوای اصلی با فاصله مناسب -->
      <div class="flex-1 px-4 pt-20 pb-24 overflow-y-auto">
        <TabLeadCapture :cardId="cardId" :isMobile="true" />
      </div>

      <!-- دکمه‌های ثابت پایین -->
      <div class="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 z-50">
        <div class="flex gap-3">
          <button
            @click="() => goBack('/profile')"
            class="flex-1 h-12 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors"
          >
            انصراف
          </button>
          <button
            @click="handleSave"
            class="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            ذخیره تغییرات
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop Layout -->
    <div class="hidden lg:block">
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
          <div class="mb-6">
            <button @click="() => goBack('/profile')" class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <i class="ti ti-arrow-right text-xl"></i>
              <span>بازگشت</span>
            </button>
          </div>
          
          <div class="bg-card border border-border rounded-2xl p-6">
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-foreground mb-2">فرم ارتباط</h1>
              <p class="text-muted-foreground">تنظیمات فرم دریافت اطلاعات از مخاطبین</p>
            </div>
            
            <TabLeadCapture :cardId="cardId" :isMobile="false" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import TabLeadCapture from '~/components/UserDashboard/main/EditCard/tabs/TabLeadCapture.vue'
import { useFormStore } from '~/stores/form'

definePageMeta({
  middleware: 'require-activated',
  layout: false // بدون layout پیش‌فرض (بدون bottom nav)
})

const route = useRoute()
const router = useRouter()
const formStore = useFormStore()

// گرفتن cardId از query یا از formStore
const cardId = computed(() => {
  return route.query.id || route.query.cardId || formStore.defaultCard?.id
})

const goBack = () => {
  router.back()
}

// تابع ذخیره که از کامپوننت فرزند صدا میزنه
const handleSave = () => {
  const saveEvent = new CustomEvent('lead-capture-save')
  window.dispatchEvent(saveEvent)
}
</script>
