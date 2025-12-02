<template>
  <div class="bg-background rounded-xl space-y-6 w-full text-center max-h-[90vh] overflow-y-auto p-4">

    <!-- Icon Upload RTL: Icon right, text left -->
    <div class="flex flex-row items-center gap-4 mb-2 w-full justify-start rtl:justify-start">
      <div class="relative w-20 h-20 flex-shrink-0 order-1 flex items-center justify-center">
        <img
          v-if="form.customIcon"
          :src="form.customIcon"
          class="w-full h-full rounded-xl bg-muted object-cover cursor-pointer"
          @click="fileInputRef?.click()"
        >
        <div
          v-else-if="iconComponent"
          class="w-full h-full rounded-xl bg-muted flex items-center justify-center cursor-pointer"
          @click="fileInputRef?.click()"
        >
          <component 
            :is="iconComponent"
            :size="80"
            v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
          />
        </div>
        <div
          v-else
          class="w-full h-full rounded-xl bg-muted text-muted-foreground flex items-center justify-center cursor-pointer"
          @click="fileInputRef?.click()"
        >
          <i class="ti ti-egg text-4xl" />
        </div>
        <input 
          ref="fileInputRef"
          type="file" 
          accept="image/*" 
          class="hidden" 
          @change="handleIconUpload" 
        />
      </div>

      <p class="text-sm text-primary font-medium cursor-pointer order-2 flex-1 text-right" @click="fileInputRef?.click()">
        برای تغییر آیکون کلیک کنید
      </p>
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

    <!-- Description Field -->
    <div class="text-right space-y-1 mb-6">
      <div class="flex items-center gap-2 mb-2">
        <button
          type="button"
          @click="form.showDescription = !form.showDescription"
          :aria-pressed="form.showDescription"
          class="relative w-10 h-6 flex items-center rounded-full transition-colors duration-200 focus:outline-none ml-2"
          :style="{ backgroundColor: form.showDescription ? iconColor : 'rgba(156, 163, 175, 0.3)' }"
          style="min-width:40px; min-height:24px;"
        >
          <span :class="['bg-white w-4 h-4 rounded-full shadow transform transition', form.showDescription ? '-translate-x-4' : '']"></span>
        </button>
        <span class="text-xs text-muted-foreground cursor-pointer select-none">نمایش توضیحات</span>
      </div>
      <transition name="fade">
        <textarea
          v-if="form.showDescription"
          v-model="form.description"
          placeholder="توضیحات"
          class="w-full px-4 py-2 bg-muted rounded-lg border border-border text-sm text-right resize-none text-foreground"
          rows="3"
        ></textarea>
      </transition>
    </div>

    <!-- Phone Required Toggle -->
    <div class="text-right space-y-1 mb-6">
      <label class="text-sm font-medium text-foreground flex items-center gap-1 ltr:justify-end rtl:justify-start">
        آیا شماره موبایل برای این بازی فعال باشد؟
        <i class="ti ti-info-circle text-muted-foreground text-base" />
      </label>
      <button
        type="button"
        @click="form.phoneRequired = !form.phoneRequired"
        :aria-pressed="form.phoneRequired"
        class="relative w-12 h-7 flex items-center rounded-full transition-colors duration-200 focus:outline-none ml-2"
        :style="{ backgroundColor: form.phoneRequired ? iconColor : 'rgba(156, 163, 175, 0.3)' }"
        style="min-width:48px; min-height:28px;"
      >
        <span
          class="absolute left-0 top-0 w-12 h-7 rounded-full transition-colors duration-200"
          :style="{ backgroundColor: form.phoneRequired ? iconColor : 'rgba(156, 163, 175, 0.3)' }"
        ></span>
        <span
          class="absolute left-0 top-0 w-7 h-7 bg-white rounded-full shadow transform transition-transform duration-200"
          :class="form.phoneRequired ? 'translate-x-5' : ''"
        ></span>
      </button>
      <span class="text-xs text-muted-foreground cursor-pointer select-none mr-2">{{ form.phoneRequired ? 'فعال' : 'غیرفعال' }}</span>
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
                : 'border-gray-400 bg-transparent'
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
          class="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-foreground hover:text-foreground transition-colors text-sm flex items-center justify-center gap-2" @click="addReward"
        >
          <i class="ti ti-plus text-sm" />
          افزودن گزینه دیگر
        </button>
      </div>
    </div>

    <!-- Actions -->
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
import { reactive, ref, computed } from 'vue';
import { useDifficultyColors } from '~/composables/useDifficultyColors'
import { useIconComponents } from '~/composables/useIconComponentsMap'
import { useFormStore } from '~/stores/form'

const { difficultyLevels } = useDifficultyColors();
const { getIconComponent } = useIconComponents()
const formStore = useFormStore()

const props = defineProps({ 
  link: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(['submit', 'cancel', 'back', 'delete']);

const fileInputRef = ref(null);
const showDescription = ref(props.link?.showDescription);
const form = reactive({
  ...props.link,
  title: props.link?.title || '',
  description: props.link?.description || '',
  showDescription: typeof props.link?.showDescription === 'boolean' ? props.link.showDescription : false,
  icon: props.link?.icon || { name: 'luckyegg', library: 'custom', type: 'component' },
  customIcon: props.link?.customIcon || '',
  difficulty: props.link?.difficulty || 'easy',
  prizes: props.link?.prizes || [''],
  phoneRequired: typeof props.link?.phoneRequired === 'boolean' ? props.link.phoneRequired : true,
});

// Icon Management
const iconData = computed(() => form.icon || null)
const iconComponent = computed(() => getIconComponent(iconData.value))
const iconColor = computed(() => {
  if (formStore.iconColor?.background && formStore.iconColor.background !== 'transparent') {
    return formStore.iconColor.background
  }
  return undefined
})
const isIconFilled = computed(() => {
  return !!(formStore.iconColor?.background && formStore.iconColor.background !== 'transparent')
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
  const filteredPrizes = form.prizes.filter(reward => reward && reward.trim());
  
  emit('submit', { 
    ...form, 
    prizes: filteredPrizes.length > 0 ? filteredPrizes : [''],
    phoneRequired: form.phoneRequired 
  });
}
</script>

<script>
export default {
  name: 'LuckyeggEdit',
}
</script>



