<template>
  <div class="h-screen bg-background transition-colors duration-300 relative overflow-hidden flex flex-col">
      <template v-if="step === 'phone'">
        <!-- Fixed Header -->
        <div class="flex-shrink-0 bg-background border-b border-border">
          <div class="flex items-center h-14 px-4">
            <h1 class="text-lg font-semibold text-foreground mr-2">شماره موبایل</h1>
            <div class="flex-1"></div>
            <button
              @click="isLanguageSheetOpen = true"
              class="w-10 h-10 flex items-center justify-center hover:bg-accent transition-colors rounded-full"
            >
              <i class="ti ti-language text-foreground text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Centered Content -->
        <div class="flex-1 flex items-center justify-center overflow-hidden">
          <div class="w-full max-w-md px-4">
            <p class="text-muted-foreground text-sm text-center mb-8">لطفاً کشور را انتخاب و سپس شماره رو وارد کنید</p>

        <!-- Country Selector (استایل جدید مطابق عکس) -->
        <div class="relative w-full mb-4">
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

        <!-- Phone Number Input (استایل جدید مطابق عکس) -->
        <div class="relative w-full mb-6">
          <input
              v-model="phone"
              @input="handlePhoneInput"
              id="phoneInput"
              type="text"
              inputmode="numeric"
              placeholder=" "
              dir="ltr"
              :class="[
                'block px-3 pb-2.5 pt-4 w-full text-sm text-foreground bg-transparent rounded-xl border-2 appearance-none focus:outline-none focus:ring-0 peer transition-colors duration-200 pl-16',
                errors.phone ? 'border-red-500' : 'border-border focus:border-primary'
              ]"
          />
          <label
              for="phoneInput"
              :class="[
                'inline-flex items-center absolute text-sm duration-300 transform -translate-y-4 scale-[0.85] top-2 z-10 bg-background px-2 right-2 origin-top-right pointer-events-none',
                errors.phone ? 'text-red-500' : 'text-muted-foreground peer-focus:text-primary'
              ]"
          >
            <i class="ti ti-phone w-4 h-4 ml-1.5"></i>
            <span>شماره موبایل</span>
          </label>
          <!-- Country Code Display Inside Input with Border - Fixed Position -->
          <div class="absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground text-sm font-medium pointer-events-none border-r border-border pr-2 mr-2 min-w-[40px] text-left flex items-center h-8" dir="ltr">
            {{ selectedCountry.dialCode }}
          </div>

          <p v-if="errors.phone" class="text-red-500 text-xs mt-1 block">{{ errors.phone }}</p>
        </div>

        <!-- Continue Button -->
        <button
            class="w-full bg-primary text-primary-foreground text-center py-4 rounded-lg text-lg font-medium relative flex items-center justify-center overflow-hidden transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
            @click="handlePhone"
        >
          <i class="ti ti-chevron-left w-4 rtl:mr-auto ltr:ml-auto absolute rtl:left-4 ltr:right-4 pt-1 text-2xl rtl:border-r ltr:border-l px-4 border-primary-foreground/30 ltr:hidden"></i>
          <i class="ti ti-chevron-right w-4 ltr:ml-auto absolute ltr:right-4 pt-1 text-2xl ltr:border-l px-4 border-primary-foreground/30 rtl:hidden"></i>
          <span>ادامه</span>
        </button>

        <!-- Divider -->
        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px bg-border"></div>
          <span class="text-muted-foreground text-sm">یا</span>
          <div class="flex-1 h-px bg-border"></div>
        </div>

        <!-- Face ID / Touch ID Button -->
        <button
            v-if="isPlatformAuthenticatorAvailable && isPasskeyEnabled()"
            class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-4 rounded-lg text-lg font-medium relative flex items-center justify-center overflow-hidden transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 mb-3"
            @click="handlePasskeyLogin"
            :disabled="isWebAuthnLoading"
        >
          <template v-if="isWebAuthnLoading">
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
            <span>در حال احراز هویت...</span>
          </template>
          <template v-else>
            <i class="ti ti-face-id text-xl ml-2"></i>
            <span>ورود با Face ID / Touch ID</span>
          </template>
        </button>

        <!-- Login with Email Button -->
        <button
            class="w-full bg-card border border-border text-foreground text-center py-4 rounded-lg text-lg font-medium relative flex items-center justify-center overflow-hidden transition-all duration-300 hover:bg-muted hover:-translate-y-0.5"
            @click="step = 'email'"
        >
          <i class="ti ti-mail text-xl ml-2"></i>
          <span>ورود با ایمیل</span>
        </button>
          </div>
        </div>
      </template>

      <!-- Email Step -->
      <template v-else-if="step === 'email'">
        <!-- Fixed Header -->
        <div class="flex-shrink-0 bg-background border-b border-border">
          <div class="flex items-center h-14 px-4">
            <button
              @click="step = 'phone'"
              class="w-10 h-10 flex items-center justify-center hover:bg-accent transition-colors rounded-full"
            >
              <i class="ti ti-arrow-right rtl:block ltr:hidden text-foreground text-xl"></i>
              <i class="ti ti-arrow-left ltr:block rtl:hidden text-foreground text-xl"></i>
            </button>
            <h1 class="text-lg font-semibold text-foreground mr-2">ایمیل</h1>
          </div>
        </div>

        <!-- Centered Content -->
        <div class="flex-1 flex items-center justify-center overflow-hidden">
          <div class="w-full max-w-md px-4">
            <p class="text-muted-foreground text-sm text-center mb-8">آدرس ایمیل خود را وارد کنید</p>

        <!-- Email Input -->
        <div class="w-full mb-6 relative">
          <input
              v-model="email"
              id="emailInput"
              type="email"
              inputmode="email"
              placeholder=" "
              dir="ltr"
              class="peer block w-full px-4 py-4 text-sm border border-border rounded-lg focus:outline-none focus:ring-0 focus:border-primary text-foreground bg-card transition-all duration-300"
          />
          <label
              for="emailInput"
              class="absolute rtl:right-4 ltr:left-4 text-sm text-muted-foreground bg-background px-1 z-10 transition-all duration-200 cursor-text
              top-1/2 -translate-y-1/2
              peer-focus:top-1 peer-focus:text-xs peer-focus:-translate-y-1/2 peer-focus:text-primary
              peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1/2"
          >
            ایمیل
          </label>

          <p v-if="errors.email" class="text-red-500 text-xs mt-1 block">{{ errors.email }}</p>
        </div>

        <!-- Continue Button -->
        <button
            class="w-full bg-primary text-primary-foreground text-center py-4 rounded-lg text-lg font-medium relative flex items-center justify-center overflow-hidden transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
            @click="handleEmail"
        >
          <i class="ti ti-chevron-left w-4 rtl:mr-auto ltr:ml-auto absolute rtl:left-4 ltr:right-4 pt-1 text-2xl rtl:border-r ltr:border-l px-4 border-primary-foreground/30 ltr:hidden"></i>
          <i class="ti ti-chevron-right w-4 ltr:ml-auto absolute ltr:right-4 pt-1 text-2xl ltr:border-l px-4 border-primary-foreground/30 rtl:hidden"></i>
          <span>ادامه</span>
        </button>
          </div>
        </div>
      </template>

      <!-- OTP Step -->
      <template v-else-if="step === 'otp'">
        <!-- Fixed Header -->
        <div class="flex-shrink-0 bg-background border-b border-border">
          <div class="flex items-center h-14 px-4">
            <button
              @click="goBackFromOtp"
              class="w-10 h-10 flex items-center justify-center hover:bg-accent transition-colors rounded-full"
            >
              <i class="ti ti-arrow-right rtl:block ltr:hidden text-foreground text-xl"></i>
              <i class="ti ti-arrow-left ltr:block rtl:hidden text-foreground text-xl"></i>
            </button>
            <h2 class="text-lg font-semibold text-foreground mr-2">کد تایید</h2>
            <div class="flex-1"></div>
            <button
              @click="isLanguageSheetOpen = true"
              class="w-10 h-10 flex items-center justify-center hover:bg-accent transition-colors rounded-full"
            >
              <i class="ti ti-language text-foreground text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Loading Overlay -->
        <div v-if="isVerifying" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div class="flex flex-col items-center gap-4">
            <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p class="text-foreground font-medium">در حال ورود...</p>
          </div>
        </div>

        <!-- Centered Content -->
        <div class="flex-1 flex items-center justify-center overflow-hidden">
          <div class="w-full max-w-md px-4">
            <p v-if="authMethod === 'phone'" class="text-sm text-muted-foreground text-center mb-4">لطفا کد ارسال شده به شماره موبایل
              {{ toPersianDigits(displayPhone) }} را وارد
              کنید</p>
            <p v-else class="text-sm text-muted-foreground text-center mb-4">لطفا کد ارسال شده به ایمیل
              {{ displayEmail }} را وارد
              کنید</p>

        <div ref="otpCont" class="flex justify-center gap-2 mt-6 ltr">
          <input
              v-for="(_, ind) in otpLength"
              :key="ind"
              :id="`otp-input-${ind}`"
              type="text"
              class="p-4 w-14 h-14 border border-border rounded-lg bg-card text-center text-xl text-foreground flex items-center justify-center font-semibold ltr focus:outline-none focus:border-primary focus:bg-background transition-all duration-300"
              :value="otp[ind]"
              maxlength="1"
              placeholder="-"
              inputmode="numeric"
              autocomplete="one-time-code"
              :autofocus="ind === 0"
              @input="otp[ind] = ($event.target as HTMLInputElement)?.value || null"
              @keydown="handleOtpKey(ind, $event)"
              :class="{ bounce: otp[ind] !== null }"
          />
        </div>

        <div class="timer center flex justify-center py-4 text-sm">
          <template v-if="!isResendEnabled">
            <div class="text-right">
              <span class="font-bold inline-block text-foreground" dir="ltr">{{ formatTime(timer) }}</span>
              <strong class="mr-2 text-muted-foreground">ثانیه مانده تا ارسال مجدد کد</strong>
            </div>
          </template>
          <template v-else>
            <button
                class="text-primary underline hover:opacity-80 transition-opacity"
                @click="resendCode"
            >
              ارسال مجدد کد
            </button>
          </template>
        </div>
          </div>
        </div>
      </template>

      <!-- Register Step -->
      <template v-else-if="step === 'register'">
        <!-- Fixed Header -->
        <div class="flex-shrink-0 bg-background border-b border-border">
          <div class="flex items-center h-14 px-4">
            <button
              @click="step = 'otp'"
              class="w-10 h-10 flex items-center justify-center hover:bg-accent transition-colors rounded-full"
            >
              <i class="ti ti-arrow-right rtl:block ltr:hidden text-foreground text-xl"></i>
              <i class="ti ti-arrow-left ltr:block rtl:hidden text-foreground text-xl"></i>
            </button>
            <h1 class="text-lg font-semibold text-foreground mr-2">ثبت نام</h1>
          </div>
        </div>

        <!-- Centered Content -->
        <div class="flex-1 flex items-center justify-center overflow-hidden">
          <div class="w-full max-w-md px-4">
            <p class="text-muted-foreground text-sm text-center mb-8">لطفاً اطلاعات خود را تکمیل کنید</p>

        <!-- Full Name Input -->
        <div class="relative w-full mb-4">
          <input
              v-model="name"
              id="nameInput"
              type="text"
              placeholder=" "
              class="peer block w-full px-3 pb-2.5 pt-4 text-sm text-foreground bg-transparent rounded-xl border-2 border-border focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300"
          />
          <label
              for="nameInput"
              class="inline-flex items-center absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-[0.85] top-2 z-10 bg-background px-2 
								peer-focus:px-2 peer-focus:text-primary 
								peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 
								peer-focus:top-2 peer-focus:scale-[0.85] peer-focus:-translate-y-4 
								right-2 origin-top-right"
          >
            <i class="ti ti-user w-4 h-4 ml-1.5"></i>
            <span>نام کامل</span>
          </label>
        </div>

        <!-- Referral Code Input -->
        <div class="relative w-full mb-6">
          <input
              type="text"
              id="referralInput"
              v-model="referralCode"
              placeholder=" "
              class="peer block w-full px-3 pb-2.5 pt-4 text-sm text-foreground bg-transparent rounded-xl border-2 border-border focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300"
          />
          <label
              for="referralInput"
              class="inline-flex items-center absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-[0.85] top-2 z-10 bg-background px-2 
								peer-focus:px-2 peer-focus:text-primary 
								peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 
								peer-focus:top-2 peer-focus:scale-[0.85] peer-focus:-translate-y-4 
								right-2 origin-top-right"
          >
            <i class="ti ti-gift w-4 h-4 ml-1.5"></i>
            <span>کد معرف (اختیاری)</span>
          </label>
        </div>

        <!-- Submit Button -->
        <button
            class="w-full bg-primary text-primary-foreground text-center py-4 rounded-lg text-lg font-medium relative flex items-center justify-center overflow-hidden transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
            @click="handleRegister"
        >
          <i class="ti ti-chevron-left w-4 rtl:mr-auto ltr:ml-auto absolute rtl:left-4 ltr:right-4 pt-1 text-2xl rtl:border-r ltr:border-l px-4 border-primary-foreground/30 ltr:hidden"></i>
          <i class="ti ti-chevron-right w-4 ltr:ml-auto absolute ltr:right-4 pt-1 text-2xl ltr:border-l px-4 border-primary-foreground/30 rtl:hidden"></i>
          <span>ثبت و ورود</span>
        </button>
          </div>
        </div>
      </template>

      <!-- Email Profile Step (for new email users) -->
      <template v-else-if="step === 'email_profile'">
        <!-- Fixed Header -->
        <div class="flex-shrink-0 bg-background border-b border-border">
          <div class="flex items-center h-14 px-4">
            <button
              @click="step = 'otp'"
              class="w-10 h-10 flex items-center justify-center hover:bg-accent transition-colors rounded-full"
            >
              <i class="ti ti-arrow-right rtl:block ltr:hidden text-foreground text-xl"></i>
              <i class="ti ti-arrow-left ltr:block rtl:hidden text-foreground text-xl"></i>
            </button>
            <h1 class="text-lg font-semibold text-foreground mr-2">تکمیل اطلاعات</h1>
          </div>
        </div>

        <!-- Centered Content -->
        <div class="flex-1 flex items-center justify-center overflow-hidden">
          <div class="w-full max-w-md px-4">
            <p class="text-muted-foreground text-sm text-center mb-8">لطفاً اطلاعات خود را تکمیل کنید</p>

        <!-- Full Name Input -->
        <div class="relative w-full mb-4">
          <input
              v-model="fullName"
              id="profileFullNameInput"
              type="text"
              placeholder=" "
              class="peer block w-full px-3 pb-2.5 pt-4 text-sm text-foreground bg-transparent rounded-xl border-2 border-border focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300"
          />
          <label
              for="profileFullNameInput"
              class="inline-flex items-center absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-[0.85] top-2 z-10 bg-background px-2 
								peer-focus:px-2 peer-focus:text-primary 
								peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 
								peer-focus:top-2 peer-focus:scale-[0.85] peer-focus:-translate-y-4 
								right-2 origin-top-right"
          >
            <i class="ti ti-user w-4 h-4 ml-1.5"></i>
            <span>نام کامل</span>
          </label>
          <p v-if="errors.profileName" class="text-red-500 text-xs mt-1 block">{{ errors.profileName }}</p>
        </div>

        <!-- Phone Input with Country Code -->
        <div class="relative w-full mb-4">
          <div class="flex gap-2 flex-row-reverse">
            <!-- Country Code Selector (Right in RTL) -->
            <button 
              @click="showProfileCountryPicker = true"
              class="flex items-center gap-2 px-3 py-4 border-2 border-border rounded-xl bg-transparent hover:border-primary transition-all duration-300"
            >
              <img :src="`/flag/${selectedProfileCountry.flag}.svg`" :alt="selectedProfileCountry.nameEn" class="w-6 h-4 object-cover rounded" />
              <span class="text-sm text-foreground" dir="ltr">{{ selectedProfileCountry.dialCode }}</span>
              <i class="ti ti-chevron-down text-muted-foreground text-sm"></i>
            </button>
            <!-- Phone Number -->
            <div class="flex-1 relative">
              <input
                  v-model="profilePhone"
                  id="profilePhoneInput"
                  type="text"
                  inputmode="numeric"
                  placeholder=" "
                  dir="ltr"
                  class="peer block w-full px-3 pb-2.5 pt-4 text-sm text-foreground bg-transparent rounded-xl border-2 border-border focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 text-left"
              />
              <label
                  for="profilePhoneInput"
                  class="inline-flex items-center absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-[0.85] top-2 z-10 bg-background px-2 
										peer-focus:px-2 peer-focus:text-primary 
										peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 
										peer-focus:top-2 peer-focus:scale-[0.85] peer-focus:-translate-y-4 
										right-2 origin-top-right"
              >
                <i class="ti ti-phone w-4 h-4 ml-1.5"></i>
                <span>شماره موبایل (اختیاری)</span>
              </label>
            </div>
          </div>
          <p v-if="errors.profilePhone" class="text-red-500 text-xs mt-1 block">{{ errors.profilePhone }}</p>
        </div>

        <!-- Referral Code Input -->
        <div class="relative w-full mb-6">
          <input
              v-model="referralCode"
              id="profileReferralInput"
              type="text"
              placeholder=" "
              class="peer block w-full px-3 pb-2.5 pt-4 text-sm text-foreground bg-transparent rounded-xl border-2 border-border focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300"
          />
          <label
              for="profileReferralInput"
              class="inline-flex items-center absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-[0.85] top-2 z-10 bg-background px-2 
								peer-focus:px-2 peer-focus:text-primary 
								peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 
								peer-focus:top-2 peer-focus:scale-[0.85] peer-focus:-translate-y-4 
								right-2 origin-top-right"
          >
            <i class="ti ti-gift w-4 h-4 ml-1.5"></i>
            <span>کد معرف (اختیاری)</span>
          </label>
        </div>

        <!-- Submit Button -->
        <button
            class="w-full bg-primary text-primary-foreground text-center py-4 rounded-lg text-lg font-medium relative flex items-center justify-center overflow-hidden transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
            @click="handleEmailProfileSubmit"
            :disabled="isVerifying"
        >
          <template v-if="isVerifying">
            <div class="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin ml-2"></div>
            <span>در حال ثبت...</span>
          </template>
          <template v-else>
            <i class="ti ti-chevron-left w-4 rtl:mr-auto ltr:ml-auto absolute rtl:left-4 ltr:right-4 pt-1 text-2xl rtl:border-r ltr:border-l px-4 border-primary-foreground/30 ltr:hidden"></i>
            <i class="ti ti-chevron-right w-4 ltr:ml-auto absolute ltr:right-4 pt-1 text-2xl ltr:border-l px-4 border-primary-foreground/30 rtl:hidden"></i>
            <span>ثبت و ورود</span>
          </template>
        </button>
          </div>
        </div>
      </template>

      <!-- Success Step -->
      <template v-else-if="step === 'done'">
        <h2 class="text-xl font-bold text-center text-green-600 flex items-center justify-center gap-2">
          <i class="ti ti-check"></i> ورود موفق
        </h2>
      </template>
    </div>

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

    <!-- Profile Country Picker Bottom Sheet -->
    <UiBottomSheet
      v-model="showProfileCountryPicker"
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
            @click="selectProfileCountry(country)"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
              selectedProfileCountry.code === country.code 
                ? 'bg-primary/10 border border-primary' 
                : 'hover:bg-accent'
            ]"
          >
            <img :src="`/flag/${country.flag}.svg`" :alt="country.nameEn" class="w-7 h-5 object-cover rounded" />
            <div class="flex-1 text-right">
              <div class="text-foreground font-medium">{{ country.name }}</div>
              <div class="text-xs text-muted-foreground">{{ country.nameEn }}</div>
            </div>
            <span class="text-muted-foreground text-sm" dir="ltr">{{ country.dialCode }}</span>
            <i v-if="selectedProfileCountry.code === country.code" class="ti ti-check text-primary"></i>
          </button>
        </div>
      </div>
    </UiBottomSheet>

    <!-- Language Settings Bottom Sheet -->
    <UiBottomSheet
      v-model="isLanguageSheetOpen"
      title="تنظیمات زبان"
      size="auto"
      desktop-width="lg"
      :closable="true"
      :close-on-backdrop="true"
    >
      <div class="px-6 py-4 pb-6">
        <div class="space-y-2">
          <!-- Persian -->
          <button
            @click="handleLanguageChange('fa')"
            :class="[
              'w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200',
              currentLanguage === 'fa' 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-border bg-card hover:border-primary/50 hover:bg-accent'
            ]"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center overflow-hidden">
                <img src="~/assets/flag/IR.png" alt="Iran" class="w-7 h-5 object-cover" />
              </div>
              <div class="text-right">
                <div class="font-semibold text-foreground">فارسی</div>
                <div class="text-xs text-muted-foreground">Persian</div>
              </div>
            </div>
            <i v-if="currentLanguage === 'fa'" class="ti ti-check text-primary text-2xl"></i>
          </button>

          <!-- English -->
          <button
            disabled
            class="w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all opacity-50 cursor-not-allowed border-border bg-muted/30"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden">
                <img src="~/assets/flag/US.png" alt="USA" class="w-7 h-5 object-cover" />
              </div>
              <div class="text-right">
                <div class="font-semibold text-foreground">English</div>
                <div class="text-xs text-muted-foreground">به‌زودی</div>
              </div>
            </div>
            <div class="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">قفل</div>
          </button>

          <!-- Arabic -->
          <button
            disabled
            class="w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all opacity-50 cursor-not-allowed border-border bg-muted/30"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center overflow-hidden">
                <img src="~/assets/flag/SA.png" alt="Saudi Arabia" class="w-7 h-5 object-cover" />
              </div>
              <div class="text-right">
                <div class="font-semibold text-foreground">العربية</div>
                <div class="text-xs text-muted-foreground">به‌زودی</div>
              </div>
            </div>
          </button>

          <!-- Turkish -->
          <button
            disabled
            class="w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all opacity-50 cursor-not-allowed border-border bg-muted/30"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center overflow-hidden">
                <img src="~/assets/flag/TR.png" alt="Turkey" class="w-7 h-5 object-cover" />
              </div>
              <div class="text-right">
                <div class="font-semibold text-foreground">Türkçe</div>
                <div class="text-xs text-muted-foreground">به‌زودی</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </UiBottomSheet>
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>

