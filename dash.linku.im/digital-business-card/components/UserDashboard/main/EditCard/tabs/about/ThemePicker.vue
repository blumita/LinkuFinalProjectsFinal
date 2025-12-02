<template>
  <div class="p-4 border border-border bg-background rounded-xl space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <p class="text-sm font-medium text-foreground whitespace-nowrap">رنگ ظاهری</p>

      <div class="flex items-center gap-2 flex-wrap">
        <!-- رنگ‌های آماده -->
        <div
          v-for="color in cardThemes"
          :key="color"
          class="lg:w-8 lg:h-8 w-6 h-6 rounded-full cursor-pointer border flex items-center justify-center transition-all"
          :class="[
            form.themeColor.background === color
              ? 'ring-2 ring-primary border-background opacity-100'
              : 'border-border opacity-80 hover:opacity-100',
            color === 'transparent' ? 'border-dashed' : '',
            disabled ? 'cursor-not-allowed opacity-50 pointer-events-none' : 'cursor-pointer'
          ]"
          :style="{ backgroundColor: color === 'transparent' ? '#fff' : color }"
          @click="!disabled && selectPresetColor(color)"
        >
          <template v-if="color === 'transparent'">
            <i class="ti ti-ban text-xs text-muted-foreground"></i>
          </template>
        </div>

        <!-- انتخاب رنگ سفارشی -->
        <label
          class="lg:w-8 lg:h-8 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer relative overflow-hidden"
          :class="[
            !cardThemes.includes(form.themeColor.background)
              ? 'border-2 border-blue-500 opacity-100'
              : 'border border-border opacity-80 hover:opacity-100',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          ]"
          :style="{ backgroundColor: form.themeColor.background }"
        >
          <i
            class="ti ti-color-picker text-base z-10"
            :style="{ color: form.themeColor.text, fontSize: '14px' }"
          ></i>
          <input
              :disabled="disabled"
            type="color"
            class="absolute inset-0 opacity-0 cursor-pointer"
            @input="handleCustomColor"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormStore } from '~/stores/form'

const props = defineProps({
  disabled: Boolean
})
const form = useFormStore()

const cardThemes = [
  'transparent',
  '#000000',
  '#E49AF4',
  '#EF4444',
  '#F59E0B',
  '#FACC15',
  '#22C55E',
  '#3B82F6',
]

function selectPresetColor(color: string) {
  form.themeColor = {
    background: color,
    text: color === 'transparent' ? '#000000' : getContrastColor(color)
  }
}

function handleCustomColor(event: Event) {
  const input = event.target as HTMLInputElement
  const bg = input?.value || '#ffffff'
  form.themeColor = {
    background: bg,
    text: getContrastColor(bg)
  }
}

function getContrastColor(hex: string): string {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return '#000000'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 150 ? '#000000' : '#ffffff'
}
</script>
