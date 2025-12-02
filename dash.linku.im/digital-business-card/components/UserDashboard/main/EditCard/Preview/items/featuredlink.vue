<template>
  <a
    :href="finalUrl"
    target="_blank"
    rel="noopener"
    class="relative flex flex-col items-center justify-end rounded-2xl shadow-2xl border-2 border-blue-400 overflow-hidden w-full h-50 mx-auto bg-gray-900"
  >
    <!-- عکس پس‌زمینه آپلود شده یا آیکون -->
    <img
      v-if="link.backgroundImage || link.customIcon || (link.icon && link.icon.path)"
      :src="link.backgroundImage || link.customIcon || link.icon.path"
      alt="background"
      class="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-2xl"
    />
    
    <!-- گرادینت مشکی از پایین به بالا برای خوانایی متن -->
    <div class="absolute inset-0 pointer-events-none rounded-2xl"
         style="background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.0) 70%);"></div>
    <!-- متن و توضیح پایین کارت -->
    <div class="relative z-10 flex flex-col items-center justify-end w-full p-4 pb-6">
      <span class="text-lg font-bold text-white drop-shadow text-center">
        {{ link.title || link.name }}
      </span>
      <span
        v-if="sanitizedDescription"
        class="text-xs text-white/80 mt-2 text-center drop-shadow"
      >
        {{ sanitizedDescription }}
      </span>
    </div>
  </a>
  <!-- حذف ActionButtons -->
</template>

<script setup>
const props = defineProps({
  link: Object,
  isListMode: Boolean
})

const sanitizedDescription = computed(() => {
  // در حالت جدولی هیچ توضیحی نمایش نده
  if (!displayMode.value) return null
  
  if (!props.link.description) return null
  const trimmed = props.link.description.trim()
  if (!trimmed || trimmed === '' || trimmed === 'description') return null
  return trimmed
})

// محاسبه حالت نمایش (true = لیست، false = جدول)
const displayMode = computed(() => {
  // ابتدا از فیلد link.isListMode استفاده کن
  if (props.link.isListMode !== undefined) {
    return props.link.isListMode
  }
  
  // در غیر این صورت از props.isListMode استفاده کن
  if (props.isListMode !== undefined) {
    return props.isListMode
  }
  
  // اگر هیچ کدام تعریف نشده، پیش‌فرض true (حالت لیست)
  return true
})

const value = props.link.value || ''
const baseUrl = props.link.baseUrl || ''
let finalUrl = value

if (baseUrl) {
  if (baseUrl.endsWith(':')) {
    finalUrl = baseUrl + value
  } else {
    finalUrl = baseUrl + value.replace(/^[@+]/, '')
  }
}
</script>
