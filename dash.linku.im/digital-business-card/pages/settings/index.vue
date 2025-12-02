<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
      <div class="flex items-center h-14 px-4 max-w-5xl mx-auto">
        <button
          @click="goBack"
          class="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-accent transition-colors"
        >
          <i class="ti ti-arrow-right text-xl"></i>
        </button>
        <h1 class="flex-1 text-lg font-semibold text-foreground text-center mr-10">تنظیمات</h1>
      </div>
    </div>

    <!-- Content -->
    <div class="pt-[60px] pb-20 px-3">
      <div class="max-w-5xl mx-auto lg:max-w-none lg:px-8">
        
        <!-- Mobile List -->
        <div class="lg:hidden space-y-0">
          <!-- Edit Profile -->
          <button
            @click="handleSettingClick('edit-profile')"
            class="w-full flex items-center justify-between py-4 border-b border-border/20"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-user-edit text-foreground text-lg"></i>
              <span class="font-medium text-foreground text-base">ویرایش پروفایل</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <button
            @click="handleSettingClick('customize-link')"
            class="w-full flex items-center justify-between py-4 border-b border-border/20"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-link text-foreground text-lg"></i>
              <span class="font-medium text-foreground text-base">سفارشی‌سازی لینک</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <button
            @click="handleSettingClick('customize-qr')"
            class="w-full flex items-center justify-between py-4 border-b border-border/20"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-qrcode text-foreground text-lg"></i>
              <span class="font-medium text-foreground text-base">سفارشی‌سازی کد QR</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <button
            @click="handleSettingClick('theme')"
            class="w-full flex items-center justify-between py-4 border-b border-border/20"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-palette text-foreground text-lg"></i>
              <span class="font-medium text-foreground text-base">تنظیمات ظاهری</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-muted-foreground">{{ getCurrentThemeLabel() }}</span>
              <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
            </div>
          </button>

          <button
            @click="handleSettingClick('language')"
            class="w-full flex items-center justify-between py-4 border-b border-border/20"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-language text-foreground text-lg"></i>
              <span class="font-medium text-foreground text-base">زبان</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-muted-foreground">{{ getCurrentLanguageLabel() }}</span>
              <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
            </div>
          </button>

          <button
            @click="handleSettingClick('notifications')"
            class="w-full flex items-center justify-between py-4 border-b border-border/20"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-bell text-foreground text-lg"></i>
              <span class="font-medium text-foreground text-base">تنظیمات اعلان‌ها</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <!-- Face ID / Touch ID -->
          <button
            v-if="showBiometricOption"
            @click="handleSettingClick('biometric')"
            class="w-full flex items-center justify-between py-4 border-b border-border/20"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-face-id text-foreground text-lg"></i>
              <span class="font-medium text-foreground text-base">Face ID / Touch ID</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="isBiometricEnabled" class="text-xs text-primary bg-primary/10 px-2 py-1 rounded">فعال</span>
              <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
            </div>
          </button>

          <button
            disabled
            class="w-full flex items-center justify-between py-4 border-b border-border/20 opacity-50 cursor-not-allowed"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-key text-foreground text-lg"></i>
              <span class="font-medium text-foreground text-base">تغییر رمز عبور</span>
              <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">بزودی</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <button
            disabled
            class="w-full flex items-center justify-between py-4 opacity-50 cursor-not-allowed"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-map text-foreground text-lg"></i>
              <span class="font-medium text-foreground text-base">تنظیمات نقشه</span>
              <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">بزودی</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>
        </div>

        <!-- Desktop Grid -->
        <div class="hidden lg:grid lg:grid-cols-3 lg:gap-6 lg:auto-rows-fr">
          <button
            @click="handleSettingClick('edit-profile')"
            class="bg-card border border-border rounded-xl p-5 hover:bg-accent hover:border-primary/30 transition-all text-right group"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <i class="ti ti-user-edit text-primary text-2xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-base font-semibold text-foreground">ویرایش پروفایل</h3>
              </div>
              <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i>
            </div>
          </button>

          <button
            @click="handleSettingClick('customize-link')"
            class="bg-card border border-border rounded-xl p-5 hover:bg-accent hover:border-primary/30 transition-all text-right group"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <i class="ti ti-link text-primary text-2xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-base font-semibold text-foreground">سفارشی‌سازی لینک</h3>
              </div>
              <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i>
            </div>
          </button>

          <button
            @click="handleSettingClick('customize-qr')"
            class="bg-card border border-border rounded-xl p-5 hover:bg-accent hover:border-primary/30 transition-all text-right group"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <i class="ti ti-qrcode text-primary text-2xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-base font-semibold text-foreground">سفارشی‌سازی QR</h3>
              </div>
              <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i>
            </div>
          </button>

          <button
            @click="handleSettingClick('theme')"
            class="bg-card border border-border rounded-xl p-5 hover:bg-accent hover:border-primary/30 transition-all text-right group"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <i class="ti ti-palette text-primary text-2xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-base font-semibold text-foreground mb-1">تنظیمات ظاهری</h3>
                <span class="text-xs text-primary font-medium">{{ getCurrentThemeLabel() }}</span>
              </div>
              <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i>
            </div>
          </button>

          <button
            @click="handleSettingClick('language')"
            class="bg-card border border-border rounded-xl p-5 hover:bg-accent hover:border-primary/30 transition-all text-right group"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <i class="ti ti-language text-primary text-2xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-base font-semibold text-foreground mb-1">تنظیمات زبان</h3>
                <span class="text-xs text-primary font-medium">{{ getCurrentLanguageLabel() }}</span>
              </div>
              <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i>
            </div>
          </button>

          <button
            @click="handleSettingClick('notifications')"
            class="bg-card border border-border rounded-xl p-5 hover:bg-accent hover:border-primary/30 transition-all text-right group"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <i class="ti ti-bell text-primary text-2xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-base font-semibold text-foreground">اعلان‌ها</h3>
              </div>
              <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i>
            </div>
          </button>

          <!-- Face ID / Touch ID - Desktop -->
          <button
            v-if="showBiometricOption"
            @click="handleSettingClick('biometric')"
            class="bg-card border border-border rounded-xl p-5 hover:bg-accent hover:border-primary/30 transition-all text-right group"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <i class="ti ti-face-id text-blue-500 text-2xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-base font-semibold text-foreground mb-1">Face ID / Touch ID</h3>
                <span v-if="isBiometricEnabled" class="text-xs text-primary font-medium">فعال</span>
                <span v-else class="text-xs text-muted-foreground font-medium">غیرفعال</span>
              </div>
              <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i>
            </div>
          </button>

          <button
            disabled
            class="bg-card border border-border rounded-xl p-5 opacity-50 cursor-not-allowed text-right"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <i class="ti ti-key text-muted-foreground text-2xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-base font-semibold text-foreground">تغییر رمز عبور</h3>
              </div>
              <span class="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">بزودی</span>
            </div>
          </button>

          <button
            disabled
            class="bg-card border border-border rounded-xl p-5 opacity-50 cursor-not-allowed text-right"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <i class="ti ti-map text-muted-foreground text-2xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-base font-semibold text-foreground">تنظیمات نقشه</h3>
              </div>
              <span class="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">بزودی</span>
            </div>
          </button>
        </div>

      </div>
    </div>

    <!-- Theme Settings Bottom Sheet -->
    <UiBottomSheet
      v-model="isThemeSheetOpen"
      title="تنظیمات ظاهری"
      size="auto"
      :closable="true"
      :close-on-backdrop="false"
    >
      <div class="px-6 py-6 space-y-6">
        <!-- Theme Mode Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <i class="ti ti-palette text-primary text-xl"></i>
            </div>
            <div>
              <h4 class="text-base font-semibold text-foreground">حالت تم</h4>
              <p class="text-xs text-muted-foreground">انتخاب حالت روشن یا تاریک</p>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <button
              @click="handleThemeModeChange('light')"
              :class="[
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:outline-none',
                currentThemeMode === 'light' 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-border bg-card hover:border-primary/50 hover:bg-accent'
              ]"
            >
              <div :class="[
                'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                currentThemeMode === 'light' ? 'bg-yellow-500/20' : 'bg-muted'
              ]">
                <i class="ti ti-sun text-yellow-600 text-2xl"></i>
              </div>
              <span class="text-sm font-medium text-foreground">روشن</span>
            </button>
            <button
              @click="handleThemeModeChange('dark')"
              :class="[
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:outline-none',
                currentThemeMode === 'dark' 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-border bg-card hover:border-primary/50 hover:bg-accent'
              ]"
            >
              <div :class="[
                'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                currentThemeMode === 'dark' ? 'bg-blue-500/20' : 'bg-muted'
              ]">
                <i class="ti ti-moon text-blue-600 text-2xl"></i>
              </div>
              <span class="text-sm font-medium text-foreground">تاریک</span>
            </button>
            <button
              @click="handleThemeModeChange('system')"
              :class="[
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:outline-none',
                currentThemeMode === 'system' 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-border bg-card hover:border-primary/50 hover:bg-accent'
              ]"
            >
              <div :class="[
                'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                currentThemeMode === 'system' ? 'bg-green-500/20' : 'bg-muted'
              ]">
                <i class="ti ti-device-desktop text-green-600 text-2xl"></i>
              </div>
              <span class="text-sm font-medium text-foreground">سیستم</span>
            </button>
          </div>
        </div>

        <!-- Color Scheme Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <i class="ti ti-color-swatch text-primary text-xl"></i>
            </div>
            <div>
              <h4 class="text-base font-semibold text-foreground">رنگ اصلی</h4>
              <p class="text-xs text-muted-foreground">انتخاب رنگ تم اپلیکیشن</p>
            </div>
          </div>
          <ClientOnly>
            <div class="flex gap-3 flex-wrap justify-start">
              <button
                v-for="color in colorSchemes"
                :key="color.name"
                @click="handleColorSchemeChange(color.name)"
                :class="[
                  'relative w-12 h-12 rounded-xl transition-all duration-200 p-1 focus:outline-none focus-visible:outline-none focus:ring-0',
                  currentColorScheme === color.name 
                    ? 'shadow-lg ring-2 ring-offset-2' 
                    : 'hover:shadow-md'
                ]"
                :style="currentColorScheme === color.name ? { '--tw-ring-color': color.color } : {}"
                :title="getColorName(color.name)"
              >
                <div 
                  class="w-full h-full rounded-lg border"
                  :style="{ 
                    backgroundColor: color.color,
                    borderColor: color.color,
                    opacity: currentColorScheme === color.name ? '1' : '0.9'
                  }"
                >
                  <i 
                    v-if="currentColorScheme === color.name" 
                    class="ti ti-check text-white text-xl drop-shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  ></i>
                </div>
              </button>
            </div>
          </ClientOnly>
        </div>

        <!-- Apply Button -->
        <div class="pt-2">
          <button
            @click="applyThemeChanges"
            class="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3.5 px-6 rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
          >
            <i class="ti ti-check text-lg"></i>
            <span>اعمال تغییرات</span>
          </button>
        </div>
      </div>
    </UiBottomSheet>

    <!-- Language Settings Bottom Sheet -->
    <UiBottomSheet
      v-model="isLanguageSheetOpen"
      title="تنظیمات زبان"
      size="auto"
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

    <!-- Biometric Settings Bottom Sheet -->
    <UiBottomSheet
      v-model="isBiometricSheetOpen"
      title="Face ID / Touch ID"
      size="auto"
      :closable="true"
      :close-on-backdrop="true"
    >
      <div class="px-6 py-4 pb-6">
        <div class="text-center mb-6">
          <div class="w-20 h-20 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
            <i class="ti ti-face-id text-blue-500 text-4xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-foreground mb-2">
            {{ isBiometricEnabled ? 'Face ID فعال است' : 'Face ID / Touch ID' }}
          </h3>
          <p class="text-sm text-muted-foreground">
            {{ isBiometricEnabled 
              ? 'می‌توانید با Face ID یا Touch ID وارد حساب خود شوید' 
              : 'برای ورود سریع‌تر، Face ID یا Touch ID را فعال کنید' 
            }}
          </p>
        </div>

        <button
          @click="handleBiometricToggle"
          :disabled="isWebAuthnLoading"
          :class="[
            'w-full py-3.5 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2',
            isBiometricEnabled 
              ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          ]"
        >
          <template v-if="isWebAuthnLoading">
            <div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <span>در حال پردازش...</span>
          </template>
          <template v-else>
            <i :class="isBiometricEnabled ? 'ti ti-x' : 'ti ti-check'" class="text-lg"></i>
            <span>{{ isBiometricEnabled ? 'غیرفعال کردن' : 'فعال‌سازی' }}</span>
          </template>
        </button>

        <p class="text-xs text-muted-foreground text-center mt-4">
          این قابلیت فقط در دستگاه‌های پشتیبانی‌کننده Face ID / Touch ID کار می‌کند
        </p>
      </div>
    </UiBottomSheet>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFormStore } from '~/stores/form'
