<!-- components/ui/ToggleSwitch.vue -->
<template>
  <label class="flex items-center cursor-pointer select-none gap-2">
    <span class="text-sm text-gray-700">{{ label }}</span>
    <div class="relative">
      <input
        type="checkbox"
        class="sr-only"
        :checked="modelValue"
        @change="handleChange"
      />
      <div
        class="w-10 h-5 bg-gray-300 rounded-full shadow-inner transition-colors duration-200"
        :class="modelValue ? 'bg-gray-900' : 'bg-gray-300'"
      ></div>
      <div
        class="absolute left-0 top-0 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200"
        :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
      ></div>
    </div>
  </label>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  label: String,
});

const emit = defineEmits(['update:modelValue']);

const handleChange = (e) => {
  emit('update:modelValue', e.target.checked);
};
</script>

<style scoped>
/* اضافه کردن transition برای عملکرد نرم‌تر */
.transition-transform {
  transition: transform 0.2s ease;
}
.transition-colors {
  transition: background-color 0.2s ease;
}
</style>