</template>

<script setup lang="ts">
import {ref, reactive, onMounted, computed, nextTick} from 'vue'
import {useNuxtApp, useRouter} from 'nuxt/app'
import {useAuthStore} from '~/stores/auth'
import type {AxiosInstance} from 'axios'
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";
import {useUserStore} from "~/stores/user";
import {useWebAuthn} from "~/composables/useWebAuthn";
import {safeStorage} from "~/utils/safeStorage";

// ========== Country List ==========
import { countries, type Country, defaultCountry } from '~/data/countries'

// ========== WebAuthn ==========
const { 
  isSupported: isWebAuthnSupported, 
  isPlatformAuthenticatorAvailable,
  isLoading: isWebAuthnLoading,
  registerPasskey,
  authenticateWithPasskey,
  isPasskeyEnabled
} = useWebAuthn()

// ========== Refs & Reactive State ==========
const step = ref<'phone' | 'email' | 'otp' | 'register' | 'email_profile' | 'done'>('phone')
const authMethod = ref<'phone' | 'email'>('phone')
const phone = ref('')
const email = ref('')
const name = ref('')
const family = ref('')
const fullName = ref('') // نام و نام‌خانوادگی یکجا
const profilePhone = ref('')
const profileCountryCode = ref('+98')
const selectedCountry = ref<Country>(defaultCountry) // ایران پیش‌فرض
const selectedProfileCountry = ref<Country>(defaultCountry) // برای فرم پروفایل
const showCountryPicker = ref(false)
const showProfileCountryPicker = ref(false)
const countrySearchQuery = ref('')
const pendingEmailOtpCode = ref('') // ذخیره کد OTP برای ارسال با پروفایل (email)
const pendingPhoneOtpCode = ref('') // ذخیره کد OTP برای ارسال با پروفایل (phone)
const referralCode = ref('')
const displayPhone = ref('')
const displayEmail = ref('')
const isLanguageSheetOpen = ref(false)
const currentLanguage = ref<'fa' | 'en'>('fa')
const isDark = computed(() => {
  if (process.client) {
    return document.documentElement.classList.contains('dark')
  }
  return false
})

