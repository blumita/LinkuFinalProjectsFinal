<template>
  <div class="bg-background flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-4 space-y-6 pb-20 lg:pb-4">

      <!-- Icon Upload RTL: Icon right, text left -->
      <div class="flex flex-row items-center gap-4 mb-2 w-full justify-start rtl:justify-start">
        <div class="relative w-20 h-20 flex-shrink-0 order-1 flex items-center justify-center">
          <img v-if="form.customIcon" :src="form.customIcon"
               class="w-full h-full rounded-xl bg-muted object-cover cursor-pointer" @click="fileInput?.click()">
          <!-- Dynamic icon component (same as other forms) -->
          <div
              v-else-if="iconComponent"
              class="w-full h-full rounded-xl bg-muted flex items-center justify-center cursor-pointer"
              @click="fileInput?.click()"
          >
            <component
                :is="iconComponent"
                :size="80"
                :color="iconColor"
                :filled="isIconFilled"
            />
          </div>
          <!-- Fallback to image -->
          <img
              v-else-if="safeIcon"
              :src="safeIcon"
              class="w-full h-full rounded-xl bg-muted object-contain p-2 cursor-pointer"
              @click="fileInput?.click()"
          >
          <div v-else
               class="w-full h-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-2xl cursor-pointer"
               @click="fileInput?.click()">
            <i class="ti ti-map-pin"/>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleIconUpload">
        </div>
        <p class="text-sm text-primary font-medium cursor-pointer order-2" @click="fileInput?.click()">برای تغییر آیکون
          کلیک کنید</p>
      </div>

      <!-- Title -->
      <div class="mb-4 mt-4">
        <label class="block text-sm font-medium text-foreground mb-1">عنوان نقشه</label>
        <input
            v-model="form.title"
            type="text"
            placeholder="مثلاً آدرس دفتر یا موقعیت مکانی"
            class="w-full px-4 py-2 bg-muted rounded-lg border border-border text-sm text-foreground"
        >
      </div>

      <!-- Toggle for description -->
      <div class="flex items-center justify-between">
        <div>
          <label class="text-sm font-medium text-foreground">نمایش توضیحات</label>
          <p class="text-xs text-muted-foreground mt-1">فعال‌سازی حالت لیستی با نمایش توضیحات</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="form.showDescription" type="checkbox" class="sr-only peer" />
          <div 
            class="w-11 h-6 peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer transition-all duration-300" 
            :style="{ backgroundColor: form.showDescription ? iconColor : 'rgba(156, 163, 175, 0.3)' }"
          />
          <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-full" />
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

      <!-- Interactive Map -->
      <div class="mb-4">
        <label v-if="!locationSelected" class="block text-sm font-medium text-foreground mb-2">موقعیت روی نقشه</label>
        
        <!-- Map Preview (after location is selected) -->
        <div v-if="locationSelected" class="relative rounded-xl overflow-hidden border border-border">
          <div class="h-[140px] bg-muted">
            <ClientOnly>
              <MapboxComponent
                  :latitude="form.latitude"
                  :longitude="form.longitude"
                  :zoom="selectedMapType === 'area' ? 14 : 15"
                  :icon-color="iconColor || '#000000'"
                  :interactive="false"
                  :draggable="false"
                  :show-marker="true"
                  :show-circle="selectedMapType === 'area'"
              />
            </ClientOnly>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
          <div class="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
            <span class="text-white text-xs truncate flex-1 ml-2">{{ selectedAddressText || 'موقعیت انتخاب شده' }}</span>
            <button 
              type="button"
              @click="openMapSelector"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
              :style="{ backgroundColor: iconColor || '#000000', color: 'white' }"
            >
              <i class="ti ti-edit text-sm"></i>
              ویرایش
            </button>
          </div>
        </div>

        <!-- Map Selector (before location is selected) -->
        <ClientOnly v-if="!locationSelected">
          <MapboxComponent
              ref="mapboxRef"
              :latitude="form.latitude || 35.6992"
              :longitude="form.longitude || 51.3890"
              :zoom="form.zoom || 14"
              :icon-color="iconColor || '#000000'"
              @location-change="handleLocationChange"
              @confirm="handleMapConfirm"
          />
          <template #fallback>
            <div class="h-[100px] bg-muted rounded-lg flex items-center justify-center">
              <p class="text-sm text-muted-foreground">در حال بارگذاری...</p>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>

    <!-- Fixed Bottom Actions -->
    <div class="border-t border-border bg-background p-4 fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto lg:left-auto lg:right-auto">
      <div class="flex items-center gap-3">
        <button type="button" class="flex-1 bg-muted text-muted-foreground font-medium py-3 rounded-lg hover:bg-muted/80 transition-colors" @click="$emit('cancel')">
          انصراف
        </button>
        <button
            type="button"
            :disabled="!isFormValid"
            :class="[
          'flex-1 font-medium py-3 rounded-lg transition-colors',
          isFormValid 
            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        ]"
            @click="submitForm"
        >
          <i class="ti ti-check mr-1"/>
          ذخیره تغییرات
        </button>
      </div>
    </div>
  </div>

  <!-- BottomSheet: انتخاب نوع نمایش نقشه -->
  <BottomSheet
    v-model="showMapPreviewModal"
    title="نحوه نمایش در پروفایل"
    size="auto"
    :closable="true"
  >
    <div class="p-4 space-y-4">
      <p class="text-sm text-muted-foreground text-center">موقعیت شما چگونه در پروفایل نمایش داده شود؟</p>

      <div class="grid grid-cols-2 gap-3">
        <!-- موقعیت دقیق -->
        <div
            class="rounded-xl border-2 transition cursor-pointer overflow-hidden"
            :class="selectedMapType === 'precise' ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-border hover:border-primary/50'"
            @click="selectedMapType = 'precise'"
        >
          <div class="h-28 bg-muted relative">
            <ClientOnly>
              <MapboxComponent
                  :latitude="form.latitude"
                  :longitude="form.longitude"
                  :zoom="17"
                  :icon-color="iconColor || '#000000'"
                  :interactive="false"
                  :draggable="false"
                  :show-marker="true"
              />
            </ClientOnly>
            <div v-if="selectedMapType === 'precise'" class="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <i class="ti ti-check text-white text-sm"></i>
            </div>
          </div>
          <div class="p-2.5 text-center">
            <p class="text-sm font-medium text-foreground">موقعیت دقیق</p>
            <p class="text-xs text-muted-foreground mt-0.5">آدرس کامل نمایش داده می‌شود</p>
          </div>
        </div>

        <!-- موقعیت تقریبی -->
        <div
            class="rounded-xl border-2 transition cursor-pointer overflow-hidden"
            :class="selectedMapType === 'area' ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-border hover:border-primary/50'"
            @click="selectedMapType = 'area'"
        >
          <div class="h-28 bg-muted relative">
            <ClientOnly>
              <MapboxComponent
                  :latitude="form.latitude"
                  :longitude="form.longitude"
                  :zoom="14"
                  :icon-color="iconColor || '#000000'"
                  :interactive="false"
                  :draggable="false"
                  :show-marker="true"
                  :show-circle="true"
              />
            </ClientOnly>
            <div v-if="selectedMapType === 'area'" class="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <i class="ti ti-check text-white text-sm"></i>
            </div>
          </div>
          <div class="p-2.5 text-center">
            <p class="text-sm font-medium text-foreground">موقعیت تقریبی</p>
            <p class="text-xs text-muted-foreground mt-0.5">فقط محدوده نمایش داده می‌شود</p>
          </div>
        </div>
      </div>

      <!-- دکمه تایید -->
      <button
          :disabled="!selectedMapType"
          @click="confirmMapSelection"
          :class="[
            'w-full py-3 rounded-xl text-sm font-medium transition-colors',
            selectedMapType
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          ]"
      >
        <i class="ti ti-check ml-1"></i>
        ذخیره تغییرات
      </button>
    </div>
  </BottomSheet>

