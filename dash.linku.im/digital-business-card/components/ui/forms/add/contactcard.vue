<template>
  <div class="bg-background flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-4 space-y-6 pb-20 lg:pb-4">

      <!-- Icon Upload -->
      <div class="flex items-center gap-4">
        <div class="relative w-20 h-20">
          <img 
            v-if="form.customIcon" 
            :src="form.customIcon" 
            class="w-full h-full rounded-xl object-cover cursor-pointer"
            @click="fileInputRef?.click()"
          />
          <!-- Dynamic icon component -->
          <div
            v-else-if="iconComponent && iconData?.type === 'component'"
            class="w-full h-full rounded-xl bg-muted flex items-center justify-center cursor-pointer"
            @click="fileInputRef?.click()"
          >
            <component 
              :is="iconComponent"
              :size="80"
              v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
            />
          </div>
          <!-- Fallback to image -->
          <img 
            v-else-if="safeIcon" 
            :src="safeIcon" 
            class="w-full h-full rounded-xl object-contain p-2 cursor-pointer"
            @click="fileInputRef?.click()"
          />
          <div 
            v-else 
            class="w-full h-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-2xl cursor-pointer"
            @click="fileInputRef?.click()"
          >
            <i class="ti ti-id-badge" />
          </div>
          <input 
            ref="fileInputRef"
            type="file" 
            accept="image/*" 
            class="hidden"
            @change="handleIconUpload"
          />
        </div>
        <div class="flex flex-col items-start gap-2 flex-1">
          <p class="text-sm text-primary font-medium cursor-pointer text-right" @click="fileInputRef?.click()">کلیک کنید تا آیکون تغییر کند</p>
        </div>
      </div>

      <!-- Inputs -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">عنوان کارت تماس</label>
          <input 
            v-model="form.title" 
            type="text" 
            placeholder="مثال: کارت تماس شرکت" 
            class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <!-- Toggle for description -->
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-foreground">نمایش توضیحات</label>
            <p class="text-xs text-muted-foreground mt-1">فعال‌سازی حالت لیستی با نمایش توضیحات</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="form.showDescription" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:bg-primary transition-all duration-300" />
            <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-background rounded-full transition-transform duration-300 peer-checked:translate-x-full" />
          </label>
        </div>

        <!-- Description Field (only show when enabled) -->
        <div v-if="form.showDescription">
          <label class="block text-sm font-medium text-foreground mb-1">توضیحات</label>
          <textarea 
            v-model="form.description"
            rows="3"
            placeholder="توضیحات اختیاری..."
            class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm resize-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <!-- لینک‌های قابل انتخاب -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">لینک‌های قابل انتخاب</label>
          <p class="text-xs text-muted-foreground mb-3">لینک‌هایی که در کارت تماس نمایش داده شوند را انتخاب کنید</p>
          
          <div class="border border-border rounded-lg bg-background">
            <div class="max-h-48 overflow-y-auto">
              <div
                v-for="item in profileItems"
                :key="item.id"
                class="group flex items-center justify-between py-3 px-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-all duration-200 cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center transition-colors group-hover:bg-muted/70">
                    <component :is="item.iconComponent" v-if="item.iconComponent" class="w-4 h-4 text-foreground/80 group-hover:text-foreground transition-colors" />
                    <i v-else class="ti ti-link w-4 h-4 text-muted-foreground group-hover:text-foreground/80 transition-colors" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-foreground group-hover:text-foreground/90 transition-colors">{{ item.name }}</span>
                    <span class="text-xs text-muted-foreground group-hover:text-muted-foreground/90 transition-colors">{{ getItemDescription(item) }}</span>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    v-model="item.selected" 
                    type="checkbox" 
                    class="sr-only peer" 
                    @change="toggleItemSelection(item.id)" 
                  />
                  <div class="w-11 h-6 bg-muted/70 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer-focus:ring-offset-2 rounded-full peer peer-checked:bg-primary transition-all duration-300 group-hover:bg-muted">
                    <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-background border border-border peer-checked:border-primary/80 rounded-full transition-all duration-300 peer-checked:translate-x-full peer-checked:bg-background shadow-sm group-hover:shadow-md"></div>
                  </div>
                </label>
              </div>
            </div>
            
            <div v-if="profileItems.length === 0" class="py-12 text-center">
              <div class="flex flex-col items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <i class="ti ti-link text-muted-foreground text-xl"></i>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-foreground">هیچ لینکی موجود نیست</p>
                  <p class="text-xs text-muted-foreground">ابتدا در تب لینک‌ها، لینک‌هایی اضافه کنید</p>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="selectedItemsCount > 0" class="mt-2 flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
            <i class="ti ti-info-circle w-4 h-4"></i>
            <span>{{ selectedItemsCount }} لینک انتخاب شده</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Fixed Bottom Actions -->
    <div class="border-t border-border bg-background p-4 fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto lg:left-auto lg:right-auto">
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
import { reactive, ref, computed, onMounted, watch } from 'vue';
import { useFormStore } from '~/stores/form'
import { useIconComponents } from '@/composables/useIconComponentsMap'
import {useNuxtApp} from "#app";

