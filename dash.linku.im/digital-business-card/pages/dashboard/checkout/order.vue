<template>
  <div class="min-h-screen bg-background">
    <!-- Success Modal -->
    <div v-if="showSuccessModal && !isLoading && selectedPlan" class="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50">
      <div class="bg-card rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-primary/10"></div>
        
        <div class="relative z-10">
          <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
            <i class="ti ti-check text-white text-4xl"></i>
          </div>
          
          <h3 class="text-2xl font-bold text-primary mb-3">تبریک! 🎉</h3>
          <p class="text-lg text-muted-foreground mb-6">
            اشتراک شما با موفقیت فعال شد
          </p>
          
          <div class="bg-primary/10 rounded-xl p-4 mb-6 border border-primary/20">
            <div class="font-semibold text-lg mb-2 text-primary">{{ selectedPlan?.title }} پرمیوم</div>
            <div class="text-sm text-muted-foreground">
              تا <span class="font-medium text-primary">{{ getExpiryDate() }}</span> معتبر است
            </div>
          </div>
          
          <div class="space-y-3">
            <button @click="goToDashboard" class="w-full bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-200">
              ورود به پروفایل
            </button>
            <button @click="closeSuccessModal" class="w-full text-muted-foreground font-medium py-2">
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <button @click="$router.back()" class="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <i class="ti ti-arrow-right text-xl"></i>
            <span class="text-sm font-medium">بازگشت</span>
          </button>
          <div class="text-center">
            <h1 class="text-lg font-bold text-foreground">جزئیات سفارش شما</h1>
            <p class="text-xs text-muted-foreground">تکمیل خرید اشتراک</p>
          </div>
          <div class="w-20"></div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="pt-[68px] pb-24 px-4 max-w-7xl mx-auto">
      <!-- Loading State -->
      <div v-if="isLoading || !selectedPlan" class="space-y-4 animate-pulse">
        <div class="bg-muted rounded-2xl h-40"></div>
        <div class="bg-muted rounded-2xl p-6">
          <div class="h-6 w-24 bg-muted-foreground/20 rounded mx-auto mb-3"></div>
          <div class="h-8 w-48 bg-muted-foreground/20 rounded mx-auto"></div>
        </div>
        <div class="bg-card rounded-xl p-6">
          <div class="space-y-3">
            <div v-for="n in 5" :key="n" class="flex justify-between">
              <div class="h-4 w-24 bg-muted rounded"></div>
              <div class="h-4 w-20 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
      
      <template v-else>
      <!-- Desktop Layout -->
      <div class="hidden lg:grid lg:grid-cols-3 lg:gap-6">
        <!-- Right Column - Plan Card (2/3 width) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Selected Plan Card - طراحی جدید -->
          <div class="relative">
            <!-- کارت اصلی با طراحی ماژولار -->
        <div class="bg-card rounded-3xl border border-border overflow-hidden">
          <!-- بخش بالایی - Header با آیکون و عنوان -->
          <div class="relative bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 p-6 border-b border-border">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="relative">
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-br" :class="getPlanIconGradient()" 
                       >
                    <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                    <div class="relative h-full flex items-center justify-center">
                      <i :class="[selectedPlan.icon, 'text-3xl', getPlanIconColorClass()]"></i>
                    </div>
                  </div>
                  <!-- بج تخفیف روی آیکون -->
                  <div v-if="selectedPlan.hasDiscount" class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {{ selectedPlan.discount }}
                  </div>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-foreground mb-1">{{ selectedPlan.title }}</h2>
                  <p class="text-sm text-muted-foreground flex items-center gap-1">
                    <i class="ti ti-calendar-month text-base"></i>
                    <span>{{ selectedPlan.duration }}</span>
                  </p>
                </div>
              </div>
              <div class="text-left">
                <div class="text-xs text-muted-foreground mb-1">اشتراک</div>
                <div class="px-3 py-1 rounded-lg bg-gradient-to-r text-white text-xs font-bold" :class="getPremiumBadgeGradient()">
                  پرمیوم
                </div>
              </div>
            </div>
          </div>

          <!-- بخش میانی - اطلاعات قیمت -->
          <div class="p-6 bg-gradient-to-br from-muted/20 to-transparent">
            <!-- کارت قیمت اصلی -->
            <div class="bg-gradient-to-br rounded-2xl p-6 border-2 relative overflow-hidden" :class="[getPriceCardGradient(), getPriceCardBorder()]">
              <!-- دکوراتیو پترن -->
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br to-transparent rounded-bl-full" :class="getPriceCardDecoLight()"></div>
              <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr to-transparent rounded-tr-full" :class="getPriceCardDecoDark()"></div>
              
              <div class="relative z-10">
                <!-- عنوان -->
                <div class="flex items-center justify-center gap-2 mb-4">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="getPriceIconBg()">
                    <i class="ti ti-currency-dollar text-lg" :class="getPriceIconColor()"></i>
                  </div>
                  <span class="text-sm font-medium" :class="getPriceTextColor()">قیمت اشتراک</span>
                </div>

                <!-- قیمت اصلی با خط خورده (اگر تخفیف داشت) -->
                <div v-if="selectedPlan.hasDiscount" class="text-center mb-3">
                  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <span class="text-sm text-muted-foreground line-through">{{ selectedPlan.originalPrice }}</span>
                    <span class="text-xs font-bold text-red-600 dark:text-red-400">{{ selectedPlan.discount }} تخفیف</span>
                  </div>
                </div>

                <!-- قیمت نهایی بزرگ -->
                <div class="text-center mb-4">
                  <div class="text-4xl font-black mb-1" :class="getPriceBigTextColor()">
                    {{ selectedPlan.totalPrice }}
                  </div>
                  <div class="text-xs" :class="getPriceSmallTextColor()">
                    برای {{ selectedPlan.duration }}
                  </div>
                </div>

                <!-- جدا کننده -->
                <div class="relative py-3">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t" :class="getPriceBorderColor()"></div>
                  </div>
                  <div class="relative flex justify-center">
                    <span class="px-3 bg-gradient-to-br text-xs" :class="[getBadgeGradient(), getPriceSmallTextColor()]">معادل</span>
                  </div>
                </div>

                <!-- قیمت ماهانه -->
                <div class="text-center">
                  <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl" :class="getMonthlyBadgeBg()">
                    <i class="ti ti-calendar-month" :class="getPriceIconColor()"></i>
                    <span class="text-lg font-bold" :class="getPriceBigTextColor()">{{ selectedPlan.monthlyPrice }}</span>
                    <span class="text-xs" :class="getPriceSmallTextColor()">در ماه</span>
                  </div>
                </div>

                <!-- میزان صرفه‌جویی (اگر تخفیف داشت) -->
                <div v-if="selectedPlan.hasDiscount" class="mt-4 text-center">
                  <div class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white">
                    <i class="ti ti-discount-check text-sm"></i>
                    <span class="text-xs font-medium">شما {{ selectedPlan.discountAmount }} صرفه‌جویی می‌کنید</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- بخش پایینی - ویژگی‌ها -->
          <div class="p-6 bg-gradient-to-br from-primary/3 to-transparent border-t border-border">
            <div class="flex items-center justify-center gap-6 flex-wrap">
              <div class="flex items-center gap-2 text-sm">
                <div class="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <i class="ti ti-check text-green-600 dark:text-green-400"></i>
                </div>
                <span class="text-muted-foreground">دسترسی کامل</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <i class="ti ti-sparkles text-purple-600 dark:text-purple-400"></i>
                </div>
                <span class="text-muted-foreground">امکانات ویژه</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <i class="ti ti-headset text-blue-600 dark:text-blue-400"></i>
                </div>
                <span class="text-muted-foreground">پشتیبانی ویژه</span>
              </div>
            </div>
          </div>
        </div>

        <!-- دکوراتیو - دایره‌های پس‌زمینه -->
        <div class="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 blur-3xl -z-10"></div>
        <div class="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-accent/5 to-primary/5 blur-3xl -z-10"></div>
      </div>
        </div>

        <!-- Left Sidebar - Summary & Payment (1/3 width, sticky) -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 space-y-4">
      <!-- Order Summary -->
      <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-4 flex items-center">
          <i class="ti ti-receipt text-xl ml-2 text-primary"></i>
          خلاصه سفارش
        </h3>
        
        <div class="space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-border">
            <span class="text-muted-foreground">نوع اشتراک:</span>
            <span class="text-foreground font-medium">{{ selectedPlan.title }} پرمیوم</span>
          </div>
          
          <div class="flex justify-between items-center py-2 border-b border-border">
            <span class="text-muted-foreground">مدت اشتراک:</span>
            <span class="text-foreground font-medium">{{ selectedPlan.duration }}</span>
          </div>
          
          <div v-if="selectedPlan.hasDiscount" class="flex justify-between items-center py-2 border-b border-border">
            <span class="text-muted-foreground">قیمت اصلی:</span>
            <span class="text-muted-foreground line-through">{{ selectedPlan.originalPrice }}</span>
          </div>
          
          <div v-if="selectedPlan.hasDiscount" class="flex justify-between items-center py-2 border-b border-border">
            <span class="text-green-600 dark:text-green-400">تخفیف ({{ selectedPlan.discount }}):</span>
            <span class="text-green-600 dark:text-green-400 font-medium">-{{ selectedPlan.discountAmount }}</span>
          </div>
          
          <div class="flex justify-between items-center py-3 rounded-lg px-3 bg-primary/10">
            <span class="text-lg font-bold text-foreground">مبلغ نهایی:</span>
            <span class="text-2xl font-bold text-primary">{{ selectedPlan.totalPrice }}</span>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-4 flex items-center">
          <i class="ti ti-credit-card text-xl ml-2 text-primary"></i>
          روش پرداخت
        </h3>
        
        <div class="space-y-3">
          <!-- کارت بانکی - با رنگ‌بندی داینامیک -->
          <div class="relative overflow-hidden rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-all duration-200 border-2" 
               :class="[getPaymentCardGradient(), getPaymentCardBorder()]">
            <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5"></div>
            <div class="relative flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center border" 
                     :class="getPaymentIconBg()">
                  <i class="ti ti-credit-card text-2xl" :class="getPaymentIconColor()"></i>
                </div>
                <div class="text-right">
                  <div class="font-bold text-base mb-0.5" :class="getPaymentTextColor()">کارت بانکی</div>
                  <div class="text-xs" :class="getPaymentSubTextColor()">پرداخت آنلاین با کارت</div>
                </div>
              </div>
              <div class="w-6 h-6 rounded-full flex items-center justify-center" :class="getPaymentCheckBg()">
                <i class="ti ti-check text-white text-sm"></i>
              </div>
            </div>
          </div>
          
          <!-- کیف پول - غیرفعال -->
          <div class="relative overflow-hidden rounded-xl bg-muted p-5 cursor-not-allowed opacity-50 border border-border">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-card flex items-center justify-center border border-border">
                  <i class="ti ti-wallet text-2xl text-muted-foreground"></i>
                </div>
                <div class="text-right">
                  <div class="font-medium text-muted-foreground text-base mb-0.5">کیف پول دیجیتال</div>
                  <div class="text-xs text-muted-foreground">به زودی در دسترس</div>
                </div>
              </div>
              <div class="w-6 h-6 rounded-full border-2 border-muted-foreground/30"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Terms -->
      <div class="bg-card rounded-xl p-4 shadow-sm border border-border">
        <div class="flex items-start">
          <input type="checkbox" id="terms" class="mt-1 ml-3" checked>
          <label for="terms" class="text-sm text-foreground cursor-pointer">
            با <span class="text-primary underline font-medium">قوانین و مقررات</span> و 
            <span class="text-primary underline font-medium">شرایط استفاده</span> موافقم. 
            <span class="text-muted-foreground">این اشتراک به صورت خودکار تمدید نمی‌شود.</span>
          </label>
        </div>
      </div>

      <!-- Discount Code -->
      <div class="bg-card rounded-xl p-4 shadow-sm border border-border">
        <button @click="showDiscountSheet = true" class="w-full flex items-center justify-between text-right hover:bg-muted/50 p-2 rounded-lg transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <i class="ti ti-discount-2 text-primary text-xl"></i>
            </div>
            <div>
              <div class="text-sm font-medium text-foreground">کد تخفیف دارید؟</div>
              <div class="text-xs text-muted-foreground">برای اعمال کد تخفیف کلیک کنید</div>
            </div>
          </div>
          <i class="ti ti-chevron-left text-muted-foreground"></i>
        </button>
      </div>

      <!-- Security Notice -->
      <div class="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <div class="flex items-start">
          <i class="ti ti-shield-check text-green-600 dark:text-green-400 text-xl ml-3 mt-0.5"></i>
          <div class="text-sm">
            <div class="text-green-600 dark:text-green-400 font-medium mb-1">پرداخت امن</div>
            <div class="text-muted-foreground">
              تمامی اطلاعات شما با رمزگذاری SSL محافظت می‌شود. 
              هیچ اطلاعات کارتی در سرورهای ما ذخیره نمی‌شود.
            </div>
          </div>
        </div>
      </div>

      <!-- VPN Notice - فقط برای IP غیر ایرانی -->
      <div v-if="isNonIranIP" class="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
        <div class="flex items-start">
          <i class="ti ti-alert-triangle text-orange-600 dark:text-orange-400 text-xl ml-3 mt-0.5"></i>
          <div class="text-sm">
            <div class="text-orange-600 dark:text-orange-400 font-medium mb-1">توجه مهم</div>
            <div class="text-muted-foreground">
              در صورت روشن بودن فیلترشکن، آن را خاموش کنید تا پرداخت با موفقیت انجام شود.
            </div>
          </div>
        </div>
      </div>

            <!-- Payment Button for Desktop -->
            <button @click="proceedToPayment" class="hidden lg:flex w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 items-center justify-center">
              <i class="ti ti-lock text-xl ml-2"></i>
              پرداخت امن {{ selectedPlan.totalPrice }}
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Layout -->
      <div class="lg:hidden space-y-4">
        <!-- Selected Plan Card -->
        <div class="relative">
          <div class="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
            <!-- بخش بالایی - Header با آیکون و عنوان -->
            <div class="relative bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 p-6 border-b border-border">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="relative">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br" :class="getPlanIconGradient()">
                      <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                      <div class="relative h-full flex items-center justify-center">
                        <i :class="[selectedPlan.icon, 'text-3xl', getPlanIconColorClass()]"></i>
                      </div>
                    </div>
                    <div v-if="selectedPlan.hasDiscount" class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                      {{ selectedPlan.discount }}
                    </div>
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold text-foreground mb-1">{{ selectedPlan.title }}</h2>
                    <p class="text-sm text-muted-foreground flex items-center gap-1">
                      <i class="ti ti-calendar-month text-base"></i>
                      <span>{{ selectedPlan.duration }}</span>
                    </p>
                  </div>
                </div>
                <div class="text-left">
                  <div class="text-xs text-muted-foreground mb-1">اشتراک</div>
                  <div class="px-3 py-1 rounded-lg bg-gradient-to-r text-white text-xs font-bold" :class="getPremiumBadgeGradient()">
                    پرمیوم
                  </div>
                </div>
              </div>
            </div>

            <!-- بخش میانی - اطلاعات قیمت -->
            <div class="p-6 bg-gradient-to-br from-muted/20 to-transparent">
              <div class="bg-gradient-to-br rounded-2xl p-6 border-2 relative overflow-hidden" :class="[getPriceCardGradient(), getPriceCardBorder()]">
                <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br to-transparent rounded-bl-full" :class="getPriceCardDecoLight()"></div>
                <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr to-transparent rounded-tr-full" :class="getPriceCardDecoDark()"></div>
                
                <div class="relative z-10">
                  <div class="flex items-center justify-center gap-2 mb-4">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="getPriceIconBg()">
                      <i class="ti ti-currency-dollar text-lg" :class="getPriceIconColor()"></i>
                    </div>
                    <span class="text-sm font-medium" :class="getPriceTextColor()">قیمت اشتراک</span>
                  </div>

                  <div v-if="selectedPlan.hasDiscount" class="text-center mb-3">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/30">
                      <span class="text-sm text-muted-foreground line-through">{{ selectedPlan.originalPrice }}</span>
                      <span class="text-xs font-bold text-red-600 dark:text-red-400">{{ selectedPlan.discount }} تخفیف</span>
                    </div>
                  </div>

                  <div class="text-center mb-4">
                    <div class="text-4xl font-black mb-1" :class="getPriceBigTextColor()">
                      {{ selectedPlan.totalPrice }}
                    </div>
                    <div class="text-xs" :class="getPriceSmallTextColor()">
                      برای {{ selectedPlan.duration }}
                    </div>
                  </div>

                  <div class="relative py-3">
                    <div class="absolute inset-0 flex items-center">
                      <div class="w-full border-t" :class="getPriceBorderColor()"></div>
                    </div>
                    <div class="relative flex justify-center">
                      <span class="px-3 bg-gradient-to-br text-xs" :class="[getBadgeGradient(), getPriceSmallTextColor()]">معادل</span>
                    </div>
                  </div>

                  <div class="text-center">
                    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl" :class="getMonthlyBadgeBg()">
                      <i class="ti ti-calendar-month" :class="getPriceIconColor()"></i>
                      <span class="text-lg font-bold" :class="getPriceBigTextColor()">{{ selectedPlan.monthlyPrice }}</span>
                      <span class="text-xs" :class="getPriceSmallTextColor()">در ماه</span>
                    </div>
                  </div>

                  <div v-if="selectedPlan.hasDiscount" class="mt-4 text-center">
                    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white">
                      <i class="ti ti-discount-check text-sm"></i>
                      <span class="text-xs font-medium">شما {{ selectedPlan.discountAmount }} صرفه‌جویی می‌کنید</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-6 bg-gradient-to-br from-primary/3 to-transparent border-t border-border">
              <div class="flex items-center justify-center gap-6 flex-wrap">
                <div class="flex items-center gap-2 text-sm">
                  <div class="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <i class="ti ti-check text-green-600 dark:text-green-400"></i>
                  </div>
                  <span class="text-muted-foreground">دسترسی کامل</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <i class="ti ti-sparkles text-purple-600 dark:text-purple-400"></i>
                  </div>
                  <span class="text-muted-foreground">امکانات ویژه</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <i class="ti ti-headset text-blue-600 dark:text-blue-400"></i>
                  </div>
                  <span class="text-muted-foreground">پشتیبانی ویژه</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h3 class="text-lg font-semibold text-foreground mb-4 flex items-center">
            <i class="ti ti-receipt text-xl ml-2 text-primary"></i>
            خلاصه سفارش
          </h3>
          
          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-border">
              <span class="text-muted-foreground">نوع اشتراک:</span>
              <span class="text-foreground font-medium">{{ selectedPlan.title }} پرمیوم</span>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b border-border">
              <span class="text-muted-foreground">مدت اشتراک:</span>
              <span class="text-foreground font-medium">{{ selectedPlan.duration }}</span>
            </div>
            
            <div v-if="selectedPlan.hasDiscount" class="flex justify-between items-center py-2 border-b border-border">
              <span class="text-muted-foreground">قیمت اصلی:</span>
              <span class="text-muted-foreground line-through">{{ selectedPlan.originalPrice }}</span>
            </div>
            
            <div v-if="selectedPlan.hasDiscount" class="flex justify-between items-center py-2 border-b border-border">
              <span class="text-green-600 dark:text-green-400">تخفیف ({{ selectedPlan.discount }}):</span>
              <span class="text-green-600 dark:text-green-400 font-medium">-{{ selectedPlan.discountAmount }}</span>
            </div>
            
            <div class="flex justify-between items-center py-3 rounded-lg px-3 bg-primary/10">
              <span class="text-lg font-bold text-foreground">مبلغ نهایی:</span>
              <span class="text-2xl font-bold text-primary">{{ selectedPlan.totalPrice }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Methods -->
        <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h3 class="text-lg font-semibold text-foreground mb-4 flex items-center">
            <i class="ti ti-credit-card text-xl ml-2 text-primary"></i>
            روش پرداخت
          </h3>
          
          <div class="space-y-3">
            <div class="relative overflow-hidden rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-all duration-200 border-2" 
                 :class="[getPaymentCardGradient(), getPaymentCardBorder()]">
              <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5"></div>
              <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center border" 
                       :class="getPaymentIconBg()">
                    <i class="ti ti-credit-card text-2xl" :class="getPaymentIconColor()"></i>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-base mb-0.5" :class="getPaymentTextColor()">کارت بانکی</div>
                    <div class="text-xs" :class="getPaymentSubTextColor()">پرداخت آنلاین با کارت</div>
                  </div>
                </div>
                <div class="w-6 h-6 rounded-full flex items-center justify-center" :class="getPaymentCheckBg()">
                  <i class="ti ti-check text-white text-sm"></i>
                </div>
              </div>
            </div>
            
            <div class="relative overflow-hidden rounded-xl bg-muted p-5 cursor-not-allowed opacity-50 border border-border">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-card flex items-center justify-center border border-border">
                    <i class="ti ti-wallet text-2xl text-muted-foreground"></i>
                  </div>
                  <div class="text-right">
                    <div class="font-medium text-muted-foreground text-base mb-0.5">کیف پول دیجیتال</div>
                    <div class="text-xs text-muted-foreground">به زودی در دسترس</div>
                  </div>
                </div>
                <div class="w-6 h-6 rounded-full border-2 border-muted-foreground/30"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Terms -->
        <div class="bg-card rounded-xl p-4 shadow-sm border border-border">
          <div class="flex items-start">
            <input type="checkbox" id="terms" class="mt-1 ml-3" checked>
            <label for="terms" class="text-sm text-foreground cursor-pointer">
              با <span class="text-primary underline font-medium">قوانین و مقررات</span> و 
              <span class="text-primary underline font-medium">شرایط استفاده</span> موافقم. 
              <span class="text-muted-foreground">این اشتراک به صورت خودکار تمدید نمی‌شود.</span>
            </label>
          </div>
        </div>

        <!-- Security Notice -->
        <div class="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div class="flex items-start">
            <i class="ti ti-shield-check text-green-600 dark:text-green-400 text-xl ml-3 mt-0.5"></i>
            <div class="text-sm">
              <div class="text-green-600 dark:text-green-400 font-medium mb-1">پرداخت امن</div>
              <div class="text-muted-foreground">
                تمامی اطلاعات شما با رمزگذاری SSL محافظت می‌شود. 
                هیچ اطلاعات کارتی در سرورهای ما ذخیره نمی‌شود.
              </div>
            </div>
          </div>
        </div>

        <!-- VPN Notice -->
        <div v-if="isNonIranIP" class="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
          <div class="flex items-start">
            <i class="ti ti-alert-triangle text-orange-600 dark:text-orange-400 text-xl ml-3 mt-0.5"></i>
            <div class="text-sm">
              <div class="text-orange-600 dark:text-orange-400 font-medium mb-1">توجه مهم</div>
              <div class="text-muted-foreground">
                در صورت روشن بودن فیلترشکن، آن را خاموش کنید تا پرداخت با موفقیت انجام شود.
              </div>
            </div>
          </div>
        </div>

        <!-- Discount Code - Mobile -->
        <div class="bg-card rounded-xl p-4 shadow-sm border border-border">
          <button @click="showDiscountSheet = true" class="w-full flex items-center justify-between text-right hover:bg-muted/50 p-2 rounded-lg transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <i class="ti ti-discount-2 text-primary text-xl"></i>
              </div>
              <div>
                <div class="text-sm font-medium text-foreground">کد تخفیف دارید؟</div>
                <div class="text-xs text-muted-foreground">برای اعمال کد تخفیف کلیک کنید</div>
              </div>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground"></i>
          </button>
        </div>
      </div>
      </template>
    </div>
    
    <!-- Fixed Bottom Payment Button - Mobile Only -->
    <div v-if="selectedPlan" class="lg:hidden fixed bottom-0 left-0 right-0 p-4 z-40 bg-card border-t border-border shadow-lg">
      <button @click="proceedToPayment" class="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center">
        <i class="ti ti-lock text-xl ml-2"></i>
        پرداخت امن {{ selectedPlan.totalPrice }}
      </button>
    </div>

    <!-- Discount Code Bottom Sheet -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showDiscountSheet" @click="showDiscountSheet = false" class="fixed inset-0 bg-black/50 z-[100] flex items-end lg:items-center lg:justify-center">
          <div @click.stop class="bg-card w-full lg:max-w-md lg:rounded-2xl rounded-t-3xl p-6 transform transition-transform">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-foreground">کد تخفیف</h3>
              <button @click="showDiscountSheet = false" class="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
                <i class="ti ti-x text-foreground"></i>
              </button>
            </div>

            <!-- Discount Input -->
            <div class="space-y-4">
              <div>
                <label class="text-sm text-muted-foreground mb-2 block">کد تخفیف خود را وارد کنید</label>
                <div class="relative">
                  <input 
                    v-model="discountCode"
                    type="text"
                    placeholder="مثال: SUMMER2025"
                    class="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <div v-if="discountCode" class="absolute left-3 top-1/2 -translate-y-1/2">
                    <button @click="discountCode = ''" class="text-muted-foreground hover:text-foreground transition-colors">
                      <i class="ti ti-x"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Discount Status -->
              <div v-if="discountStatus" class="p-3 rounded-lg flex items-start gap-2" :class="[
                discountStatus.type === 'success' ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
              ]">
                <i class="ti text-lg" :class="[
                  discountStatus.type === 'success' ? 'ti-circle-check text-green-600 dark:text-green-400' : 'ti-alert-circle text-red-600 dark:text-red-400'
                ]"></i>
                <div class="flex-1">
                  <div class="text-sm font-medium" :class="[
                    discountStatus.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  ]">{{ discountStatus.message }}</div>
                  <div v-if="discountStatus.type === 'success' && discountStatus.amount" class="text-xs text-muted-foreground mt-1">
                    {{ discountStatus.amount }} تخفیف اعمال می‌شود
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3">
                <button 
                  @click="applyDiscount"
                  :disabled="!discountCode || isCheckingDiscount"
                  class="flex-1 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <i v-if="isCheckingDiscount" class="ti ti-loader-2 animate-spin"></i>
                  <span>{{ isCheckingDiscount ? 'در حال بررسی...' : 'اعمال کد تخفیف' }}</span>
                </button>
                <button 
                  @click="showDiscountSheet = false"
                  class="px-6 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
                >
                  انصراف
                </button>
              </div>

              <!-- Popular Discounts -->
              <div v-if="popularDiscounts.length > 0" class="pt-4 border-t border-border">
                <div class="text-xs text-muted-foreground mb-3">کدهای تخفیف محبوب</div>
                <div v-if="loadingPopularDiscounts" class="space-y-2">
                  <div v-for="n in 3" :key="n" class="w-full h-16 bg-muted rounded-lg animate-pulse"></div>
                </div>
                <div v-else class="space-y-2">
                  <button 
                    v-for="code in popularDiscounts" 
                    :key="code.code"
                    @click="discountCode = code.code"
                    class="w-full flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-right"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <i class="ti ti-tag text-primary"></i>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-foreground">{{ code.code }}</div>
                        <div class="text-xs text-muted-foreground">{{ code.description }}</div>
                      </div>
                    </div>
                    <div class="text-sm font-bold text-primary">{{ code.discount }}</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { usePlanStore } from '~/stores/plan'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'default',
  middleware: ['require-activated']
})

