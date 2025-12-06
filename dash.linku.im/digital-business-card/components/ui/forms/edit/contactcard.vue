<template>
  <div class="bg-background rounded-xl space-y-6 w-full overflow-y-auto max-h-[80vh] p-4">

    <div class="flex flex-row items-center gap-4 mb-4">
      <div class="relative w-20 h-20">
        <img 
          v-if="form.customIcon" 
          :src="form.customIcon" 
          class="w-full h-full rounded-xl bg-muted object-cover cursor-pointer"
          @click="fileInputRef?.click()"
        >
        <component 
          :is="iconComponent" v-else-if="iconComponent" 
          class="w-full h-full rounded-xl bg-muted text-muted-foreground p-2 cursor-pointer"
          @click="fileInputRef?.click()"
        />
        <div 
          v-else 
          class="w-full h-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-2xl cursor-pointer"
          @click="fileInputRef?.click()"
        >
          <i class="ti ti-layout-grid text-muted-foreground text-xl" />
        </div>
        <input 
          ref="fileInputRef"
          type="file" 
          accept="image/*" 
          class="hidden" @change="handleIconUpload"
        >
      </div>
      <p class="text-sm text-blue-500 font-medium cursor-pointer" @click="fileInputRef?.click()">برای تغییر آیکون کلیک کنید</p>
    </div>



    <!-- عنوان لینک -->
    <div>
      <label class="block text-sm font-medium text-foreground mb-1">عنوان لینک</label>
      <input
        v-model="form.title"
        type="text"
        placeholder="مثلاً: کارت تماس"
        class="w-full border border-border rounded px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
    </div>



    <!-- لینک‌های قابل انتخاب -->
    <div>
      <label class="block text-sm font-medium text-foreground mb-1">لینک‌های قابل انتخاب:</label>
      <div class="max-h-78 overflow-y-auto border border-border rounded-lg">
        <div
          v-for="item in profileItems"
          :key="item.id"
          class="flex items-center justify-between py-2 px-3 border-b border-border last:border-b-0 hover:bg-muted"
        >
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 flex items-center justify-center">
              <component :is="item.iconComponent" v-if="item.iconComponent" class="w-6 h-6 text-muted-foreground" />
              <i v-else class="ti ti-link w-6 h-6 text-muted-foreground" />
            </div>
            <span class="text-sm text-foreground">{{ item.name }}</span>
          </div>
          <label class="inline-flex items-center cursor-pointer">
            <div
              class="relative w-11 h-6 rounded-full transition-colors"
              :class="{ 'bg-primary': item.selected, 'bg-muted': !item.selected }"
              @click="toggleItemSelection(item.id)"
            >
              <div
                class="absolute top-1 left-1 w-4 h-4 bg-background rounded-full transition-all"
                :class="{ 'translate-x-5': item.selected, 'translate-x-0': !item.selected }"
               />
            </div>
          </label>
        </div>
        <div v-if="profileItems.length === 0" class="py-6 text-center text-muted-foreground text-sm">
          هیچ لینکی در تب لینک‌ها اضافه نشده است
        </div>
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
import { reactive, ref, computed,onMounted } from 'vue';
import { useFormStore } from '~/stores/form'
import { useIconComponents } from '@/composables/useIconComponentsMap'
import {useNuxtApp} from "#app";

const { getIconComponent, getSafeIcon } = useIconComponents();

const props = defineProps({
  link: {
    type: Object,
    default: () => ({}) // Ensure a default value to avoid null or undefined
  },
  cardId:String
});

const emit = defineEmits({
  submit: (payload) => {
    // Optional validation for the payload
    return payload && typeof payload === 'object';
  },
  cancel: () => true,
  back: () => true,
  delete: () => true
});

// دسترسی مستقیم به formStore
const formStore = useFormStore()
const {$axios} = useNuxtApp();
const form = reactive({
  ...props.link,
  title: props.link.title || '',
  description: props.link.description || '',
  icon: props.link.icon || '',
  customIcon: props.link.customIcon || ''
});

// Icon Management
const iconComponent = computed(() => getIconComponent(form.icon));
const selectedMap = ref({}) // key: itemId, value: true/false
// لینک‌های از تب لینک‌ها (real-time)
const profileItems = computed(() => {
  const items = []
  
  // گرفتن لینک‌ها از formStore.links
  if (formStore && formStore.links && Array.isArray(formStore.links)) {
    formStore.links.forEach(link => {
      // فقط لینک‌ها (نه بلاک‌ها)
      if (link.type === 'link') {
        // استفاده از composable برای آیکون
        const linkIconData = getSafeIcon(link.icon);
        const linkIconComponent = getIconComponent(link.icon);
        
        items.push({
          id: link.id,
          name: link.displayName || link.title || link.name || 'بدون عنوان',
          action:link.action,
          value:link.value,
          iconComponent: linkIconComponent,
          iconData: linkIconData,
          selected: selectedMap.value[link.id] ?? link.enabled === true, // اگر در تب لینک‌ها فعال باشد، اینجا هم انتخاب شود
          originalItem: link
        })
      }
    })
  }
  
  return items
})

const fileInputRef = ref(null);

function handleIconUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      form.customIcon = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function toggleItemSelection(itemId) {
  // فقط selectedMap رو تغییر بده - ذخیره واقعی موقع submit انجام میشه
  selectedMap.value[itemId] = !selectedMap.value[itemId]
}

function submitForm() {
  // فقط آیتم‌های انتخاب شده رو بگیر و اطلاعات کامل اون‌ها رو ارسال کن
  const selectedItems = profileItems.value
    .filter(i => selectedMap.value[i.id])
    .map(i => ({
      id: i.originalItem.id,
      action: i.originalItem.action,
      value: i.originalItem.value,
      name: i.name,
      originalItem: i.originalItem
    }));
  
  emit('submit', { ...form, selectedItems, action: 'contactcard' });
}

onMounted(() => {
  // اگر در حال ویرایش هستیم و selectedItems داریم، از اون استفاده کن
  if (props.link?.selectedItems && Array.isArray(props.link.selectedItems)) {
    props.link.selectedItems.forEach(item => {
      if (item.id) {
        selectedMap.value[item.id] = true
      }
    })
  } else {
    // اگر selectedItems نداریم، از enabled status لینک‌ها استفاده کن
    if (formStore && Array.isArray(formStore.links)) {
      formStore.links.forEach(link => {
        if (link.type === 'link' && link.enabled === true) {
          selectedMap.value[link.id] = true
        }
      })
    }
  }
})

</script>

<script>
export default {
  name: 'Contactcard',
}
</script>



