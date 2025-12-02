<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <MobilePageHeader 
      title="وضعیت حساب کاربری"
      :show-back="true"
    />

    <!-- Content -->
    <div class="pb-6 px-4">
      <div class="space-y-6">
        
        <!-- Loading State -->
        <div v-if="isLoading" class="animate-pulse">
          <!-- عنوان و نوار پیشرفت اسکلتون -->
          <div class="text-center">
            <div class="h-4 w-3/4 bg-muted/60 rounded mx-auto mb-6"></div>

            <!-- Progress Bar Skeleton -->
            <div class="w-full h-3 rounded-full bg-muted/40 border border-border mb-4 overflow-hidden">
              <div class="h-full w-1/3 bg-muted/80 rounded-full animate-pulse"></div>
            </div>

            <div class="flex justify-between">
              <div class="h-3 w-20 bg-muted/50 rounded"></div>
              <div class="h-3 w-24 bg-muted/50 rounded"></div>
            </div>
          </div>

          <!-- Cards Skeleton -->
          <div class="max-w-md mx-auto space-y-4 mt-8">
            <div v-for="n in 4" :key="n" class="bg-card border border-border rounded-2xl relative min-h-[280px] overflow-hidden">
              
              <!-- Background Illustration Area Skeleton -->
              <div class="w-full h-32 mb-6 relative flex items-center justify-center bg-muted/20">
                <div class="w-16 h-16 bg-muted/60 rounded-full flex items-center justify-center">
                  <div class="w-6 h-6 bg-muted/40 rounded"></div>
                </div>
                <!-- Scattered elements -->
                <div class="absolute top-4 left-4 w-8 h-8 bg-muted/40 rounded-full"></div>
                <div class="absolute top-6 right-6 w-6 h-6 bg-muted/40 rounded-full"></div>
                <div class="absolute bottom-4 left-8 w-7 h-7 bg-muted/40 rounded-full"></div>
                <div class="absolute bottom-6 right-4 w-5 h-5 bg-muted/40 rounded-full"></div>
              </div>

              <!-- Content Skeleton -->
              <div class="space-y-3 mb-12 px-6">
                <div class="h-5 w-48 bg-muted/60 rounded mx-auto"></div>
                <div class="space-y-2">
                  <div class="h-3 w-full bg-muted/40 rounded"></div>
                  <div class="h-3 w-4/5 bg-muted/40 rounded mx-auto"></div>
                </div>
              </div>

              <!-- Footer Action Skeleton -->
              <div class="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 border-t border-border/30">
                <div class="flex items-center gap-2">
                  <div class="h-4 w-24 bg-muted/50 rounded"></div>
                  <div class="w-4 h-4 bg-muted/40 rounded"></div>
                </div>
                
                <div class="flex items-center gap-2">
                  <div class="h-4 w-16 bg-muted/50 rounded"></div>
                  <div class="w-6 h-6 bg-muted/60 rounded-full"></div>
                </div>
              </div>

            </div>
          </div>

          <!-- Info Box Skeleton -->
          <div class="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <div class="w-4 h-4 bg-primary/40 rounded"></div>
              </div>
              <div class="space-y-2 flex-1">
                <div class="h-4 w-20 bg-muted/50 rounded"></div>
                <div class="h-3 w-full bg-muted/40 rounded"></div>
                <div class="h-3 w-3/4 bg-muted/40 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- عنوان و نوار پیشرفت -->
        <div v-else class="text-center">
          <p class="text-sm text-muted-foreground mb-6 px-4">
            برای گرفتن بیشترین نتیجه از کارت دیجیتال لینکو، این چک‌لیست را کامل کنید
          </p>

          <!-- Progress Bar -->
          <div class="w-full h-3 rounded-full border border-border overflow-hidden mb-4 bg-muted/20">
            <div 
              class="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-500 ease-out" 
              :style="{ width: progress + '%' }"
            ></div>
          </div>

          <div class="flex justify-between text-sm text-muted-foreground">
            <span class="font-medium">{{ progress }}٪ تکمیل شده</span>
            <span>{{ completed }} / {{ total }} مرحله انجام شده</span>
          </div>
        </div>

        <!-- نمایش همه مراحل به صورت زیر هم -->
        <div class="max-w-md mx-auto space-y-4">
          <ChecklistCard
            v-for="(step, index) in steps"
            :key="index"
            :icon="step.icon"
            :title="step.title"
            :description="step.description"
            :action="step.action"
            :status="step.status"
            :to="step.to"
          />
        </div>

        <!-- اطلاعات تکمیلی -->
        <div class="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-1">
              <i class="ti ti-info-circle text-primary"></i>
            </div>
            <div>
              <h4 class="font-semibold text-foreground mb-2">نکته مهم</h4>
              <p class="text-sm text-muted-foreground leading-relaxed">
                تکمیل همه مراحل به شما کمک می‌کند تا بهترین تجربه را از لینکو داشته باشید و امنیت حساب شما افزایش یابد.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MobilePageHeader from '~/components/shared/Header/MobilePageHeader.vue'
import ChecklistCard from '~/components/shared/ChecklistCard.vue'
import { computed, ref, onMounted } from 'vue'

// Loading state
const isLoading = ref(true)

// تعریف تمام مراحل
const steps = [
  {
    icon: "ti ti-user-plus",
    title: "افزودن تصویر پروفایل",
    description: "کارت دیجیتال خود را با افزودن عکس جذاب‌تر کنید",
    action: "افزودن عکس",
    status: "done" as const,
    to: "/profile"
  },
  {
    icon: "ti ti-link",
    title: "افزودن اولین لینک",
    description: "لینک‌ها را به پروفایل خود اضافه کنید تا دیگران در پلتفرم‌های مختلف با شما ارتباط برقرار کنند",
    action: "افزودن لینک",
    status: "done" as const,
    to: "/profile"
  },
  {
    icon: "ti ti-credit-card",
    title: "انجام یک پاپ!",
    description: "از دستگاه لینکو یا QR کد داخل اپ برای اشتراک‌گذاری اطلاعات خود استفاده کنید",
    action: "رفتن به QR کد",
    status: "done" as const,
    to: "/profile"
  },
  {
    icon: "ti ti-crown",
    title: "به حرفه‌ای‌ها بپیوندید!",
    description: "پرمیوم بگیرید و با سرعت موشک پیشرفت کنید",
    action: "رفتن به پرمیوم",
    status: "pending" as const,
    to: "/premium-upgrade"
  }
]

const total = steps.length
const completed = steps.filter(step => step.status === 'done').length
const progress = computed(() => Math.round((completed / total) * 100))

// Initialize loading
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 800) // کاهش از 1200 به 800 میلی‌ثانیه
})
</script>

<style scoped>
/* بهبود انیمیشن skeleton */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Shimmer effect برای skeleton elements */
.bg-muted\/60,
.bg-muted\/40,
.bg-muted\/50,
.bg-muted\/80 {
  background: linear-gradient(90deg, 
    var(--muted) 25%, 
    var(--muted-foreground)/10 50%, 
    var(--muted) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
</style>
