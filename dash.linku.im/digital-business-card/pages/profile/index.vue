<template>
  <div class="min-h-screen bg-background pb-24 lg:pb-12">
    <!-- Profile Content -->
    <div class="px-3 lg:px-6 py-3 lg:py-6 bg-background">
      <div class="w-full max-w-6xl mx-auto">
        <!-- Desktop Layout -->
        <div class="hidden lg:grid lg:grid-cols-3 lg:gap-6">
          <!-- Left Column - Profile Card -->
          <div class="lg:col-span-1">
            <div class="bg-card rounded-2xl p-8 border border-border sticky top-24 shadow-sm">
              <div v-if="isProfileLoaded" class="text-center">
                <!-- Avatar with gradient border -->
                <div class="relative w-32 h-32 mx-auto mb-6">
                  <div class="absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-full blur-sm"></div>
                  <div class="relative w-full h-full rounded-full flex items-center justify-center overflow-hidden ring-4 ring-card bg-muted">
                    <img 
                      v-if="userAvatar" 
                      :src="userAvatar" 
                      :alt="userName"
                      class="w-full h-full object-cover"
                    />
                    <i v-else class="ti ti-user text-primary text-5xl"></i>
                  </div>
                </div>

                <!-- User Info -->
                <div class="mb-6">
                  <div class="flex items-center justify-center gap-2 mb-2">
                    <h2 class="text-2xl font-bold text-foreground">{{ userName }}</h2>
                    <i 
                      v-if="isPro"
                      class="ti ti-crown text-primary text-2xl"
                    />
                  </div>
                  <p class="text-sm text-muted-foreground font-mono" dir="ltr">{{ userPhone }}</p>
                </div>
              </div>
              <div v-else class="text-center animate-pulse">
                <div class="w-32 h-32 mx-auto bg-muted rounded-full mb-6"></div>
                <div class="h-7 w-36 bg-muted rounded mx-auto mb-2"></div>
                <div class="h-4 w-28 bg-muted rounded mx-auto mb-6"></div>
                <div class="h-12 w-full bg-muted rounded-xl"></div>
              </div>
              
              <!-- Premium Status -->
              <div class="mt-6 pt-6 border-t border-border" v-if="isProfileLoaded">
                <button 
                  v-if="!isPro" 
                  @click="goToPremium"
                  class="w-full p-4 rounded-xl hover:scale-[1.02] transition-all cursor-pointer text-center bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border border-primary/20"
                >
                  <i class="ti ti-crown text-3xl mb-2 block text-primary"></i>
                  <p class="font-bold text-base text-primary mb-1">ارتقا به حساب ویژه</p>
                  <p class="text-xs text-muted-foreground">دسترسی به تمام امکانات</p>
                </button>
                <div 
                  v-else 
                  class="w-full p-4 rounded-xl text-center bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20"
                >
                  <i class="ti ti-rosette-discount-check text-3xl mb-2 block text-green-500"></i>
                  <p class="font-bold text-base text-green-500 mb-1">اشتراک ویژه فعال</p>
                  <p class="text-xs text-green-600/70">{{ subscriptionStatusText }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Menu Items -->
          <div class="lg:col-span-2">
            <div class="bg-card rounded-2xl border border-border overflow-hidden">
              <div v-if="isProfileLoaded" class="divide-y divide-border">
                <!-- وضعیت حساب -->
                <button
                  @click="handleMenuClick('account')"
                  class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <i class="ti ti-user-check text-green-500 text-lg"></i>
                    </div>
                    <span class="font-medium text-foreground">وضعیت حساب</span>
                  </div>
                  <i class="ti ti-chevron-left text-muted-foreground"></i>
                </button>

                <!-- مالی -->
                <button
                  @click="handleMenuClick('financial')"
                  class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <i class="ti ti-wallet text-blue-500 text-lg"></i>
                    </div>
                    <span class="font-medium text-foreground">مالی و تراکنش‌ها</span>
                  </div>
                  <i class="ti ti-chevron-left text-muted-foreground"></i>
                </button>

                <!-- خرید محصولات -->
                <button
                  @click="handleMenuClick('product')"
                  class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <i class="ti ti-shopping-cart text-purple-500 text-lg"></i>
                    </div>
                    <span class="font-medium text-foreground">خرید محصولات لینکو</span>
                  </div>
                  <i class="ti ti-chevron-left text-muted-foreground"></i>
                </button>

                <!-- فعال‌سازی دستگاه -->
                <button
                  @click="handleMenuClick('device')"
                  class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <i class="ti ti-nfc text-orange-500 text-lg"></i>
                    </div>
                    <span class="font-medium text-foreground">فعال‌سازی دستگاه</span>
                  </div>
                  <i class="ti ti-chevron-left text-muted-foreground"></i>
                </button>

                <!-- محصولات من -->
                <button
                  @click="handleMenuClick('mydevice')"
                  class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                      <i class="ti ti-device-mobile-check text-cyan-500 text-lg"></i>
                    </div>
                    <span class="font-medium text-foreground">محصولات فعال من</span>
                  </div>
                  <i class="ti ti-chevron-left text-muted-foreground"></i>
                </button>

                <!-- مدیریت اشتراک / ارتقاء به پریمیوم -->
                <button
                  @click="handleMenuClick('premium')"
                  class="w-full flex items-center justify-between p-4 transition-colors"
                  :class="!isPro ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted'"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="!isPro ? 'bg-primary/15' : 'bg-green-500/10'">
                      <i class="ti ti-crown text-lg" :class="!isPro ? 'text-primary' : 'text-green-500'"></i>
                    </div>
                    <span class="font-medium" :class="!isPro ? 'text-primary' : 'text-foreground'">{{ isPro ? 'مدیریت اشتراک' : 'ارتقاء به حساب ویژه' }}</span>
                  </div>
                  <i class="ti ti-chevron-left" :class="!isPro ? 'text-primary' : 'text-muted-foreground'"></i>
                </button>

                <!-- غرفه ساز لینکو (بزودی) -->
                <button
                  disabled
                  class="w-full flex items-center justify-between p-4 opacity-50 cursor-not-allowed"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <i class="ti ti-building-store text-muted-foreground text-lg"></i>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-foreground">غرفه ساز لینکو</span>
                      <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">بزودی</span>
                    </div>
                  </div>
                  <i class="ti ti-chevron-left text-muted-foreground"></i>
                </button>

                <!-- دعوت از دوستان (بزودی) -->
                <button
                  disabled
                  class="w-full flex items-center justify-between p-4 opacity-50 cursor-not-allowed"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <i class="ti ti-users text-muted-foreground text-lg"></i>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-foreground">دعوت از دوستان</span>
                      <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">بزودی</span>
                    </div>
                  </div>
                  <i class="ti ti-chevron-left text-muted-foreground"></i>
                </button>

                <!-- تخفیفات و جایزه‌ها -->
                <button
                  @click="handleMenuClick('rewards')"
                  class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <i class="ti ti-gift text-orange-500 text-lg"></i>
                    </div>
                    <span class="font-medium text-foreground">تخفیفات و جایزه‌ها</span>
                  </div>
                  <i class="ti ti-chevron-left text-muted-foreground"></i>
                </button>

                <!-- تنظیمات نقشه (بزودی) -->
                <button
                  disabled
                  class="w-full flex items-center justify-between p-4 opacity-50 cursor-not-allowed"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <i class="ti ti-map text-muted-foreground text-lg"></i>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-foreground">تنظیمات نقشه</span>
                      <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">بزودی</span>
                    </div>
                  </div>
                  <i class="ti ti-chevron-left text-muted-foreground"></i>
                </button>

                <!-- راهنما و پشتیبانی -->
                <button
                  @click="handleMenuClick('support')"
                  class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <i class="ti ti-help text-red-500 text-lg"></i>
                    </div>
                    <span class="font-medium text-foreground">راهنما و پشتیبانی</span>
                  </div>
                  <i class="ti ti-chevron-left text-muted-foreground"></i>
                </button>

                <!-- ویدیوهای آموزشی -->
                <button
                  @click="handleMenuClick('tutorials')"
                  class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <i class="ti ti-video text-purple-500 text-lg"></i>
                    </div>
                    <span class="font-medium text-foreground">ویدیوهای آموزشی</span>
                  </div>
                  <i class="ti ti-chevron-left text-muted-foreground"></i>
                </button>

                <!-- درباره ما -->
                <button
                  @click="handleMenuClick('about')"
                  class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <i class="ti ti-info-circle text-foreground text-lg"></i>
                    </div>
                    <span class="font-medium text-foreground">درباره</span>
                  </div>
                  <i class="ti ti-chevron-left text-muted-foreground"></i>
                </button>

                <!-- تنظیمات -->
                <button
                  @click="handleMenuClick('settings')"
                  class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <i class="ti ti-settings text-foreground text-lg"></i>
                    </div>
                    <span class="font-medium text-foreground">تنظیمات</span>
                  </div>
                  <i class="ti ti-chevron-left text-muted-foreground"></i>
                </button>

                <!-- خروج از حساب -->
                <button
                  @click="handleLogout"
                  class="w-full flex items-center justify-between p-4 hover:bg-red-500/10 transition-colors group"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                      <i class="ti ti-logout text-red-500 text-lg"></i>
                    </div>
                    <span class="font-medium text-red-500">خروج از حساب</span>
                  </div>
                  <i class="ti ti-chevron-left text-red-500"></i>
                </button>
              </div>
              <div v-else class="divide-y divide-border">
                <div v-for="i in 13" :key="i" class="flex items-center justify-between p-4 animate-pulse">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-muted rounded-xl"></div>
                    <div class="space-y-2">
                      <div class="h-4 w-32 bg-muted rounded"></div>
                      <div class="h-3 w-24 bg-muted rounded"></div>
                    </div>
                  </div>
                  <div class="w-3 h-3 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Layout -->
        <div class="lg:hidden">
          <!-- Profile Header -->
          <div v-if="isProfileLoaded" class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center overflow-hidden ring-2 ring-border">
              <img 
                v-if="userAvatar" 
                :src="userAvatar" 
                :alt="userName"
                class="w-full h-full object-cover"
              />
              <i v-else class="ti ti-user text-primary text-2xl"></i>
            </div>
            <div class="flex-1 text-right">
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-bold text-foreground">{{ userName }}</h2>
                <i 
                  v-if="isPro"
                  class="ti ti-rosette-discount-check-filled text-primary text-xl"
                />
              </div>
              <p class="text-sm text-muted-foreground pt-1" dir="ltr">{{ userPhone }}</p>
            </div>
          </div>
          <div v-else class="flex items-center gap-4 mb-6 animate-pulse">
            <div class="w-16 h-16 bg-muted rounded-full"></div>
            <div class="flex-1 text-right space-y-2">
              <div class="flex items-center gap-2 justify-end">
                <div class="h-6 w-32 bg-muted rounded"></div>
                <div class="w-5 h-5 bg-muted rounded-full"></div>
              </div>
              <div class="h-4 w-24 bg-muted rounded ml-auto"></div>
            </div>
            <div class="w-9 h-9 bg-muted rounded-full"></div>
          </div>

          <!-- Premium Banner -->
          <div class="mb-6" v-if="isProfileLoaded">
            <button 
              v-if="!isPro" 
              @click="goToPremium"
              class="w-full p-4 rounded-2xl flex items-center justify-between hover:opacity-90 transition-all cursor-pointer bg-primary/10 hover:bg-primary/20 border border-primary/20"
            >
              <div class="flex-1 text-right">
                <p class="font-semibold text-base text-primary">هیچ اشتراک فعالی ندارید</p>
                <p class="text-sm mt-1 text-muted-foreground">برای استفاده از امکانات ویژه، اشتراک تهیه کنید</p>
              </div>
              <div class="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <i class="ti ti-crown text-xl text-primary"></i>
              </div>
            </button>
            <div 
              v-else 
              class="w-full p-4 rounded-2xl flex items-center justify-between bg-green-500/10 border border-green-500/20"
            >
              <div class="flex-1 text-right">
                <p class="font-semibold text-base flex items-center gap-2 text-green-500">
                  <i class="ti ti-crown text-lg"></i>
                  اشتراک ویژه فعال است
                </p>
                <p class="text-sm mt-1 text-green-600/70">شما از تمام امکانات پریمیوم استفاده می‌کنید</p>
              </div>
              <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <i class="ti ti-check text-xl text-green-500"></i>
              </div>
            </div>
          </div>
          <div v-else class="mb-6 animate-pulse">
          <div class="bg-muted border border-border p-4 rounded-2xl flex items-center justify-between">
            <div class="flex-1 space-y-2">
              <div class="h-5 w-48 bg-muted/50 rounded"></div>
              <div class="h-4 w-32 bg-muted/50 rounded"></div>
            </div>
            <div class="w-12 h-12 bg-muted/50 rounded-xl"></div>
          </div>
        </div>

          <!-- Menu Items (Mobile) -->
          <div class="space-y-0 divide-y divide-border border-t border-border" v-if="isProfileLoaded">
          <!-- وضعیت حساب -->
          <button
            @click="handleMenuClick('account')"
            class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-user-check text-primary text-lg"></i>
              <span class="font-medium text-foreground text-base">وضعیت حساب</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
            </div>
          </button>

          <!-- مالی -->
          <button
            @click="handleMenuClick('financial')"
            class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-wallet text-primary text-lg"></i>
              <span class="font-medium text-foreground text-base">مالی و تراکنش‌ها</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <!-- خرید محصولات -->
          <button
            @click="handleMenuClick('product')"
            class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-shopping-cart text-primary text-lg"></i>
              <span class="font-medium text-foreground text-base">خرید محصولات لینکو</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <!-- فعال‌سازی دستگاه -->
          <button
            @click="handleMenuClick('device')"
            class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-nfc text-primary text-lg"></i>
              <span class="font-medium text-foreground text-base">فعال‌سازی دستگاه</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <!-- محصولات من -->
          <button
            @click="handleMenuClick('mydevice')"
            class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-device-mobile-check text-primary text-lg"></i>
              <span class="font-medium text-foreground text-base">محصولات فعال من</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <!-- مدیریت اشتراک / ارتقاء به پریمیوم -->
          <button
            @click="handleMenuClick('premium')"
            class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-crown text-primary text-lg"></i>
              <span class="font-medium text-foreground text-base">{{ isPro ? 'مدیریت اشتراک' : 'ارتقاء به حساب ویژه' }}</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <!-- غرفه ساز لینکو (بزودی) -->
          <button
            disabled
            class="w-full flex items-center justify-between py-4 opacity-50 cursor-not-allowed"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-building-store text-muted-foreground text-lg"></i>
              <span class="font-medium text-foreground text-base">غرفه ساز لینکو</span>
              <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">بزودی</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <!-- دعوت از دوستان (بزودی) -->
          <button
            disabled
            class="w-full flex items-center justify-between py-4 opacity-50 cursor-not-allowed"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-users text-muted-foreground text-lg"></i>
              <span class="font-medium text-foreground text-base">دعوت از دوستان</span>
              <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">بزودی</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <!-- تخفیفات و جایزه‌ها -->
          <button
            @click="handleMenuClick('rewards')"
            class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-gift text-orange-500 text-lg"></i>
              <span class="font-medium text-foreground text-base">تخفیفات و جایزه‌ها</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <!-- تنظیمات نقشه (بزودی) -->
          <button
            disabled
            class="w-full flex items-center justify-between py-4 opacity-50 cursor-not-allowed"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-map text-muted-foreground text-lg"></i>
              <span class="font-medium text-foreground text-base">تنظیمات نقشه</span>
              <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">بزودی</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <!-- راهنما و پشتیبانی -->
          <button
            @click="handleMenuClick('support')"
            class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-help text-primary text-lg"></i>
              <span class="font-medium text-foreground text-base">راهنما و پشتیبانی</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <!-- ویدیوهای آموزشی -->
          <button
            @click="handleMenuClick('tutorials')"
            class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-video text-purple-500 text-lg"></i>
              <span class="font-medium text-foreground text-base">ویدیوهای آموزشی</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <!-- درباره ما -->
          <button
            @click="handleMenuClick('about')"
            class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-info-circle text-primary text-lg"></i>
              <span class="font-medium text-foreground text-base">درباره</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <!-- تنظیمات -->
          <button
            @click="handleMenuClick('settings')"
            class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-settings text-primary text-lg"></i>
              <span class="font-medium text-foreground text-base">تنظیمات</span>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground text-sm"></i>
          </button>

          <!-- خروج از حساب -->
          <button
            @click="handleLogout"
            class="w-full flex items-center justify-between py-4 hover:bg-red-500/10 transition-colors group"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-logout text-red-500 text-lg"></i>
              <span class="font-medium text-red-500 text-base">خروج از حساب</span>
            </div>
            <i class="ti ti-chevron-left text-red-500 text-sm"></i>
          </button>
        </div>

        <!-- Skeleton Loading -->
        <div v-else class="space-y-0 divide-y divide-border border-t border-border animate-pulse">
          <div v-for="i in 13" :key="i" class="flex items-center justify-between py-4">
            <div class="flex items-center gap-3">
              <div class="w-5 h-5 bg-muted rounded"></div>
              <div class="h-4 w-36 bg-muted rounded"></div>
            </div>
            <div class="w-3 h-3 bg-muted rounded"></div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '~/stores/user.js'
import { useFormStore } from '~/stores/form.js'

const userStore = useUserStore()
const formStore = useFormStore()

// User data from store (matching dashboard)
const userName = computed(() => userStore.user?.name || 'کاربر')
const userUserName = computed(() => userStore.user?.userName || userStore.user?.username || '')
const userPhone = computed(() => {
  const user = userStore.user
  const countryCode = user?.countryCode || ''
  const phone = user?.phone || ''
  // اگر شماره داره، شماره رو نشون بده، وگرنه ایمیل
  if (phone) {
    return `${countryCode}${phone}`
  }
  return user?.email || ''
})
const userAvatar = computed(() => {
  const avatar = userStore.user?.avatar || formStore.defaultCard?.avatar
  return avatar || '/logo.svg'
})
const isPro = computed(() => userStore.user?.isPro || false)

// محاسبه روزهای باقی‌مانده اشتراک
const subscriptionStatusText = computed(() => {
  if (!userStore.user?.isPro) return 'دسترسی به امکانات ویژه'
  
  // بررسی روزهای باقی‌مانده
  const daysRemaining = userStore.user.daysRemaining || userStore.user.days_remaining
  if (daysRemaining !== undefined && daysRemaining !== null) {
    if (daysRemaining > 30) {
      const months = Math.floor(daysRemaining / 30)
      return `${months} ماه باقی‌مانده`
    }
    return `${daysRemaining} روز باقی‌مانده`
  }
  
  // بررسی تاریخ انقضا
  const endDate = userStore.user.subscriptionEndDate || userStore.user.subscription_end_date
  if (endDate) {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays > 30) {
      const months = Math.floor(diffDays / 30)
      return `${months} ماه باقی‌مانده`
    } else if (diffDays > 0) {
      return `${diffDays} روز باقی‌مانده`
    } else {
      return 'اشتراک منقضی شده'
    }
  }
  
  return 'تمام امکانات در دسترس شماست'
})
const isProfileLoaded = computed(() => !!userStore.user && !!userStore.user.id)

