<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
      <div class="flex items-center h-14 px-4 lg:px-8">
        <button
          @click="router.back()"
          class="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-accent transition-colors"
        >
          <i class="ti ti-arrow-right text-xl"></i>
        </button>
        <h1 class="flex-1 text-lg font-semibold text-foreground text-center lg:text-right lg:text-2xl mr-2 lg:mr-4">صندوق پیام‌ها</h1>
      </div>
    </div>

    <!-- Content -->
    <div class="pt-[60px] pb-20 px-3 lg:px-8 lg:py-8 lg:pt-20">
      <div class="max-w-2xl lg:max-w-none mx-auto">
        <!-- Desktop Grid Layout -->
        <div class="hidden lg:grid lg:grid-cols-3 lg:gap-6">
          <!-- Lucky Dice -->
          <div
            @click="navigateToCategory('lucky-dice')"
            class="bg-card rounded-xl border border-border p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer group"
          >
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <i class="ti ti-dice text-primary text-2xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-foreground">تاس شانس</h3>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-3xl font-bold text-foreground">{{ luckyDiceCount }}</span>
              <span class="text-sm text-muted-foreground">پیام جدید</span>
            </div>
          </div>

          <!-- Lucky Egg -->
          <div
            @click="navigateToCategory('lucky-egg')"
            class="bg-card rounded-xl border border-border p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer group"
          >
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <i class="ti ti-egg text-primary text-2xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-foreground">تخم شانس</h3>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-3xl font-bold text-foreground">{{ luckyEggCount }}</span>
              <span class="text-sm text-muted-foreground">پیام جدید</span>
            </div>
          </div>

          <!-- Lucky Wheel -->
          <div
            @click="navigateToCategory('lucky-wheel')"
            class="bg-card rounded-xl border border-border p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer group"
          >
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <i class="ti ti-wheel text-primary text-2xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-foreground">چرخ شانس</h3>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-3xl font-bold text-foreground">{{ luckyWheelCount }}</span>
              <span class="text-sm text-muted-foreground">پیام جدید</span>
            </div>
          </div>

          <!-- Info Form -->
          <div
            @click="navigateToCategory('info-form')"
            class="bg-card rounded-xl border border-border p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer group"
          >
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <i class="ti ti-forms text-primary text-2xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-foreground">فرم اطلاعات</h3>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-3xl font-bold text-foreground">{{ infoFormCount }}</span>
              <span class="text-sm text-muted-foreground">پیام جدید</span>
            </div>
          </div>

          <!-- Question Box -->
          <div
            @click="navigateToCategory('question-box')"
            class="bg-card rounded-xl border border-border p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer group"
          >
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <i class="ti ti-message-question text-primary text-2xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-foreground">جعبه سوال</h3>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-3xl font-bold text-foreground">{{ questionBoxCount }}</span>
              <span class="text-sm text-muted-foreground">پیام جدید</span>
            </div>
          </div>

          <!-- Poll -->
          <div
            @click="navigateToCategory('poll')"
            class="bg-card rounded-xl border border-border p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer group"
          >
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <i class="ti ti-chart-bar text-primary text-2xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-foreground">نظرسنجی</h3>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-3xl font-bold text-foreground">{{ pollCount }}</span>
              <span class="text-sm text-muted-foreground">پیام جدید</span>
            </div>
          </div>
        </div>

        <!-- Mobile List Layout -->
        <div class="lg:hidden space-y-3 mt-6">
        <!-- Lucky Dice -->
        <div
          @click="navigateToCategory('lucky-dice')"
          class="bg-card rounded-xl border border-border p-4 hover:bg-accent/5 transition-all duration-200 cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <i class="ti ti-dice text-muted-foreground text-lg"></i>
              </div>
              <div>
                <h3 class="font-medium text-foreground">تاس شانس</h3>
              </div>
            </div>
            <div class="text-right flex items-center gap-2">
              <span class="text-muted-foreground text-sm">{{ luckyDiceCount }} پیام</span>
              <i class="ti ti-chevron-left text-muted-foreground"></i>
            </div>
          </div>
        </div>

        <!-- Lucky Egg -->
        <div
          @click="navigateToCategory('lucky-egg')"
          class="bg-card rounded-xl border border-border p-4 hover:bg-accent/5 transition-all duration-200 cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <i class="ti ti-egg text-muted-foreground text-lg"></i>
              </div>
              <div>
                <h3 class="font-medium text-foreground">تخم شانس</h3>
              </div>
            </div>
            <div class="text-right flex items-center gap-2">
              <span class="text-muted-foreground text-sm">{{ luckyEggCount }} پیام</span>
              <i class="ti ti-chevron-left text-muted-foreground"></i>
            </div>
          </div>
        </div>

        <!-- Lucky Wheel -->
        <div
          @click="navigateToCategory('lucky-wheel')"
          class="bg-card rounded-xl border border-border p-4 hover:bg-accent/5 transition-all duration-200 cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <i class="ti ti-wheel text-muted-foreground text-lg"></i>
              </div>
              <div>
                <h3 class="font-medium text-foreground">چرخ شانس</h3>
              </div>
            </div>
            <div class="text-right flex items-center gap-2">
              <span class="text-muted-foreground text-sm">{{ luckyWheelCount }} پیام</span>
              <i class="ti ti-chevron-left text-muted-foreground"></i>
            </div>
          </div>
        </div>

        <!-- Info Form -->
        <div
          @click="navigateToCategory('info-form')"
          class="bg-card rounded-xl border border-border p-4 hover:bg-accent/5 transition-all duration-200 cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <i class="ti ti-forms text-muted-foreground text-lg"></i>
              </div>
              <div>
                <h3 class="font-medium text-foreground">فرم اطلاعات</h3>
              </div>
            </div>
            <div class="text-right flex items-center gap-2">
              <span class="text-muted-foreground text-sm">{{ infoFormCount }} پیام</span>
              <i class="ti ti-chevron-left text-muted-foreground"></i>
            </div>
          </div>
        </div>

        <!-- Question Box -->
        <div
          @click="navigateToCategory('question-box')"
          class="bg-card rounded-xl border border-border p-4 hover:bg-accent/5 transition-all duration-200 cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <i class="ti ti-message-question text-muted-foreground text-lg"></i>
              </div>
              <div>
                <h3 class="font-medium text-foreground">جعبه سوال</h3>
              </div>
            </div>
            <div class="text-right flex items-center gap-2">
              <span class="text-muted-foreground text-sm">{{ questionBoxCount }} پیام</span>
              <i class="ti ti-chevron-left text-muted-foreground"></i>
            </div>
          </div>
        </div>

        <!-- Poll -->
        <div
          @click="navigateToCategory('poll')"
          class="bg-card rounded-xl border border-border p-4 hover:bg-accent/5 transition-all duration-200 cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <i class="ti ti-chart-bar text-muted-foreground text-lg"></i>
              </div>
              <div>
                <h3 class="font-medium text-foreground">نظرسنجی</h3>
              </div>
            </div>
            <div class="text-right flex items-center gap-2">
              <span class="text-muted-foreground text-sm">{{ pollCount }} پیام</span>
              <i class="ti ti-chevron-left text-muted-foreground"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="totalMessageCount === 0" class="text-center py-12 mt-8">
        <div class="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-inbox text-muted-foreground text-2xl"></i>
        </div>
        <h3 class="text-foreground font-medium mb-2">صندوق دریافتی خالی است</h3>
        <p class="text-muted-foreground text-sm">هنوز محتوایی دریافت نکرده‌اید</p>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMessageCounts } from '~/composables/useMessageCounts'

const router = useRouter()

const {
  luckyDiceCount,
  luckyEggCount,
  luckyWheelCount,
  infoFormCount,
  questionBoxCount,
  pollCount,
  totalMessageCount
} = useMessageCounts()

const navigateToCategory = (category: string) => {
  switch(category) {
    case 'lucky-dice':
      router.push('/inbox/LuckyDicePage')
      break
    case 'lucky-egg':
      router.push('/inbox/LuckyEggPage')
      break
    case 'lucky-wheel':
      router.push('/inbox/SpinWheelPage')
      break
    case 'info-form':
      router.push('/inbox/InfoFormPage')
      break
    case 'question-box':
      router.push('/inbox/QuestionBoxPage')
      break
    case 'poll':
      router.push('/inbox/PollPage')
      break
  }
}

definePageMeta({
  middleware: 'require-activated'
})
</script>