import { useWebAuthn } from '~/composables/useWebAuthn'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const formStore = useFormStore()
const userStore = useUserStore()

// PWA safe navigation
const { $pwa } = useNuxtApp()

const goBack = () => {
  if ($pwa?.safeNavigateBack) {
    $pwa.safeNavigateBack('/dashboard')
  } else {
    // fallback
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true
    if (isStandalone || window.history.length <= 2) {
      window.location.href = '/dashboard'
    } else {
      window.history.back()
    }
  }
}

// WebAuthn
const { 
  isSupported: isWebAuthnSupported, 
  isPlatformAuthenticatorAvailable,
  isLoading: isWebAuthnLoading,
  registerPasskey,
  isPasskeyEnabled,
  disablePasskey
} = useWebAuthn()

// Biometric state
const showBiometricOption = ref(false)
const isBiometricEnabled = ref(false)
const isBiometricSheetOpen = ref(false)

// Check biometric support on mount
onMounted(async () => {
  if (process.client) {
    showBiometricOption.value = isWebAuthnSupported.value && isPlatformAuthenticatorAvailable.value
    isBiometricEnabled.value = isPasskeyEnabled()
  }
})

// Default card for edit-profile navigation
const defaultCard = computed(() => formStore.defaultCard)

// Theme management
const isThemeSheetOpen = ref(false)
const isLanguageSheetOpen = ref(false)