const router = useRouter()
const route = useRoute()
const planStore = usePlanStore()
const toast = useToast()
const isLoading = ref(true)
const showSuccessModal = ref(false)
const isNonIranIP = ref(false)
const showDiscountSheet = ref(false)
const discountCode = ref('')
const appliedDiscountCode = ref('')
const discountValue = ref(0)
const discountType = ref('')
const isCheckingDiscount = ref(false)
const discountStatus = ref<{ type: 'success' | 'error', message: string, amount?: string } | null>(null)
const { $axios } = useNuxtApp()

// Popular discount codes from server
const popularDiscounts = ref<Array<{ code: string, description: string, discount: string }>>([])
const loadingPopularDiscounts = ref(false)

// Fetch popular discount codes from server
const fetchPopularDiscounts = async () => {
  loadingPopularDiscounts.value = true
  try {
    const response = await $axios.get('/discounts/popular')
    if (response.data?.success && Array.isArray(response.data.data)) {
      popularDiscounts.value = response.data.data.map((item: any) => ({
        code: item.code || '',
        description: item.description || item.name || 'تخفیف ویژه',
        discount: item.type === 'percentage' ? `${item.value}%` : `${item.value.toLocaleString('fa-IR')} تومان`
      }))
    }
  } catch (error) {
    console.error('Error fetching popular discounts:', error)
    // If API fails, keep empty array (no mock data)
    popularDiscounts.value = []
  } finally {
    loadingPopularDiscounts.value = false
  }
}

