<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 w-full z-50 bg-card/95 backdrop-blur-lg border-b border-border safe-area-top">
      <div class="flex items-center justify-between px-3 py-2.5">
        <div class="flex items-center gap-3">
          <button
            @click="$router.back()"
            class="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
          >
            <i class="ti ti-arrow-right text-lg"></i>
          </button>
          <h1 class="text-base font-semibold text-foreground">تنظیمات حساب</h1>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="pt-14 pb-24 px-3">
      <div class="space-y-3">
        
        <!-- Username Section -->
        <div class="bg-card rounded-2xl p-4 shadow-sm border border-border/50">
          <h3 class="text-sm font-semibold text-foreground mb-3 flex items-center">
            <i class="ti ti-link text-primary text-lg ml-2"></i>
            آدرس پروفایل
          </h3>
          
          <!-- Current Link -->
          <div class="bg-muted/30 rounded-xl p-3 border border-border mb-3">
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <div class="text-xs text-muted-foreground mb-0.5">لینک فعلی:</div>
                <div class="text-sm text-foreground font-mono truncate">{{ currentFullLink }}</div>
              </div>
              <button
                @click="copyCurrentLink"
                class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors shrink-0 mr-2"
              >
                <i class="ti ti-copy text-primary text-base"></i>
              </button>
            </div>
          </div>
          
          <!-- Username Input -->
          <div>
            <label class="text-xs font-medium text-foreground mb-1.5 block">یوزرنیم جدید</label>
            <div class="flex items-center border border-border rounded-xl bg-background px-3 py-3 ltr relative">
              <span class="text-muted-foreground opacity-60 text-sm">linku.im/</span>
              <input
                type="text"
                class="bg-transparent flex-1 focus:outline-none text-foreground text-sm"
                v-model="form.username"
                placeholder="username"
                @input="validateUsername"
                maxlength="7"
              />
              <div v-if="usernameStatus" class="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2">
                <i v-if="usernameStatus === 'available'" class="ti ti-check text-green-600 text-lg"></i>
                <i v-else-if="usernameStatus === 'taken'" class="ti ti-x text-red-500 text-lg"></i>
                <i v-else-if="usernameStatus === 'checking'" class="ti ti-loader-2 text-primary animate-spin text-lg"></i>
              </div>
            </div>
            <p v-if="invalidUsername" class="text-[10px] text-red-600 mt-1">
              نام کاربری باید ۳ تا ۷ کاراکتر و فقط حروف انگلیسی و عدد باشد.
            </p>
            <p v-if="usernameStatus === 'taken'" class="text-[10px] text-red-600 mt-1">
              این نام کاربری قبلاً ثبت شده است.
            </p>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="bg-card rounded-2xl p-4 shadow-sm space-y-3 border border-border/50">
          <h3 class="text-sm font-semibold text-foreground mb-3 flex items-center">
            <i class="ti ti-address-book text-primary text-lg ml-2"></i>
            اطلاعات تماس
          </h3>
          
          <!-- Email -->
          <div class="relative">
            <input
              type="email"
              v-model="form.email"
              id="emailInput"
              placeholder=" "
              dir="ltr"
              class="peer block w-full px-3 pt-4 pb-2.5 text-sm text-foreground bg-transparent rounded-xl border-2 border-border appearance-none focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
            />
            <label
              for="emailInput"
              class="inline-flex items-center absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-[0.85] top-2 z-10 bg-background px-2 
                peer-focus:px-2 peer-focus:text-primary 
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 
                peer-focus:top-2 peer-focus:scale-[0.85] peer-focus:-translate-y-4 
                right-2 origin-top-right"
            >
              <i class="ti ti-mail w-4 h-4 ml-1.5"></i>
              <span>ایمیل</span>
            </label>
          </div>

          <!-- Phone -->
          <div>
            <!-- Country Selector -->
            <div class="relative mb-3">
              <button 
                @click="showCountryPicker = true"
                class="block px-3 pb-2.5 pt-4 w-full text-sm text-foreground bg-transparent rounded-xl border-2 border-border appearance-none focus:outline-none focus:ring-0 hover:border-primary peer transition-colors duration-200 text-right"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <img :src="`/flag/${selectedCountry.flag}.svg`" :alt="selectedCountry.nameEn" class="w-6 h-4 object-cover rounded" />
                    <span class="text-foreground">{{ selectedCountry.name }}</span>
                  </div>
                  <i class="ti ti-chevron-down text-muted-foreground"></i>
                </div>
              </button>
              <label 
                class="inline-flex items-center absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-[0.85] top-2 z-10 bg-background px-2 right-2 origin-top-right pointer-events-none"
              >
                <i class="ti ti-world w-4 h-4 ml-1.5"></i>
                <span>کشور</span>
              </label>
            </div>
            
            <!-- Phone Input -->
            <div class="relative">
              <input
                v-model="form.phone"
                @input="handlePhoneInput"
                id="phoneInput"
                type="text"
                inputmode="numeric"
                placeholder=" "
                dir="ltr"
                class="block px-3 pb-2.5 pt-4 w-full text-sm text-foreground bg-transparent rounded-xl border-2 border-border appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors duration-200 pl-12"
              />
              <label
                for="phoneInput"
                class="inline-flex items-center absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-[0.85] top-2 z-10 bg-background px-2 
                  peer-focus:px-2 peer-focus:text-primary 
                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 
                  peer-focus:top-2 peer-focus:scale-[0.85] peer-focus:-translate-y-4 
                  right-2 origin-top-right"
              >
                <i class="ti ti-phone w-4 h-4 ml-1.5"></i>
                <span>شماره موبایل</span>
              </label>
              <!-- Country Code Display Inside Input with Border -->
              <div class="absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground text-sm font-medium pointer-events-none border-r border-border pr-2 mr-2" dir="ltr">
                {{ selectedCountry.dialCode }}
              </div>
            </div>
          </div>
        </div>

        <!-- Branding Settings -->
        <div class="bg-card rounded-2xl p-4 shadow-sm border border-border/50">
          <div class="flex items-center justify-between gap-3">
            <div class="flex flex-col flex-1 min-w-0">
              <span class="text-sm font-medium text-foreground">حذف برندینگ لینکو</span>
              <span class="text-[10px] text-muted-foreground">
                حذف لوگو لینکو از حساب کاربری
              </span>
            </div>

            <label class="inline-flex relative items-center shrink-0"
                   :class="isProUser ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'">
              <input
                type="checkbox"
                class="sr-only"
                v-model="form.removeBranding"
                @change="handleBrandingChange"
              />
              <div
                class="w-10 h-5 rounded-full transition-colors duration-300 border"
                :class="form.removeBranding ? 'accent-bg border-accent' : 'bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600'"
              ></div>
              <div
                class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300"
                :class="form.removeBranding ? 'ltr:right-0.5 rtl:left-0.5' : 'ltr:right-5 rtl:left-5'"
              ></div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Bottom Buttons -->
    <div class="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div class="px-4 py-3 flex gap-3">
        <button
          @click="cancelChanges"
          class="flex-1 px-4 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-secondary transition-colors disabled:opacity-40"
          :disabled="!hasChanges"
        >
          انصراف
        </button>
        <button
          @click="saveChanges"
          class="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
          :disabled="!hasChanges || invalidUsername || isLoading"
        >
          <i v-if="isLoading" class="ti ti-loader-2 animate-spin"></i>
          {{ isLoading ? 'ذخیره...' : 'ذخیره تغییرات' }}
        </button>
      </div>
    </div>

    <!-- OTP Modal -->
    <transition name="fade">
      <div v-if="showPhoneModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click.self="closeOtpModal"></div>
        <div class="relative bg-card rounded-2xl shadow-xl p-6 w-full max-w-sm z-50 text-center space-y-5 mx-4 border border-border">
          <h2 class="text-xl font-bold text-foreground">کد تأیید</h2>
          <p class="text-sm text-muted-foreground">
            کدی که به <strong>{{ form.phone }}</strong> ارسال شده را وارد کنید.
          </p>

          <div class="flex justify-center gap-2 ltr">
            <input
              v-for="(digit, index) in otp.length"
              :key="index"
              :ref="el => otpRefs[index] = el"
              v-model="otp[index]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              pattern="[0-9]*"
              class="w-12 h-12 text-xl text-center border border-border rounded-lg font-bold text-foreground bg-background"
              dir="ltr"
              @input="handleOtpInput(index)"
              @keydown.backspace="handleBackspace(index, $event)"
            />
          </div>

          <p class="text-xs text-muted-foreground mt-2">
            {{ timer > 0 ? `مانده تا ارسال مجدد: ${formatTime(timer)}` : "ارسال مجدد فعال شد." }}
          </p>
          <p v-if="otpError" class="text-xs text-red-600">کد وارد شده نادرست است.</p>
          <p v-if="otpSuccess" class="text-xs text-green-600">شماره موبایل تأیید شد.</p>

          <div class="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              @click="closeOtpModal"
              class="w-full sm:w-auto px-4 py-2 rounded-lg border border-border text-foreground bg-background hover:bg-secondary order-2 sm:order-1"
            >
              انصراف
            </button>
            <button
              @click="submitOtp"
              class="w-full sm:w-auto px-4 py-2 rounded-lg accent-bg accent-text hover:opacity-90 order-1 sm:order-2"
            >
              تأیید
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Upgrade Modal -->
    <transition name="fade">
      <div v-if="showUpgradeModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click.self="showUpgradeModal = false"></div>
        <div class="relative bg-card rounded-2xl shadow-xl p-6 w-full max-w-md z-50 text-center space-y-5 border border-border">
          <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <i class="ti ti-crown text-2xl text-yellow-600"></i>
          </div>

          <h2 class="text-xl font-bold text-foreground">ارتقا به اشتراک پرو</h2>
          <p class="text-sm text-muted-foreground">
            برای حذف برندینگ لینکو و دسترسی به امکانات ویژه، نیاز به اشتراک پرو دارید.
          </p>

          <div class="flex flex-col gap-3 pt-2">
            <button
              @click="goToUpgrade"
              class="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              مشاهده پلان‌های اشتراک
            </button>
            <button
              @click="showUpgradeModal = false"
              class="w-full px-4 py-2 rounded-lg border border-border text-foreground bg-background hover:bg-secondary transition-colors"
            >
              بعداً
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>

    <!-- Country Picker Bottom Sheet -->
    <UiBottomSheet
      v-model="showCountryPicker"
      title="انتخاب کشور"
      size="lg"
      desktop-width="2xl"
      :closable="true"
      :close-on-backdrop="true"
    >
      <div class="px-4 pb-4">
        <!-- Search -->
        <div class="relative mb-4">
          <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"></i>
          <input
            v-model="countrySearchQuery"
            type="text"
            placeholder="جستجو کشور..."
            class="w-full pr-10 pl-4 py-3 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary"
          />
        </div>
        
        <!-- Country List -->
        <div class="max-h-[50vh] overflow-y-auto space-y-1">
          <button
            v-for="country in filteredCountries"
            :key="country.code"
            @click="country.code === 'IR' ? selectCountry(country) : null"
            :disabled="country.code !== 'IR'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
              selectedCountry.code === country.code 
                ? 'bg-primary/10 border border-primary' 
                : country.code === 'IR' 
                  ? 'hover:bg-accent cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
            ]"
          >
            <img :src="`/flag/${country.flag}.svg`" :alt="country.nameEn" class="w-7 h-5 object-cover rounded" />
            <div class="flex-1 text-right">
              <div class="text-foreground font-medium">{{ country.name }}</div>
              <div class="text-xs text-muted-foreground">{{ country.nameEn }}</div>
            </div>
            <span class="text-muted-foreground text-sm" dir="ltr">{{ country.dialCode }}</span>
            <template v-if="country.code === 'IR'">
              <i v-if="selectedCountry.code === country.code" class="ti ti-check text-primary"></i>
            </template>
            <template v-else>
              <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">به‌زودی</span>
            </template>
          </button>
        </div>
      </div>
    </UiBottomSheet>