</template>

<script setup lang="ts">
import {reactive, ref, computed, watch} from 'vue'
import type {MapBlock} from '@/types/data'
import BottomSheet from '~/components/ui/BottomSheet.vue'

const {getIconComponent, getSafeIcon} = useIconComponents();

const props = defineProps<{ link?: Partial<MapBlock> }>()
const emit = defineEmits(['submit', 'cancel', 'back', 'delete'])

// Access form store for dynamic coloring
const formStore = useFormStore()
const fileInput = ref<HTMLInputElement | null>(null)
const mapboxRef = ref(null)

// States
const locationSelected = ref(false)
const selectedAddressText = ref('')
const showMapPreviewModal = ref(false)
const selectedMapType = ref<'precise' | 'area' | null>(null)

const form = reactive<MapBlock & { showDescription?: boolean }>({
  id: props.link?.id || Date.now().toString(),
  action: 'map',
  type: 'block',
  name: 'map',
  title: props.link?.title || '',
  latitude: props.link?.latitude || 35.6992,
  longitude: props.link?.longitude || 51.3890,
  address: props.link?.address || '',
  description: props.link?.description || '',
  zoom: props.link?.zoom || 15,
  icon: props.link?.icon || {type: 'component', path: 'linkumap'},
  customIcon: props.link?.customIcon || '',
  displayName: props.link?.displayName || '',
  placeholder: props.link?.placeholder || {},
  access: props.link?.access || 'free',
  showDescription: typeof props.link?.showDescription === 'boolean' ? props.link.showDescription : false,
})

