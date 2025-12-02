<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
      <div class="flex items-center h-14 px-4">
        <button 
          @click="$router.back()"
          class="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-accent transition-colors"
        >
          <i class="ti ti-arrow-right text-xl"></i>
        </button>
        <h1 class="flex-1 text-lg font-semibold text-foreground text-center mr-10">صندوق پیام‌ها</h1>
      </div>
    </div>

    <!-- Content -->
    <div class="pt-16 pb-24 px-4">
      <div class="max-w-2xl mx-auto space-y-3 mt-6">
        <!-- Lucky Dice -->
        <div
          @click="navigateToCategory('lucky-dice')"
          class="bg-card rounded-xl border border-border p-4 hover:bg-accent/5 transition-all duration-200 cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-secondary  flex items-center justify-center">
                <i class="ti ti-dice text-foreground text-lg"></i>
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
              <div class="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <i class="ti ti-egg text-secondary-foreground text-lg"></i>
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
              <div class="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <i class="ti ti-wheel text-accent-foreground text-lg"></i>
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
              <div class="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <i class="ti ti-help text-secondary-foreground text-lg"></i>
              </div>
              <div>
                <h3 class="font-medium text-foreground">صندوق سوال</h3>
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
              <div class="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <i class="ti ti-chart-bar text-accent-foreground text-lg"></i>
              </div>
              <div>
                <h3 class="font-medium text-foreground">نظرسنجی</h3>
              </div>
            </div>
            <div class="text-right flex items-center gap-2">
              <span class="text-muted-foreground text-sm">{{ pollCount }} رای</span>
              <i class="ti ti-chevron-left text-muted-foreground"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="totalItems === 0" class="text-center py-12 mt-8">
        <div class="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-inbox text-muted-foreground text-2xl"></i>
        </div>
        <h3 class="text-foreground font-medium mb-2">صندوق دریافتی خالی است</h3>
        <p class="text-muted-foreground text-sm">هنوز محتوایی دریافت نکرده‌اید</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMessageCounts } from '~/composables/useMessageCounts'

// Router
const router = useRouter()

// Use message counts composable
const {
  luckyDiceCount,
  luckyEggCount,
  luckyWheelCount,
  infoFormCount,
  questionBoxCount,
  pollCount,
  totalMessageCount,
  formattedMessageCount
} = useMessageCounts()

// Computed for total items (keeping original logic for this page)
const totalItems = computed(() => {
  return luckyDiceCount.value + luckyEggCount.value + luckyWheelCount.value + 
         infoFormCount.value + questionBoxCount.value + (pollCount.value > 0 ? 1 : 0)
})

// Methods
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
</script>

<style scoped>

.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.5rem;
}
</style>