// Check if user is using non-Iranian IP
const checkIPLocation = async () => {
  try {
    // استفاده از سرویس عمومی برای تشخیص IP
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    
    
    // اگر کشور ایران نباشد یا از VPN استفاده می‌کند
    if (data.country_code && data.country_code !== 'IR') {
      isNonIranIP.value = true
    } else {
      isNonIranIP.value = false
    }
  } catch (error) {
    // در صورت خطا، برای اطمینان پیام را نشان می‌دهیم
    isNonIranIP.value = true
  }
}

// Get icon based on index/duration
const getIconForPlan = (duration: string) => {
  if (duration.includes('12') || duration.includes('۱۲') || duration.includes('سال')) return 'ti ti-crown'
  if (duration.includes('6') || duration.includes('۶')) return 'ti ti-star'
  if (duration.includes('3') || duration.includes('۳')) return 'ti ti-bolt'
  return 'ti ti-calendar'
}

// Format number to Persian with thousands separator
const formatPrice = (price: number) => {
  return price.toLocaleString('fa-IR')
}

// Get plan index for color scheme
const getPlanIndex = computed(() => {
  if (!selectedPlan.value) return 0
  return planStore.plans.findIndex(p => Number(p.id) === Number(selectedPlan.value.id))
})

// Color scheme functions based on plan index
const getPlanIconGradient = () => {
  return 'from-primary via-accent to-primary'
}

