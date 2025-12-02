<template>
  <div class="w-full p-4 sm:p-6 lg:p-8">
    <h2 class="text-xl font-bold mb-3 text-slate-900 dark:text-white">اطلاعات پشتیبانی</h2>

    <div class="space-y-3">
      <input v-model="form.email" type="email" placeholder="ایمیل" class="w-full p-2 border rounded dark:bg-slate-700 dark:text-white"/>
      <input v-model="form.phone" type="text" placeholder="تلفن" class="w-full p-2 border rounded dark:bg-slate-700 dark:text-white"/>
      <input v-model="form.socialMediaLink" type="text" placeholder="تلگرام" class="w-full p-2 border rounded dark:bg-slate-700 dark:text-white"/>
    </div>

    <div class="flex justify-end gap-3 mt-4">
      <button @click="save" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">ذخیره</button>
    </div>

    <div v-if="supportStore.loading" class="text-center text-gray-500">در حال ذخیره‌سازی...</div>
    <div v-if="supportStore.error" class="text-red-500 text-sm">{{ supportStore.error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupportStore } from '@/stores/support'

const supportStore = useSupportStore()
const form = ref({...supportStore.support})

onMounted(async () => {
  await supportStore.fetchSupport()
  form.value = { ...supportStore.support }
})

const save = async () => {
  await supportStore.updateSupport(form.value)
}
</script>
