<template>
    <div>
      <label class="block text-sm font-medium text-foreground mb-2">
        {{ label }}
      </label>
      <input
        type="text"
        :placeholder="placeholder"
        v-model="value"
        :maxlength="maxlength ||10"
        :disabled="disabled"
        class="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      />
      <div v-if="error" class="text-xs text-destructive mt-1.5">{{ error }}</div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    label: String,
    placeholder: String,
    modelValue: String,
    maxlength: Number,
    error: String,
    disabled:Boolean
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
