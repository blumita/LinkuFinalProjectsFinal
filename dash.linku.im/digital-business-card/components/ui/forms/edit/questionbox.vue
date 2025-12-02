<template>
  <div class="bg-background rounded-xl space-y-6 w-full p-4">
    
    <!-- Icon Upload RTL: Icon right, text left -->
    <div class="flex flex-row items-center gap-4 w-full justify-start rtl:justify-start mb-2">
      <div class="relative w-20 h-20 flex-shrink-0 order-1 flex items-center justify-center">
        <img v-if="form.customIcon" :src="form.customIcon" class="w-full h-full rounded-xl bg-muted object-cover cursor-pointer" @click="fileInput?.click()" >
        <component :is="iconComponent" v-else-if="iconComponent" class="w-full h-full rounded-xl bg-muted text-muted-foreground p-2 cursor-pointer" @click="fileInput?.click()" />
        <div v-else class="w-full h-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-2xl cursor-pointer" @click="fileInput?.click()">
          <i class="ti ti-question-mark" />
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleIconUpload" >
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
        placeholder="عنوان سوال..."
        class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-right text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
      <!-- نام و نام خانوادگی -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-1">نام و نام خانوادگی</label>
        <input
            v-model="form.fullName"
            type="text"
            placeholder="مثلاً علی رضایی"
            class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
      </div>

      <!-- شماره موبایل -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-1">شماره موبایل</label>
        <input
            v-model="form.phoneNumber"
            type="tel"
            placeholder="مثلاً 09123456789"
            class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
      </div>
      <label class="text-sm font-medium text-foreground flex items-center gap-1 justify-start mt-2">
        توضیح:
      </label>
      <input
        v-model="form.description"
        type="text"
        placeholder="توضیح..."
        class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-right text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
    </div>
    <!-- Fixed Bottom Actions -->
    <div class="border-t border-border bg-background p-4">
      <div class="flex items-center gap-3">
        <button type="button" class="flex-1 bg-muted text-muted-foreground font-medium py-3 rounded-lg hover:bg-muted/80 transition-colors" @click="$emit('cancel')">
          انصراف
        </button>
        <button type="button" class="flex-1 bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors" @click="$emit('submit', form)">
          <i class="ti ti-check mr-1" />
          ذخیره
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'

const { getIconComponent } = useIconComponents();

const props = defineProps(['link'])
const emit = defineEmits(['submit', 'cancel', 'delete', 'back'])

// Access form store for dynamic coloring
const formStore = useFormStore()

const form = reactive({
  fullName:props.link?.fullName??'',
  phoneNumber:props.link?.phoneNumber??'',
  title: props.link?.title??'',
  description: props.link?.description??'',
  icon: props.link?.icon??'',
  customIcon: props.link?.customIcon??''
})

// Icon Management
const iconComponent = computed(() => getIconComponent(form.icon));
const safeIcon = computed(() => iconData.value?.icon || 'ti-question-mark');

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
</script>




