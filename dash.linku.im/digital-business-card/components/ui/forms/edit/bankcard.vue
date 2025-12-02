<template>
  <form class="bg-background rounded-xl space-y-6 w-full max-h-[90vh] overflow-y-auto p-4" @submit.prevent="onSubmit">

    <!-- Icon Upload -->
    <div class="flex flex-row items-center gap-3 w-full justify-start rtl:justify-start">
      <div class="relative w-20 h-20 flex-shrink-0 order-1">
        <img v-if="form.customIcon" :src="form.customIcon" class="w-full h-full rounded-xl bg-muted object-cover cursor-pointer" @click="fileInputRef?.click()" >
        <!-- Dynamic icon component -->
        <div
          v-else-if="iconComponent && iconData?.type === 'component'"
          class="w-full h-full rounded-xl bg-muted flex items-center justify-center cursor-pointer"
          @click="fileInputRef?.click()"
        >
          <component 
            :is="iconComponent"
            :size="50"
            v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
          />
        </div>
        <!-- Fallback to image -->
        <img 
          v-else-if="safeIcon"
          :src="safeIcon" 
          class="w-full h-full rounded-xl bg-muted object-contain p-2 cursor-pointer"
          @click="fileInputRef?.click()"
        >
        <div 
          v-else 
          class="w-full h-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-2xl cursor-pointer"
          @click="fileInputRef?.click()"
        >
          <i class="ti ti-credit-card" />
        </div>
        <input 
          ref="fileInputRef"
          type="file" 
          accept="image/*" 
          class="hidden" @change="handleIconUpload"
        >
      </div>
      <p class="text-sm text-blue-500 font-medium cursor-pointer order-2" @click="fileInputRef?.click()">برای تغییر آیکون کلیک کنید</p>
    </div>

    <!-- Form Fields -->
    <div class="space-y-4">
      <BaseInput v-model="form.title" label="عنوان کارت بانکی" placeholder="مثال: کارت پس‌انداز، کارت حقوق" required />
      <BaseInput v-model="form.description" label="توضیحات (اختیاری)" placeholder="توضیح کوتاه در مورد این کارت" />
    </div>

    <!-- Card Information -->
    <div class="border border-border rounded-lg p-4 bg-muted">
      <h3 class="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        <i class="ti ti-credit-card text-primary" />
        اطلاعات کارت بانکی
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput 
          v-model="card.cardNumber" 
          label="شماره کارت" 
          placeholder="1234123412341234" 
          required 
          pattern="[0-9]{16}" 
          maxlength="16" 
          @input="formatCardInput"
        />
        
        <BaseInput 
          v-model="card.accountHolder" 
          label="نام صاحب حساب" 
          placeholder="نام و نام خانوادگی" 
          required
        />
        
        <!-- Bank Selection -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-foreground mb-2">بانک صادرکننده *</label>
          <div class="relative">
            <button 
              type="button" 
              class="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
              @click="card.showBankDropdown = !card.showBankDropdown"
            >
              <span>{{ card.bankName ? (card.bankName === '__other' ? card.customBank || 'بانک دیگر...' : card.bankName) : 'انتخاب کنید...' }}</span>
              <i :class="['ti', card.showBankDropdown ? 'ti-chevron-up' : 'ti-chevron-down']" />
            </button>
            <ul v-if="card.showBankDropdown" class="absolute z-10 w-full bg-background border border-border rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
              <li 
                v-for="bank in banks" 
                :key="bank" 
                :class="['px-4 py-3 cursor-pointer hover:bg-muted text-foreground', card.bankName === bank && 'bg-primary text-primary-foreground hover:bg-primary']"
                @click="card.bankName = bank; card.showBankDropdown = false"
              >
                {{ bank }}
              </li>
              <li 
                :class="['px-4 py-3 cursor-pointer hover:bg-muted border-t border-border text-foreground', card.bankName === '__other' && 'bg-primary text-primary-foreground hover:bg-primary']"
                @click="card.bankName = '__other'; card.showBankDropdown = false"
              >
                بانک دیگر...
              </li>
            </ul>
          </div>
          <BaseInput 
            v-if="card.bankName === '__other'" 
            v-model="card.customBank" 
            label="نام بانک" 
            placeholder="نام بانک را وارد کنید" 
            class="mt-3"
            required
          />
        </div>
        
        <BaseInput 
          v-model="card.accountNumber" 
          label="شماره حساب (اختیاری)" 
          placeholder="1234567890123456" 
        />
        
        <BaseInput 
          v-model="card.ibanNumber" 
          label="شماره شبا (اختیاری)" 
          placeholder="IR123456789012345678901234" 
          @input="formatIbanInput"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="border-t border-border bg-background p-4">
      <div class="flex items-center gap-3">
        <button type="button" class="flex-1 bg-muted text-muted-foreground font-medium py-3 rounded-lg hover:bg-muted/80 transition-colors" @click="$emit('cancel')">
          انصراف
        </button>
        <button type="button" class="flex-1 bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors" @click="onSubmit">
          <i class="ti ti-check mr-1" />
          ذخیره
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import BaseInput from '~/components/ui/BaseInput.vue';
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue';
import { useToast } from '~/composables/useToast';
import { useIconComponents } from '~/composables/useIconComponentsMap';
import { useFormStore } from '~/stores/form';

