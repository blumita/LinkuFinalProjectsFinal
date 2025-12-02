<template>
  <div>
    <!-- برند -->
    <div class="mb-10 text-center">
      <h1 class="text-2xl font-bold text-primary">لینکولاین</h1>
      <p class="text-primary opacity-60 text-sm mt-1">همیشه به وقت، همه‌جا در کنار شما هستیم</p>
    </div>

    <!-- گرید گزینه‌های پشتیبانی -->
    <div class="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mb-12 bg-secondary rounded-2xl shadow-sm border border-border px-8 py-10 text-right">
      <!-- سوالات متداول -->
      <NuxtLink
        to="/dashboard/support/faq"
        class="flex justify-between items-center border border-border rounded-md p-4 hover:bg-primary transition group"
      >
        <div class="flex items-center gap-3 text-primary">
          <i class="ti ti-help text-xl text-primary group-hover:text-accent"></i>
          <span class="font-medium">سوالات متداول</span>
        </div>
        <span class="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">جدید!</span>
      </NuxtLink>

      <!-- گفتگوی آنلاین -->
      <NuxtLink
        to="/dashboard/support/chat"
        class="flex items-center justify-between border border-border rounded-md p-4 hover:bg-primary transition group"
      >
        <div class="flex items-center gap-3 text-primary">
          <i class="ti ti-message-circle text-xl text-primary group-hover:text-accent"></i>
          <span class="font-medium">گفتگوی آنلاین</span>
        </div>
      </NuxtLink>

      <!-- تماس تلفنی -->
      <a
        href="tel:+989123456789"
        class="flex items-center justify-between border border-border rounded-md p-4 hover:bg-primary transition group"
      >
        <div class="flex items-center gap-3 text-primary">
          <i class="ti ti-phone-call text-xl text-primary group-hover:text-accent"></i>
          <span class="font-medium">تماس تلفنی</span>
        </div>
      </a>
    </div>

    <!-- فرم تماس با پشتیبانی -->
    <div class="bg-secondary rounded-2xl shadow-sm border border-border px-8 py-10 text-right">
      <h2 class="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
        <i class="ti ti-mail text-2xl"></i>
        ارسال پیام به پشتیبانی
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid md:grid-cols-2 grid-cols-1 gap-4">
          <!-- نام -->
          <div>
            <input
              v-model="form.name"
              type="text"
              placeholder="نام"
              class="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring focus:ring-accent bg-primary text-primary"
            />
            <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
          </div>

          <!-- شماره تماس -->
          <div>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="شماره تماس"
              class="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring focus:ring-accent bg-primary text-primary"
            />
            <p v-if="errors.phone" class="text-red-600 text-sm mt-1">{{ errors.phone }}</p>
          </div>
        </div>

        <!-- ایمیل -->
        <div>
          <input
            v-model="form.email"
            type="email"
            placeholder="ایمیل"
            class="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring focus:ring-accent bg-primary text-primary"
          />
          <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <!-- پیام -->
        <div>
          <textarea
            v-model="form.message"
            rows="4"
            placeholder="پیام شما"
            class="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring focus:ring-accent bg-primary text-primary"
          ></textarea>
          <p v-if="errors.message" class="text-red-600 text-sm mt-1">{{ errors.message }}</p>
        </div>

        <!-- دکمه -->
        <button
          type="submit"
          class="w-full accent-bg accent-text py-3 rounded-xl hover:opacity-90 transition font-medium"
        >
          ارسال پیام
        </button>
      </form>

      <!-- پیام کلی -->
      <p v-if="status" class="mt-4 text-center font-medium text-sm" :class="statusColor">
        {{ statusMessage }}
      </p>
    </div>
  </div>
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
</template>

<script>
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";

export default {
  name: 'SupportDashboard',
  components: {InfoToast},
  data() {
    return {
      form: {
        name: '',
        phone: '',
        email: '',
        message: ''
      },
      errors: {},
      status: null,
      showToast: false,
      toastMessage: '',
      toastIcon: 'ti-alert-triangle',
    }
  },
  computed: {
    statusMessage() {
      return this.status === 'success'
        ? 'پیام شما با موفقیت ارسال شد!'
        : 'لطفاً تمام فیلدها را به‌درستی پر کنید.'
    },
    statusColor() {
      return this.status === 'success' ? 'text-green-600' : 'text-red-600'
    }
  },
  methods: {
    showInfoToast(message, icon = 'ti-lock') {
      this.toastMessage = message;
      this.toastIcon = icon;
      this.showToast = true;
      setTimeout(() => this.showToast = false, 3000);
    },
    async handleSubmit() {
      this.errors = {}

      if (!this.form.name.trim()) this.errors.name = 'نام الزامی است.'
      if (!this.form.phone.trim()) this.errors.phone = 'شماره تماس الزامی است.'
      if (!this.form.email.trim()) {
        this.errors.email = 'ایمیل الزامی است.'
      } else if (!this.form.email.includes('@')) {
        this.errors.email = 'ایمیل معتبر نیست.'
      }
      if (!this.form.message.trim()) this.errors.message = 'متن پیام الزامی است.'

      if (Object.keys(this.errors).length === 0) {
        try {
          const response = await this.$axios.post('user/support/contact', this.form)
          if (response.data.success) {
            this.showInfoToast(response.data.message, 'ti-check');
            this.status = 'success'
            this.form = {name: '', phone: '', email: '', message: ''}
          } else {
            this.status = 'error'
          }
        } catch (e) {
          this.status = 'error'
        }
      } else {
        this.status = 'error'
      }
    }
  }
}
</script>
