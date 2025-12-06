<template>
  <div class="bg-background rounded-xl space-y-6 w-full text-center max-h-[90vh] overflow-y-auto p-4">
    
    <!-- Icon Upload RTL: Icon right, text left -->
    <div class="flex flex-row items-center gap-4 mb-2 w-full justify-start rtl:justify-start">
      <div class="relative w-20 h-20 flex-shrink-0 order-1 flex items-center justify-center">
        <img v-if="form.customIcon" :src="form.customIcon" class="w-full h-full rounded-xl bg-muted object-cover cursor-pointer" @click="fileInput?.click()" >
        <component :is="iconComponent" v-else-if="iconComponent" class="w-full h-full rounded-xl bg-muted text-muted-foreground p-2 cursor-pointer" @click="fileInput?.click()" />
        <div v-else class="w-full h-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-2xl cursor-pointer" @click="fileInput?.click()">
          <i class="ti ti-poll" />
        </div>
        <input ref="fileInput" type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp,image/svg+xml" class="hidden" @change="handleIconUpload" >
      </div>
      <p class="text-sm text-blue-500 font-medium cursor-pointer order-2" @click="fileInput?.click()">برای تغییر آیکون کلیک کنید</p>
    </div>
    <div class="text-right space-y-1 mt-4">
      <label class="text-sm font-medium text-foreground flex items-center gap-1 justify-start">
        عنوان:
      </label>
      <input
        v-model="form.title"
        type="text"
        placeholder="عنوان نظرسنجی..."
        class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-right text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
      <label class="text-sm font-medium text-foreground flex items-center gap-1 justify-start mt-2">
        توضیحات:
      </label>
      <input
        v-model="form.description"
        type="text"
        placeholder="توضیح اختیاری"
        class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-right text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
      <label class="text-sm font-medium text-foreground flex items-center gap-1 justify-start mt-2">
        گزینه‌ها:
      </label>
      <div class="space-y-2">
        <div v-for="(option, idx) in form.options" :key="idx" class="flex items-center gap-2">
          <input
            v-model="form.options[idx]"
            type="text"
            :placeholder="`گزینه ${idx + 1}`"
            class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-right text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            @input="autoAddOption(idx)"
          >
          <button v-if="form.options.length > 2" type="button" @click="removeOption(idx)" class="text-destructive hover:text-destructive/80 text-lg px-2">
            <i class="ti ti-x" />
          </button>
        </div>
        <button type="button" class="text-primary hover:text-primary/80 text-sm mt-2" @click="addOption">افزودن گزینه جدید</button>
      </div>
    </div>
    <!-- Fixed Bottom Actions -->
    <div class="border-t border-border bg-background p-4">
      <div class="flex items-center gap-3">
        <button type="button" class="flex-1 bg-muted text-muted-foreground font-medium py-3 rounded-lg hover:bg-muted/80 transition-colors" @click="$emit('cancel')">
          انصراف
        </button>
        <button type="button" class="flex-1 bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors" @click="submitForm">
          <i class="ti ti-check mr-1" />
          ذخیره
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const { getIconComponent } = useIconComponents();

const props = defineProps({ link: Object })
const emit = defineEmits(['submit', 'cancel', 'delete', 'back'])

// Access form store for dynamic coloring
const formStore = useFormStore()
const form = reactive({
  title: props.link?.title || '',
  description: props.link?.description || '',
  options: Array.isArray(props.link?.options) && props.link.options.length ? [...props.link.options] : ['', ''],
  icon: props.link?.icon || '',
  customIcon: props.link?.customIcon || ''
})

// Icon Management
const iconComponent = computed(() => getIconComponent(form.icon));
const safeIcon = computed(() => iconData.value?.icon || 'ti-poll');

const fileInput = ref(null)
function handleIconUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = e => {
    form.customIcon = e.target.result
    form.icon = ''
  }
  reader.readAsDataURL(file)
}
function addOption() {
  form.options.push('')
}
function removeOption(idx) {
  if (form.options.length > 2) form.options.splice(idx, 1)
}
function autoAddOption(idx) {
  // اگر آخرین فیلد پر شد، یک گزینه جدید اضافه شود
  if (idx === form.options.length - 1 && form.options[idx].trim() !== '') {
    form.options.push('')
  }
}
function submitForm() {
  emit('submit', { ...form, options: form.options.map(v => v.trim()).filter(Boolean) })
}
</script>




