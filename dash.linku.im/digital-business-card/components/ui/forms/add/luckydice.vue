<template>
  <div class="bg-background flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-4 space-y-6 pb-20 lg:pb-4">
      <!-- Icon Upload -->
      <div class="flex items-center gap-4 mb-4">
        <div class="relative w-20 h-20">
          <img v-if="form.customIcon" :src="form.customIcon" class="w-full h-full rounded-xl bg-muted object-cover cursor-pointer" @click="fileInputRef?.click()" >
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
          <component 
            :is="iconComponent" 
            v-else-if="iconComponent" 
            class="w-full h-full rounded-xl bg-muted cursor-pointer" 
            :size="80"
            v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
            @click="fileInputRef?.click()" 
          />
          <div
            v-else
            class="w-full h-full rounded-xl bg-muted flex items-center justify-center text-2xl cursor-pointer"
            @click="fileInputRef?.click()"
          >
            <component 
              :is="getIconComponent('dice')" 
              :size="40"
              v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
            />
          </div>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp,image/svg+xml"
            class="hidden" @change="handleIconUpload"
          >
        </div>
        <p class="text-sm text-primary font-medium cursor-pointer" @click="fileInputRef?.click()">
          برای تغییر آیکون کلیک کنید</p>
      </div>
    <!-- Title Field -->
    <div class="mb-4">
      <input
        v-model="form.title"
        type="text"
        placeholder="عنوان"
        class="w-full px-4 py-2 bg-muted rounded-lg border border-border text-sm text-right text-foreground"
      >
    </div>
    <!-- Description Field (toggle) -->
    <div class="flex items-center justify-between">
      <div>
        <label class="text-sm font-medium text-foreground">نمایش توضیحات</label>
        <p class="text-xs text-muted-foreground mt-1">افزودن توضیحات زیر عنوان</p>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input v-model="form.showDescription" type="checkbox" class="sr-only peer" />
        <div class="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:bg-primary transition-all duration-300" />
        <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-background rounded-full transition-transform duration-300 peer-checked:translate-x-full" />
      </label>
    </div>

    <!-- Description Field (only show when enabled) -->
    <div v-if="form.showDescription">
      <label class="block text-sm font-medium text-foreground mb-1 mt-4">توضیحات</label>
      <textarea
        v-model="form.description"
        rows="3"
        placeholder="توضیحات اختیاری..."
        class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm resize-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
    </div>

    <!-- Phone Required Toggle -->
    <div class="flex items-center justify-between">
      <div>
        <label class="text-sm font-medium text-foreground">شماره موبایل</label>
        <p class="text-xs text-muted-foreground mt-1">دریافت شماره موبایل برای شرکت در بازی</p>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input v-model="form.phoneRequired" type="checkbox" class="sr-only peer" />
        <div class="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:bg-primary transition-all duration-300" />
        <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-background rounded-full transition-transform duration-300 peer-checked:translate-x-full" />
      </label>
    </div>
    <!-- Select Chance Level -->
    <div class="text-right space-y-4" dir="rtl">
      <div class="flex items-center justify-start gap-2">
        <span class="text-foreground font-medium">سطح شانس را انتخاب کنید:</span>
        <i class="ti ti-info-circle text-muted-foreground hover:text-foreground cursor-pointer text-lg" />
      </div>

      <div class="flex justify-start gap-4">
        <div
          v-for="level in difficultyLevels"
          :key="level.value"
          :class="[
            'w-24 h-20 flex flex-col items-center justify-center rounded-xl border transition-all cursor-pointer px-3 py-2',
            form.difficulty === level.value
              ? 'text-white border-transparent'
              : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
          ]"
          :style="{
            backgroundColor: form.difficulty === level.value ? level.colorHex : undefined,
            borderColor: form.difficulty === level.value ? level.colorHex : undefined
          }"
          @click="form.difficulty = level.value"
        >
          <!-- عنوان -->
          <div class="text-sm font-semibold mb-3">{{ level.label }}</div>

          <!-- رادیو باتن -->
          <div
            :class="[
              'w-5 h-5 rounded-full border-2',
              form.difficulty === level.value
                ? 'border-white bg-white'
                : 'border-muted-foreground bg-transparent'
            ]"
          />
        </div>
      </div>
    </div>

    <!-- Reward Options -->
    <div class="text-right space-y-3 mb-6">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-foreground">
          گزینه‌های جایزه:
        </label>
        <i class="ti ti-info-circle text-muted-foreground text-base" />
      </div>
      
      <div class="space-y-3">
        <div 
          v-for="(reward, index) in form.prizes" 
          :key="index" 
          class="flex items-center gap-3"
        >
          <div class="flex-1">
            <input
              v-model="form.prizes[index]"
              type="text"
              :placeholder="`جایزه ${index + 1}`"
              class="w-full px-4 py-3 bg-muted rounded-xl border border-border text-sm text-right placeholder:text-muted-foreground text-foreground"
            >
          </div>
          <button
            v-if="form.prizes.length > 1"
            class="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" @click="removeReward(index)"
          >
            <i class="ti ti-x text-sm" />
          </button>
        </div>
        
        <button
          class="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-foreground transition-colors text-sm flex items-center justify-center gap-2" @click="addReward"
        >
          <i class="ti ti-plus text-sm" />
          افزودن گزینه دیگر
        </button>
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
import { reactive, ref, computed } from 'vue';
import { useDifficultyColors } from '~/composables/useDifficultyColors'
import { useIconComponents } from '~/composables/useIconComponentsMap'

const { getIconComponent } = useIconComponents();
const formStore = useFormStore()
const { difficultyLevels } = useDifficultyColors();

const props = defineProps({ 
  link: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(['submit']);

const fileInputRef = ref(null);
const showDescription = ref(props.link?.showDescription);

const form = reactive({
  ...props.link,
  title: props.link?.title || '',
  description: props.link?.description || '',
  showDescription: typeof props.link?.showDescription === 'boolean' ? props.link.showDescription : false,
  icon: props.link?.icon || { name: 'dice', library: 'tabler', type: 'component' },
  customIcon: props.link?.customIcon || '',
  difficulty: props.link?.difficulty || 'easy',
  prizes: props.link?.prizes || [''],
  phoneRequired: typeof props.link?.phoneRequired === 'boolean' ? props.link.phoneRequired : true,
});

// Icon Management
const iconData = computed(() => {
  return form.icon || null;
})

const iconComponent = computed(() => getIconComponent(iconData.value));
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

// Reward management functions
function addReward() {
  form.prizes.push('');
}

function removeReward(index) {
  if (form.prizes.length > 1) {
    form.prizes.splice(index, 1);
  }
}

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

function submitForm() {
  // فیلتر کردن جوایز خالی
  const filteredPrizes = form.prizes.filter(prize => prize && prize.trim());
  
  emit('submit', {
    ...form,
    prizes: filteredPrizes.length > 0 ? filteredPrizes : [''],
    phoneRequired: form.phoneRequired,
  });
}
</script>

<script>
export default {
  name: 'Luckydice',
}
</script>



