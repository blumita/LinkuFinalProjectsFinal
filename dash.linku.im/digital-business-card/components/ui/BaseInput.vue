<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="block text-sm font-medium text-foreground mb-1">{{ label }}</label>
    <input
      :id="id"
      v-model="modelValue"
      v-bind="$attrs"
      :class="[
        'w-full px-4 py-2 bg-muted rounded-lg border border-border text-sm focus:ring-primary focus:border-primary transition placeholder-muted-foreground text-foreground',
        error ? 'border-destructive focus:border-destructive' : ''
      ]"
      @invalid="onInvalid"
      @input="error = ''"
    />
    <p v-if="error" class="text-xs text-destructive mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ id?: string; label?: string }>()
defineEmits(['update:modelValue'])
const modelValue = defineModel<string>()
const error = ref('')

function onInvalid(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.validity.valueMissing) error.value = 'پر کردن این فیلد الزامی است.'
  else if (input.validity.typeMismatch) error.value = 'لطفاً مقدار معتبر وارد کنید.'
  else if (input.validity.patternMismatch) error.value = 'فرمت وارد شده صحیح نیست.'
  else if (input.validity.tooShort) error.value = `حداقل ${input.minLength} کاراکتر وارد کنید.`
  else if (input.validity.tooLong) error.value = `حداکثر ${input.maxLength} کاراکتر مجاز است.`
  else if (input.validity.rangeUnderflow) error.value = `مقدار باید بیشتر باشد از ${input.min}.`
  else if (input.validity.rangeOverflow) error.value = `مقدار باید کمتر باشد از ${input.max}.`
  else error.value = 'مقدار وارد شده معتبر نیست.'
}
</script>
