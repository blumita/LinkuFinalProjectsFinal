<template>
  <!-- تریگر -->
  <div
    class="w-full rounded-xl bg-card border border-border px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors cursor-pointer"
    @click="show = true"
  >
    <span class="text-sm font-medium text-foreground">تغییر چیدمان</span>
    <span class="flex items-center gap-2 text-sm text-muted-foreground">
      {{ currentLabel }}
      <svg viewBox="0 0 24 24" class="w-5 h-5 rotate-180">
        <path fill="currentColor" d="M9.3 6.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L13.6 12 9.3 7.7a1 1 0 0 1 0-1.4Z"/>
      </svg>
    </span>
  </div>

  <!-- Bottom Sheet -->
  <UiBottomSheet v-model="show" size="auto" :closable="true" role="dialog" aria-modal="true" title="چیدمان">
    <!-- گزینه‌ها -->
    <div class="px-6">
      <!-- موبایل: اسکرول افقی -->
      <div class="md:hidden">
        <div class="flex gap-8 overflow-x-auto px-6 pb-6 pt-6 snap-x snap-mandatory" role="radiogroup" aria-label="گزینه‌های چیدمان">
        
          <!-- 1) راست‌چین (تمام محتوای کارت راست‌چین) -->
          <button @click="pick('right')" :aria-checked="selected==='right'" role="radio" class="flex flex-col items-center flex-shrink-0 snap-start focus:outline-none">
            <div :class="cardClass('right')">
              <div class="w-full h-full bg-card flex flex-col">
                <div class="relative w-full h-24 bg-muted border-b border-border/40">
                  <div class="absolute -bottom-6 right-3">
                    <div class="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
                      <i class="ti ti-user text-xl text-muted-foreground"></i>
                    </div>
                    <div class="absolute -bottom-1 -left-2 w-7 h-7 rounded-full bg-muted border border-border"></div>
                  </div>
                </div>
                <div class="px-3 pt-8 pb-3">
                  <div class="flex flex-col items-end gap-2 mb-4">
                    <div class="w-24 h-2.5 bg-muted/40 rounded"></div>
                    <div class="w-16 h-2 bg-muted rounded"></div>
                  </div>
                  <div class="w-full h-6 bg-muted/40 rounded mb-4"></div>
                </div>
                <div class="grid grid-cols-3 gap-2 px-3 pb-3 mt-auto">
                  <div class="space-y-1"><div class="aspect-square bg-muted rounded-lg"></div><div class="h-1 bg-muted rounded"></div></div>
                  <div class="space-y-1"><div class="aspect-square bg-muted rounded-lg"></div><div class="h-1 bg-muted rounded"></div></div>
                  <div class="space-y-1"><div class="aspect-square bg-muted rounded-lg"></div><div class="h-1 bg-muted rounded"></div></div>
                </div>
              </div>
            </div>
            <p class="text-xs mt-2 text-foreground">راست‌چین</p>
            <span :class="radioClass('right')">
              <svg v-if="selected==='right'" viewBox="0 0 24 24" class="w-4 h-4">
                <path fill="currentColor" d="M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"/>
              </svg>
            </span>
          </button>

          <!-- 2) چپ‌چین -->
          <button @click="pick('left')" :aria-checked="selected==='left'" role="radio" class="flex flex-col items-center flex-shrink-0 snap-start focus:outline-none">
            <div :class="cardClass('left')">
              <div class="w-full h-full bg-card flex flex-col">
                <div class="relative w-full h-24 bg-muted border-b border-border/40">
                  <div class="absolute -bottom-6 left-3">
                    <div class="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
                      <i class="ti ti-user text-xl text-muted-foreground"></i>
                    </div>
                    <div class="absolute -bottom-1 -right-2 w-7 h-7 rounded-full bg-muted border border-border"></div>
                  </div>
                </div>
                <div class="px-3 pt-8 pb-3">
                  <div class="flex flex-col items-start gap-2 mb-4">
                    <div class="w-24 h-2.5 bg-muted/40 rounded"></div>
                    <div class="w-16 h-2 bg-muted rounded"></div>
                  </div>
                  <div class="w-full h-6 bg-muted/40 rounded mb-4"></div>
                </div>
                <div class="grid grid-cols-3 gap-2 px-3 pb-3 mt-auto">
                  <div class="space-y-1"><div class="aspect-square bg-muted rounded-lg"></div><div class="h-1 bg-muted rounded"></div></div>
                  <div class="space-y-1"><div class="aspect-square bg-muted rounded-lg"></div><div class="h-1 bg-muted rounded"></div></div>
                  <div class="space-y-1"><div class="aspect-square bg-muted rounded-lg"></div><div class="h-1 bg-muted rounded"></div></div>
                </div>
              </div>
            </div>
            <p class="text-xs mt-2 text-foreground">چپ‌چین</p>
            <span :class="radioClass('left')">
              <svg v-if="selected==='left'" viewBox="0 0 24 24" class="w-4 h-4">
                <path fill="currentColor" d="M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"/>
              </svg>
            </span>
          </button>

          <!-- 3) وسط‌چین -->
          <button @click="pick('center')" :aria-checked="selected==='center'" role="radio" class="flex flex-col items-center flex-shrink-0 snap-start focus:outline-none">
            <div :class="cardClass('center')">
              <div class="w-full h-full bg-card flex flex-col">
                <div class="relative w-full h-24 bg-muted border-b border-border/40">
                  <div class="absolute -bottom-6 left-1/2 -translate-x-1/2">
                    <div class="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
                      <i class="ti ti-user text-xl text-muted-foreground"></i>
                    </div>
                    <div class="absolute -bottom-1 -right-2 w-7 h-7 rounded-full bg-muted border border-border"></div>
                  </div>
                </div>
                <div class="px-3 pt-8 pb-3">
                  <div class="flex flex-col items-center gap-2 mb-4">
                    <div class="w-24 h-2.5 bg-muted/40 rounded"></div>
                    <div class="w-16 h-2 bg-muted rounded"></div>
                  </div>
                  <div class="w-full h-6 bg-muted/40 rounded mb-4"></div>
                </div>
                <div class="grid grid-cols-3 gap-2 px-3 pb-3 mt-auto">
                  <div class="space-y-1"><div class="aspect-square bg-muted rounded-lg"></div><div class="h-1 bg-muted rounded"></div></div>
                  <div class="space-y-1"><div class="aspect-square bg-muted rounded-lg"></div><div class="h-1 bg-muted rounded"></div></div>
                  <div class="space-y-1"><div class="aspect-square bg-muted rounded-lg"></div><div class="h-1 bg-muted rounded"></div></div>
                </div>
              </div>
            </div>
            <p class="text-xs mt-2 text-foreground">وسط‌چین</p>
            <span :class="radioClass('center')">
              <svg v-if="selected==='center'" viewBox="0 0 24 24" class="w-4 h-4">
                <path fill="currentColor" d="M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"/>
              </svg>
            </span>
          </button>

          <!-- 4) پورتریت -->
          <button @click="pick('portrait')" :aria-checked="selected==='portrait'" role="radio" class="flex flex-col items-center flex-shrink-0 snap-start focus:outline-none">
            <div :class="cardClass('portrait')">
              <div class="w-full h-full bg-card flex flex-col">
                <!-- هدر با لوگو در پایین -->
                <div class="relative w-full h-20 bg-gradient-to-b from-muted to-card/90">
                  <div class="absolute bottom-2 right-2">
                    <div class="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
                      <i class="ti ti-user text-xs text-muted-foreground"></i>
                    </div>
                  </div>
                </div>
                
                <!-- متن‌ها -->
                <div class="px-3 pt-4 pb-3">
                  <div class="space-y-2 mb-4 text-center">
                    <div class="mx-auto w-20 h-2.5 bg-muted/40 rounded"></div>
                    <div class="mx-auto w-16 h-2 bg-muted rounded"></div>
                  </div>
                  <div class="w-full h-6 bg-muted/40 rounded mb-4"></div>
                  
                  <!-- باکس‌های عمودی -->
                  <div class="space-y-2">
                    <div class="flex items-center gap-2">
                      <div class="w-5 h-5 bg-muted rounded"></div>
                      <div class="flex-1">
                        <div class="w-20 h-1.5 bg-muted rounded mb-1"></div>
                        <div class="w-16 h-1.5 bg-muted rounded"></div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-5 h-5 bg-muted rounded"></div>
                      <div class="flex-1">
                        <div class="w-18 h-1.5 bg-muted rounded mb-1"></div>
                        <div class="w-14 h-1.5 bg-muted rounded"></div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-5 h-5 bg-muted rounded"></div>
                      <div class="flex-1">
                        <div class="w-16 h-1.5 bg-muted rounded mb-1"></div>
                        <div class="w-18 h-1.5 bg-muted rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p class="text-xs mt-2 text-foreground">پورتریت</p>
            <span :class="radioClass('portrait')">
              <svg v-if="selected==='portrait'" viewBox="0 0 24 24" class="w-4 h-4">
                <path fill="currentColor" d="M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"/>
              </svg>
            </span>
          </button>
        </div>
      </div>

      <!-- دسکتاپ: Grid Layout (No Scroll) -->
      <div class="hidden md:block px-6 pb-6 pt-6">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto" role="radiogroup" aria-label="گزینه‌های چیدمان">
            <!-- 1) راست‌چین -->
            <button @click="pick('right')" :aria-checked="selected==='right'" role="radio" class="flex flex-col items-center focus:outline-none">
              <div :class="cardClass('right')">
                <div class="w-full h-full bg-card flex flex-col">
                  <div class="relative w-full h-24 bg-muted border-b border-border/40">
                    <div class="absolute -bottom-6 right-3">
                      <div class="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
                        <i class="ti ti-user text-xl text-muted-foreground"></i>
                      </div>
                      <div class="absolute -bottom-1 -left-2 w-7 h-7 rounded-full bg-muted border border-border"></div>
                    </div>
                  </div>
                  <div class="px-3 pt-8 pb-3">
                    <div class="flex flex-col items-end gap-2 mb-4">
                      <div class="w-24 h-2.5 bg-muted/40 rounded"></div>
                      <div class="w-16 h-2 bg-muted rounded"></div>
                      <div class="w-28 h-2 bg-muted rounded"></div>
                    </div>
                    <div class="w-full h-8 bg-muted/40 rounded-full mb-4"></div>
                  </div>
                  <div class="grid grid-cols-3 gap-2 px-3 pb-3 mt-auto">
                    <div class="space-y-1"><div class="aspect-square bg-muted rounded-lg"></div><div class="h-1 bg-muted rounded"></div></div>
                    <div class="space-y-1"><div class="aspect-square bg-muted rounded-lg"></div><div class="h-1 bg-muted rounded"></div></div>
                    <div class="space-y-1"><div class="aspect-square bg-muted rounded-lg"></div><div class="h-1 bg-muted rounded"></div></div>
                  </div>
                </div>
              </div>
              <p class="text-sm mt-3 text-foreground font-medium">راست‌چین</p>
              <span :class="radioClass('right')">
                <svg v-if="selected==='right'" viewBox="0 0 24 24" class="w-4 h-4">
                  <path fill="currentColor" d="M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"/>
                </svg>
              </span>
            </button>

            <!-- 2) چپ‌چین -->
            <button @click="pick('left')" :aria-checked="selected==='left'" role="radio" class="flex flex-col items-center focus:outline-none">
              <div :class="cardClass('left')">
                <div class="w-full h-full bg-card flex flex-col">
                  <div class="relative w-full h-24 bg-muted border-b border-border/40">
                    <div class="absolute -bottom-6 left-3">
                      <div class="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
                        <i class="ti ti-user text-xl text-muted-foreground"></i>
                      </div>
                      <div class="absolute -bottom-1 -right-2 w-7 h-7 rounded-full bg-muted border border-border"></div>
                    </div>
                  </div>
                  <div class="px-3 pt-8 pb-3">
                    <div class="flex flex-col items-start gap-2 mb-4">
                      <div class="w-24 h-2.5 bg-muted/40 rounded"></div>
                      <div class="w-16 h-2 bg-muted rounded"></div>
                      <div class="w-28 h-2 bg-muted rounded"></div>
                    </div>
                    <div class="w-full h-8 bg-muted/40 rounded-full mb-4"></div>
                  </div>
                  <div class="px-3 pb-3 mt-auto space-y-3">
                    <div class="flex items-center gap-2">
                      <div class="w-5 h-5 bg-muted rounded"></div>
                      <div class="w-24 h-1.5 bg-muted rounded"></div>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-5 h-5 bg-muted rounded"></div>
                      <div class="w-20 h-1.5 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-sm mt-3 text-foreground font-medium">چپ‌چین</p>
              <span :class="radioClass('left')">
                <svg v-if="selected==='left'" viewBox="0 0 24 24" class="w-4 h-4">
                  <path fill="currentColor" d="M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"/>
                </svg>
              </span>
            </button>

            <!-- 3) وسط‌چین -->
            <button @click="pick('center')" :aria-checked="selected==='center'" role="radio" class="flex flex-col items-center focus:outline-none">
              <div :class="cardClass('center')">
                <div class="w-full h-full bg-card flex flex-col">
                  <div class="relative w-full h-24 bg-muted border-b border-border/40">
                    <div class="absolute -bottom-6 left-1/2 -translate-x-1/2">
                      <div class="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
                        <i class="ti ti-user text-xl text-muted-foreground"></i>
                      </div>
                      <div class="absolute -bottom-1 -right-2 w-7 h-7 rounded-full bg-muted border border-border"></div>
                    </div>
                  </div>
                  <div class="px-3 pt-8 pb-3">
                    <div class="flex flex-col items-center gap-2 mb-4">
                      <div class="w-24 h-2.5 bg-muted/40 rounded"></div>
                      <div class="w-16 h-2 bg-muted rounded"></div>
                      <div class="w-28 h-2 bg-muted rounded"></div>
                    </div>
                    <div class="w-full h-8 bg-muted/40 rounded-full mb-4"></div>
                  </div>
                  <div class="grid grid-cols-3 gap-2 px-3 pb-3 mt-auto">
                    <div class="space-y-1"><div class="aspect-square bg-muted rounded-lg"></div><div class="h-1 bg-muted rounded"></div></div>
                    <div class="space-y-1"><div class="aspect-square bg-muted rounded-lg"></div><div class="h-1 bg-muted rounded"></div></div>
                    <div class="space-y-1"><div class="aspect-square bg-muted rounded-lg"></div><div class="h-1 bg-muted rounded"></div></div>
                  </div>
                </div>
              </div>
              <p class="text-sm mt-3 text-foreground font-medium">وسط‌چین</p>
              <span :class="radioClass('center')">
                <svg v-if="selected==='center'" viewBox="0 0 24 24" class="w-4 h-4">
                  <path fill="currentColor" d="M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"/>
                </svg>
              </span>
            </button>

            <!-- 4) پورتریت -->
            <button @click="pick('portrait')" :aria-checked="selected==='portrait'" role="radio" class="flex flex-col items-center focus:outline-none">
              <div :class="cardClass('portrait')">
                <div class="w-full h-full bg-card flex flex-col">
                  <!-- هدر با لوگو در پایین -->
                  <div class="relative w-full h-20 bg-gradient-to-b from-muted to-card/90">
                    <div class="absolute bottom-2 right-2">
                      <div class="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
                        <i class="ti ti-user text-xs text-muted-foreground"></i>
                      </div>
                    </div>
                  </div>
                  
                  <!-- متن‌ها -->
                  <div class="px-3 pt-4 pb-3">
                    <div class="space-y-3 mb-6 text-center">
                      <div class="mx-auto w-20 h-2.5 bg-muted/40 rounded"></div>
                      <div class="mx-auto w-16 h-2 bg-muted rounded"></div>
                      <div class="mx-auto w-24 h-2 bg-muted rounded"></div>
                    </div>
                    <div class="w-full h-8 bg-muted/40 rounded-full mb-6"></div>
                    
                    <!-- باکس‌های مربعی در پایین -->
                    <div class="space-y-3">
                      <div class="flex items-center gap-2">
                        <div class="w-5 h-5 bg-muted rounded"></div>
                        <div class="flex-1">
                          <div class="w-20 h-1.5 bg-muted rounded mb-1"></div>
                          <div class="w-24 h-1.5 bg-muted rounded"></div>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-5 h-5 bg-muted rounded"></div>
                        <div class="flex-1">
                          <div class="w-18 h-1.5 bg-muted rounded mb-1"></div>
                          <div class="w-22 h-1.5 bg-muted rounded"></div>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-5 h-5 bg-muted rounded"></div>
                        <div class="flex-1">
                          <div class="w-16 h-1.5 bg-muted rounded mb-1"></div>
                          <div class="w-20 h-1.5 bg-muted rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-sm mt-3 text-foreground font-medium">پورتریت</p>
              <span :class="radioClass('portrait')">
                <svg v-if="selected==='portrait'" viewBox="0 0 24 24" class="w-4 h-4">
                  <path fill="currentColor" d="M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"/>
                </svg>
              </span>
            </button>
        </div>
      </div>
    </div>

    <!-- تایید -->
    <div class="px-4 pb-4 pt-4 border-t border-border space-y-3">
      <button @click="confirm()" class="w-full py-3 bg-foreground/80 text-background rounded-xl font-semibold hover:bg-foreground transition-colors">
        تایید چیدمان
      </button>
    </div>
  </UiBottomSheet>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRaw } from 'vue'
