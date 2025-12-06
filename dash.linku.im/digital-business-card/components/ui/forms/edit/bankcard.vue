<template>
  <div class="bg-background flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-4 space-y-6 pb-20 lg:pb-4">

    <!-- Icon Upload -->
    <div class="flex items-center gap-4">
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
      <div class="flex flex-col items-start gap-2 flex-1">
        <p class="text-sm text-primary font-medium cursor-pointer" @click="fileInputRef?.click()">برای تغییر آیکون کلیک کنید</p>
      </div>
    </div>

    <!-- Inputs -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-foreground mb-1">عنوان کارت بانکی <span class="text-destructive">*</span></label>
        <input 
          v-model="form.title" 
          type="text" 
          placeholder="مثال: کارت پس‌انداز، کارت حقوق" 
          required
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
          <input 
            type="checkbox" 
            v-model="showDescription" 
            class="sr-only peer"
          />
          <div class="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <div v-if="showDescription">
        <label class="block text-sm font-medium text-foreground mb-1">توضیحات</label>
        <textarea
          v-model="form.description"
          placeholder="توضیح کوتاه در مورد این کارت"
          rows="3"
          class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
        ></textarea>
      </div>
    
      <!-- Card Information -->
      <div class="space-y-4 pt-2">
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">شماره کارت <span class="text-destructive">*</span></label>
          <input 
            v-model="card.cardNumber" 
            type="text"
            placeholder="1234123412341234" 
            required
            pattern="[0-9]{16}" 
            maxlength="16" 
            class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground ltr focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            @input="formatCardInput"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">نام صاحب حساب</label>
          <input 
            v-model="card.accountHolder" 
            type="text"
            placeholder="نام و نام خانوادگی" 
            class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        
        <!-- Bank Selection -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">بانک صادرکننده <span class="text-destructive">*</span></label>
          <div class="relative">
            <button 
              type="button" 
              class="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" 
              @click="card.showBankDropdown = !card.showBankDropdown"
            >
              <span>{{ card.bankName ? (card.bankName === '__other' ? card.customBank || 'بانک دیگر...' : card.bankName) : 'انتخاب کنید...' }}</span>
              <i :class="['ti', card.showBankDropdown ? 'ti-chevron-up' : 'ti-chevron-down']" />
            </button>
            <ul v-if="card.showBankDropdown" class="absolute z-10 w-full bg-background border border-border rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
              <li 
                v-for="bank in banks" 
                :key="bank" 
                :class="['px-4 py-3 cursor-pointer hover:bg-muted text-foreground text-sm', card.bankName === bank && 'bg-primary text-primary-foreground hover:bg-primary']"
                @click="card.bankName = bank; card.showBankDropdown = false"
              >
                {{ bank }}
              </li>
              <li 
                :class="['px-4 py-3 cursor-pointer hover:bg-muted border-t border-border text-sm', card.bankName === '__other' && 'bg-primary text-primary-foreground hover:bg-primary']"
                @click="card.bankName = '__other'; card.showBankDropdown = false"
              >
                بانک دیگر...
              </li>
            </ul>
          </div>
          <div v-if="card.bankName === '__other'" class="mt-3">
            <input 
              v-model="card.customBank" 
              type="text"
              placeholder="نام بانک را وارد کنید" 
              required
              class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">شماره حساب</label>
          <input 
            v-model="card.accountNumber" 
            type="text"
            placeholder="1234567890123456" 
            class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground ltr focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">شماره شبا</label>
          <input 
            v-model="card.ibanNumber" 
            type="text"
            placeholder="IR123456789012345678901234" 
            class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground ltr focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            @input="formatIbanInput"
          />
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
        <button type="button" class="flex-1 bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors" @click="onSubmit">
          <i class="ti ti-check mr-1" />
          ذخیره
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const showDescription = ref(!!(props.link?.description && props.link.description.trim()));

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
  
  // ارسال داده‌ها
  emit('submit', {
    ...card,
    action: 'bankcard',
    cardNumber: cleanedCardNumber,
    bankName: bankName,
    icon: form.icon,
    customIcon: form.customIcon,
    title: form.title,
    description: showDescription.value ? form.description : '',
    type: 'block'
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