const props = defineProps({
  link: {
    type: Object,
    default: () => ({}) // Ensure a default value to avoid null or undefined
  },
  cardId:String
});
const {$axios} = useNuxtApp();
const emit = defineEmits({
  submit: (payload) => {
    // Optional validation for the payload
    return payload && typeof payload === 'object';
  },
  cancel: () => true
});

// دسترسی مستقیم به formStore
const formStore = useFormStore()

// استفاده از icon components composable
const { getIconComponent, getSafeIcon } = useIconComponents()

const form = reactive({
  ...props.link,
  title: props.link.title || '',
  description: props.link.description || '',
  icon: props.link.icon || { type: 'component', name: 'contactcard' },
  customIcon: props.link.customIcon || '',
  showDescription: props.link.showDescription || false
});

// Icon data and component computation using composable
const iconData = computed(() => {
  const result = form.icon || null;
  return result;
})

const iconComponent = computed(() => {
  const result = getIconComponent(iconData.value);
  return result;
})

const safeIcon = computed(() => {
  return getSafeIcon(iconData.value);
})

// Dynamic icon coloring from form store (same as LinkItem.vue)
const iconColor = computed(() => {
  // اگر کاربر رنگ انتخاب کرده، از آن استفاده کن
  if (formStore.iconColor?.background && 
      formStore.iconColor.background !== 'transparent') {
    return formStore.iconColor.background
  }
  // در غیر این صورت، undefined برگردان تا رنگ پیش‌فرض SVG استفاده شود
  return undefined
})

const isIconFilled = computed(() => {
  return !!(formStore.iconColor?.background && 
           formStore.iconColor.background !== 'transparent')
})
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
          action:link.action,
          value:link.value,
          name: link.displayName || link.title || link.name || 'بدون عنوان',
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

// Watch showDescription to clear description when disabled
watch(() => form.showDescription, (newValue) => {
  if (!newValue) {
    form.description = ''
  }
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

async function toggleItemSelection(itemId) {
  const item = profileItems.value.find(item => item.id === itemId)

  if (item) {
    selectedMap.value[itemId] = !selectedMap.value[itemId]

    const response = await $axios.patch(`v1/cards/${props.cardId}/links/${itemId}`, {enabled: selectedMap.value[itemId]});
  }
}

// توضیحات هر آیتم بر اساس نوع آن
function getItemDescription(item) {
  if (!item.originalItem) return '';
  
  const actionDescriptions = {
    'call': 'تماس تلفنی',
    'number': 'پیامک',
    'email': 'ایمیل',
    'telegram': 'تلگرام', 
    'whatsapp': 'واتساپ',
    'instagram': 'اینستاگرام',
    'website': 'وبسایت',
    'address': 'آدرس'
  };
  
  return actionDescriptions[item.originalItem.action] || 'لینک';
}

// تعداد آیتم‌های انتخاب شده
const selectedItemsCount = computed(() => {
  return Object.values(selectedMap.value).filter(Boolean).length;
});

function submitForm() {
  const selectedItems = profileItems.value.filter(i => selectedMap.value[i.id]);
  emit('submit', { ...form, selectedItems });
}

onMounted(() => {
  if (formStore && Array.isArray(formStore.links)) {
    formStore.links.forEach(link => {
      if (link.type === 'link') {
        selectedMap.value[link.id] = link.enabled === true
      }
    })
  }
})

</script>

<script>
export default {
  name: 'Contactcard',
}
</script>