// Filtered countries for search
const filteredCountries = computed(() => {
  if (!countrySearchQuery.value) return countries
  const query = countrySearchQuery.value.toLowerCase()
  return countries.filter(c => 
    c.name.includes(query) || 
    c.nameEn.toLowerCase().includes(query) ||
    c.dialCode.includes(query)
  )
})

// Initialize language from safeStorage
if (process.client) {
  const savedLang = safeStorage.getItem('language') as 'fa' | 'en'
  if (savedLang) currentLanguage.value = savedLang
}

const errors = reactive({phone: '', email: '', profilePhone: '', profileName: ''})
const otpLength = 4
const otp = reactive(Array(otpLength).fill(null))
const otpCont = ref<HTMLElement | null>(null)
const timer = ref(120)
const timerInterval = ref<number | null>(null)
const isResendEnabled = ref(false)
const isVerifying = ref(false) // Loading state برای تایید OTP
const userStore = useUserStore()
const formStore = useFormStore()
////Setting Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle') // یا 'ti-lock', 'ti-check', هر چی خواستی
const showInfoToast = (message: string, icon = 'ti-lock') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000) // بعد از ۳ ثانیه بسته می‌شه
}

// ========== Dependencies ==========
const nuxtApp = useNuxtApp()
const router = useRouter()
const $axios = nuxtApp.$axios as AxiosInstance
const authStore = useAuthStore()

