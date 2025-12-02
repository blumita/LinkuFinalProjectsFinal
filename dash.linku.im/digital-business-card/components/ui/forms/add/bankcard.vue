<template>
  <div class="bg-background flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-4 space-y-6 pb-20 lg:pb-4">
      <div class="flex flex-row items-center gap-4 mb-4 order-first">
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
      <p class="text-sm text-primary font-medium cursor-pointer" @click="fileInputRef?.click()">برای تغییر آیکون کلیک کنید</p>
    </div>
    <div class="flex flex-col gap-2 mb-6">
      <BaseInput v-model="form.title" label="عنوان کارت بانکی" placeholder="مثال: کارت پس‌انداز، کارت حقوق" />
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
                @mousedown.prevent="selectBank(bank)"
              >
                {{ bank }}
              </li>
              <li 
                :class="['px-4 py-3 cursor-pointer hover:bg-muted border-t border-border', card.bankName === '__other' && 'bg-primary text-primary-foreground hover:bg-primary']"
                @mousedown.prevent="selectBank('__other')"
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
    
        </div>

    <!-- Fixed Bottom Actions -->
    <div class="border-t border-border bg-background p-4 fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto lg:left-auto lg:right-auto">
      <div class="flex items-center gap-3">
        <button type="button" class="flex-1 bg-muted text-muted-foreground font-medium py-3 rounded-lg hover:bg-muted/80 transition-colors" @click="$emit('cancel')">
          انصراف
        </button>
        <button type="button" class="flex-1 bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors" @click="onSubmit">
          <i class="ti ti-check mr-1" />
          افزودن کارت
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed,  onMounted, onUnmounted } from 'vue';
import BaseInput from '~/components/ui/BaseInput.vue';
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
const emit = defineEmits(['submit']);

// Access form store for dynamic coloring
const formStore = useFormStore();

const banks = [ 'ملت', 'ملی', 'صادرات', 'تجارت', 'کشاورزی', 'مسکن', 'پاسارگاد', 'پارسیان', 'سامان', 'سپه', 'اقتصاد نوین', 'انصار', 'دی', 'سینا', 'شهر', 'آینده', 'ایران زمین', 'قوامین', 'رسالت', 'حکمت ایرانیان', 'گردشگری', 'کارآفرین', 'توسعه تعاون', 'توسعه صادرات', 'مهر ایران', 'صنعت و معدن', 'رفاه کارگران', 'سرمایه', 'پست بانک', 'خاورمیانه', 'ایران ونزوئلا', 'قرض الحسنه مهر', 'قرض الحسنه رسالت', 'مهر اقتصاد', 'تات', 'موسسه ملل', 'موسسه کوثر', 'موسسه نور', 'موسسه اعتباری توسعه' ];

const form = reactive({
  icon: props.link?.icon || '',
  customIcon: props.link?.customIcon || '',
  description: props.link?.description || '',
  title: props.link?.title || '',
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
  cardNumber: '',
  accountHolder: '',
  bankName: '',
  customBank: '',
  accountNumber: '',
  ibanNumber: '',
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
  
  // پاک کردن فرم
  card.cardNumber = '';
  card.accountHolder = '';
  card.bankName = '';
  card.customBank = '';
  card.accountNumber = '';
  card.ibanNumber = '';
  card.showBankDropdown = false;
  form.icon = '';
  form.customIcon = '';
  form.title = '';
  form.description = '';
}

function handleClickOutside(event: MouseEvent) {
  const dropdownContainer = document.querySelector('.relative');
  if (card.showBankDropdown && dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
    card.showBankDropdown = false;
  }
}

function selectBank(bank: string) {
  card.bankName = bank;
  if (bank === '__other') {
    card.customBank = '';
  } else {
    card.customBank = '';
  }
  card.showBankDropdown = false;
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
</script>

<style scoped>
.ltr {
  direction: ltr;
  unicode-bidi: plaintext;
}
</style>