// Theme mode
const currentThemeMode = ref<'light' | 'dark' | 'system'>('system')
const currentColorScheme = ref<string>('blue')
const currentLanguage = ref<'fa' | 'en'>('fa')

// Initialize from localStorage
if (process.client) {
  const savedMode = localStorage.getItem('theme-mode')
  if (savedMode) {
    currentThemeMode.value = savedMode as 'light' | 'dark' | 'system'
  } else {
    // اگر mode ذخیره نشده بود، system رو پیش‌فرض می‌ذاریم
    currentThemeMode.value = 'system'
    localStorage.setItem('theme-mode', 'system')
  }
  
  const savedColor = localStorage.getItem('theme-color')
  if (savedColor) {
    currentColorScheme.value = savedColor
  } else {
    // اگر رنگ ذخیره نشده بود، black رو پیش‌فرض می‌ذاریم
    currentColorScheme.value = 'black'
    localStorage.setItem('theme-color', 'black')
  }
  
  const savedLang = localStorage.getItem('language') as 'fa' | 'en'
  if (savedLang) currentLanguage.value = savedLang
}

// Color schemes
const colorSchemes = [
  { name: 'black', color: '#0f0f0f' },
  { name: 'blue', color: '#3b82f6' },
  { name: 'violet', color: '#8b5cf6' },
  { name: 'green', color: '#10b981' },
  { name: 'orange', color: '#f59e0b' },
  { name: 'red', color: '#ef4444' }
]

