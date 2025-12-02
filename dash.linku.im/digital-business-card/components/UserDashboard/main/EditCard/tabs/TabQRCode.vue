<template>
  <div class="bg-card rounded-lg border border-border shadow-sm space-y-6">
    <div v-if="!isPro"
         class="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <i class="ti ti-crown text-yellow-300 text-lg"></i>
        <span class="text-sm font-medium">برای دسترسی به تنظیمات پیشرفته، اشتراک Premium تهیه کنید</span>
      </div>
      <button
          @click="$emit('show-premium')"
          class="px-3 py-1 text-xs bg-white text-purple-600 rounded-full hover:bg-white/90 transition-all"
      >
        ارتقا به Pro
      </button>
    </div>

    <div class="flex items-center gap-2 mb-2 pb-3 border-b border-border">
      <i class="ti ti-qrcode text-blue-500 text-xl"></i>
      <h3 class="text-base font-bold text-foreground tracking-tight">تنظیمات QR کد اختصاصی</h3>
      <span class="ml-2 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">سفارشی‌سازی سریع</span>
    </div>

    <!-- رنگ QR -->
    <div class="p-4">
      <label class="block text-sm font-medium text-foreground mb-2">رنگ QR کد</label>
      <div class="flex items-center gap-3">

        <div class="flex gap-2 flex-wrap">
          <div
              v-for="presetColor in presetColors"
              :key="presetColor"
              :style="{ backgroundColor: presetColor }"
              @click="isPro ? (settings.color = presetColor) : $emit('show-premium')"
              class="lg:w-8 lg:h-8 w-6 h-6 rounded-full border border-border transition-transform flex items-center justify-center"
              :class="[
          settings.color === presetColor
            ? 'ring-2 ring-offset-1 ring-gray-500'
            : '',
          isPro
            ? 'cursor-pointer hover:scale-110 hover:shadow-sm'
            : 'cursor-not-allowed opacity-50 grayscale'
        ]"
          ></div>
        </div>
        <div class="relative">
          <div
              class="lg:w-8 lg:h-8 w-6 h-6 rounded-full border-2 border-border flex items-center justify-center relative"
              :style="{ backgroundColor: settings.color }"
              @click.stop="isPro ? toggleColorPicker('qr') : $emit('show-premium')"
              :class="isPro ? 'cursor-pointer hover:scale-110 hover:shadow-sm' : 'cursor-not-allowed opacity-60 grayscale'"
          >
            <input
                type="color"
                v-model="settings.color"
                ref="qrColorInput"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                @click.stop
                :disabled="!isPro"
            />
            <i class="ti ti-pencil text-white lg:text-lg text-base"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- پس‌زمینه QR -->
    <div>
      <label class="block text-sm font-medium text-foreground mb-2">رنگ پس‌زمینه QR</label>
      <div class="flex items-center gap-3">

        <div class="flex gap-2 flex-wrap">
          <div
              v-for="bg in backgroundColors"
              :key="bg"
              :style="{ backgroundColor: bg }"
              @click="isPro?settings.bgColor = bg:$emit('show-premium')"
              class="lg:w-8 lg:h-8 w-6 h-6 rounded-full border border-border transition-transform flex items-center justify-center"
              :class="[
                settings.bgColor === bg
                  ? 'ring-2 ring-offset-1 ring-gray-500'
                  : '',
                isPro
                  ? 'cursor-pointer hover:scale-110 hover:shadow-sm'
                  : 'cursor-not-allowed opacity-50 grayscale'
              ]"
          ></div>
        </div>
        <div class="relative">
          <div
              class="lg:w-8 lg:h-8 w-6 h-6 rounded-full border-2 border-border flex items-center justify-center cursor-pointer relative"
              :style="{ backgroundColor: settings.bgColor }"
              @click.stop="toggleColorPicker('bg')"
          >
            <input
                :disabled="!isPro"
                type="color"
                v-model="settings.bgColor"
                ref="bgColorInput"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                @click.stop
            />
            <i class="ti ti-pencil text-muted-foreground lg:text-lg text-base"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- لوگوی مرکزی -->
    <div>
      <label class="block text-sm font-medium text-foreground mb-2">لوگوی مرکزی</label>
      <div class="flex items-center gap-4">
        <div class="relative">
          <img
              :src="settings.logo"
              class="w-20 h-20 object-contain border border-border p-2 rounded-lg te"
              :style="{ borderRadius: settings.logoRadius + 'px', opacity: isPro ? 1 : 0.5 }"
              alt="لوگوی انتخابی"
          />
          <button
              v-if="settings.logo !== defaultLogo"
              @click="removeLogo"
              class="absolute -top-2 -right-2 bg-background w-6 h-6 rounded-full p-1 shadow-md hover:bg-muted transition-colors text-destructive"
          >
            <i class="ti ti-x text-xs"></i>
          </button>
        </div>
        <label
            :class="[
    'flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 transition-colors',
    isPro
      ? 'cursor-pointer border-border hover:border-primary bg-card'
      : 'cursor-not-allowed border-border bg-muted opacity-60 grayscale'
  ]"
            @click.stop="!isPro && $event.preventDefault()"
        >
          <i class="ti ti-photo-plus text-muted-foreground text-xl mb-1"></i>
          <span class="text-xs text-muted-foreground">آپلود لوگو</span>
          <input
              :disabled="!isPro"
              type="file"
              accept="image/*"
              @change="handleLogoUpload($event)"
              class="hidden"
          />
        </label>
      </div>
    </div>

    <!-- اندازه لوگو -->