// ========== Helper: Convert Persian/Arabic to English Digits ==========
function toEnglishDigits(str: string): string {
  // تبدیل اعداد فارسی به انگلیسی
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
  // تبدیل اعداد عربی به انگلیسی
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩'
  
  return str
    .replace(/[۰-۹]/g, d => String(persianDigits.indexOf(d)))
    .replace(/[٠-٩]/g, d => String(arabicDigits.indexOf(d)))
}

function toPersianDigits(str: string): string {
  return str.replace(/[0-9]/g, (d: string) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

// ========== Helper: Format Phone with Spaces ==========
function formatPhoneWithSpaces(value: string): string {
  // حذف تمام فاصله‌ها و کاراکترهای غیر عددی
  const cleaned = value.replace(/\D/g, '')
  
  // محدود کردن به 11 رقم
  const limited = cleaned.slice(0, 11)
  
  // اضافه کردن فاصله بعد از هر 3 رقم
  const formatted = limited.replace(/(\d{3})(?=\d)/g, '$1 ')
  
  return toPersianDigits(formatted)
}

// ========== Go Back From OTP Step ==========
function goBackFromOtp() {
  // ریست کردن OTP
  otp.fill(null)
  timer.value = 120
  isResendEnabled.value = false
  
  // برگشت به مرحله قبل بر اساس روش احراز هویت
  if (authMethod.value === 'email') {
    step.value = 'email'
  } else {
    step.value = 'phone'
  }
}

// ========== Handle Phone Input with Formatting ==========
function handlePhoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  const cursorPos = input.selectionStart || 0
  
  // حذف همه چیز غیر از اعداد فارسی، عربی و انگلیسی
  let value = input.value
  // تبدیل به انگلیسی و سپس حذف غیر اعداد
  const englishValue = toEnglishDigits(value)
  const cleaned = englishValue.replace(/\D/g, '')
  
  // محدود به 11 رقم
  const limited = cleaned.slice(0, 11)
  
  // فرمت جدید: آخرین رقم بدون فاصله
  // اگه شماره با 0 شروع شه: 0914 276 6601
  // اگه بدون 0 باشه: 914 276 6601
  let formatted = ''
  if (limited.length > 0) {
    if (limited.startsWith('0')) {
      // فرمت: 0XXX XXX XXXX (آخرین 4 رقم بدون فاصله)
      if (limited.length <= 4) {
        formatted = limited
      } else if (limited.length <= 7) {
        formatted = limited.slice(0, 4) + ' ' + limited.slice(4)
      } else {
        formatted = limited.slice(0, 4) + ' ' + limited.slice(4, 7) + ' ' + limited.slice(7)
      }
    } else {
      // فرمت: XXX XXX XXXX (آخرین 4 رقم بدون فاصله)
      if (limited.length <= 3) {
        formatted = limited
      } else if (limited.length <= 6) {
        formatted = limited.slice(0, 3) + ' ' + limited.slice(3)
      } else {
        formatted = limited.slice(0, 3) + ' ' + limited.slice(3, 6) + ' ' + limited.slice(6)
      }
    }
  }
  
  // تبدیل به فارسی
  const persian = toPersianDigits(formatted)
  
  // به‌روزرسانی
  phone.value = persian
  input.value = persian
  
  // محاسبه موقعیت جدید کرسر - با پشتیبانی از اعداد فارسی، عربی و انگلیسی
  const oldDigitCount = toEnglishDigits(value.slice(0, cursorPos)).replace(/\D/g, '').length
  let newPos = 0
  let digitCount = 0
  for (let i = 0; i < persian.length; i++) {
    if (persian[i].match(/[۰-۹]/)) {
      digitCount++
      if (digitCount > oldDigitCount) {
        newPos = i
        break
      }
    }
    if (digitCount === oldDigitCount) {
      newPos = i + 1
      break
    }
  }
  
  nextTick(() => {
    input.setSelectionRange(newPos, newPos)
  })
}

// ========== Helper: Timer Format ==========
function formatTime(seconds: number): string {
  return toPersianDigits(seconds.toString());
}

// ========== Countdown Timer ==========
function startTimer(initialSeconds: number = 120) {
  // پاک کردن تایمر قبلی اگر وجود دارد
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  
  timer.value = initialSeconds
  isResendEnabled.value = false
  
  timerInterval.value = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      isResendEnabled.value = true
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
        timerInterval.value = null
      }
    }
  }, 1000) as unknown as number
}

