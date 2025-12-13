<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-primary flex items-center gap-2 justify-center">
      <i class="ti ti-settings text-3xl text-primary"></i>
      تنظیمات حساب کاربری
    </h2>

    <!-- لینک به وضعیت حساب -->
    <NuxtLink
        to="/settings/account-status"
        class="block bg-secondary rounded-xl p-5 border border-border hover:border-accent transition-all group"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <i class="ti ti-dashboard text-2xl text-primary"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-primary">وضعیت حساب</h3>
            <p class="text-sm text-primary opacity-60 mt-0.5">مشاهده پیشرفت و چک‌لیست کامل شدن پروفایل</p>
          </div>
        </div>
        <i class="ti ti-chevron-left text-xl text-primary group-hover:translate-x-1 transition-transform"></i>
      </div>
    </NuxtLink>

    <!-- وضعیت حساب -->
    <div class="bg-secondary rounded-xl p-6 border border-border">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-primary">وضعیت حساب</h3>
        <div v-if="isProUser" class="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">
          <i class="ti ti-crown text-base"></i>
          اشتراک پرو
        </div>
        <div v-else class="flex items-center gap-2 bg-primary text-primary px-4 py-1.5 rounded-full text-sm font-medium border border-border">
          <i class="ti ti-user text-base"></i>
          کاربر عادی
        </div>
      </div>
      
      <div class="space-y-3">
        <div class="flex items-center justify-between text-sm">
          <span class="text-primary opacity-70">نام کاربری</span>
          <span class="text-primary font-medium">{{ form.username || 'تنظیم نشده' }}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-primary opacity-70">شماره موبایل</span>
          <span class="text-primary font-medium ltr">{{ form.phone || 'تنظیم نشده' }}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-primary opacity-70">ایمیل</span>
          <span class="text-primary font-medium ltr">{{ form.email || 'تنظیم نشده' }}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-primary opacity-70">تعداد کارت‌ها</span>
          <span class="text-primary font-medium">{{ userStore.cards?.length || 0 }} کارت</span>
        </div>
      </div>

      <button
          v-if="!isProUser"
          @click="goToUpgrade"
          class="w-full mt-4 px-4 py-3 rounded-lg accent-bg accent-text font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        <i class="ti ti-rocket text-base"></i>
        ارتقا به اشتراک پرو
      </button>
    </div>

    <!-- آدرس پروفایل فعال (slug کارت) -->
    <div>
      <label class="text-sm font-medium text-primary mb-1 block flex items-center gap-2">
        <span>آدرس پروفایل فعال</span>
        <span v-if="activeCard?.name" class="text-xs text-primary opacity-60">({{ activeCard.name }})</span>
      </label>
      <div class="flex items-center border border-border rounded-lg bg-primary px-4 py-3 ltr relative">
        <span class="text-primary opacity-60">linku.im/</span>
        <input
            type="text"
            class="bg-transparent flex-1 focus:outline-none text-primary"
            v-model="form.slug"
            placeholder="slug"
            @input="validateSlug"
            maxlength="7"
        />
        <div v-if="slugStatus" class="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2">
          <i v-if="slugStatus === 'available'" class="ti ti-check text-green-600 text-xl"></i>
          <i v-else-if="slugStatus === 'taken'" class="ti ti-x text-red-500 text-xl"></i>
          <i v-else-if="slugStatus === 'checking'" class="ti ti-loader-2 text-primary animate-spin text-xl"></i>
        </div>
      </div>
      <p v-if="invalidSlug" class="text-xs text-red-600 mt-1">
        آدرس پروفایل باید حداقل ۳ کاراکتر و حداکثر ۷ کاراکتر و فقط شامل حروف انگلیسی و عدد باشد.
      </p>
      <p v-if="slugStatus === 'taken'" class="text-xs text-red-600 mt-1">
        این آدرس قبلاً ثبت شده است.
      </p>
    </div>

    <!-- ایمیل -->
    <div>
      <label class="text-sm font-medium text-primary mb-1 block">ایمیل</label>
      <input
          type="email"
          class="w-full border border-border rounded-lg px-4 py-3 focus:outline-none bg-primary text-primary"
          v-model="form.email"
          @input="form.email = form.email.replace(/[^\x00-\x7F]/g, '')"
          placeholder=""
      />
    </div>

    <!-- شماره موبایل -->
    <div>
      <label class="text-sm font-medium text-primary mb-1 block">شماره موبایل</label>
      <div class="flex gap-2">

        <input
            type="tel"
            class="flex-1 border border-border rounded-lg px-4 py-3 focus:outline-none bg-primary text-primary"
            v-model="form.phone"
            @input="handlePhoneInput"
            placeholder=""
        />
        <input
            type="text"
            class="ltr w-24 border border-border rounded-lg px-3 py-3 focus:outline-none bg-primary text-primary text-center"
            v-model="form.countryCode"
            placeholder="+98"
        />
      </div>

      <p v-if="phoneError" class="text-xs text-red-600 mt-1">{{ phoneError }}</p>
      <p v-else-if="form.phone !== originalForm.phone" class="text-xs text-red-600 mt-1">
        برای تغییر شماره موبایل نیاز به احراز هویت مجدد دارید.
      </p>
      <p v-else class="text-xs text-primary opacity-60 mt-1">
        در صورت تغییر شماره موبایل، نیاز به احراز هویت مجدد دارید.
      </p>
    </div>


    <!-- تنظیمات حذف برندینگ -->
    <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 rounded-lg bg-secondary border border-border gap-4">
      <div class="flex flex-col">
        <span class="text-sm font-medium text-primary">حذف برندینگ لینکو</span>
        <span class="text-xs text-primary opacity-60 max-w-sm">
          حذف لوگو لینکو و سایر برندینگ‌های لینکو از حساب کاربری
        </span>
      </div>

      <label class="inline-flex relative items-center cursor-pointer shrink-0"
             :class="isProUser ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'">
        <input
            type="checkbox"
            class="sr-only"
            v-model="form.removeBranding"
            @change="handleBrandingChange"
        />
        <div
            class="w-11 h-6 rounded-full transition-colors duration-300 border"
            :class="form.removeBranding ? 'accent-bg border-accent' : 'bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600'"
        ></div>
        <div
            class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300"
            :class="form.removeBranding ? 'ltr:right-0.5 rtl:left-0.5' : 'ltr:right-5 rtl:left-5'"
        ></div>
      </label>
    </div>

    <!-- دکمه‌های ذخیره و انصراف -->
    <div class="flex flex-col sm:flex-row justify-end gap-3">
      <button
          @click="cancelChanges"
          class="w-full sm:w-auto px-4 py-2 rounded-lg border border-border text-primary hover:bg-secondary order-2 sm:order-1"
          :disabled="!hasChanges"
      >
        انصراف
      </button>
      <button
          @click="saveChanges"
          class="w-full sm:w-auto px-4 py-2 rounded-lg accent-bg accent-text hover:opacity-90 order-1 sm:order-2"
          :disabled="!hasChanges || invalidUsername"
      >
        ذخیره
      </button>
    </div>

    <!-- مدال OTP -->
    <transition name="fade">
      <div v-if="showPhoneModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click.self="closeOtpModal"></div>
        <div class="relative bg-secondary rounded-2xl shadow-xl p-6 w-full max-w-sm z-50 text-center space-y-5 mx-4 border border-border">
          <h2 class="text-xl font-bold text-primary">کد تأیید</h2>
          <p class="text-sm text-primary opacity-70">
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
                class="w-12 h-12 text-xl text-center border border-border rounded-lg font-bold text-primary bg-primary"
                dir="ltr"
                @input="handleOtpInput(index)"
                @keydown.backspace="handleBackspace(index, $event)"
            />
          </div>

          <p class="text-xs text-primary opacity-60 mt-2">
            {{ timer > 0 ? `مانده تا ارسال مجدد: ${formatTime(timer)}` : "ارسال مجدد فعال شد." }}
          </p>
          <p v-if="otpError" class="text-xs text-red-600">کد وارد شده نادرست است.</p>
          <p v-if="otpSuccess" class="text-xs text-green-600">شماره موبایل تأیید شد.</p>

          <div class="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
                @click="closeOtpModal"
                class="w-full sm:w-auto px-4 py-2 rounded-lg border border-border text-primary bg-primary hover:bg-secondary order-2 sm:order-1"
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

    <!-- مدال ارتقا اشتراک -->
    <transition name="fade">
      <div v-if="showUpgradeModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click.self="showUpgradeModal = false"></div>
        <div class="relative bg-secondary rounded-2xl shadow-xl p-6 w-full max-w-md z-50 text-center space-y-5 border border-border">
          <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <i class="ti ti-crown text-2xl text-yellow-600"></i>
          </div>

          <h2 class="text-xl font-bold text-primary">ارتقا به اشتراک پرو</h2>
          <p class="text-sm text-primary opacity-70">
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
                class="w-full px-4 py-2 rounded-lg border border-border text-primary bg-primary hover:bg-secondary transition-colors"
            >
              بعداً
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
</template>