// اگر لینک موجود داره، location selected رو true کن
watch(
    () => props.link,
    (val) => {
      if (val && val.latitude && val.longitude) {
        form.latitude = val.latitude
        form.longitude = val.longitude
        locationSelected.value = true
        // تنظیم نوع نقشه بر اساس zoom موجود
        if (val.zoom && val.zoom >= 16) {
          selectedMapType.value = 'precise'
        } else {
          selectedMapType.value = 'area'
        }
      }
    },
    { immediate: true, deep: true }
)

// Validation
const isFormValid = computed(() => {
  return form.latitude !== null && form.latitude !== undefined &&
      form.longitude !== null && form.longitude !== undefined &&
      form.latitude >= -90 && form.latitude <= 90 &&
      form.longitude >= -180 && form.longitude <= 180
})

// Icon Management
const iconData = computed(() => {
  return form.icon || null;
})

const iconComponent = computed(() => {
  if (!iconData.value) return null;

  if (typeof iconData.value === 'string') {
    return getIconComponent(iconData.value);
  }

  if (typeof iconData.value === 'object' && iconData.value.type === 'component') {
    // Support both 'path' and 'name' properties
    const iconName = iconData.value.path || iconData.value.name || iconData.value.url || '';
    return getIconComponent(iconName);
  }

  return null;
})

const safeIcon = computed(() => {
  return getSafeIcon(form as any);
})

const iconColor = computed(() => {
  if (formStore.iconColor?.background &&
      formStore.iconColor.background !== 'transparent') {
    return formStore.iconColor.background
  }
  return '#000000'
})

const isIconFilled = computed(() => {
  return true
})

function handleLocationChange(data: { latitude: number; longitude: number }) {
  form.latitude = data.latitude
  form.longitude = data.longitude
}

function handleMapConfirm(data: { latitude: number; longitude: number; address?: string }) {
  form.latitude = data.latitude
  form.longitude = data.longitude
  if (data.address) {
    selectedAddressText.value = data.address
  }
  locationSelected.value = true
}

function openMapSelector() {
  locationSelected.value = false
}

function handleIconUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      form.customIcon = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function submitForm() {
  if (!isFormValid.value) return
  showMapPreviewModal.value = true
}

function confirmMapSelection() {
  form.zoom = selectedMapType.value === 'precise' ? 17 : 14
  if (!form.title || !form.title.trim()) {
    form.title = 'نقشه'
  }
  // اگر showDescription خاموشه، description رو خالی کن
  if (!form.showDescription) {
    form.description = ''
  }
  showMapPreviewModal.value = false
  emit('submit', {...form})
}
</script>