const getPlanIconColorClass = () => {
  return 'text-white'
}

const getPlanGradientClass = () => {
  return 'from-primary via-accent to-primary'
}

const getPlanTextColorClass = (isSubtext = false) => {
  return isSubtext ? 'text-muted-foreground' : 'text-foreground'
}

// Price card color schemes
const getPriceCardGradient = () => {
  return 'from-primary/5 via-accent/5 to-primary/10'
}

const getPriceCardBorder = () => {
  return 'border-primary/20'
}

const getPriceCardDecoLight = () => {
  return 'from-primary/10'
}

const getPriceCardDecoDark = () => {
  return 'from-accent/10'
}

const getPriceIconBg = () => {
  return 'bg-primary/10'
}

const getPriceIconColor = () => {
  return 'text-primary'
}

const getPriceTextColor = () => {
  return 'text-foreground'
}

const getPriceBigTextColor = () => {
  return 'text-primary'
}

const getPriceSmallTextColor = () => {
  return 'text-muted-foreground'
}

const getPriceBorderColor = () => {
  return 'border-border'
}

const getMonthlyBadgeBg = () => {
  return 'bg-accent/10'
}

const getBadgeGradient = () => {
  return 'from-primary/5 to-accent/5'
}

const getPremiumBadgeGradient = () => {
  return 'from-primary to-accent'
}