</template>

<script setup>
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";
import { useUserStore } from "~/stores/user.js";
import { countries, defaultCountry } from '~/data/countries';

definePageMeta({
  layout: false,
  middleware: ['auth']
});

const router = useRouter();
const { $axios } = useNuxtApp();
const userStore = useUserStore();

const form = ref({
  username: "",
  email: "",
  phone: "",
  countryCode: '',
  removeBranding: false,
});

const originalForm = ref({});
const invalidUsername = ref(false);
const phoneError = ref("");
const usernameStatus = ref(null);
let debounceTimer = null;
const showPhoneModal = ref(false);
const showUpgradeModal = ref(false);
const showCountryPicker = ref(false);
const selectedCountry = ref({ ...defaultCountry });
const countrySearchQuery = ref('');
const otp = ref(["", "", "", ""]);
const otpError = ref(false);
const otpSuccess = ref(false);
const otpRefs = ref([]);
const timer = ref(120);
let timerInterval = null;
const isPhoneVerified = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const toastIcon = ref('ti-alert-triangle');
const isLoading = ref(false);

const isProUser = computed(() => userStore.user?.isPro);
const hasChanges = computed(() => {
  return (
    form.value.username !== originalForm.value.username ||
    form.value.email !== originalForm.value.email ||
    form.value.phone !== originalForm.value.phone ||
    form.value.removeBranding !== originalForm.value.removeBranding
  );
});
const currentFullLink = computed(() => `linku.im/${form.value.username || 'username'}`);
const filteredCountries = computed(() => {
  if (!countrySearchQuery.value) return countries;
  const query = countrySearchQuery.value.toLowerCase();
  return countries.filter(c => 
    c.name.includes(query) || 
    c.nameEn.toLowerCase().includes(query) ||
    c.dialCode.includes(query)
  );
});

