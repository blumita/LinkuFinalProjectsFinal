<template>
  <div>
    <label class="block text-sm font-medium text-foreground mb-2">
      {{ label }}
    </label>
    <textarea
        :disabled="disabled"
        :placeholder="placeholder"
        v-model="value"
        :rows="rows"
        :maxlength="maxlength || 500"
        class="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
    ></textarea>
    <div v-if="error" class="text-xs text-destructive mt-1.5">{{ error }}</div>
  </div>
</template>

<script setup>
import {computed} from 'vue'

const props = defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
  maxlength: Number,
  rows: {
    type: Number,
    default: 4
  },
  error: String,
  disabled: Boolean
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (val) => {
    if (props.maxlength && val && val.length > props.maxlength) {
      emit('update:modelValue', val.slice(0, props.maxlength))
    } else {
      emit('update:modelValue', val)
    }
  }
})
</script>