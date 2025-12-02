<template>
  <div class="bg-white p-4 rounded-lg">
    <!-- عنوان -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-gray-800">
        <i class="ti ti-credit-card text-xl"></i>
        <h3 class="text-lg font-bold">خرید اشتراک {{ planLabel }}</h3>
      </div>
      <span v-if="discountText && Number(discountText) > 0" class="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
        {{ discountText }}درصد تخفیف
      </span>
      <span v-else class="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
        بدون تخفیف
       </span>
    </div>

    <!-- روش پرداخت -->
    <div class="space-y-2">
      <p class="text-sm font-medium text-gray-700">انتخاب روش پرداخت:</p>
      <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer"
             :class="paymentMethod === 'bank' ? 'border-green-500 bg-green-50' : 'border-gray-300'">
        <input type="radio" value="bank" v-model="paymentMethod" class="accent-green-500" />
        <i class="ti ti-building-bank text-lg text-gray-600"></i>
        <span class="text-sm font-medium text-gray-800">درگاه بانکی (پرداخت آنلاین)</span>
      </label>
    </div>

    <!-- جزئیات پرداخت -->
    <div class="space-y-2 text-sm text-gray-700 border-t pt-4">
      <div class="flex justify-between">
        <span>قیمت اشتراک:</span>
        <span>
          <del class="text-red-500">{{ originalPrice.toLocaleString() }} تومان</del>
          <span class="mr-2 font-semibold text-gray-800">{{ discountedPrice.toLocaleString() }} تومان</span>
        </span>
      </div>
      <div class="flex justify-between text-lg font-bold text-red-600 border-t pt-2">
        <span>مبلغ تخفیف:</span>
        <span>{{ amountOff.toLocaleString() }} تومان</span>
      </div>
      <div class="flex justify-between text-lg font-bold text-green-600 border-t pt-2">
        <span>مبلغ نهایی:</span>
        <span>{{ totalPrice.toLocaleString() }} تومان</span>
      </div>
    </div>

    <!-- قوانین و اقدام نهایی -->
    <div class="flex items-center justify-between mt-4">
      <label class="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" v-model="accepted" class="accent-green-500" />
        قوانین استفاده را می‌پذیرم
      </label>

      <button
          @click="handlePayment"
          class="px-6 py-2 bg-black text-white font-semibold rounded"
          :class="{ 'pointer-events-none opacity-50': !accepted }"
          :disabled="!accepted || loading"
      >
        <i class="ti ti-shopping-cart-plus ml-2"></i>
        خرید اشتراک
      </button>
    </div>
  </div>
</template>

<script>
import {useUserStore} from "~/stores/user.js";

export default {
  name: "CheckoutBox",
  props: {
    originalPrice: {
      type: Number,
      default: 0
    },
    discountedPrice: {
      type: Number,
      default: 0
    },
    planLabel: {
      type: String,
      default: ''
    },
    discountText: {
      type: String,
      default: ''
    },
    discountCode: {
      type: String,
      default: ''
    },
    discountType: {
      type: String,
      default: ''
    },
    discountValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      paymentMethod: "bank",
      metadata: {
        discountCode:'',
        mobile: '',
        email: ''
      },
      accepted: false,
      loading: false,
      discountInfo: {
        type: null,
        value: 0,
        discountCode: null
      }
    };
  },
  methods: {
    async handlePayment() {
      if (!this.accepted) return;
      const userStore=useUserStore()

      const {$axios} = useNuxtApp()
      this.loading = true
      try {

        // اعتبارسنجی کد تخفیف قبل از ارسال
        if (this.discountCode) {
          const validate = await $axios.post('/discount/apply', {code: this.discountCode})
          if (!validate.data.success) {
            alert('کد تخفیف نامعتبر است')
            this.loading = false
            return
          }
          this.discountInfo.type = validate.data.data.type
          this.discountInfo.value = validate.data.data.value
          this.discountInfo.discountCode=this.discountCode
        }
        this.metadata.discountCode=this.discountCode
        this.metadata.mobile=userStore.user.phone||''
        this.metadata.email=userStore.user.email||''
        const response = await $axios.post('/payment', {
          planId: this.$route.query.id,
          amount:this.totalPrice*10,
          discountCode: this.discountCode,
          metadata: this.metadata,
          gateway: 'zarinpal'
        });

        const url = response.data?.data.redirect_url;
        if (url) {
          window.location.href = url; // هدایت به درگاه
        } else {
          alert('مشکلی در دریافت لینک پرداخت پیش آمد.');
        }
      } catch (error) {
        alert('پرداخت با خطا مواجه شد.');
      }
    }
  },
  computed: {
    //TODO:To next information
    /*taxAmount() {
      return Math.round(this.discountedPrice * 0.1);
    },*/
    taxAmount() {
      return 0;
    },
    amountOff() {
      if(this.discountValue!=='0'){
        let off = this.discountedPrice
        if (this.discountType === 'percentage') {
          off *=this.discountValue / 100
        } else if (this.discountType === 'fixed') {
          off = this.discountValue
        }
        return Math.round(off)
      }
      return 0

    },
    totalPrice() {
      let price = this.discountedPrice
      if (this.discountInfo?.type === 'percentage') {
        price *= (1 - this.discountInfo.value / 100)
      } else if (this.discountInfo?.type === 'fixed') {
        price = Math.max(0, price - this.discountInfo.value)
      }
      if(this.discountInfo?.type){
        return Math.round(price + this.taxAmount)
      }
      return Math.round(price + this.taxAmount-this.amountOff)
    },
    discountCode() {
      return this.$route.query.discountCode || null
    },
  }
};
</script>

<style scoped>
input[type="checkbox"] {
  transform: scale(1.2);
}
</style>