// Navigation handlers
const goToEditProfile = () => {
  const defaultCard = formStore.defaultCard
  if (defaultCard?.id && defaultCard?.slug) {
    navigateTo(`/dashboard/edit-card?id=${defaultCard.id}&slug=${defaultCard.slug}`)
  } else {
    // Fallback - page will handle redirect
    navigateTo('/dashboard/edit-card')
  }
}

const goToPremium = () => {
  navigateTo('/dashboard/checkout')
}

const handleMenuClick = (menu: string) => {
  console.log('Menu clicked:', menu)
  
  switch (menu) {
    case 'account':
      navigateTo('/settings/account-status')
      break
    case 'financial':
      navigateTo('/financial')
      break
    case 'product':
      // Link to shop or products page
      window.open('https://linkutag.com/shop', '_blank')
      break
    case 'device':
      navigateTo('/dashboard/activate')
      break
    case 'mydevice':
      navigateTo('/dashboard/my-products')
      break
    case 'premium':
      navigateTo('/dashboard/checkout')
      break
    case 'rewards':
      navigateTo('/dashboard/rewards')
      break
    case 'support':
      navigateTo('/dashboard/support')
      break
    case 'tutorials':
      navigateTo('/profile/tutorials')
      break
    case 'about':
      // Link to about page
      window.open('https://linkutag.com/about', '_blank')
      break
    case 'settings':
      navigateTo('/settings')
      break
    default:
      console.log('Unknown menu:', menu)
  }
}

const handleLogout = async () => {
  if (confirm('آیا مطمئن هستید که می‌خواهید از حساب کاربری خارج شوید؟')) {
    try {
      // Clear user data
      await userStore.logout()
      // Clear form store
      formStore.$reset()
      // Redirect to login page
      await navigateTo('/auth/login')
    } catch (error) {
      console.error('خطا در خروج از حساب:', error)
    }
  }
}

// Load user data (matching dashboard)
onMounted(async () => {
  console.log('🔍 Profile Index: Loading user data...')
  if (!userStore.user || !userStore.user.id) {
    await userStore.fetchUser()
    formStore.cards = userStore.cards
  }
  console.log('👤 User loaded:', userStore.user)
  console.log('📱 Name:', userName.value)
  console.log('👑 Is Pro:', isPro.value)
})

definePageMeta({
  middleware: 'require-activated',
  layout: 'default'
})
</script>