// Payment card color schemes
const getPaymentCardGradient = () => {
  return 'from-primary/10 via-accent/5 to-primary/5'
}

const getPaymentCardBorder = () => {
  return 'border-primary/30'
}

const getPaymentIconBg = () => {
  return 'bg-primary/10 border-primary/20'
}

const getPaymentIconColor = () => {
  return 'text-primary'
}

const getPaymentTextColor = () => {
  return 'text-foreground'
}

const getPaymentSubTextColor = () => {
  return 'text-muted-foreground'
}

const getPaymentCheckBg = () => {
  return 'bg-primary'
}

const getPlanIconBgClass = () => {
  return getPlanIndex.value === 0 ? 'bg-white/30 backdrop-blur-sm border border-white/50' : 'bg-white/20 border border-white/30'
}

const getPlanDiscountClass = () => {
  if (getPlanIndex.value === 0) {
    return 'bg-amber-800/30 text-amber-900 border-amber-700/40'
  }
  return 'bg-white/20 text-white border-white/30'
}

const getPlanDividerClass = () => {
  return getPlanIndex.value === 0 ? 'bg-amber-900/30' : 'bg-white/30'
}

const getPlanBorderClass = () => {
  return getPlanIndex.value === 0 ? 'border-yellow-300/50' : 'border-gray-400/30'
}

