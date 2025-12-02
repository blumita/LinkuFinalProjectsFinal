<template>
  <div class="p-4 border border-border bg-background rounded-xl space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="flex justify-between items-center">
        <h3 class="text-base font-semibold text-foreground">رنگ آیکون‌ها</h3>
      </div>

      <!-- رنگ‌های آماده -->
      <div class="flex items-center lg:gap-2 gap-1 flex-wrap">
        <div
            v-for="(color, index) in iconColors"
            :key="index"
            class="lg:w-8 lg:h-8 w-6 h-6 rounded-full cursor-pointer border flex items-center justify-center transition-all"
            :class="[
            isSelected(color) ? 'ring-2 ring-primary border-background opacity-100' : 'border-border opacity-80 hover:opacity-100',
            color.background === 'transparent' ? 'border-dashed' : '',
            disabled ? 'cursor-not-allowed opacity-50 pointer-events-none' : 'cursor-pointer'
          ]"
            :style="{
            backgroundColor: color.background === 'transparent' ? 'transparent' : color.background,
            backgroundImage: color.background === 'transparent' ? 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)' : 'none',
            backgroundSize: color.background === 'transparent' ? '8px 8px' : 'auto',
            backgroundPosition: color.background === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto',
            color: color.background === '#000000' ? '#ffffff' : '#000000'
          }"
            @click="!disabled && selectColor(color)"
        >
          <template v-if="color.background === 'transparent'">
            <i class="ti ti-ban text-xs text-muted-foreground"></i>
          </template>
          <template v-else>
            <i class="ti ti-link text-xs hidden lg:block"></i>
          </template>
        </div>

        <!-- انتخاب رنگ سفارشی -->
        <label
            class="lg:w-8 lg:h-8 w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer relative overflow-hidden transition-all"
            :style="{
            backgroundColor: selected.background,
            color: selected.text,
            borderColor: isPredefinedColor(selected) ? '#e5e7eb' : '#3b82f6'
          }"
        >
          <i class="ti ti-color-picker text-sm z-10"></i>
          <input
              :disabled="disabled"
              type="color"
              class="absolute inset-0 opacity-0 cursor-pointer"
              @input="handleCustomColor"
          />
        </label>
      </div>
    </div>

    <!-- هماهنگی با رنگ تم -->
    <div class="border-t border-border pt-4">
      <label class="inline-flex items-center cursor-pointer"
             :class="disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'">
        <input
            :disabled="disabled"
            type="checkbox"
            class="sr-only peer"
            v-model="matchTheme"
            @change="toggleMatchTheme"
        >
        <div
            class="relative w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground"></div>
        <span class="text-sm text-foreground rtl:pr-2">هم‌رنگ با رنگ کارت</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {useFormStore} from '~/stores/form'

const props = defineProps<{ selected: ColorOption; matchThemeColor: boolean; disabled?: boolean }>()
const form = useFormStore()
const matchTheme = ref(false)

const emit = defineEmits(['update', 'update:matchTheme'])

watch(() => props.matchThemeColor, (newVal) => {
  matchTheme.value = newVal
})

watch(matchTheme, (val) => {
  emit('update:matchTheme', val)
})

const iconColors: ColorOption[] = [
  {background: 'transparent', text: '#000000'},
  {background: '#000000', text: '#ffffff'},
  {background: '#E49AF4', text: '#000000'},
  {background: '#EF4444', text: '#ffffff'},
  {background: '#F59E0B', text: '#000000'},
  {background: '#FACC15', text: '#000000'},
  {background: '#22C55E', text: '#ffffff'},
  {background: '#3B82F6', text: '#ffffff'},
]

const isSelected = (color: ColorOption) => {
  return (
      color.background === props.selected.background &&
      color.text === props.selected.text
  )
}

const isPredefinedColor = (color: ColorOption) =>
    iconColors.some(c => c.background === color.background && c.text === color.text)

const getContrastColor = (hex: string): string => {

  if (!hex || !hex.startsWith('#')) return '#000000'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 150 ? '#000000' : '#ffffff'
}

const selectColor = (color: ColorOption) => {
  emit('update', color.background === 'transparent'
      ? {background: 'transparent', text: '#000000'}
      : color
  )
  matchTheme.value = false
}

const toggleMatchTheme = () => {

  if (matchTheme.value) {

    const bg = form.themeColor?.background || '#ffffff'
    const text = bg === 'transparent' ? '#000000' : getContrastColor(bg)
    emit('update', {background: bg, text})
  }
}

const handleCustomColor = (e: Event) => {
  const input = e.target as HTMLInputElement
  const bg = input.value
  const text = getContrastColor(bg)
  emit('update', {background: bg, text})
  matchTheme.value = false
}

watch(() => form.themeColor?.background, (newColor) => {
  if (matchTheme.value) {
    const text = newColor === 'transparent' ? '#000000' : getContrastColor(newColor)
    emit('update', {background: newColor, text})
  }
})
</script>
