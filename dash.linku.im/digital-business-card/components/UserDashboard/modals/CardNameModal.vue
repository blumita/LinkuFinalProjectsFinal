<!-- components/CardNameModal.vue -->
<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-right">
      <h2 class="text-lg font-semibold mb-4">ویرایش نام کارت</h2>
      <input
        v-model="cardNameDraft"
        type="text"
        class="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-black/20"
        :class="cardNameDraft ? 'border-gray-300 focus:ring-black/20' : 'border-red-500 focus:ring-red-300'"
        placeholder="مثلاً: کارت شخصی"
        @keydown.enter="updateCardName"
      />
      <!-- پیام خطا -->
      <p v-if="!cardNameDraft" class="text-red-500 text-xs mt-1">
        نام کارت نمی‌تواند خالی باشد.
      </p>
      <div class="flex justify-end gap-2 mt-4">
        <button @click="closeModal" class="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50">لغو</button>
        <button @click="updateCardName" class="px-4 py-2 text-sm bg-black text-white rounded hover:bg-black/90">بروزرسانی</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  currentCardName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'update'])

const cardNameDraft = ref(props.currentCardName || '')

function closeModal() {
  emit('close')
}

function updateCardName() {
  if (!cardNameDraft.value) return
  emit('update', cardNameDraft.value.trim())
}
</script>

<style scoped>
/* Optional: You can add specific styles for your modal here */
</style>
