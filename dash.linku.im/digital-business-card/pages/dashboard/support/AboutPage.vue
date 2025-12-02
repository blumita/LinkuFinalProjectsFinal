<template>
  <div class="min-h-screen bg-background">
    <!-- Mobile Header -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div class="flex items-center justify-between px-4 h-16">
        <button @click="$router.back()" class="p-2 hover:bg-secondary rounded-lg transition-colors">
          <i class="ti ti-arrow-right text-primary text-xl"></i>
        </button>
        <h1 class="text-lg font-bold text-foreground">درباره لینکو</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="pt-20 pb-4 px-4">
      <div class="space-y-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-6 animate-pulse">
          <!-- App Info Skeleton -->
          <div class="text-center">
            <div class="w-48 h-12 bg-muted rounded mx-auto mb-4"></div>
          </div>

          <!-- About Linku Skeleton -->
          <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div class="h-6 w-24 bg-muted rounded mb-4"></div>
            <div class="space-y-3">
              <div class="h-4 w-full bg-muted-foreground/20 rounded"></div>
              <div class="h-4 w-3/4 bg-muted-foreground/20 rounded"></div>
              <div class="h-4 w-5/6 bg-muted-foreground/20 rounded"></div>
            </div>
          </div>

          <!-- Contact Skeleton -->
          <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div class="h-6 w-20 bg-muted rounded mb-4"></div>
            <div class="space-y-3">
              <div v-for="n in 2" :key="n" class="flex justify-between items-center">
                <div class="h-4 w-16 bg-muted-foreground/20 rounded"></div>
                <div class="h-4 w-24 bg-muted rounded"></div>
              </div>
            </div>
          </div>

          <!-- Copyright Skeleton -->
          <div class="text-center">
            <div class="h-4 w-40 bg-muted-foreground/20 rounded mx-auto"></div>
          </div>
        </div>

        <!-- App Info -->
        <div v-else class="text-center">
          <div class="flex items-center justify-center mx-auto mb-4">
            <img src="/assets/LinkuLogo/logo.png" alt="Linku Logo" class="w-[200px] h-[44px]" />
          </div>
        </div>

        <!-- About Linku -->
        <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h4 class="text-lg font-semibold text-foreground mb-4">درباره لینکو</h4>
          
          <div class="space-y-4 text-muted-foreground">
            <p>
              لینکو یک پلتفرم نوآورانه برای مدیریت و به‌اشتراک‌گذاری لینک‌ها است که به شما امکان ایجاد، سازماندهی و تجزیه و تحلیل لینک‌های خود را می‌دهد.
            </p>
            
            <p>
              با استفاده از تکنولوژی‌های مدرن، لینکو تجربه‌ای ساده و کارآمد برای کاربران خود فراهم می‌کند.
            </p>
          </div>
        </div>

        <!-- Contact -->
        <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h4 class="text-lg font-semibold text-foreground mb-4">تماس با ما</h4>
          
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-muted-foreground">وب‌سایت</span>
              <a href="https://linkutag.com" class="text-primary hover:underline">linku.im</a>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-muted-foreground">ایمیل</span>
              <a href="mailto:info@linkutag.com" class="text-primary hover:underline">info@linku.im</a>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="text-center text-muted-foreground text-sm">
          <p>© ۱۴۰۳ لینکو . تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Loading state
const isLoading = ref(true)

// Initialize loading
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>