import UiBottomSheet from '@/components/ui/BottomSheet.vue'

type Layout = 'right' | 'left' | 'center' | 'portrait'

const props = defineProps<{ modelValue?: Layout }>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: Layout): void
  (e: 'layout-changed', v: Layout): void
  (e: 'confirm', v: Layout): void
}>()

const show = ref(false)
const selected = ref<Layout>(props.modelValue ?? 'right')

watch(() => props.modelValue, v => {
  if (process.client && v) {
    selected.value = v
  }
})

const labels: Record<Layout, string> = {
  right: 'راست‌چین', 
  left: 'چپ‌چین', 
  center: 'وسط‌چین', 
  portrait: 'پورتریت'
}

const currentLabel = computed(() => {
  if (process.client) {
    return labels[selected.value] || 'راست‌چین'
  }
  return labels[props.modelValue ?? 'right'] || 'راست‌چین'
})

function pick(v: Layout) {
  if (process.client) {
    selected.value = v
    emit('update:modelValue', toRaw(v))
    emit('layout-changed', toRaw(v))
  }
}

function confirm() {
  if (process.client) {
    show.value = false
    emit('confirm', toRaw(selected.value))
  }
}

function cardClass(kind: Layout) {
  return [
    'relative w-36 h-64 rounded-2xl border border-border overflow-hidden shadow-sm transition-colors',
    selected.value === kind ? 'ring-1 ring-foreground' : 'hover:border-muted-foreground/60'
  ].join(' ')
}

function radioClass(kind: Layout) {
  return [
    'mt-1.5 inline-flex items-center justify-center w-6 h-6 rounded-full',
    selected.value === kind ? 'bg-foreground text-background' : 'border-2 border-muted'
  ].join(' ')
}
</script>