// Get selected plan from store
const selectedPlan = computed(() => {
  const planId = route.query.id
  if (!planId) return null
  
  const plan = planStore.plans.find(p => Number(p.id) === Number(planId))
  if (!plan) return null
  
  const finalPrice = Math.round(plan.price * (1 - plan.discount / 100))
  const discountAmount = plan.price - finalPrice
  
  // Parse duration to get months
  const durationMatch = plan.duration.match(/\d+/)
  const months = durationMatch ? parseInt(durationMatch[0]) : 1
  const monthlyPrice = Math.round(finalPrice / months)
  
  return {
    id: plan.id,
    title: plan.title,
    duration: plan.duration,
    monthlyPrice: `${formatPrice(monthlyPrice)} تومان`,
    totalPrice: `${formatPrice(finalPrice)} تومان`,
    originalPrice: `${formatPrice(plan.price)} تومان`,
    discount: `${plan.discount}٪`,
    discountAmount: `${formatPrice(discountAmount)} تومان`,
    icon: getIconForPlan(plan.duration),
    months: months,
    hasDiscount: plan.discount > 0
  }
})

const proceedToPayment = async () => {
  if (!selectedPlan.value) return
  
  isLoading.value = true
  
  try {
    const { $axios } = useNuxtApp()
    const { useUserStore } = await import('~/stores/user')
    const userStore = useUserStore()
    
    // Get user info
    if (!userStore.user) {
      await userStore.fetchUser()
    }
    
    const planId = route.query.id
    const plan = planStore.plans.find(p => Number(p.id) === Number(planId))
    
    if (!plan) {
      toast.error('پلن یافت نشد')
      isLoading.value = false
      return
    }
    
    // Calculate price exactly like old checkout
    const finalPrice = Math.round(plan.price * (1 - plan.discount / 100))
    const amountInRials = finalPrice * 10
    
    // Prepare metadata exactly like old checkout
    const metadata = {
      discountCode: '',
      mobile: userStore.user?.phone || '',
      email: userStore.user?.email || ''
    }
    
    const paymentData = {
      planId: Number(planId),
      amount: amountInRials,
      discountCode: appliedDiscountCode.value || '',
      metadata,
      gateway: 'zarinpal'
    }
    
    // ارسال درخواست پرداخت
    // توجه: در localhost، درگاه نمی‌تونه به callback برگرده
    // برای تست واقعی باید از دامنه production استفاده کنی
    const response = await $axios.post('/payment', {
      planId: Number(planId),
      amount: amountInRials,
      discountCode: appliedDiscountCode.value || '',
      metadata: metadata,
      gateway: 'zarinpal'
    })
    
    
    const paymentUrl = response.data?.data?.redirect_url
    if (paymentUrl) {
      // Redirect to payment gateway
      window.location.href = paymentUrl
    } else {
      toast.error('لینک پرداخت دریافت نشد')
    }
  } catch (error: any) {
    console.error('Payment error:', error)
    
    let errorMsg = 'خطا در برقراری ارتباط با درگاه پرداخت'
    let errorTitle = 'خطا در پرداخت'
    
    // بررسی پیام خطای سرور
    if (error.response?.data?.message) {
      const serverMsg = error.response.data.message
      
      // خطای redirect_url_not_created
      if (serverMsg.includes('redirect_url_not_created') || serverMsg === 'messages.redirect_url_not_created') {
        errorTitle = 'درگاه پرداخت غیرفعال است'
        errorMsg = 'متأسفانه درگاه پرداخت در حال حاضر غیرفعال است. لطفاً با پشتیبانی تماس بگیرید یا بعداً مجدداً تلاش کنید.'
      } else {
        errorMsg = serverMsg
      }
    } else if (error.response?.status === 500) {
      errorTitle = 'خطای سرور'
      errorMsg = 'خطا در سرور. لطفاً چند لحظه دیگر تلاش کنید.'
    } else if (error.response?.status === 422) {
      errorTitle = 'اطلاعات نامعتبر'
      errorMsg = 'اطلاعات وارد شده نامعتبر است.'
    } else if (!navigator.onLine) {
      errorTitle = 'قطع اینترنت'
      errorMsg = 'اتصال اینترنت خود را بررسی کنید.'
    }
    
    // نمایش toast با جزئیات بیشتر
    toast.error(errorMsg, {
      duration: 6000
    })
  } finally {
    isLoading.value = false
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.push('/dashboard/checkout')
}

const goToDashboard = () => {
  showSuccessModal.value = false
  router.push('/dashboard')
}

const applyDiscount = async () => {
  if (!discountCode.value || !selectedPlan.value) return
  
  isCheckingDiscount.value = true
  discountStatus.value = null
  
  try {
    const response = await $axios.post('/discounts/validate', {
      code: discountCode.value,
      planId: selectedPlan.value.id
    })
    
    if (response.data?.success && response.data.data) {
      const discount = response.data.data
      appliedDiscountCode.value = discountCode.value
      discountValue.value = discount.value || 0
      discountType.value = discount.type || 'percentage'
      
      let discountText = ''
      if (discount.type === 'percentage') {
        discountText = `${discount.value}٪`
      } else if (discount.type === 'fixed') {
        discountText = `${discount.value.toLocaleString('fa-IR')} تومان`
      }
      
      discountStatus.value = {
        type: 'success',
        message: 'کد تخفیف با موفقیت اعمال شد',
        amount: discountText
      }
      
      toast.success(`تخفیف ${discountText} اعمال شد`)
      
      // Close sheet after 2 seconds
      setTimeout(() => {
        showDiscountSheet.value = false
      }, 2000)
    } else {
      discountStatus.value = {
        type: 'error',
        message: response.data?.message || 'کد تخفیف نامعتبر است'
      }
    }
  } catch (error: any) {
    let errorMessage = 'خطا در بررسی کد تخفیف'
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.status === 404) {
      errorMessage = 'کد تخفیف یافت نشد'
    } else if (error.response?.status === 422) {
      errorMessage = 'کد تخفیف منقضی شده یا غیرفعال است'
    }
    
    discountStatus.value = {
      type: 'error',
      message: errorMessage
    }
  } finally {
    isCheckingDiscount.value = false
  }
}

