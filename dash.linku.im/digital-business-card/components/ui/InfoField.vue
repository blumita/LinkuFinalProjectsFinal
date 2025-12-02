<template>
  <div class="flex-1 flex flex-col items-center md:items-start relative gap-1" v-if="value">
    <span class="font-medium text-gray-700">{{ label }}:</span>
    <div class="relative w-full flex items-center">
      <input
        :value="value"
        readonly
        :class="[
          'bg-gray-100 text-gray-900 rounded-lg px-2 py-1 w-full pr-8',
          ltr ? 'ltr' : ''
        ]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  value: string
  ltr?: boolean
}>()

const emit = defineEmits(['copied'])

function copy() {
  navigator.clipboard.writeText(props.value || '')
    .then(() => emit('copied'))
}
</script>

<style scoped>
.ltr {
  direction: ltr;
  unicode-bidi: plaintext;
}
</style>