const getColorName = (colorName: string) => {
  const colorNames: { [key: string]: string } = {
    'black': 'مشکی',
    'blue': 'آبی',
    'violet': 'بنفش',
    'green': 'سبز',
    'orange': 'نارنجی',
    'red': 'قرمز'
  }
  return colorNames[colorName] || colorName
}

const getCurrentThemeLabel = () => {
  switch (currentThemeMode.value) {
    case 'light': return 'روشن'
    case 'dark': return 'تاریک'
    case 'system': return 'اتوماتیک'
    default: return 'اتوماتیک'
  }
}

const getCurrentLanguageLabel = () => {
  switch (currentLanguage.value) {
    case 'fa': return 'فارسی'
    case 'en': return 'English'
    default: return 'فارسی'
  }
}

const handleSettingClick = (setting: string) => {
  switch (setting) {
    case 'edit-profile':
      const cardId = defaultCard.value?.id
      if (cardId) {
        router.push(`/dashboard/edit-card?id=${cardId}&slug=${defaultCard.value?.slug || ''}`)
      } else {
        router.push('/dashboard/edit-card')
      }
      break
    case 'customize-link':
      router.push('/profile/customize-link')
      break
    case 'customize-qr':
      router.push('/QR')
      break
    case 'theme':
      isThemeSheetOpen.value = true
      break
    case 'language':
      isLanguageSheetOpen.value = true
      break
    case 'notifications':
      router.push('/settings/notifications')
      break
    case 'biometric':
      isBiometricSheetOpen.value = true
      break
    case 'delete-account':
      // Handle delete account
      break
    default:
      break
  }
}