watch(() => userStore.user, (user) => {
  if (!user) return;
  form.value.username = user.username || '';
  form.value.email = user.email || '';
  form.value.phone = user.phone || '';
  form.value.countryCode = user.countryCode || '';
  form.value.removeBranding = !!user.removeBranding;
  originalForm.value = { ...form.value };
  
  if (user.countryCode) {
    const dialCode = user.countryCode.startsWith('+') ? user.countryCode : '+' + user.countryCode;
    const country = countries.find(c => c.dialCode === dialCode);
    if (country) {
      selectedCountry.value = country;
    }
  }
}, { immediate: true });

onMounted(() => {
  originalForm.value = { ...form.value };
});

onBeforeUnmount(() => {
  clearInterval(timerInterval);
});

function toEnglishDigits(input) {
  return input.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[^\d]/g, '');
}

function toPersianDigits(str) {
  return str.replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

function formatPhoneWithSpaces(value) {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.slice(0, 11);
  const formatted = limited.replace(/(\d{3})(?=\d)/g, '$1 ');
  return toPersianDigits(formatted);
}

function selectCountry(country) {
  selectedCountry.value = country;
  form.value.countryCode = country.dialCode;
  showCountryPicker.value = false;
  countrySearchQuery.value = '';
}

function showInfoToast(message, icon = 'ti-lock') {
  toastMessage.value = message;
  toastIcon.value = icon;
  showToast.value = true;
  setTimeout(() => showToast.value = false, 3000);
}

function validateUsername() {
  form.value.username = form.value.username.replace(/[^\x00-\x7F]/g, "");

  if (form.value.username.length > 7) {
    form.value.username = form.value.username.slice(0, 7);
  }

  clearTimeout(debounceTimer);
  const username = form.value.username.trim();

  invalidUsername.value = !/^[a-zA-Z0-9]{3,7}$/.test(username);

  if (invalidUsername.value) {
    usernameStatus.value = null;
    return;
  }
  usernameStatus.value = 'checking';
  
  debounceTimer = setTimeout(async () => {
    try {
      const response = await $axios.get('user/checkUsername', {
        params: { username }
      });
      usernameStatus.value = response.data.available ? 'available' : 'taken';
    } catch (error) {
      console.error(error);
      usernameStatus.value = 'error';
    }
  }, 500);
}

function handlePhoneInput(event) {
  const cleaned = event.target.value.replace(/[^\d۰-۹\s]/g, '');
  const english = toEnglishDigits(cleaned);
  form.value.phone = formatPhoneWithSpaces(english);
}

function handleBrandingChange() {
  if (form.value.removeBranding) {
    if (isProUser.value) return;
    form.value.removeBranding = false;
    showUpgradeModal.value = true;
  }
}

function cancelChanges() {
  form.value = { ...originalForm.value };
  usernameStatus.value = null;
  invalidUsername.value = false;
  isPhoneVerified.value = false;
}

async function saveChanges() {
  isLoading.value = true;
  
  try {
    const payload = {
      username: form.value.username,
      email: form.value.email,
    };

    if (isPhoneVerified.value) {
      payload.phone = normalizePhone(form.value.phone);
    }

    payload.removeBranding = form.value.removeBranding;

    const response = await $axios.put('user/update', payload);

    originalForm.value = { ...form.value };
    usernameStatus.value = null;
    invalidUsername.value = false;
    phoneError.value = "";

    showInfoToast(response.data.message, 'ti-check');
    userStore.user.userName = form.value.username;
    userStore.user.email = form.value.email;
    userStore.user.phone = form.value.phone;

  } catch (error) {
    if (error.response && error.response.data) {
      const { message, errors } = error.response.data;

      if (errors?.username) {
        usernameStatus.value = 'taken';
        invalidUsername.value = true;
      }

      if (errors?.phone) {
        phoneError.value = errors.phone[0];
      }

      showInfoToast(message || 'خطایی در ذخیره‌سازی رخ داد.', 'ti-alert-triangle');
    } else {
      showInfoToast('خطای شبکه یا ارتباط با سرور!', 'ti-alert-triangle');
    }
  } finally {
    isLoading.value = false;
  }
}

function normalizePhone(phone) {
  if (!phone) return '';
  const cleaned = toEnglishDigits(phone.toString().trim()).replace(/\s/g, '');
  const raw = cleaned.replace(/^0/, '');
  const countryCode = selectedCountry.value.dialCode.replace('+', '');
  return countryCode + raw;
}

function goToUpgrade() {
  showUpgradeModal.value = false;
  router.push('/dashboard/upgrade');
}

function copyCurrentLink() {
  navigator.clipboard.writeText(currentFullLink.value);
  showInfoToast('لینک کپی شد', 'ti-check');
}

function closeOtpModal() {
  showPhoneModal.value = false;
  otp.value = ["", "", "", ""];
  otpError.value = false;
  otpSuccess.value = false;
  clearInterval(timerInterval);
  form.value.phone = originalForm.value.phone;
}

function handleOtpInput(index) {
  const input = otp.value[index];
  if (!/^\d$/.test(input)) {
    otp.value[index] = "";
    return;
  }
  if (index < otp.value.length - 1) {
    otpRefs.value[index + 1]?.focus();
  }
}

function handleBackspace(index) {
  if (otp.value[index] === "" && index > 0) {
    otpRefs.value[index - 1]?.focus();
  }
}

async function openOtpModal() {
  const normalized = toEnglishDigits(form.value.phone || "").replace(/\s/g, '');

  try {
    const response = await $axios.post('auth/sendOtpCode', {
      phone: normalized.replace(/^0/, ''),
      countryCode: selectedCountry.value.dialCode.replace('+', ''),
    });

    if (response.data && response.data.success === true) {
      otp.value = ["", "", "", ""];
      otpError.value = false;
      otpSuccess.value = false;
      timer.value = 120;
      showPhoneModal.value = true;
      startTimer();
      await nextTick(() => otpRefs.value[0]?.focus());
    } else {
      showInfoToast(response.data.message || 'ارسال کد با مشکل مواجه شد.', 'ti-alert-triangle');
    }

  } catch (error) {
    if (error.response?.data?.message) {
      showInfoToast(error.response.data.message, 'ti-alert-triangle');
    } else {
      showInfoToast('مشکلی در ارتباط با سرور وجود دارد.', 'ti-alert-triangle');
    }
  }
}

async function submitOtp() {
  const code = otp.value.join("");
  const phone = toEnglishDigits(form.value.phone || "").replace(/\s/g, '').replace(/^0/, '');

  try {
    const response = await $axios.post('auth/verifyPhoneChange', {
      code,
      phone,
      countryCode: selectedCountry.value.dialCode.replace('+', ''),
    });

    if (response.data?.success === true) {
      otpSuccess.value = true;
      otpError.value = false;
      showInfoToast('شماره با موفقیت تأیید شد.', 'ti-check');
      clearInterval(timerInterval);
      showPhoneModal.value = false;
      originalForm.value.phone = form.value.phone;
      isPhoneVerified.value = true;
    } else {
      otpSuccess.value = false;
      otpError.value = true;
      showInfoToast(response.data.message || 'کد وارد شده نادرست است.', 'ti-alert-triangle');
    }

  } catch (error) {
    otpSuccess.value = false;
    otpError.value = true;
    const message = error.response?.data?.message || 'خطایی در بررسی کد تأیید رخ داد.';
    showInfoToast(message, 'ti-alert-triangle');
  }
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.safe-area-top {
  padding-top: env(safe-area-inset-top, 0px);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
