<template>
  <div class="w-full space-y-4">
    <!-- توست نسخه پرو -->
    <ProToast :visible="showToast"/>

    <!-- ردیف اصلی -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-2">
      <!-- پیام خوش‌آمدگویی -->
      <div class="text-center sm:text-right text-base sm:text-lg font-semibold text-foreground w-full sm:w-auto">
        {{ username }} عزیز خوش آمدید
      </div>

      <!-- دکمه‌های فیلتر -->
      <div class="flex flex-wrap justify-center sm:justify-end gap-2 w-full sm:w-auto">
        <button
            v-for="(label, key) in filters"
            :key="key"
            @click="handleClick(key)"
            :class="[
            'px-4 py-2 text-sm font-medium rounded-full border transition',
            modelValue === key
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-foreground border-border hover:bg-muted',
            isPro(key) && !userStore.user?.isPro ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
          ]"
        >
          {{ label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import ProToast from '~/components/UserDashboard/modals/ProToast.vue'
import {useUserStore} from "~/stores/user.js"; // مسیرش رو تنظیم کن

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {type: String, default: '1day'},
  username: {type: String, default: 'کاربر'}
})

const filters = {
  '1day': 'روزانه',
  '7days': 'هفته',
  '30days': 'ماه',
  '90days': '۳ ماه'
}

const proKeys = ['7days', '30days', '90days']
const showToast = ref(false)

const handleClick = (key) => {
  if (isPro(key) && (!userStore || !userStore.user?.isPro)) {
    showToast.value = true
    setTimeout(() => (showToast.value = false), 3000)
  } else {
    emit('update:modelValue', key)
  }
}

const isPro = (key) => proKeys.includes(key)
const userStore = useUserStore()
</script>
