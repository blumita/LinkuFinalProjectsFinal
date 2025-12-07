<template>
  <div class="w-full p-4 sm:p-6 lg:p-8">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">
        تنظیمات سیستم
      </h1>
      <p class="text-slate-600 dark:text-slate-400">
        مدیریت تنظیمات عمومی سیستم و پیکربندی‌های امنیتی
      </p>
    </div>

    <!-- Settings Sections -->
    <div class="space-y-8">
      <!-- Currency Settings -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
            <i class="ti ti-currency-rial text-green-600 ml-3"></i>
            تنظیمات ارز
          </h2>
        </div>
        <div class="p-6 space-y-6">
          <!-- Primary Currency -->
          <div class="relative">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              واحد پول اصلی
            </label>
            <button disabled
                @click="showPrimaryCurrencyDropdown = !showPrimaryCurrencyDropdown"
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-left flex items-center justify-between"
            >
              <span class="flex items-center">
                <i class="ti ti-currency-rial text-green-600 dark:text-white ml-3"></i>
                {{ getPrimaryCurrencyDisplayName(settings.primaryCurrency) }}
              </span>
              <i class="ti ti-chevron-down text-slate-500 dark:text-slate-400 transition-transform duration-200"
                 :class="{ 'rotate-180': showPrimaryCurrencyDropdown }"></i>
            </button>
            <ul v-if="showPrimaryCurrencyDropdown"
                class="absolute top-full left-0 right-0 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg mt-1 shadow-lg z-10">
              <li @click="selectPrimaryCurrency('IRR')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-currency-rial text-green-600 dark:text-white ml-3"></i>
                ریال ایران (IRR)
              </li>
              <li @click="selectPrimaryCurrency('IRT')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-currency-toman text-green-600 dark:text-white ml-3"></i>
                تومان ایران (IRT)
              </li>
              <li @click="selectPrimaryCurrency('USD')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-currency-dollar text-green-600 dark:text-white ml-3"></i>
                دلار آمریکا (USD)
              </li>
              <li @click="selectPrimaryCurrency('EUR')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-currency-euro text-green-600 dark:text-white ml-3"></i>
                یورو (EUR)
              </li>
            </ul>
          </div>

          <!-- Currency Position -->
          <div class="relative">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              موقعیت نماد ارز
            </label>
            <button disabled
                @click="showCurrencyPositionDropdown = !showCurrencyPositionDropdown"
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-left flex items-center justify-between"
            >
              <span class="flex items-center">
                <i class="ti ti-arrows-left-right text-blue-600 dark:text-white ml-3"></i>
                {{ getCurrencyPositionDisplayName(settings.currencyPosition) }}
              </span>
              <i class="ti ti-chevron-down text-slate-500 dark:text-slate-400 transition-transform duration-200"
                 :class="{ 'rotate-180': showCurrencyPositionDropdown }"></i>
            </button>
            <ul v-if="showCurrencyPositionDropdown"
                class="absolute top-full left-0 right-0 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg mt-1 shadow-lg z-10">
              <li @click="selectCurrencyPosition('before')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-arrow-left text-blue-600 dark:text-white ml-3"></i>
                قبل از قیمت ($ 100)
              </li>
              <li @click="selectCurrencyPosition('after')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-arrow-right text-blue-600 dark:text-white ml-3"></i>
                بعد از قیمت (100 تومان)
              </li>
            </ul>
          </div>

          <!-- Decimal Places -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              تعداد رقم اعشار
            </label>
            <input disabled
                v-model.number="settings.decimalPlaces"
                type="number"
                min="0"
                max="4"
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="2"
            />
          </div>
        </div>
      </div>

      <!-- Payment Gateway Settings -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
            <i class="ti ti-credit-card text-blue-600 ml-3"></i>
            تنظیمات درگاه پرداخت
          </h2>
        </div>
        <div class="p-6 space-y-6">
          <!-- Gateway Selection -->
          <div class="relative">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              درگاه پرداخت فعال
            </label>
            <button
                @click="showActiveGatewayDropdown = !showActiveGatewayDropdown"
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-left flex items-center justify-between"
            >
              <span class="flex items-center">
                <i class="ti ti-credit-card text-blue-600 dark:text-white ml-3"></i>
                {{ getActiveGatewayDisplayName(settings.activeGateway) }}
              </span>
              <i class="ti ti-chevron-down text-slate-500 dark:text-slate-400 transition-transform duration-200"
                 :class="{ 'rotate-180': showActiveGatewayDropdown }"></i>
            </button>
            <ul v-if="showActiveGatewayDropdown"
                class="absolute top-full left-0 right-0 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg mt-1 shadow-lg z-10">
              <li @click="selectActiveGateway('zarinpal')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-brand-mastercard text-yellow-600 dark:text-white ml-3"></i>
                زرین‌پال
              </li>
              <li @click="selectActiveGateway('mellat')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-building-bank text-blue-600 dark:text-white ml-3"></i>
                بانک ملت
              </li>
              <li @click="selectActiveGateway('pasargad')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-building-bank text-green-600 dark:text-white ml-3"></i>
                پاسارگاد
              </li>
              <li @click="selectActiveGateway('saman')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-building-bank text-purple-600 dark:text-white ml-3"></i>
                سامان
              </li>
              <li @click="selectActiveGateway('parsian')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-building-bank text-red-600 dark:text-white ml-3"></i>
                پارسیان
              </li>
            </ul>
          </div>

          <!-- Merchant ID (Primary for Zarinpal) -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <span v-if="settings.activeGateway === 'zarinpal'">شناسه پذیرنده (Merchant ID) - کلید اصلی زرین‌پال</span>
              <span v-else>شناسه پذیرنده</span>
            </label>
            <input
                v-model="settings.merchantId"
                type="text"
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                :placeholder="settings.activeGateway === 'zarinpal' ? 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' : 'شناسه پذیرنده درگاه'"
            />
            <p v-if="settings.activeGateway === 'zarinpal'" class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              برای زرین‌پال فقط Merchant ID لازم است (36 کاراکتر UUID)
            </p>
          </div>

          <!-- Gateway API Key (Only for non-Zarinpal gateways) -->
          <div v-if="settings.activeGateway !== 'zarinpal'">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              کلید API درگاه
            </label>
            <div class="relative">
              <input
                  v-model="settings.gatewayApiKey"
                  :type="showGatewayApiKey ? 'text' : 'password'"
                  class="w-full px-4 py-3 pl-12 border border-slate-300 dark:border-slate-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="کلید API درگاه پرداخت"
              />
              <button
                  @click="showGatewayApiKey = !showGatewayApiKey"
                  type="button"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <i :class="showGatewayApiKey ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
              </button>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              فقط برای درگاه‌هایی که نیاز به کلید API جداگانه دارند
            </p>
          </div>

          <!-- Test Mode -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-slate-900 dark:text-white">
                حالت تست
              </h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                فعال‌سازی حالت تست برای آزمایش پرداخت
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                  v-model="settings.paymentTestMode"
                  type="checkbox"
                  class="sr-only peer"
              />
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4
                         peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer
                         dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white
                         after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                         after:bg-white after:border-slate-300 after:border after:rounded-full
                         after:h-5 after:w-5 after:transition-all dark:border-slate-600
                         peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <!-- Save Button -->
          <div class="pt-4">
            <button
                @click="savePaymentSettings"
                :disabled="isSavingPayment"
                class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                     transition-colors duration-200 flex items-center justify-center
                     disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              <i v-if="!isSavingPayment" class="ti ti-device-floppy ml-2"></i>
              <i v-else class="ti ti-loader animate-spin ml-2"></i>
              {{ isSavingPayment ? 'در حال ذخیره...' : 'ذخیره تنظیمات درگاه' }}
            </button>
          </div>
        </div>
      </div>

      <!-- SMS Panel Settings -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
            <i class="ti ti-message text-purple-600 ml-3"></i>
            تنظیمات سامانه پیامک
          </h2>
        </div>
        <div class="p-6 space-y-6">
          <!-- SMS Provider -->
          <div class="relative">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              ارائه‌دهنده پیامک
            </label>
            <button
                @click="showSmsProviderDropdown = !showSmsProviderDropdown"
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-left flex items-center justify-between"
            >
              <span class="flex items-center">
                <i class="ti ti-message text-purple-600 dark:text-white ml-3"></i>
                {{ getSmsProviderDisplayName(smsSettings.smsProvider) }}
              </span>
              <i class="ti ti-chevron-down text-slate-500 dark:text-slate-400 transition-transform duration-200"
                 :class="{ 'rotate-180': showSmsProviderDropdown }"></i>
            </button>
            <ul v-if="showSmsProviderDropdown"
                class="absolute top-full left-0 right-0 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg mt-1 shadow-lg z-10">
              <li @click="selectSmsProviderNew('kavenegar')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-message text-blue-600 dark:text-white ml-3"></i>
                کاوه‌نگار
              </li>
              <li @click="selectSmsProviderNew('ippanel')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-message text-green-600 dark:text-white ml-3"></i>
                آی‌پی پنل
              </li>
              <li @click="selectSmsProviderNew('melipayamak')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-message text-purple-600 dark:text-white ml-3"></i>
                ملی پیامک
              </li>
              <li @click="selectSmsProviderNew('modirpayamak')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-message text-purple-600 dark:text-white ml-3"></i>
                مدیر پیامک
              </li>

              <li @click="selectSmsProviderNew('ghasedak')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-message text-orange-600 dark:text-white ml-3"></i>
                قاصدک
              </li>
            </ul>
          </div>

          <!-- SMS API Key -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              کلید API پیامک
            </label>
            <div class="relative">
              <input
                  v-model="smsSettings.smsApiKey"
                  :type="showSmsApiKey ? 'text' : 'password'"
                  class="w-full px-4 py-3 pl-12 border border-slate-300 dark:border-slate-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="کلید API سامانه پیامک"
              />
              <button
                  @click="showSmsApiKey = !showSmsApiKey"
                  type="button"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <i :class="showSmsApiKey ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
              </button>
            </div>
          </div>

          <!-- SMS Sender Number -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              شماره ارسال‌کننده
            </label>
            <input
                v-model="smsSettings.smsSender"
                type="text"
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="10004346"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              الگوی ارسال پیامک
            </label>
            <input
                v-model="smsSettings.smsPatternCode"
                type="text"
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="pattern"
            />
          </div>

          <!-- Save SMS Settings Button -->
          <div class="pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
                @click="saveSmsSettings"
                :disabled="isSavingSms"
                class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <i class="ti ti-device-floppy ml-2" :class="{ 'animate-pulse': isSavingSms }"></i>
              {{ isSavingSms ? 'در حال ذخیره...' : 'ذخیره تنظیمات پیامک' }}
            </button>
          </div>
        </div>
      </div>

      <!-- VAPID Keys Settings -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
            <i class="ti ti-bell-ringing text-orange-600 ml-3"></i>
            تنظیمات کلیدهای VAPID (اعلان‌های Push)
          </h2>
        </div>
        <div class="p-6 space-y-6">
          <!-- VAPID Public Key -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              کلید عمومی VAPID
            </label>
            <div class="relative">
              <input
                  v-model="vapidSettings.publicKey"
                  :type="showVapidPublicKey ? 'text' : 'password'"
                  class="w-full px-4 py-3 pl-12 border border-slate-300 dark:border-slate-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-xs"
                  placeholder="BFzttfamBJ5XHjuy55yNQTCdkR2rbgE3J0oYQHmEgoiRJPPrLWPt5lkTBZn7jS30UBdMLCeBplkznfAoZSjXkUY"
              />
              <button
                  @click="showVapidPublicKey = !showVapidPublicKey"
                  type="button"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <i :class="showVapidPublicKey ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
              </button>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              کلید عمومی برای ثبت subscription در مرورگر کاربر
            </p>
          </div>

          <!-- VAPID Private Key -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              کلید خصوصی VAPID
            </label>
            <div class="relative">
              <input
                  v-model="vapidSettings.privateKey"
                  :type="showVapidPrivateKey ? 'text' : 'password'"
                  class="w-full px-4 py-3 pl-12 border border-slate-300 dark:border-slate-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-xs"
                  placeholder="8CZ6gF2j9bKzJzF6k3N5n4V8m7L6k5J4h3G2f1D0c9B8"
              />
              <button
                  @click="showVapidPrivateKey = !showVapidPrivateKey"
                  type="button"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <i :class="showVapidPrivateKey ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
              </button>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              کلید خصوصی برای امضای پیام‌های Push در سرور
            </p>
          </div>

          <!-- VAPID Subject -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Subject (ایمیل یا URL)
            </label>
            <input
                v-model="vapidSettings.subject"
                type="text"
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="mailto:admin@linku.im or https://linku.im"
            />
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ایمیل یا URL برای شناسایی سرویس (مثال: mailto:admin@linku.im)
            </p>
          </div>

          <!-- Generate New Keys Button -->
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div class="flex items-start">
              <i class="ti ti-info-circle text-blue-600 dark:text-blue-400 ml-2 mt-1"></i>
              <div class="flex-1">
                <p class="text-sm text-blue-800 dark:text-blue-300 mb-2">
                  برای تولید کلیدهای جدید VAPID، دستور زیر را در ترمینال سرور اجرا کنید:
                </p>
                <code class="block bg-slate-800 text-green-400 p-3 rounded text-xs font-mono">
                  php artisan webpush:vapid
                </code>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="pt-4">
            <button
                @click="saveVapidSettings"
                :disabled="isSavingVapid"
                class="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg
                     transition-colors duration-200 flex items-center justify-center
                     disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              <i v-if="!isSavingVapid" class="ti ti-device-floppy ml-2"></i>
              <i v-else class="ti ti-loader animate-spin ml-2"></i>
              {{ isSavingVapid ? 'در حال ذخیره...' : 'ذخیره کلیدهای VAPID' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
            <i class="ti ti-shield-check text-green-600 ml-3"></i>
            تنظیمات امنیتی
          </h2>
        </div>
        <div class="p-6 space-y-6">
          <!-- Email (Read-only) -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              ایمیل
            </label>
            <input
                v-model="securitySettings.email"
                type="email"
                disabled
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                     bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white cursor-not-allowed"
                placeholder="ایمیل شما"
            />
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">ایمیل قابل تغییر نیست</p>
          </div>

          <!-- Change Password -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              رمز عبور فعلی
            </label>
            <div class="relative">
              <input
                  v-model="securitySettings.currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  @input="restrictToEnglish($event, 'currentPassword')"
                  class="w-full px-4 py-3 pl-12 border border-slate-300 dark:border-slate-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="رمز عبور فعلی"
              />
              <button
                  @click="showCurrentPassword = !showCurrentPassword"
                  type="button"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <i :class="showCurrentPassword ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              رمز عبور جدید
            </label>
            <div class="relative">
              <input
                  v-model="securitySettings.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  @input="restrictToEnglish($event, 'newPassword')"
                  class="w-full px-4 py-3 pl-12 border border-slate-300 dark:border-slate-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="رمز عبور جدید (حداقل ۸ کاراکتر)"
              />
              <button
                  @click="showNewPassword = !showNewPassword"
                  type="button"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <i :class="showNewPassword ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              تکرار رمز عبور جدید
            </label>
            <div class="relative">
              <input
                  v-model="securitySettings.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  @input="restrictToEnglish($event, 'confirmPassword')"
                  class="w-full px-4 py-3 pl-12 border border-slate-300 dark:border-slate-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="تکرار رمز عبور جدید"
              />
              <button
                  @click="showConfirmPassword = !showConfirmPassword"
                  type="button"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <i :class="showConfirmPassword ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Password Error -->
          <div v-if="passwordError" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-red-600 dark:text-red-400 text-sm">{{ passwordError }}</p>
          </div>

          <!-- Save Password Button -->
          <div class="pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
                @click="changePassword"
                :disabled="isChangingPassword || !securitySettings.currentPassword || !securitySettings.newPassword || !securitySettings.confirmPassword"
                class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <i class="ti ti-lock ml-2" :class="{ 'animate-pulse': isChangingPassword }"></i>
              {{ isChangingPassword ? 'در حال تغییر...' : 'تغییر رمز عبور' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Support Settings -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
            <i class="ti ti-headset text-green-600 ml-3"></i>
            تنظیمات پشتیبانی
          </h2>
        </div>
        <div class="p-6 space-y-6">
          <!-- Support Phone -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              شماره تماس پشتیبانی
            </label>
            <input
                v-model="supportSettings.phone"
                type="text"
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="021-12345678"
            />
          </div>

          <!-- Support Email -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              ایمیل پشتیبانی
            </label>
            <input
                v-model="supportSettings.email"
                type="email"
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="support@example.com"
            />
          </div>

          <!-- Social Media Link -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              لینک شبکه اجتماعی (تلگرام/واتساپ)
            </label>
            <input
                v-model="supportSettings.socialMediaLink"
                type="text"
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="https://t.me/support"
            />
          </div>

          <!-- Crisp Code -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              کد Crisp (چت آنلاین)
            </label>
            <textarea
                v-model="supportSettings.crispCode"
                rows="4"
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm"
                placeholder="کد جاوااسکریپت Crisp"
            ></textarea>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              کد جاوااسکریپت چت آنلاین Crisp را از پنل مدیریت Crisp کپی کرده و اینجا قرار دهید.
            </p>
          </div>

          <!-- Support Active -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-slate-900 dark:text-white">
                پشتیبانی فعال
              </h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                نمایش بخش پشتیبانی در اپلیکیشن
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                  v-model="supportSettings.active"
                  type="checkbox"
                  class="sr-only peer"
              />
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4
                         peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer
                         dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white
                         after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                         after:bg-white after:border-slate-300 after:border after:rounded-full
                         after:h-5 after:w-5 after:transition-all dark:border-slate-600
                         peer-checked:bg-green-600"></div>
            </label>
          </div>

          <!-- Save Support Settings Button -->
          <div class="pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
                @click="saveSupportSettings"
                :disabled="isSavingSupport"
                class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <i class="ti ti-device-floppy ml-2" :class="{ 'animate-pulse': isSavingSupport }"></i>
              {{ isSavingSupport ? 'در حال ذخیره...' : 'ذخیره تنظیمات پشتیبانی' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
            <i class="ti ti-bell text-yellow-600 ml-3"></i>
            تنظیمات اعلان‌ها
          </h2>
        </div>
        <div class="p-6 space-y-6">
          <!-- Email Notifications -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-slate-900 dark:text-white">
                اعلان‌های ایمیل
              </h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                ارسال اعلان‌های مهم از طریق ایمیل
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input disabled
                  v-model="settings.emailNotifications"
                  type="checkbox"
                  class="sr-only peer"
              />
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4
                         peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer
                         dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white
                         after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                         after:bg-white after:border-slate-300 after:border after:rounded-full
                         after:h-5 after:w-5 after:transition-all dark:border-slate-600
                         peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <!-- SMS Notifications -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-slate-900 dark:text-white">
                اعلان‌های پیامکی
              </h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                ارسال اعلان‌های اضطراری از طریق پیامک
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input disabled
                  v-model="settings.smsNotifications"
                  type="checkbox"
                  class="sr-only peer"
              />
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4
                         peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer
                         dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white
                         after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                         after:bg-white after:border-slate-300 after:border after:rounded-full
                         after:h-5 after:w-5 after:transition-all dark:border-slate-600
                         peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <!-- Notification Frequency -->
          <div class="relative">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              فرکانس اعلان‌ها
            </label>
            <button disabled
                @click="showNotificationFrequencyDropdown = !showNotificationFrequencyDropdown"
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-left flex items-center justify-between"
            >
              <span class="flex items-center">
                <i class="ti ti-clock text-indigo-600 dark:text-white ml-3"></i>
                {{ getNotificationFrequencyDisplayName(settings.notificationFrequency) }}
              </span>
              <i class="ti ti-chevron-down text-slate-500 dark:text-slate-400 transition-transform duration-200"
                 :class="{ 'rotate-180': showNotificationFrequencyDropdown }"></i>
            </button>
            <ul v-if="showNotificationFrequencyDropdown"
                class="absolute top-full left-0 right-0 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg mt-1 shadow-lg z-10">
              <li @click="selectNotificationFrequency('instant')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-bolt text-yellow-600 dark:text-white ml-3"></i>
                فوری
              </li>
              <li @click="selectNotificationFrequency('hourly')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-clock text-blue-600 dark:text-white ml-3"></i>
                ساعتی
              </li>
              <li @click="selectNotificationFrequency('daily')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-calendar text-green-600 dark:text-white ml-3"></i>
                روزانه
              </li>
              <li @click="selectNotificationFrequency('weekly')"
                  class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center text-slate-900 dark:text-white">
                <i class="ti ti-calendar-week text-purple-600 dark:text-white ml-3"></i>
                هفتگی
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-8 flex justify-end gap-4">
      <button disabled
          @click="resetSettings"
          class="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg
               transition-colors flex items-center"
      >
        <i class="ti ti-refresh ml-2"></i>
        بازنشانی
      </button>
      <button
          @click="saveSettings"
          :disabled="isSaving"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
               transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        <i class="ti ti-device-floppy ml-2" :class="{ 'animate-pulse': isSaving }"></i>
        {{ isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
      </button>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="mt-4 p-4 rounded-lg" :class="messageClass">
      <div class="flex items-center">
        <i :class="messageIcon" class="ml-2"></i>
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, getCurrentInstance, onMounted} from 'vue'
import type {AxiosInstance} from "axios";
import {useUserStore} from "@/stores/user.ts";

defineOptions({
  name: 'SettingsManagement'
})

interface Settings {
  newUsername: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
  emailNotifications: boolean
  smsNotifications: boolean
  notificationFrequency: string
  // Currency Settings
  primaryCurrency: string
  currencyPosition: string
  decimalPlaces: number
  // Payment Gateway Settings
  activeGateway: string
  gatewayApiKey: string
  merchantId: string
  paymentTestMode: boolean
  // SMS Settings
  smsProvider: string
  smsPatternCode: string
  smsApiKey: string
  smsSender: string
  smsProviderUserName: string
  smsProviderPassword: string
  welcomeSmsTemplate: string
}

// State
const isSaving = ref(false)
const isSavingSupport = ref(false)
const isSavingSms = ref(false)
const isSavingPayment = ref(false)
const isSavingVapid = ref(false)
const isChangingPassword = ref(false)
const passwordError = ref('')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// User store
const userStore = useUserStore()

// Security settings
const securitySettings = reactive({
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// SMS settings (from ENV)
const smsSettings = reactive({
  smsProvider: 'modirpayamak',
  smsPatternCode: '',
  smsApiKey: '',
  smsSender: ''
})

// VAPID settings
const vapidSettings = reactive({
  publicKey: '',
  privateKey: '',
  subject: ''
})

// Support settings
const supportSettings = reactive({
  phone: '',
  email: '',
  socialMediaLink: '',
  crispCode: '',
  active: true
})

// Dropdown states
const showPrimaryCurrencyDropdown = ref(false)
const showCurrencyPositionDropdown = ref(false)
const showActiveGatewayDropdown = ref(false)
const showSmsProviderDropdown = ref(false)
const showNotificationFrequencyDropdown = ref(false)

// Password visibility states
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const showGatewayApiKey = ref(false)
const showSmsApiKey = ref(false)
const showVapidPublicKey = ref(false)
const showVapidPrivateKey = ref(false)

// Settings data
const settings = reactive<Settings>({
  newUsername: 'admin',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  emailNotifications: true,
  smsNotifications: false,
  notificationFrequency: 'daily',
  // Currency Settings
  primaryCurrency: 'IRT',
  currencyPosition: 'after',
  decimalPlaces: 0,
  // Payment Gateway Settings
  activeGateway: 'zarinpal',
  gatewayApiKey: '',
  merchantId: '',
  paymentTestMode: false,
  // SMS Settings
  smsProvider: 'modirpayamak',
  smsPatternCode: '',
  smsApiKey: '',
  smsSender: '',
  smsProviderUserName: '',
  smsProviderPassword: '',
  welcomeSmsTemplate: 'خوش آمدید! برای تکمیل ثبت نام کد {code} را وارد کنید.'
})

// Computed
const messageClass = computed(() => {
  return messageType.value === 'success'
      ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
      : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
})

const messageIcon = computed(() => {
  return messageType.value === 'success'
      ? 'ti ti-check-circle text-green-600'
      : 'ti ti-alert-circle text-red-600'
})
const {appContext} = getCurrentInstance()!
const axios = appContext.config.globalProperties.$axios as AxiosInstance

// Methods
const saveSettings = async () => {
  //TODO:add return temperate
  return
  try {
    isSaving.value = true
    // API call
    await axios.post('/user/admin/settings', settings);

    messageType.value = 'success'
    message.value = 'تنظیمات با موفقیت ذخیره شد'

    // Clear message after 3 seconds
    setTimeout(() => {
      message.value = ''
    }, 3000)

  } catch {
    messageType.value = 'error'
    message.value = 'خطا در ذخیره تنظیمات'

    setTimeout(() => {
      message.value = ''
    }, 3000)
  } finally {
    isSaving.value = false
  }
}

const resetSettings = () => {
  // Reset to default values
  Object.assign(settings, {
    newUsername: 'admin',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    smsNotifications: false,
    notificationFrequency: 'daily'
  })

  messageType.value = 'success'
  message.value = 'تنظیمات بازنشانی شد'

  setTimeout(() => {
    message.value = ''
  }, 3000)
}

// Dropdown helper functions
function getPrimaryCurrencyDisplayName(value: string) {
  switch (value) {
    case 'IRR':
      return 'ریال ایران (IRR)'
    case 'IRT':
      return 'تومان ایران (IRT)'
    case 'USD':
      return 'دلار آمریکا (USD)'
    case 'EUR':
      return 'یورو (EUR)'
    default:
      return 'انتخاب ارز'
  }
}

function selectPrimaryCurrency(currency: string) {
  settings.primaryCurrency = currency
  showPrimaryCurrencyDropdown.value = false
}

function getCurrencyPositionDisplayName(value: string) {
  switch (value) {
    case 'before':
      return 'قبل از قیمت ($ 100)'
    case 'after':
      return 'بعد از قیمت (100 تومان)'
    default:
      return 'انتخاب موقعیت'
  }
}

function selectCurrencyPosition(position: string) {
  settings.currencyPosition = position
  showCurrencyPositionDropdown.value = false
}

function getActiveGatewayDisplayName(value: string) {
  switch (value) {
    case 'zarinpal':
      return 'زرین‌پال'
    case 'mellat':
      return 'بانک ملت'
    case 'pasargad':
      return 'پاسارگاد'
    case 'saman':
      return 'سامان'
    case 'parsian':
      return 'پارسیان'
    default:
      return 'انتخاب درگاه'
  }
}

function selectActiveGateway(gateway: string) {
  settings.activeGateway = gateway
  showActiveGatewayDropdown.value = false
}

function getSmsProviderDisplayName(value: string) {
  switch (value) {
    case 'kavenegar':
      return 'کاوه‌نگار'
    case 'ghasedak':
      return 'قاصدک'
    case 'melipayamak':
      return 'ملی‌پیامک'
    case 'farazpayamak':
      return 'فرازپیامک'
    case 'modirpayamak':
      return 'مدیر پیامک'
    default:
      return 'انتخاب ارائه‌دهنده'
  }
}

function selectSmsProvider(provider: string) {
  settings.smsProvider = provider
  showSmsProviderDropdown.value = false
}

function selectSmsProviderNew(provider: string) {
  smsSettings.smsProvider = provider
  showSmsProviderDropdown.value = false
}

function getNotificationFrequencyDisplayName(value: string) {
  switch (value) {
    case 'realtime':
      return 'فوری'
    case 'daily':
      return 'روزانه'
    case 'weekly':
      return 'هفتگی'
    case 'monthly':
      return 'ماهانه'
    default:
      return 'انتخاب فرکانس'
  }
}

function selectNotificationFrequency(frequency: string) {
  settings.notificationFrequency = frequency
  showNotificationFrequencyDropdown.value = false
}

// Restrict Persian/Farsi input for username and passwords
function restrictToEnglish(event: Event, field: string) {
  const target = event.target as HTMLInputElement
  const value = target.value
  // Remove Persian/Farsi characters and keep only English letters, numbers and common symbols
  const englishOnly = value.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '')

  if (value !== englishOnly) {
    target.value = englishOnly
    if (field === 'currentPassword') {
      securitySettings.currentPassword = englishOnly
    } else if (field === 'newPassword') {
      securitySettings.newPassword = englishOnly
    } else if (field === 'confirmPassword') {
      securitySettings.confirmPassword = englishOnly
    }
  }
}

onMounted(async () => {
  try {
    const res = await axios.get('/user/admin/settings')
    Object.assign(settings, res.data)
    
    // Load SMS settings from ENV
    if (res.data.smsProvider) smsSettings.smsProvider = res.data.smsProvider
    if (res.data.smsPatternCode) smsSettings.smsPatternCode = res.data.smsPatternCode
    if (res.data.smsApiKey) smsSettings.smsApiKey = res.data.smsApiKey
    if (res.data.smsSender) smsSettings.smsSender = res.data.smsSender
    
    console.log('set', settings)
  } catch (error) {
    console.error('خطا در دریافت تنظیمات:', error)
  }

  // Load support settings
  try {
    const supportRes = await axios.get('/user/admin/support/info')
    if (supportRes.data?.data) {
      Object.assign(supportSettings, supportRes.data.data)
    }
  } catch (error) {
    console.error('خطا در دریافت تنظیمات پشتیبانی:', error)
  }
  
  // Load user email for security settings
  if (userStore.user?.email) {
    securitySettings.email = userStore.user.email
  } else {
    await userStore.fetchUser()
    if (userStore.user?.email) {
      securitySettings.email = userStore.user.email
    }
  }
  
  // Load VAPID settings
  try {
    const vapidRes = await axios.get('/user/admin/settings/vapid')
    if (vapidRes.data) {
      Object.assign(vapidSettings, vapidRes.data)
    }
  } catch (error) {
    console.error('خطا در دریافت کلیدهای VAPID:', error)
  }
})

// Change password
const changePassword = async () => {
  passwordError.value = ''
  
  // Validation
  if (securitySettings.newPassword.length < 8) {
    passwordError.value = 'رمز عبور جدید باید حداقل ۸ کاراکتر باشد'
    return
  }
  
  if (securitySettings.newPassword !== securitySettings.confirmPassword) {
    passwordError.value = 'تکرار رمز عبور با رمز عبور جدید مطابقت ندارد'
    return
  }
  
  try {
    isChangingPassword.value = true
    await axios.post('/user/admin/settings/change-password', {
      currentPassword: securitySettings.currentPassword,
      newPassword: securitySettings.newPassword,
      confirmPassword: securitySettings.confirmPassword
    })
    
    messageType.value = 'success'
    message.value = 'رمز عبور با موفقیت تغییر یافت'
    
    // Clear password fields
    securitySettings.currentPassword = ''
    securitySettings.newPassword = ''
    securitySettings.confirmPassword = ''
    
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error: any) {
    passwordError.value = error.response?.data?.message || 'خطا در تغییر رمز عبور'
  } finally {
    isChangingPassword.value = false
  }
}

// Save SMS settings
const saveSmsSettings = async () => {
  try {
    isSavingSms.value = true
    await axios.post('/user/admin/settings/sms', smsSettings)
    
    messageType.value = 'success'
    message.value = 'تنظیمات پیامک با موفقیت ذخیره شد'
    
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error) {
    messageType.value = 'error'
    message.value = 'خطا در ذخیره تنظیمات پیامک'
    
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } finally {
    isSavingSms.value = false
  }
}

// Save Payment Gateway settings
const savePaymentSettings = async () => {
  try {
    isSavingPayment.value = true
    await axios.post('/user/admin/settings/payment', {
      activeGateway: settings.activeGateway,
      gatewayApiKey: settings.gatewayApiKey,
      merchantId: settings.merchantId,
      paymentTestMode: settings.paymentTestMode
    })
    
    messageType.value = 'success'
    message.value = 'تنظیمات درگاه پرداخت با موفقیت ذخیره شد'
    
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error) {
    messageType.value = 'error'
    message.value = 'خطا در ذخیره تنظیمات درگاه پرداخت'
    
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } finally {
    isSavingPayment.value = false
  }
}

// Save support settings
const saveSupportSettings = async () => {
  try {
    isSavingSupport.value = true
    await axios.put('/user/admin/support/update', supportSettings)
    
    messageType.value = 'success'
    message.value = 'تنظیمات پشتیبانی با موفقیت ذخیره شد'
    
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error) {
    messageType.value = 'error'
    message.value = 'خطا در ذخیره تنظیمات پشتیبانی'
    
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } finally {
    isSavingSupport.value = false
  }
}

// Save VAPID settings
const saveVapidSettings = async () => {
  try {
    isSavingVapid.value = true
    await axios.post('/user/admin/settings/vapid', vapidSettings)
    
    messageType.value = 'success'
    message.value = 'کلیدهای VAPID با موفقیت ذخیره شد'
    
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error) {
    messageType.value = 'error'
    message.value = 'خطا در ذخیره کلیدهای VAPID'
    
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } finally {
    isSavingVapid.value = false
  }
}
</script>