const getExpiryDate = () => {
  if (!selectedPlan.value) return ''
  
  const now = new Date()
  const monthsToAdd = selectedPlan.value.months
  
  const expiryDate = new Date(now.getFullYear(), now.getMonth() + monthsToAdd, now.getDate())
  return expiryDate.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(async () => {
  try {
    isLoading.value = true
    
    
    // Check IP location
    await checkIPLocation()
    
    // Fetch popular discounts from server
    await fetchPopularDiscounts()
    
    // Fetch plans if not loaded
    if (planStore.plans.length === 0) {
      await planStore.fetchPlans()
    }
    
    // Check if plan exists
    if (!selectedPlan.value) {
      toast.error('پلن انتخابی یافت نشد')
      router.push('/dashboard/checkout')
      return
    }
    
    // بررسی وجود کد تخفیف در query parameters
    if (route.query.discountCode && route.query.discountValue && route.query.discountType) {
      discountCode.value = String(route.query.discountCode)
      appliedDiscountCode.value = String(route.query.discountCode)
      discountValue.value = Number(route.query.discountValue)
      discountType.value = String(route.query.discountType)
      
      // نمایش پیام موفقیت
      let discountText = ''
      if (discountType.value === 'percentage') {
        discountText = `${discountValue.value}٪`
      } else if (discountType.value === 'fixed') {
        discountText = `${discountValue.value.toLocaleString('fa-IR')} تومان`
      }
      
      discountStatus.value = {
        type: 'success',
        message: `کد تخفیف "${discountCode.value}" اعمال شد`,
        amount: discountText
      }
      
      toast.success(`کد تخفیف ${discountText} اعمال شد`, { duration: 3000 })
    }
    
  } catch (error) {
    toast.error('خطا در بارگذاری اطلاعات')
    router.push('/dashboard/checkout')
  } finally {
    isLoading.value = false
  }
})
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

.fade-enter-active > div,
.fade-leave-active > div {
  transition: transform 0.3s ease;
}

.fade-enter-from > div {
  transform: translateY(100%);
}

.fade-leave-to > div {
  transform: translateY(100%);
}

@media (min-width: 1024px) {
  .fade-enter-from > div {
    transform: translateY(0) scale(0.95);
  }
  
  .fade-leave-to > div {
    transform: translateY(0) scale(0.95);
  }
}
</style>