// Handle Biometric toggle
const handleBiometricToggle = async () => {
  if (isBiometricEnabled.value) {
    // غیرفعال کردن
    disablePasskey()
    isBiometricEnabled.value = false
    localStorage.removeItem('passkey_auth_token')
  } else {
    // فعال کردن - ثبت passkey جدید
    const user = userStore.user
    if (!user) {
      alert('لطفاً ابتدا وارد شوید')
      return
    }
    
    const result = await registerPasskey(
      String(user.id || user.phone || user.email),
      user.phone || user.email || 'user',
      user.name || 'کاربر لینکو'
    )
    
    if (result.success) {
      isBiometricEnabled.value = true
      // ذخیره توکن فعلی برای استفاده در لاگین با Face ID
      const currentToken = localStorage.getItem('auth_token')
      if (currentToken) {
        localStorage.setItem('passkey_auth_token', currentToken)
      }
      alert('Face ID / Touch ID با موفقیت فعال شد')
    } else {
      alert(result.error || 'خطا در فعال‌سازی')
    }
  }
  isBiometricSheetOpen.value = false
}

const handleThemeModeChange = (mode: 'light' | 'dark' | 'system') => {
  currentThemeMode.value = mode
  
  if (process.client) {
    localStorage.setItem('theme-mode', mode)
    
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

const handleColorSchemeChange = (scheme: string) => {
  currentColorScheme.value = scheme
  
  if (process.client) {
    localStorage.setItem('theme-color', scheme)
    
    // Remove all theme classes
    document.documentElement.classList.forEach(cls => {
      if (cls.startsWith('theme-')) {
        document.documentElement.classList.remove(cls)
      }
    })
    
    // Add new theme class
    document.documentElement.classList.add(`theme-${scheme}`)
  }
}

const applyThemeChanges = () => {
  isThemeSheetOpen.value = false
}

const handleLanguageChange = async (lang: 'fa' | 'en') => {
  currentLanguage.value = lang
  
  if (process.client) {
    localStorage.setItem('language', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'
  }
  
  setTimeout(() => {
    isLanguageSheetOpen.value = false
  }, 300)
}
</script>
