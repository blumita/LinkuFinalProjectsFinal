<template>
  <div class="min-h-screen bg-background">
    <!-- Mobile Header -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div class="flex items-center justify-between px-4 h-16">
        <button @click="goBack('/dashboard/support')" class="p-2 hover:bg-secondary rounded-lg transition-colors">
          <i class="ti ti-arrow-right text-primary text-xl"></i>
        </button>
        <h1 class="text-lg font-bold text-foreground">پشتیبانی</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="pt-20 pb-4 px-4">
      <div class="space-y-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-6 animate-pulse">
          <!-- FAQ Skeleton -->
          <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div class="h-6 w-32 bg-muted rounded mb-4"></div>
            
            <div class="space-y-3">
              <div v-for="n in 5" :key="n" class="border border-border rounded-lg p-4">
                <div class="flex items-center gap-3">
                  <div class="w-5 h-5 bg-muted rounded"></div>
                  <div class="h-4 flex-1 bg-muted rounded"></div>
                  <div class="w-4 h-4 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Info Skeleton -->
          <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div class="h-6 w-24 bg-muted rounded mb-4"></div>
            <div class="space-y-3">
              <div v-for="n in 3" :key="n" class="flex items-center gap-3 p-3 rounded-lg border border-border">
                <div class="w-10 h-10 bg-muted rounded-full"></div>
                <div class="flex-1 space-y-1">
                  <div class="h-4 w-20 bg-muted rounded"></div>
                  <div class="h-3 w-32 bg-muted-foreground/20 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- سوالات متداول -->
        <div v-else class="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h3 class="text-lg font-semibold text-foreground mb-4">سوالات متداول</h3>
          
          <div class="space-y-3">
            <div v-for="(faq, index) in faqs" :key="index" 
                 class="border border-border rounded-lg overflow-hidden">
              <button @click="toggleFaq(index)" 
                      class="w-full flex items-center justify-between p-4 text-right hover:bg-secondary/50 transition-colors">
                <div class="flex items-center gap-3">
                  <i :class="faq.icon" class="text-primary"></i>
                  <span class="font-medium text-foreground">{{ faq.title }}</span>
                </div>
                <i :class="openFaq === index ? 'ti ti-chevron-up' : 'ti ti-chevron-down'" 
                   class="text-muted-foreground transition-transform"></i>
              </button>
              <div v-show="openFaq === index" 
                   class="px-4 pb-4 text-sm text-muted-foreground border-t border-border bg-muted/20">
                {{ faq.content }}
              </div>
            </div>
          </div>
        </div>

        <!-- اطلاعات تماس -->
        <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h4 class="text-lg font-semibold text-foreground mb-4">اطلاعات تماس</h4>
          
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <i class="ti ti-mail text-primary"></i>
              <div>
                <div class="text-foreground font-medium">ایمیل پشتیبانی</div>
                <div class="text-muted-foreground text-sm">support@linku.im</div>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <i class="ti ti-brand-telegram text-primary"></i>
              <div>
                <div class="text-foreground font-medium">کانال تلگرام</div>
                <div class="text-muted-foreground text-sm">@linkusupport</div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <i class="ti ti-clock text-primary"></i>
              <div>
                <div class="text-foreground font-medium">پاسخ‌دهی</div>
                <div class="text-muted-foreground text-sm">کمتر از ۲۴ ساعت</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSafeNavigation } from '~/composables/useSafeNavigation'
const { goBack } = useSafeNavigation()

// Loading state
const isLoading = ref(true)
const openFaq = ref<number | null>(null)

// FAQ data
const faqs = [
  {
    title: 'چگونه اکانت خود را ایجاد کنم؟',
    content: "برای ایجاد اکانت، روی دکمه 'ثبت نام' کلیک کنید و شماره موبایل خود را وارد کنید. کد تایید به شما ارسال خواهد شد.",
    icon: 'ti ti-user-plus'
  },
  {
    title: 'چگونه رمز عبور خود را تغییر دهم؟',
    content: "به قسمت تنظیمات بروید و روی 'تغییر رمز عبور' کلیک کنید. رمز جدید را وارد کرده و تایید کنید.",
    icon: 'ti ti-key'
  },
  {
    title: 'پرمیوم چه ویژگی‌هایی دارد؟',
    content: 'با پرمیوم می‌توانید از قابلیت‌های پیشرفته، فضای ذخیره بیشتر و پشتیبانی اولویت‌دار استفاده کنید.',
    icon: 'ti ti-crown'
  },
  {
    title: 'چگونه اطلاعات خود را حذف کنم؟',
    content: "برای حذف اکانت، به تنظیمات رفته و روی 'حذف اکانت' کلیک کنید. این عمل قابل برگشت نیست.",
    icon: 'ti ti-trash'
  },
  {
    title: 'پشتیبانی فنی چگونه کار می‌کند؟',
    content: 'تیم پشتیبانی ما ۲۴/۷ آماده پاسخگویی به سوالات شما هستند. از طریق تلگرام یا ایمیل با ما تماس بگیرید.',
    icon: 'ti ti-headphones'
  }
]

const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

// Initialize loading
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>