///======
async function resendCode() {
  try {
    let success = false
    
    if (authMethod.value === 'phone') {
      const cleaned = toEnglishDigits(phone.value.trim()).replace(/\D/g, '').replace(/^0/, '')
      success = await sendOtpCode(cleaned)
    } else {
      success = await sendEmailOtpCode(email.value.trim())
    }
    
    if (success) {
      otp.fill(null)
      startTimer()
    } else {
      showInfoToast('ارسال مجدد ناموفق بود. لطفاً دوباره تلاش کنید.', 'ti-alert-triangle')
    }
  } catch (error) {
    showInfoToast('خطایی رخ داد. لطفاً بعداً دوباره تلاش کنید.', 'ti-alert-triangle')
  }
}

// ========== Handle Passkey (Face ID / Touch ID) Login ==========
async function handlePasskeyLogin() {
  try {
    const result = await authenticateWithPasskey()
    
    if (result.success && result.userId) {
      // بازیابی توکن ذخیره شده
      const savedToken = safeStorage.getItem('passkey_auth_token')
      
      if (savedToken) {
        authStore.setToken(savedToken)
        safeStorage.setItem('auth_token', savedToken)
        
        showInfoToast('ورود موفق با Face ID', 'ti-check')
        
        await userStore.fetchUser()
        const defaultCard = formStore.defaultCard
        
        // همیشه به داشبورد ریدایرکت کن
        router.push('/dashboard')
      } else {
        showInfoToast('لطفاً ابتدا با شماره یا ایمیل وارد شوید', 'ti-alert-triangle')
      }
    } else {
      showInfoToast(result.error || 'احراز هویت ناموفق بود', 'ti-alert-triangle')
    }
  } catch (error) {
    showInfoToast('خطا در احراز هویت', 'ti-alert-triangle')
  }
}

// ========== Step 1: Handle Phone Submission ==========
async function handlePhone() {
  const cleaned = toEnglishDigits(phone.value.trim()).replace(/\D/g, '')
  
  errors.phone = ''
  authMethod.value = 'phone'

  // validation for phone IR
  const phoneRegex = /^0?9\d{9}$/;

  if (!phoneRegex.test(cleaned)) {
    errors.phone = 'شماره موبایل ایران باید با ۰۹ شروع شود یا ۹ و ۱۱ رقم باشد';
    return;
  }

  const normalized = cleaned.startsWith('0') ? cleaned.slice(1) : cleaned
  displayPhone.value = toPersianDigits('98') + normalized + '+'

  try {
    const success = await sendOtpCode(normalized)
    
    if (success) {
      step.value = 'otp'
      startTimer()
    } else {
      errors.phone = 'ارسال کد تأیید ناموفق بود. لطفاً دوباره تلاش کنید.'
    }
  } catch (error) {
    errors.phone = 'خطایی رخ داد. لطفاً بعداً دوباره تلاش کنید.'
  }
}

// ========== Handle Email Submission ==========
async function handleEmail() {
  const emailValue = email.value.trim()
  
  errors.email = ''
  authMethod.value = 'email'

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(emailValue)) {
    errors.email = 'لطفاً یک ایمیل معتبر وارد کنید'
    return
  }

  displayEmail.value = emailValue

  try {
    const success = await sendEmailOtpCode(emailValue)
    
    if (success) {
      step.value = 'otp'
      startTimer()
    } else {
      errors.email = 'ارسال کد تأیید ناموفق بود. لطفاً دوباره تلاش کنید.'
    }
  } catch (error) {
    errors.email = 'خطایی رخ داد. لطفاً بعداً دوباره تلاش کنید.'
  }
}

