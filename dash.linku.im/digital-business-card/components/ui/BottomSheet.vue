<template>
  <Teleport to="body">
    <!-- Full size: mobile = full screen, desktop = centered modal -->
    <Transition
      v-if="size === 'full'"
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="modelValue"
        :class="['fixed inset-0 lg:bg-black/50', zIndex]"
        @click="handleBackdropClick"
      >
        <Transition
          enter-active-class="transition-transform duration-300 ease-out"
          enter-from-class="translate-y-full lg:translate-y-0 lg:scale-95 lg:opacity-0"
          enter-to-class="translate-y-0 lg:scale-100 lg:opacity-100"
          leave-active-class="transition-transform duration-200 ease-in"
          leave-from-class="translate-y-0 lg:scale-100 lg:opacity-100"
          leave-to-class="translate-y-full lg:translate-y-0 lg:scale-95 lg:opacity-0"
        >
          <div
            v-show="modelValue"
            ref="bottomSheetRef"
            :class="[
              'fixed bg-background text-foreground flex flex-col',
              'inset-0',
              'lg:inset-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2',
              'lg:w-full lg:max-w-4xl lg:max-h-[80vh] lg:rounded-2xl lg:shadow-2xl lg:border lg:border-border',
              zIndex
            ]"
            @click.stop
          >
            <div class="overflow-y-auto flex-1 scrollbar-hidden overscroll-contain">
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <Transition
      v-else
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="modelValue"
        :class="['fixed inset-0 bg-black/50', zIndex]"
        @click="handleBackdropClick"
      >
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="translate-y-full lg:translate-y-0 lg:scale-95 lg:opacity-0"
          enter-to-class="translate-y-0 lg:scale-100 lg:opacity-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="translate-y-0 lg:scale-100 lg:opacity-100"
          leave-to-class="translate-y-full lg:translate-y-0 lg:scale-95 lg:opacity-0"
        >
          <div
            v-show="modelValue"
            ref="bottomSheetRef"
            class="fixed bg-background text-foreground flex flex-col shadow-xl border border-border"
            :class="[
              'bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl',
              'lg:rounded-2xl lg:left-1/2 lg:right-auto lg:bottom-auto lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-h-[85vh]', 
              desktopWidthClass, 
              zIndex
            ]"
            :style="bottomSheetStyle"
            @click.stop
          >
            <div v-if="!closable" class="flex justify-center pt-2 pb-1 lg:hidden">
              <div class="w-10 h-1 bg-muted-foreground/30 rounded-full"></div>
            </div>

            <div v-if="title || closable" class="flex items-center border-b border-border px-4 py-3">
              <div class="flex-1 text-center lg:text-right">
                <h3 v-if="title" class="text-lg font-semibold text-foreground">{{ title }}</h3>
              </div>
              <button v-if="closable" type="button" class="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" @click="close">
                <i class="ti ti-x text-xl"></i>
              </button>
            </div>

            <div 
              class="overflow-y-auto flex-1 scrollbar-hidden overscroll-contain" 
              :style="contentStyle"
              style="-webkit-overflow-scrolling: touch; touch-action: pan-y;"
            >
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

export type BottomSheetSize = 'sm' | 'md' | 'lg' | 'xl' | 'auto' | 'full'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  visible?: boolean // alias for modelValue
  title?: string
  size?: BottomSheetSize
  maxHeight?: string
  closable?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  zIndex?: string
  desktopCentered?: boolean
  heightClass?: string
  contentPadding?: string
  desktopWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
}>(), {
  modelValue: false,
  visible: false,
  size: 'auto',
  maxHeight: '70vh',
  closable: true,
  closeOnBackdrop: true,
  closeOnEscape: true,
  zIndex: 'z-[99999]',
  desktopCentered: false,
  heightClass: '',
  contentPadding: '',
  desktopWidth: '2xl'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const bottomSheetRef = ref<HTMLElement | null>(null)

let scrollY = 0
const setBodyLock = (hidden: boolean) => {
  if (typeof document === 'undefined') return
  
  if (hidden) {
    scrollY = window.scrollY || 0
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.top = `-${scrollY}px`
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.position = ''
    document.body.style.width = ''
    document.body.style.top = ''
    document.body.style.overflow = ''
    window.scrollTo(0, scrollY)
  }
}

watch(() => props.modelValue, (val) => {
  setBodyLock(val)
  if (!val) setTimeout(() => setBodyLock(false), 250)
})

onMounted(() => {
  if (props.modelValue) setBodyLock(true)
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.closeOnEscape && props.modelValue) close()
  })
})

onBeforeUnmount(() => setBodyLock(false))

// محاسبه کلاس عرض دسکتاپ
const desktopWidthClass = computed(() => {
  const widths = {
    sm: 'lg:max-w-sm',
    md: 'lg:max-w-md',
    lg: 'lg:max-w-lg',
    xl: 'lg:max-w-xl',
    '2xl': 'lg:max-w-2xl',
    '3xl': 'lg:max-w-3xl',
    '4xl': 'lg:max-w-4xl',
    '5xl': 'lg:max-w-5xl'
  }
  return widths[props.desktopWidth] || 'lg:max-w-xl'
})

const bottomSheetStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.size === 'full') style.height = '100vh'
  else if (props.size !== 'auto') {
    const heights = { sm: '20vh', md: '35vh', lg: '60vh', xl: '80vh' }
    style.height = heights[props.size as keyof typeof heights]
  }
  return style
})

const contentStyle = computed(() => ({
  maxHeight: props.size === 'auto' ? props.maxHeight : undefined
}))

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) close()
}
</script>

<style scoped>
.scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hidden::-webkit-scrollbar { display: none; }
</style>