const { error } = useToast();
const { getIconComponent, getSafeIcon } = useIconComponents();

const props = defineProps({ 
  link: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(['submit', 'cancel', 'delete', 'back']);

// Access form store for dynamic coloring
const formStore = useFormStore();

const banks = [
  'ملت', 'ملی', 'صادرات', 'تجارت', 'کشاورزی', 'مسکن', 'پاسارگاد', 'پارسیان', 'سامان', 'سپه', 'اقتصاد نوین', 'انصار', 'دی', 'سینا', 'شهر', 'آینده', 'ایران زمین', 'قوامین', 'رسالت', 'حکمت ایرانیان', 'گردشگری', 'کارآفرین', 'توسعه تعاون', 'توسعه صادرات', 'مهر ایران', 'صنعت و معدن', 'رفاه کارگران', 'سرمایه', 'پست بانک', 'خاورمیانه', 'ایران ونزوئلا', 'قرض الحسنه مهر', 'قرض الحسنه رسالت', 'مهر اقتصاد', 'تات', 'آینده', 'موسسه ملل', 'موسسه کوثر', 'موسسه نور', 'موسسه اعتباری توسعه',
];

const form = reactive({
  icon: props.link?.icon || '',
  customIcon: props.link?.customIcon || '',
  title: props.link?.title || '',
  description: props.link?.description || '',
});

// Icon data and component computation using centralized composable
const iconData = computed(() => {
  return form.icon || null;
});

const iconComponent = computed(() => {
  return getIconComponent(iconData.value);
});

// Safe icon fallback using composable
const safeIcon = computed(() => {
  return getSafeIcon(form);
});

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

const fileInputRef = ref<HTMLInputElement | null>(null);

const card = reactive({
  cardNumber: props.link?.cardNumber || '',
  accountHolder: props.link?.accountHolder || '',
  bankName: props.link?.bankName || '',
  customBank: props.link?.customBank || '',
  accountNumber: props.link?.accountNumber || '',
  ibanNumber: props.link?.ibanNumber || '',
  showBankDropdown: false,
});

function onSubmit() {
  // اعتبارسنجی شماره کارت
  const cleanedCardNumber = (card.cardNumber || '').replace(/\s+/g, '');
  if (!/^\d{16}$/.test(cleanedCardNumber)) {
    error('شماره کارت نامعتبر', 'شماره کارت باید ۱۶ رقم باشد');
    return;
  }
  
  // اعتبارسنجی بانک
  const bankName = card.bankName === '__other' ? (card.customBank || '').trim() : card.bankName;
  if (!bankName) {
    error('انتخاب بانک', 'لطفاً بانک مورد نظر را انتخاب کنید');
    return;
  }
  
  // اعتبارسنجی نام صاحب حساب
  if (!card.accountHolder.trim()) {
    error('نام صاحب حساب', 'نام صاحب حساب الزامی است');
    return;
  }
  
  // ارسال داده‌ها
  emit('submit', {
    ...card,
    action:'bankcard',
    cardNumber: cleanedCardNumber,
    bankName: bankName,
    icon: form.icon,
    customIcon: form.customIcon,
    title: form.title,
    description: form.description,
    type: 'block' // تضمین اینکه همیشه بلاک باشد
  });
}

function handleClickOutside(event: MouseEvent) {
  const dropdown = document.querySelector('.relative');
  if (card.showBankDropdown && dropdown && !dropdown.contains(event.target as Node)) {
    card.showBankDropdown = false;
  }
}
onMounted(() => {
  window.addEventListener('mousedown', handleClickOutside);
});
onUnmounted(() => {
  window.removeEventListener('mousedown', handleClickOutside);
});

function handleIconUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    form.customIcon = e.target?.result as string;
    form.icon = '';
  };
  reader.readAsDataURL(file);
}

function formatCardInput(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, ''); // فقط اعداد
  if (value.length > 16) value = value.slice(0, 16);
  card.cardNumber = value;
}

function formatIbanInput(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (value.length > 26) value = value.slice(0, 26);
  if (value.length > 2 && !value.startsWith('IR')) {
    value = 'IR' + value.slice(2);
  }
  card.ibanNumber = value;
}
</script>

<style scoped>
.ltr {
  direction: ltr;
  unicode-bidi: plaintext;
}
</style>