// ========== Send Verification Code API ==========
async function sendOtpCode(normalized: string): Promise<boolean> {
  try {
    const phoneData = {
      phone: toEnglishDigits(normalized),
      countryCode: '+98',
    }
    console.log('📱 Sending OTP to:', phoneData)
    const response = await $axios.post('auth/sendOtpCode', phoneData)
    
    if (response.data && response.data.success === true) {
      return true;
    }
    
    showInfoToast(response.data.message);
    return false;

  } catch (error: any) {
    const errorData = error.response?.data
    
    // اگر کد قبلی هنوز معتبره، به صفحه OTP برو و تایمر رو sync کن
    // Format 1: {code: 'code_already_valid', remaining_seconds: 120}
    // Format 2: {success: false, message: 'کد قبلی هنوز معتبر است...'}
    if (
      (errorData?.code === 'code_already_valid' && errorData?.remaining_seconds) ||
      (errorData?.message && errorData.message.includes('کد قبلی هنوز معتبر است'))
    ) {
      // بدون نمایش toast، مستقیم به صفحه OTP برو
      step.value = 'otp'
      // اگر remaining_seconds موجود باشه استفاده کن، وگرنه 120 ثانیه
      const remaining = errorData?.remaining_seconds ? parseInt(errorData.remaining_seconds) : 120
      startTimer(remaining)
      otp.fill(null)
      return true;
    }
    
    if (errorData?.message) {
      showInfoToast(errorData.message);
    } else {
      showInfoToast('مشکلی در ارتباط با سرور وجود دارد.', 'ti-alert-triangle');
    }

    return false;
  }
}

// ========== Send Email Verification Code API ==========
async function sendEmailOtpCode(emailAddress: string): Promise<boolean> {
  try {
    const emailData = {
      email: emailAddress,
    }
    console.log('📧 Sending OTP to email:', emailData)
    const response = await $axios.post('auth/sendEmailOtp', emailData)
    
    if (response.data && response.data.success === true) {
      return true;
    }
    
    showInfoToast(response.data.message);
    return false;

  } catch (error: any) {
    const errorData = error.response?.data
    
    // اگر کد قبلی هنوز معتبره، به صفحه OTP برو و تایمر رو sync کن
    // Format 1: {code: 'code_already_valid', remaining_seconds: 120}
    // Format 2: {success: false, message: 'کد قبلی هنوز معتبر است...'}
    if (
      (errorData?.code === 'code_already_valid' && errorData?.remaining_seconds) ||
      (errorData?.message && errorData.message.includes('کد قبلی هنوز معتبر است'))
    ) {
      // بدون نمایش toast، مستقیم به صفحه OTP برو
      step.value = 'otp'
      // اگر remaining_seconds موجود باشه استفاده کن، وگرنه 120 ثانیه
      const remaining = errorData?.remaining_seconds ? parseInt(errorData.remaining_seconds) : 120
      startTimer(remaining)
      otp.fill(null)
      return true;
    }
    
    if (errorData?.message) {
      showInfoToast(errorData.message);
    } else {
      showInfoToast('مشکلی در ارتباط با سرور وجود دارد.', 'ti-alert-triangle');
    }

    return false;
  }
}

// ========== OTP Step Helpers ==========
const isOtpFull = () => otp.every(d => d !== null && d !== '')

