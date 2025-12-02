<template>
  <div class="mb-1.5 relative" ref="dropdownRef">
    <!-- Text Field -->
    <div v-if="field.type === 'text'">
      <input
        v-model="modelValue"
        type="text"
        class="w-full border rounded-md px-3 py-1.5 text-xs text-right text-gray-700 placeholder-gray-400 transition-colors"
        :class="error ? 'border-red-500 bg-red-50' : 'border-gray-300'"
        :placeholder="field.label + (field.required ? ' *' : '')"
        :required="field.required"
      />
      <p v-if="error" class="text-red-500 text-[10px] mt-0.5 text-right">{{ error }}</p>
    </div>

    <!-- Custom Dropdown -->
    <div v-else-if="field.type === 'dropdown'" class="relative">
      <div
        @click="toggleDropdown"
        class="w-full border rounded-md px-3 py-1.5 text-xs text-right cursor-pointer flex justify-between items-center transition-colors"
        :class="error ? 'border-red-500 bg-red-50 text-gray-600' : 'border-gray-300 text-gray-600'"
      >
        <span>{{ modelValue || field.label + (field.required ? ' *' : '') }}</span>
        <!-- Tabler Icon -->
        <i class="ti ti-chevron-down text-gray-500 text-sm"></i>
      </div>
      <ul
        v-if="isDropdownOpen"
        class="absolute z-10 mt-1 w-full bg-white border border-gray-200 text-gray-700 rounded-md shadow-sm text-xs text-right"
      >
        <li
          v-for="(opt, i) in field.options || []"
          :key="i"
          @click="selectOption(opt)"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
        >
          {{ opt }}
        </li>
      </ul>
      <p v-if="error" class="text-red-500 text-[10px] mt-0.5 text-right">{{ error }}</p>
    </div>

    <!-- Checkbox -->
    <label
      v-else-if="field.type === 'checkbox'"
      class="flex items-center gap-2 cursor-pointer"
    >
      <input
        type="checkbox"
        v-model="modelValue"
        :required="field.required"
        class="w-4 h-4"
      />
      <span class="text-xs text-gray-600">{{ field.label }}</span>
    </label>

    <!-- File Upload -->
    <div v-else-if="field.type === 'file'" class="flex flex-col gap-1">

      <div class="flex items-center gap-3 w-full">
        <label
            :for="`fileInput-${field.id}`"
            class="inline-flex items-center gap-1 px-3 py-1.5 text-xs border-2 border-dotted rounded-md cursor-pointer w-full transition-colors"
            :class="error ? 'text-red-600 border-red-400 bg-red-50' : 'text-gray-700 border-gray-300'"
        >
          <i class="ti ti-upload text-sm"></i>
          {{ field.label }}{{ field.required ? ' *' : '' }}
        </label>

        <!-- تصویر کنار دکمه -->
        <img
            v-if="previewUrl"
            :src="previewUrl"
            alt="تصویر جدید"
            class="h-[40px] w-auto rounded border border-gray-300 object-cover"
        />

        <img
            v-else-if="typeof modelValue === 'string' && modelValue.startsWith('http')"
            :src="modelValue"
            alt="تصویر قبلی"
            class="h-[40px] w-auto rounded border border-gray-300 object-cover"
        />
      </div>
      <input
          :id="`fileInput-${field.id}`"
          type="file"
          :required="field.required"
          @change="handleFile"
          class="hidden"
      />

      <!-- نمایش نام فایل اگر فایل جدید انتخاب شد -->
      <span v-if="fileName" class="text-xs text-gray-500">{{ fileName }}</span>
      <p v-if="error" class="text-red-500 text-[10px] mt-0.5 text-right">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'

interface Field {
  id: number | string
  label: string
  name: string
  required: boolean
  type: 'text' | 'dropdown' | 'checkbox' | 'file'
  options?: string[]
}

const props = defineProps<{
  field: Field,
  modelValue: string | boolean | File | null,
  previewSrc?: string,
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'update:previewSrc', value: string): void
}>()


const fileName = ref<string>('')
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

watch(modelValue, (val) => {
  if (val instanceof File) {
    fileName.value = val.name
  }
  emit('update:modelValue', val)
})
const previewUrl = computed(() => props.previewSrc || '')

function handleFile(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] || null
  modelValue.value = file
  fileName.value = file?.name || ''

  // ساخت آدرس preview از فایل جدید
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = () => {
      emit('update:previewSrc', reader.result as string)
    }
    reader.readAsDataURL(file)
  } else {
    emit('update:previewSrc', '')
  }
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function selectOption(opt: string) {
  modelValue.value = opt
  isDropdownOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
