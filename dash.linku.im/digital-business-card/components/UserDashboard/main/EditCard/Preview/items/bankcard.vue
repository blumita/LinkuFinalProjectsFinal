<template>
  <div :class="isListMode ? 'w-full' : ''">
    <a
      :class="[
        isListMode
          ? 'flex items-center gap-4 backdrop-blur rounded-xl p-2 w-full cursor-pointer ' + (formData?.layout === 'left' ? 'text-left' : 'text-right')
          : 'rounded-xl text-center p-2 flex flex-col items-center justify-center transition hover:shadow-md backdrop-blur cursor-pointer',
        isDarkTheme ? 'bg-white/[0.02]' : isLightTheme ? 'bg-black/[0.02]' : 'bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20'
      ]"
      @click.prevent="showBankCards = true"
      tabindex="0"
      role="button"
    >
      <div 
        :class="[
          isListMode ? 'flex-shrink-0 rounded-xl flex items-center overflow-hidden w-[54px] h-[54px]' : 'w-[54px] h-[54px] rounded-xl flex items-center justify-center mb-2 overflow-hidden',
          isDarkTheme || isLightTheme ? '' : 'bg-gray-100'
        ]"
        :style="{ 
          backgroundColor: iconColor && iconColor !== 'transparent' ? iconColor : (isDarkTheme || isLightTheme ? 'transparent' : '#f3f4f6')
        }"
      >
        <component 
          :is="iconComponent"
          :size="50"
          v-bind="iconColor && iconColor !== 'transparent' ? { color: iconColor, filled: isIconFilled } : {}"
        />
      </div>
      <div :class="isListMode ? 'flex flex-col justify-center flex-1 min-w-0 ' + (formData?.layout === 'left' ? 'text-left' : 'text-right') : 'w-full text-center mt-0 flex-1 flex flex-col justify-center'">
        <div :class="[
          isListMode ? 'font-bold text-[14px] leading-snug break-words ' + (formData?.layout === 'left' ? 'text-left' : 'text-right') : 'font-bold text-[15px] leading-snug text-center break-words',
          isDarkTheme ? 'text-white' : 'text-gray-800'
        ]">
          {{ dynamicTitle }}
        </div>
        <div v-if="isListMode && dynamicDescription && dynamicDescription.trim()"
             :class="[
               'text-xs font-normal mt-1 leading-relaxed whitespace-pre-line break-words ' + (formData?.layout === 'left' ? 'text-left' : 'text-right'),
               isDarkTheme ? 'text-gray-300' : 'text-gray-600'
             ]">
          {{ dynamicDescription }}
        </div>
      </div>
    </a>
    <BaseModal v-model="showBankCards">
      <template #header>
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 class="text-lg font-bold">کارت‌های بانکی</h3>
          <button @click="showBankCards = false" class="text-gray-500 hover:text-red-500 text-xl">&times;</button>
        </div>
      </template>
      <template #default>
        <div class="flex-1 overflow-y-auto text-right">
          <div v-for="(item, idx) in cards" :key="idx" class="border-b border-gray-200 mb-4 overflow-hidden">
            <!-- Header کارت -->
            <div class="p-4 border-b border-gray-200">
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center flex-shrink-0 rounded-lg w-12 h-12 border border-gray-200">
                  <component 
                    :is="iconComponent"
                    :size="24"
                    v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
                  />
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-base text-gray-800 mb-1">
                    {{ item.title || `کارت بانکی ${idx+1}` }}
                  </h4>
                  <p v-if="item.description" class="text-sm text-gray-600 leading-relaxed">
                    {{ item.description }}
                  </p>
                  <p v-if="item.bankName" class="text-sm text-blue-700 font-medium mt-1">
                    {{ item.bankName }}
                  </p>
                </div>
              </div>
            </div>

            <!-- اطلاعات کارت -->
            <div class="p-4 space-y-4">
              <!-- شماره کارت -->
              <div v-if="item.cardNumber" class="p-4 border border-gray-200">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-medium text-gray-700">شماره کارت</span>
                  <div class="flex gap-2">
                    <button 
                      @click.stop="copyToClipboard(item.cardNumber, 'شماره کارت کپی شد!', idx)" 
                      class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" 
                      title="کپی شماره کارت"
                    >
                      <i class="ti ti-copy text-lg"></i>
                    </button>
                    <button 
                      @click.stop="shareField('cardNumber', item, idx)" 
                      class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" 
                      title="اشتراک گذاری"
                    >
                      <i class="ti ti-share text-lg"></i>
                    </button>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <i class="ti ti-credit-card text-blue-600 text-lg"></i>
                  <span class="text-lg font-mono font-bold text-gray-800 ltr tracking-wider">
                    {{ formatCardNumber(item.cardNumber) }}
                  </span>
                </div>
              </div>

              <!-- شماره حساب -->
              <div v-if="item.accountNumber" class="p-4 border border-gray-200">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-medium text-gray-700">شماره حساب</span>
                  <div class="flex gap-2">
                    <button 
                      @click.stop="copyToClipboard(item.accountNumber, 'شماره حساب کپی شد!', idx)" 
                      class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" 
                      title="کپی شماره حساب"
                    >
                      <i class="ti ti-copy text-lg"></i>
                    </button>
                    <button 
                      @click.stop="shareField('accountNumber', item, idx)" 
                      class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" 
                      title="اشتراک گذاری"
                    >
                      <i class="ti ti-share text-lg"></i>
                    </button>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <i class="ti ti-building-bank text-blue-600"></i>
                  <span class="text-base font-mono text-gray-800 ltr select-text">{{ item.accountNumber }}</span>
                </div>
              </div>

              <!-- شماره شبا -->
              <div v-if="item.ibanNumber" class="p-4 border border-gray-200">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-medium text-gray-700">شماره شبا</span>
                  <div class="flex gap-2">
                    <button 
                      @click.stop="copyToClipboard(item.ibanNumber, 'شماره شبا کپی شد!', idx)" 
                      class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" 
                      title="کپی شماره شبا"
                    >
                      <i class="ti ti-copy text-lg"></i>
                    </button>
                    <button 
                      @click.stop="shareField('ibanNumber', item, idx)" 
                      class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" 
                      title="اشتراک گذاری"
                    >
                      <i class="ti ti-share text-lg"></i>
                    </button>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <i class="ti ti-receipt text-blue-600"></i>
                  <span class="text-base font-mono text-gray-800 ltr select-text">{{ item.ibanNumber }}</span>
                </div>
              </div>

              <!-- پیام موفقیت -->
              <div v-if="copiedMsg[idx]" class="border border-green-200 text-green-700 text-sm text-center p-3">
                <i class="ti ti-check-circle text-green-600 mr-1"></i>
                {{ copiedMsg[idx] }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </BaseModal>
    <!-- دکمه تکراری حذف شد -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import BaseModal from './Modals/BaseModal.vue';
import { useFormStore } from '~/stores/form';
import { useIconComponents } from '@/composables/useIconComponentsMap';
const { getIconComponent } = useIconComponents()

const props = defineProps({ 
  link: { type: [Object, Array], required: true },
  isListMode: { type: Boolean, default: false },
  formData: { type: Object, required: false },
  isDarkTheme: { type: Boolean, default: false },
  isLightTheme: { type: Boolean, default: false },
  isBackgroundDark: { type: Boolean, default: false }
})

// دسترسی به store
const formStore = useFormStore()
const formData = computed(() => props.formData || formStore)

const showBankCards = ref(false)

// محاسبه حالت نمایش بر اساس فیلد isListMode در لینک یا props
const isListMode = computed(() => {
  // ابتدا از فیلد link.isListMode استفاده کن
  const link = props.link as any;
  if (link?.isListMode !== undefined) {
    return link.isListMode
  }
  // در غیر این صورت از props.isListMode استفاده کن
  if (props.isListMode !== undefined) {
    return props.isListMode
  }
  // پیش‌فرض: حالت لیست
  return true
})

// Icon data and component logic - same as basiclink
const sanitizedLink = computed(() => {
  const link = props.link as any;
  // اگر آرایه است، اولین عنصر را برگردان
  if (Array.isArray(link) && link.length > 0) {
    return link[0] || {}
  }
  // اگر object است، خودش را برگردان
  return link || {}
})
const iconData = computed(() => sanitizedLink.value?.icon || null)

// Icon color logic - return user selected color or undefined for default SVG colors
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

// Dynamic background for icon based on selected color
const iconBackgroundClass = computed(() => {
  if (formStore.iconColor?.background === '#000000' || formStore.iconColor?.background === 'black') {
    return 'bg-black/5'
  }
  if (formStore.iconColor?.background === '#ffffff' || formStore.iconColor?.background === 'white') {
    return 'bg-gray-100/30'
  }
  return 'bg-white'
})

const iconComponent = computed(() => {
  return getIconComponent(iconData.value);
})

const cards = computed(() => {
  const link = props.link as any;
  
  if (Array.isArray(link) && link.length) return link;
  if (link && typeof link === 'object') {
    if (Array.isArray(link.cards) && link.cards.length) return link.cards;
    if (link.cardNumber) return [link];
    if (link.type === 'block' && link.action === 'bankcard') return [link];
    if (link.cards && typeof link.cards === 'object' && !Array.isArray(link.cards)) return [link.cards];
  }
  // اگر هیچ کارتی نبود، آرایه خالی برگردان
  return [];
});

const dynamicTitle = computed(() => {
  const link = props.link as any;
  // اگر title مشخص شده باشد، آن را استفاده کن
  if (link?.title) return link.title;
  // اگر اولین کارت title داشته باشد
  if (cards.value.length > 0 && cards.value[0]?.title) return cards.value[0].title;
  // عنوان پیش‌فرض
  return 'مشاهده کارت‌های بانکی';
});

const dynamicDescription = computed(() => {
  const link = props.link as any;
  // اگر description مشخص شده باشد، آن را استفاده کن
  if (link?.description) return link.description;
  // اگر اولین کارت description داشته باشد
  if (cards.value.length > 0 && cards.value[0]?.description) return cards.value[0].description;
  // توضیح پیش‌فرض
  return 'برای مشاهده و کپی اطلاعات کارت‌ها کلیک کنید';
});
const collapsed = ref(cards.value.map(() => false)) // همه کارت‌ها در ابتدا باز هستند
const openCards = ref(cards.value.map(() => false)) // برای کنترل انیمیشن
const copiedMsg = ref(cards.value.map(() => ''))

watch(cards, (val) => {
  // همگام‌سازی تعداد openCards و copiedMsg با تعداد کارت‌ها
  while (openCards.value.length < val.length) openCards.value.push(false)
  while (openCards.value.length > val.length) openCards.value.pop()
  while (copiedMsg.value.length < val.length) copiedMsg.value.push('')
  while (copiedMsg.value.length > val.length) copiedMsg.value.pop()
})

function toggleCard(idx: number) {
  openCards.value[idx] = !openCards.value[idx]
}

function formatCardNumber(num: string) {
  return (num || '').replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim()
}
function copyToClipboard(val: string, msg: string, idx: number) {
  if (!val) return;
  navigator.clipboard.writeText(val.toString()).then(() => {
    copiedMsg.value[idx] = msg;
    setTimeout(() => copiedMsg.value[idx] = '', 2000);
  });
}
function shareField(field: 'cardNumber' | 'ibanNumber' | 'accountNumber', item: any, idx: number) {
  const labels = {
    cardNumber: 'شماره کارت',
    ibanNumber: 'شماره شبا',
    accountNumber: 'شماره حساب'
  };
  
  const value = item[field];
  if (!value) return;
  
  const title = labels[field];
  const text = `${title}: ${value}`;
  
  
  // بررسی پشتیبانی از Web Share API
  if (navigator.share) {
    const shareData = {
      title: title,
      text: text
    };
    
    
    navigator.share(shareData)
      .then(() => {
        // نمایش پیام موفقیت اشتراک
        copiedMsg.value[idx] = `${title} با موفقیت اشتراک گذاری شد!`;
        setTimeout(() => copiedMsg.value[idx] = '', 3000);
      })
      .catch((error) => {
        // اگر کاربر کنسل کرد، پیام نشون نده
        if (error.name !== 'AbortError') {
          fallbackShare(text, idx, `${title} اشتراک گذاری نشد، کپی شد!`);
        }
      });
    return;
  }
  
  // اگر Web Share API پشتیبانی نشد، پیام مناسب نشون بده
  copiedMsg.value[idx] = 'متاسفانه در مرورگر شما پشتیبانی نمی‌شود';
  setTimeout(() => copiedMsg.value[idx] = '', 3000);
}

function fallbackShare(text: string, idx: number, message: string) {
  // کپی کردن در clipboard به عنوان fallback
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      copiedMsg.value[idx] = message;
      setTimeout(() => copiedMsg.value[idx] = '', 2000);
    }).catch((error) => {
    });
  } else {
    // fallback برای مرورگرهای قدیمی‌تر
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      copiedMsg.value[idx] = message;
      setTimeout(() => copiedMsg.value[idx] = '', 2000);
    } catch (error) {
    }
    document.body.removeChild(textArea);
  }
}
</script>

<style scoped>
.ltr {
  direction: ltr;
  unicode-bidi: plaintext;
}

/* انیمیشن نرم برای اسلایدی باز شدن */
.transition-all {
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

/* تنظیم حداکثر ارتفاع برای انیمیشن */
.max-h-0 {
  max-height: 0;
}

.max-h-96 {
  max-height: 24rem;
}

/* انیمیشن چرخش آیکون */
.rotate-180 {
  transform: rotate(180deg);
}

/* هاور effect برای دکمه */
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}
</style>