async function handleOtpKey(index: number, event: KeyboardEvent) {
  const key = event.key

  if (!['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(key) && !/^[0-9]$/.test(key)) {
    event.preventDefault()
    return
  }

  // Backspace logic
  if (key === 'Backspace') {
    otp[index] = null
    if (index > 0) {
      (otpCont.value?.children[index - 1] as HTMLInputElement)?.focus()
    }
    event.preventDefault()
    return
  }

  // Numeric input
  if (/^[0-9]$/.test(key)) {
    otp[index] = key
    event.preventDefault()

    if (index < otpLength - 1) {
      (otpCont.value?.children[index + 1] as HTMLInputElement)?.focus()
    }

    if (isOtpFull()) {
      // جلوگیری از ارسال مجدد در حین پردازش
      if (isVerifying.value) return
      isVerifying.value = true
      
      try {
        const fullCode = toEnglishDigits(otp.join(''))
        const {success, userExists} = await verifyOtpCode(fullCode)
        if (success) {
          if (userExists) {
            // اجرای موازی fetchUser - بدون await برای سرعت بیشتر
            // redirect سریع و بارگذاری داده در پس‌زمینه
            try {
              const fetchPromise = userStore.fetchUser()
              
              // همزمان بررسی کارت پیش‌فرض
              await fetchPromise
              const defaultCard = formStore.defaultCard
              
              // ایجاد کارت پیش‌فرض اگر وجود ندارد
              if (!defaultCard) {
                await $axios.post('v1/cards/createDefaultCard', {
                  defaultContactType: authMethod.value === 'email' ? 'email' : 'phone'
                })
              }
              // همیشه به داشبورد ریدایرکت کن
              router.push('/dashboard')
            } catch (fetchError: any) {
              console.error('❌ Error fetching user after login:', fetchError)
              // حتی اگر fetch user خطا داد، بازم به داشبورد برو (token ذخیره شده)
              router.push('/dashboard')
            }
          } else {
            // اگر step قبلاً به email_profile تغییر کرده، دست نزن
            if (step.value !== 'email_profile') {
              step.value = 'register'
            }
            isVerifying.value = false
          }
        } else {
          isVerifying.value = false
          showInfoToast('کد وارد شده نامعتبر یا منقضی است. لطفاً دوباره تلاش کنید.', 'ti-alert-triangle')
        }
      } catch (error: any) {
        isVerifying.value = false
        if (error.response && error.response.data.message) {
          showInfoToast(error.response.data.message);
        } else {
          showInfoToast('مشکلی در برقراری ارتباط با سرور وجود دارد.', 'ti-alert-triangle');
        }
      }
    }
  }
}

// ========== Verify OTP with Server ==========
async function verifyOtpCode(fullCode: string): Promise<{ success: boolean; userExists: boolean }> {
  try {
    // Build request based on auth method
    let response
    
    if (authMethod.value === 'phone') {
      const requestData = {
        code: fullCode,
        phone: toEnglishDigits(phone.value.trim()).replace(/\D/g, '').replace(/^0/, ''),
        countryCode: '+98'
      }
      response = await $axios.post('/auth/verifyOtpCode', requestData)
    } else {
      const requestData = {
        code: fullCode,
        email: email.value.trim()
      }
      response = await $axios.post('/auth/verifyEmailOtp', requestData)
    }
    
    const token = response.data.token
    if (typeof token === 'string' && token.length > 0) {
      console.log('✅ Token received from server:', token.substring(0, 20) + '...')
      authStore.setToken(token)
      safeStorage.setItem('auth_token', token)
      console.log('✅ Token saved to safeStorage and store')
    } else {
      console.error('❌ No token in response:', response.data)
    }

    if (response.status === 200) {
      return {success: true, userExists: true}
    }
    if (response.status === 201) {
      return {success: true, userExists: false}
    }

    return {success: false, userExists: false}
  } catch (error: any) {
    // Handle profile_required for new users (both phone and email)
    // Check both response.data.code and response.data.data.code for Nuxt server errors
    const errorCode = error.response?.data?.code || error.response?.data?.data?.code
    const errorMessage = error.response?.data?.message || error.response?.data?.data?.message
    
    if (errorCode === 'profile_required') {
      // ذخیره کد OTP برای ارسال مجدد همراه با اطلاعات پروفایل
      // این یک رفتار عادی است، نه خطا - پس پیام error نشون نده
      if (authMethod.value === 'email') {
        pendingEmailOtpCode.value = fullCode
        step.value = 'email_profile'
      } else {
        // برای phone-based login به صفحه register هدایت کن
        pendingPhoneOtpCode.value = fullCode
        step.value = 'register'
      }
      // هیچ toast نشون نده برای profile_required
      return { success: true, userExists: false }
    }
    
    // فقط برای خطاهای واقعی پیام نشون بده (نه profile_required)
    if (errorMessage && errorCode !== 'profile_required') {
      showInfoToast(errorMessage, 'ti-alert-triangle');
    } else {
      showInfoToast('مشکلی در برقراری ارتباط با سرور وجود دارد.', 'ti-alert-triangle');
    }
    return {success: false, userExists: false}
  }
}

// ========== Handle Email Profile Submit ==========
async function handleEmailProfileSubmit() {
  // Reset errors
  errors.profilePhone = ''
  errors.profileName = ''
  
  // Validate inputs
  if (!fullName.value.trim()) {
    errors.profileName = 'نام و نام خانوادگی الزامی است'
    showInfoToast('لطفاً نام و نام خانوادگی خود را وارد کنید')
    return
  }
  
  // Split fullName into name and family
  const nameParts = fullName.value.trim().split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''
  
  // Double-check that firstName is not empty (防御性编程)
  if (!firstName || firstName.trim() === '') {
    errors.profileName = 'نام الزامی است'
    showInfoToast('لطفاً نام خود را وارد کنید')
    return
  }
  
  console.log('📝 Name split:', {
    fullName: fullName.value,
    firstName,
    lastName,
    firstNameLength: firstName.length,
    lastNameLength: lastName.length
  })
  
  // Build full phone with country code from selected country (optional)
  let fullPhone = null
  const cleanPhone = toEnglishDigits(profilePhone.value.trim()).replace(/\D/g, '')
  
  if (cleanPhone) {
    const countryCode = selectedProfileCountry.value.dialCode.replace('+', '')
    fullPhone = countryCode + cleanPhone
    
    // Check for Israel country code (+972)
    if (countryCode === '972' || fullPhone.startsWith('972')) {
      errors.profilePhone = 'این کد کشور پشتیبانی نمی‌شود'
      showInfoToast('این کد کشور پشتیبانی نمی‌شود', 'ti-alert-triangle')
      return
    }
  }
  
  isVerifying.value = true
  
  try {
    // Verify OTP code is available
    if (!pendingEmailOtpCode.value || pendingEmailOtpCode.value.trim() === '') {
      console.error('🐛 BUG: pendingEmailOtpCode is empty!')
      showInfoToast('کد تأیید منقضی شده است. لطفاً دوباره کد دریافت کنید.', 'ti-alert-triangle')
      step.value = 'email' // Go back to email step
      return
    }
    
    const requestData = {
      code: pendingEmailOtpCode.value,
      email: email.value.trim(),
      name: firstName,
      family: lastName,
      phone: fullPhone,
      referred_code: referralCode.value || null
    }
    
    console.log('🔍 Sending registration data:', {
      email: requestData.email,
      code: requestData.code ? '****' : 'MISSING',
      name: requestData.name || 'EMPTY',
      family: requestData.family || 'EMPTY',
      phone: requestData.phone || 'null',
      referred_code: requestData.referred_code || 'null'
    })
    
    const response = await $axios.post('/auth/verifyEmailOtp', requestData)
    
    console.log('✅ Registration successful:', {
      status: response.status,
      hasToken: !!response.data.token,
      hasUser: !!response.data.user
    })
    
    const token = response.data.token
    if (typeof token === 'string' && token.length > 0) {
      authStore.setToken(token)
      safeStorage.setItem('auth_token', token)
    }
    
    showInfoToast(`ثبت‌نام موفق! خوش آمدید ${firstName}`, 'ti-check')
    
    // Fetch user and redirect
    try {
      await userStore.fetchUser()
      const defaultCard = formStore.defaultCard
      
      // ایجاد کارت پیش‌فرض اگر وجود ندارد
      if (!defaultCard) {
        await $axios.post('v1/cards/createDefaultCard', {
          defaultContactType: 'email'
        })
      }
    } catch (fetchError) {
      console.error('❌ Error fetching user after profile submission:', fetchError)
    }
    // همیشه به داشبورد ریدایرکت کن
    router.push('/dashboard')
  } catch (error: any) {
    isVerifying.value = false
    
    console.error('❌ Registration failed:', {
      status: error.response?.status,
      code: error.response?.data?.code,
      message: error.response?.data?.message,
      fullError: error.response?.data
    })
    
    const errorCode = error.response?.data?.code
    
    if (errorCode === 'profile_required') {
      // این نباید اتفاق بیفتد چون اطلاعات رو فرستادیم
      console.error('🐛 BUG: Received profile_required AGAIN after sending profile data!')
      showInfoToast('خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید.', 'ti-alert-triangle')
    } else if (errorCode === 'phone_taken') {
      errors.profilePhone = 'این شماره قبلاً ثبت شده است'
      showInfoToast('این شماره قبلاً ثبت شده است', 'ti-alert-triangle')
    } else if (errorCode === 'invalid_phone_country') {
      errors.profilePhone = 'این کد کشور پشتیبانی نمی‌شود'
      showInfoToast('این کد کشور پشتیبانی نمی‌شود', 'ti-alert-triangle')
    } else if (error.response?.data?.message) {
      showInfoToast(error.response.data.message, 'ti-alert-triangle')
    } else {
      showInfoToast('مشکلی در برقراری ارتباط با سرور وجود دارد.', 'ti-alert-triangle')
    }
  }
}

// ========== Final Step: Register Name ==========
async function handleRegister() {
  if (!name.value.trim()) {
    showInfoToast('لطفاً نام کامل خود را وارد کنید')
    return
  }

  // Split نام کامل به نام و نام خانوادگی
  const nameParts = name.value.trim().split(/\s+/)
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ') || firstName

  try {
    // اگر کاربر از phone-based login آمده و کد OTP دارد، یک‌بار دیگر verify کن همراه با اطلاعات
    if (pendingPhoneOtpCode.value) {
      const requestData = {
        code: pendingPhoneOtpCode.value,
        phone: toEnglishDigits(phone.value.trim()).replace(/\D/g, '').replace(/^0/, ''),
        countryCode: '+98',
        name: firstName,
        family: lastName,
        referred_code: referralCode.value?.trim() || null
      }
      
      console.log('📤 Sending registration data:', requestData)
      const response = await $axios.post('/auth/verifyOtpCode', requestData)
      
      const token = response.data.token
      if (typeof token === 'string' && token.length > 0) {
        authStore.setToken(token)
        safeStorage.setItem('auth_token', token)
      }
      
      showInfoToast(`ثبت‌نام موفق! خوش آمدید ${firstName}`, 'ti-check')
      
      try {
        await userStore.fetchUser()
        const defaultCard = computed(() => formStore.defaultCard)

        // ایجاد کارت پیش‌فرض اگر وجود ندارد
        if (!defaultCard?.value) {
          await $axios.post('v1/cards/createDefaultCard', {
            defaultContactType: 'phone'
          })
        }
      } catch (fetchError) {
        console.error('❌ Error fetching user after phone profile:', fetchError)
      }
      
      pendingPhoneOtpCode.value = '' // پاک کردن کد
      await router.push('/dashboard')
      return
    }
    
    // اگر قبلاً login شده (کاربر قدیمی)، فقط referralCode رو بروز کن
    const response = await $axios.post('/user/setReferralCode', {
      name: firstName,
      family: lastName,
      referred_code: referralCode.value || null,
    })

    showInfoToast(`ثبت‌نام موفق! خوش آمدید ${firstName}`, 'ti-check')
    await userStore.fetchUser()
    const defaultCard = computed(() => formStore.defaultCard)

    // ایجاد کارت پیش‌فرض اگر وجود ندارد
    if (!defaultCard?.value) {
      await $axios.post('v1/cards/createDefaultCard', {
        defaultContactType: authMethod.value === 'email' ? 'email' : 'phone'
      })
    }
    // همیشه به داشبورد ریدایرکت کن
    await router.push('/dashboard')

  } catch (error: any) {
    console.error('Register error:', error)
    console.error('Error response:', error.response?.data)
    const errorMessage = error.response?.data?.message || error.response?.data?.data?.message
    
    // اگر OTP منقضی شده، کاربر رو به صفحه اول برگردون
    if (error.response?.status === 429 || errorMessage?.includes('منقضی')) {
      showInfoToast('کد تایید منقضی شده است. لطفاً مجدداً درخواست کنید.', 'ti-alert-triangle')
      step.value = 'phone'
      pendingPhoneOtpCode.value = ''
      name.value = ''
      referralCode.value = ''
      return
    }
    
    showInfoToast(errorMessage || 'مشکلی در ثبت نام پیش آمد. لطفاً دوباره تلاش کنید.', 'ti-alert-triangle')
  }
}

// ========== Country Selection Handlers ==========
const selectCountry = (country: Country) => {
  selectedCountry.value = country
  showCountryPicker.value = false
  countrySearchQuery.value = ''
}

const selectProfileCountry = (country: Country) => {
  // Check for Israel (blocked)
  if (country.dialCode === '+972') {
    showInfoToast('این کشور پشتیبانی نمی‌شود', 'ti-alert-triangle')
    return
  }
  selectedProfileCountry.value = country
  profileCountryCode.value = country.dialCode
  showProfileCountryPicker.value = false
  countrySearchQuery.value = ''
}

// ========== Language Change Handler ==========
const handleLanguageChange = async (lang: 'fa' | 'en') => {
  currentLanguage.value = lang
  
  if (process.client) {
    safeStorage.setItem('language', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'
  }
  
  setTimeout(() => {
    isLanguageSheetOpen.value = false
  }, 300)
}

interface OTPCredential extends Credential {
  code: string;
}

onMounted(async () => {
  // بررسی آیا باید Face ID اتوماتیک فعال بشه (از PWA)
  if (process.client) {
    const autoBiometric = sessionStorage.getItem('auto_biometric_auth')
    if (autoBiometric === 'true') {
      sessionStorage.removeItem('auto_biometric_auth')
      
      // صبر کن تا WebAuthn بارگذاری بشه
      await nextTick()
      
      // اگه Face ID فعال بود، اتوماتیک لاگین کن
      if (isPlatformAuthenticatorAvailable.value && isPasskeyEnabled()) {
        setTimeout(() => {
          handlePasskeyLogin()
        }, 500)
      }
    }
  }

  if ('OTPCredential' in window && navigator.credentials) {
    const controller = new AbortController();

    navigator.credentials.get({
      otp: {transport: ['sms']},
      signal: controller.signal
    } as any)
        .then(async (credential) => {
          if (credential && 'code' in credential) {
            const code = (credential as any).code as string;
            const digits = code.split('');
            digits.forEach((digit, i) => {
              otp[i] = digit;
              const input = document.querySelector<HTMLInputElement>(`#otp-input-${i}`);
              if (input) {
                input.value = digit;
                input.dispatchEvent(new Event('input'));
              }
            });
            const lastInput = document.querySelector<HTMLInputElement>(`#otp-input-${digits.length - 1}`);
            if (lastInput) lastInput.focus();
            if (isOtpFull()) {
              // جلوگیری از ارسال مجدد
              if (isVerifying.value) return
              isVerifying.value = true
              
              try {
                const fullCode = toEnglishDigits(otp.join(''));
                const {success, userExists} = await verifyOtpCode(fullCode);
                if (success) {
                  if (userExists) {
                    // بهینه‌سازی: fetch سریع‌تر
                    try {
                      await userStore.fetchUser()
                      const defaultCard = formStore.defaultCard
                      // ایجاد کارت پیش‌فرض اگر وجود ندارد
                      if (!defaultCard) {
                        await $axios.post('v1/cards/createDefaultCard', {
                          defaultContactType: authMethod.value === 'email' ? 'email' : 'phone'
                        })
                      }
                    } catch (fetchError) {
                      console.error('❌ Error fetching user after OTP verification:', fetchError)
                    }
                    // همیشه به داشبورد ریدایرکت کن
                    router.push('/dashboard')
                  } else {
                    step.value = 'register'
                    isVerifying.value = false
                  }
                } else {
                  isVerifying.value = false
                  showInfoToast('کد وارد شده نامعتبر یا منقضی است. لطفاً دوباره تلاش کنید.', 'ti-alert-triangle');
                }
              } catch (error) {
                isVerifying.value = false
                showInfoToast('خطایی رخ داد. لطفاً دوباره تلاش کنید.', 'ti-alert-triangle');
              }
            }
          }
        })
        .catch(err => {
          // Error receiving OTP
        });
  }
});


</script>

<style scoped>
.bounce {
  animation: pulse 0.25s ease-in-out alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}
</style>