<script>
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";
import {useUserStore} from "~/stores/user.js";
import {useFormStore} from "~/stores/form";

export default {
  name: "AccountSettings",
  components: {InfoToast},
  data() {
    return {
      form: {
        username: "",
        slug: "", // slug کارت فعال
        email: "",
        phone: "",
        countryCode:'',
        removeBranding: false,
      },
      originalForm: {},
      invalidUsername: false,
      invalidSlug: false,
      phoneError: "",
      usernameStatus: null,
      slugStatus: null,
      debounceTimer: null,
      slugDebounceTimer: null,
      showPhoneModal: false,
      showUpgradeModal: false,
      otp: ["", "", "", ""],
      otpError: false,
      otpSuccess: false,
      otpRefs: [],
      timer: 120,
      timerInterval: null,
      takenUsernames: ["admin", "rezaaaaa", "testuser"],
      isPhoneVerified: false,
      showToast: false,
      toastMessage: '',
      toastIcon: 'ti-alert-triangle',
    };
  },
  created() {
    watch(
        () => this.userStore.user,
        (user) => {
          if (!user) return;
          this.form.username = user.username || '';
          //this.form.email = user.email || '';
          this.form.phone = user.phone || '';
          this.form.countryCode=user.countryCode||'';
          this.form.removeBranding = !!user.removeBranding;
          this.originalForm = {...this.form};
        },
        {immediate: true}
    );
    // Watch برای slug کارت فعال
    watch(
        () => this.formStore.defaultCard,
        (card) => {
          if (card) {
            this.form.slug = card.slug || '';
            this.originalForm.slug = card.slug || '';
          }
        },
        {immediate: true}
    );
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    formStore() {
      return useFormStore();
    },
    activeCard() {
      return this.formStore.defaultCard;
    },
    isProUser() {
      return this.userStore.user?.isPro;
    },
    hasChanges() {
      return (
          this.form.username !== this.originalForm.username ||
          this.form.slug !== this.originalForm.slug ||
          this.form.email !== this.originalForm.email ||
          this.form.phone !== this.originalForm.phone ||
          this.form.removeBranding !== this.originalForm.removeBranding
      );
    },
  },
  mounted() {
    this.originalForm = {...this.form};
  },
  beforeUnmount() {
    clearInterval(this.timerInterval);
  },
  methods: {
    toEnglishDigits(input) {
      return input.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[^\d]/g, '');
    },
    showInfoToast(message, icon = 'ti-lock') {
      this.toastMessage = message;
      this.toastIcon = icon;
      this.showToast = true;
      setTimeout(() => this.showToast = false, 3000);
    },
    validateUsername() {
      const {$axios} = useNuxtApp();
      this.form.username = this.form.username.replace(/[^\x00-\x7F]/g, "");

      // محدود کردن به 7 کاراکتر
      if (this.form.username.length > 7) {
        this.form.username = this.form.username.slice(0, 7);
      }

      clearTimeout(this.debounceTimer);
      const username = this.form.username.trim();

      // تغییر validation: حداقل 3 و حداکثر 7 کاراکتر
      this.invalidUsername = !/^[a-zA-Z0-9]{3,7}$/.test(username);

      if (this.invalidUsername) {
        this.usernameStatus = null;
        return;
      }
      this.usernameStatus = 'checking';
      // debounce برای جلوگیری از درخواست‌های مکرر
      this.debounceTimer = setTimeout(async () => {
        try {
          const response = await $axios.get('user/checkUsername', {
            params: {username}
          });

          // سرور پاسخ داده: available = true یا false
          this.usernameStatus = response.data.available ? 'available' : 'taken';
        } catch (error) {
          this.usernameStatus = 'error';
        }
      }, 500);
    },
    validateSlug() {
      const {$axios} = useNuxtApp();
      this.form.slug = this.form.slug.replace(/[^\x00-\x7F]/g, "").toLowerCase();

      // محدود کردن به 7 کاراکتر
      if (this.form.slug.length > 7) {
        this.form.slug = this.form.slug.slice(0, 7);
      }

      clearTimeout(this.slugDebounceTimer);
      const slug = this.form.slug.trim();

      // تغییر validation: حداقل 3 و حداکثر 7 کاراکتر
      this.invalidSlug = !/^[a-zA-Z0-9]{3,7}$/.test(slug);

      if (this.invalidSlug) {
        this.slugStatus = null;
        return;
      }
      
      // اگر slug تغییر نکرده
      if (slug === this.originalForm.slug) {
        this.slugStatus = null;
        return;
      }
      
      this.slugStatus = 'checking';
      // debounce برای جلوگیری از درخواست‌های مکرر
      this.slugDebounceTimer = setTimeout(async () => {
        try {
          const response = await $axios.get('cards/checkSlug', {
            params: {slug}
          });

          // سرور پاسخ داده: available = true یا false
          this.slugStatus = response.data.available ? 'available' : 'taken';
        } catch (error) {
          this.slugStatus = 'error';
        }
      }, 500);
    },
    handlePhoneInput(event) {
      const cleaned = event.target.value.replace(/[^\d۰-۹]/g, '');
      const english = cleaned.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
      this.form.phone = english.slice(0, 11);
    },
    handleBrandingChange() {

      // اگر کاربر سوییچ رو روشن کرد، مدال نمایش بده
      if (this.form.removeBranding) {
        if (this.isProUser) {
          return
        }
        // بازگردوندن سوییچ به حالت قبلی
        this.form.removeBranding = false

        // نمایش مدال برای خرید اشتراک
        this.showUpgradeModal = true
      }
    },
    cancelChanges() {
      this.form = {...this.originalForm};
      this.usernameStatus = null;
      this.slugStatus = null;
      this.invalidUsername = false;
      this.invalidSlug = false;
      this.isPhoneVerified = false;
    },
    async saveChanges() {
      const {$axios} = useNuxtApp()
      try {
        // 1. ذخیره تنظیمات کاربر
        const payload = {
          username: this.form.username,
          email: this.form.email,
        };

        if (this.isPhoneVerified) {
          payload.phone = this.normalizePhone(this.form.phone);
        }

        payload.removeBranding = this.form.removeBranding;

        const response = await $axios.put('user/update', payload);
        
        // 2. اگر slug تغییر کرده، کارت رو هم آپدیت کن
        if (this.form.slug !== this.originalForm.slug && this.activeCard) {
          await $axios.put(`cards/${this.activeCard.id}/update`, {
            slug: this.form.slug
          });
        }

        this.originalForm = {...this.form};
        this.usernameStatus = null;
        this.slugStatus = null;
        this.invalidUsername = false;
        this.invalidSlug = false;
        this.phoneError = "";

        this.showInfoToast(response.data.message, 'ti-check');
        
        // بروزرسانی کامل userStore برای نمایش real-time در داشبورد
        await this.userStore.fetchUser();

      } catch (error) {
        if (error.response && error.response.data) {
          const {message, errors} = error.response.data;

          if (errors?.username) {
            this.usernameStatus = 'taken';
            this.invalidUsername = true;
          }

          if (errors?.phone) {
            this.phoneError = errors.phone[0];
          }

          this.showInfoToast(message || 'خطایی در ذخیره‌سازی رخ داد.', 'ti-alert-triangle');
        } else {

          this.showInfoToast('خطای شبکه یا ارتباط با سرور!', 'ti-alert-triangle');
        }
      }
    },
    normalizePhone(phone) {
      if (!phone) return '';
      const raw = phone.toString().trim().replace(/^0/, '');
      return '98' + raw;
    },
    goToUpgrade() {
      this.showUpgradeModal = false
      this.$router.push('/dashboard/upgrade')
    },
    closeOtpModal() {
      this.showPhoneModal = false;
      this.otp = ["", "", "", ""];
      this.otpError = false;
      this.otpSuccess = false;
      clearInterval(this.timerInterval);
      this.form.phone = this.originalForm.phone;
    },
    handleOtpInput(index) {
      const input = this.otp[index];
      if (!/^\d$/.test(input)) {
        this.otp[index] = "";
        return;
      }
      if (index < this.otp.length - 1) {
        this.otpRefs[index + 1]?.focus();
      }
    },
    handleBackspace(index) {
      if (this.otp[index] === "" && index > 0) {
        this.otpRefs[index - 1]?.focus();
      }
    },
    async openOtpModal() {
      const {$axios} = useNuxtApp()
      const normalized = this.toEnglishDigits(this.form.phone || "");

      try {
        const response = await $axios.post('auth/sendOtpCode', {
          phone: normalized.replace(/^0/, ''), // حذف صفر اول
          countryCode: '98',
        });

        if (response.data && response.data.success === true) {
          this.otp = ["", "", "", ""];
          this.otpError = false;
          this.otpSuccess = false;
          this.timer = 120;
          this.showPhoneModal = true;
          this.startTimer();
          await this.$nextTick(() => this.otpRefs[0]?.focus());
        } else {
          this.showInfoToast(response.data.message || 'ارسال کد با مشکل مواجه شد.', 'ti-alert-triangle');
        }

      } catch (error) {
        if (error.response?.data?.message) {
          this.showInfoToast(error.response.data.message, 'ti-alert-triangle');
        } else {
          this.showInfoToast('مشکلی در ارتباط با سرور وجود دارد.', 'ti-alert-triangle');
        }
      }
    },
    async submitOtp() {
      const {$axios} = useNuxtApp();
      const code = this.otp.join("");
      const phone = this.toEnglishDigits(this.form.phone || "").replace(/^0/, '');

      try {
        const response = await $axios.post('auth/verifyPhoneChange', {
          code,
          phone,
          countryCode: '98',
        });

        if (response.data?.success === true) {
          this.otpSuccess = true;
          this.otpError = false;
          this.showInfoToast('شماره با موفقیت تأیید شد.', 'ti-check');
          clearInterval(this.timerInterval);
          this.showPhoneModal = false;
          this.originalForm.phone = this.form.phone;
          this.isPhoneVerified = true;
        } else {
          this.otpSuccess = false;
          this.otpError = true;
          this.showInfoToast(response.data.message || 'کد وارد شده نادرست است.', 'ti-alert-triangle');
        }

      } catch (error) {
        this.otpSuccess = false;
        this.otpError = true;
        const message = error.response?.data?.message || 'خطایی در بررسی کد تأیید رخ داد.';
        this.showInfoToast(message, 'ti-alert-triangle');
      }
    },
    startTimer() {
      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(this.timerInterval);
        }
      }, 1000);
    },
    formatTime(seconds) {
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    },
  },
};
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
</style>