<!--    <div>
      <label class="block text-sm font-medium text-foreground mb-2">اندازه لوگو (درصدی از QR کد)</label>
      <input
          :disabled="!isPro"
          type="range"
          v-model.number="settings.logoSize"
          min="10"
          max="40"
          step="1"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      >
      <div class="flex justify-between text-xs text-gray-500 mt-1">
        <span>کوچک</span>
        <span>{{ settings.logoSize }}%</span>
        <span>بزرگ</span>
      </div>
    </div>-->

    <!-- گردی لوگو -->
<!--    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">گردی لوگو (پیکسل)</label>
      <input
          :disabled="!isPro"
          type="range"
          v-model.number="settings.logoRadius"
          min="0"
          max="20"
          step="1"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      >
      <div class="flex justify-between text-xs text-gray-500 mt-1">
        <span>مربع</span>
        <span>{{ settings.logoRadius }}px</span>
        <span>گرد</span>
      </div>
    </div>-->

    <!-- دکمه‌ها -->
    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
      <button
          @click="isPro && resetSettings()"
          class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          :disabled="!isPro"
      >
        بازنشانی
      </button>
      <button
          :disabled="!isPro"
          @click="isPro && saveSettings()"
          class="px-4 py-2 rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
      >
        ذخیره تغییرات
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref, watch, getCurrentInstance} from 'vue'
import {isEqual} from '~/utils/isEqual'

const emit = defineEmits(['update:settings','show-premium'])
const userStore = useUserStore()
const isPro = computed(()=>userStore.user?.isPro)
const props = defineProps({
  initialSettings: {
    type: Object,
    default: () => ({
      color: '#000000',
      bgColor: '#ffffff',
      logo: '/logo/logo.png',
      logoSize: 30,
      logoRadius: 10
    })
  }
})

const defaultLogo = '/logo/logo.png'
const presetColors = ['#000000', '#1e40af', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
const backgroundColors = ['#ffffff', '#f3f4f6', '#e5e7eb', '#000000']


// همگام‌سازی دوطرفه با parent (اعمال سریع تغییرات)
import {watchEffect} from 'vue'
import {useUserStore} from "~/stores/user.js";

const settings = ref({...props.initialSettings})

// همگام‌سازی مقدار prop با state داخلی
watch(
    () => props.initialSettings,
    (val) => {
      if (!isEqual(settings.value, val)) {
        settings.value = {...val}
      }
    },
    {deep: true}
)

const qrColorInput = ref(null)
const bgColorInput = ref(null)

const toggleColorPicker = (type) => {
  if (type === 'qr') qrColorInput.value.click()
  else bgColorInput.value.click()
}

const handleLogoUpload = (e) => {

  const file = e.target.files[0]
  if (file?.type.match('image.*')) {
    const reader = new FileReader()
    reader.onload = (event) => {
      settings.value.logo = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeLogo = () => {
  settings.value.logo = defaultLogo
}

const resetSettings = () => {
  settings.value = {
    color: '#000000',
    bgColor: '#ffffff',
    logo: defaultLogo,
    logoSize: 30,
    logoRadius: 10
  }
}

const saveSettings = async () => {
  // ارسال تغییرات به parent component
  emit('update:settings', {...settings.value})

  // اطلاع دادن به parent برای ذخیره کامل
  const parentComponent = getCurrentInstance()?.parent
  if (parentComponent && parentComponent.exposed?.manualSave) {
    await parentComponent.exposed.manualSave()
  } else {
    // fallback: trigger save event
    const saveEvent = new CustomEvent('manual-save', {
      detail: {source: 'qr-settings'}
    })
    window.dispatchEvent(saveEvent)
  }
}

// فقط یک watcher برای ارسال تغییرات به parent
watch(
    settings,
    (newVal) => {
      emit('update:settings', {...newVal})
    },
    {deep: true}
)
</script>
