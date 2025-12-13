<template>
  <div class="min-h-screen bg-background">
    <!-- Content -->
    <div class="pb-24 pt-4">
      <div class="xl:container xl:mx-auto xl:px-8">
        <!-- Desktop: 2 Column Layout -->
        <div class="xl:grid xl:grid-cols-12 xl:gap-8">
          
          <!-- Left Column: Subscription Info (Desktop Only) -->
          <div class="hidden xl:block xl:col-span-4 space-y-4">
            <!-- Premium Header for Desktop -->
            <div v-if="currentSubscription.status !== 'active'" class="sticky top-24">
              <div class="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 text-center">
                <i class="ti ti-crown text-6xl text-primary mb-4 block"></i>
                <h2 class="text-2xl font-bold mb-2 text-foreground">پرمیوم لینکو</h2>
                <!-- <p class="text-sm text-muted-foreground mb-4">کاربر ویژه لینکو باشید!</p> -->
                <p class="text-sm text-muted-foreground">دسترسی به تمام امکانات لینکو</p>
              </div>
            </div>
            
            <!-- Current Subscription Card for Desktop -->
            <div v-if="currentSubscription.status === 'active'" class="sticky top-24 space-y-4">
              <!-- Timer Card -->
              <div class="bg-gradient-to-br from-muted/50 to-transparent rounded-2xl p-6 border border-border">
                <div class="text-center mb-4">
                  <div class="text-5xl font-bold text-foreground mb-2">{{ currentSubscription.remainingDays }}</div>
                  <p class="text-sm text-muted-foreground">روز باقی‌مانده</p>
                </div>
                <div class="flex items-center justify-center">
                  <img src="/assets/images/clock.png" alt="ساعت" class="w-24 h-24 opacity-50" />
                </div>
              </div>
              
              <!-- Subscription Details -->
              <div class="bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-6 rounded-2xl text-white">
                <div class="flex items-center gap-3 mb-4">
                  <div class="p-2 bg-white/20 rounded-xl">
                    <i class="ti ti-crown text-2xl text-yellow-300"></i>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold">اشتراک فعلی شما</h3>
                    <p class="text-sm opacity-80">{{ currentSubscription.type }}</p>
                  </div>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center justify-between text-sm">
                    <span class="opacity-80">تاریخ انقضا</span>
                    <span class="font-medium">{{ currentSubscription.expiryDate }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="opacity-80">وضعیت</span>
                    <span class="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-100">فعال</span>
                  </div>
                </div>
                <button 
                  @click="router.push('/financial')"
                  class="w-full bg-white/20 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/30 transition-all border border-white/20"
                >
                  <i class="ti ti-history ml-2"></i>
                  مشاهده تاریخچه کامل
                </button>
              </div>
            </div>
          </div>
          
          <!-- Right Column: Plans & Features -->
          <div class="xl:col-span-8 space-y-4">
        <!-- Premium Header Banner with Profile Images (Mobile & Tablet) -->
        <div v-if="currentSubscription.status !== 'active'" class="relative overflow-visible xl:hidden">
          
          <!-- Content -->
          <div class="relative z-20 text-center text-foreground">
            <!-- Profile Images Scattered -->
            <div class="relative w-full h-40 mb-4 overflow-visible">
              
              <!-- Gradient overlay on profiles -->
              <div class="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background/90 z-10"></div>
              
              <!-- Main center profile -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-4 border-primary/30 dark:border-primary/50 overflow-visible">
                <img 
                  src="/assets/images/avatars/avatar-1.png" 
                  alt="پروفایل اصلی"
                  class="w-full h-full object-cover rounded-full"
                />
                <!-- Verify badge for main profile -->
                <div class="absolute -bottom-1 -right-1 w-8 h-8">
                  <i class="ti ti-rosette-discount-check-filled text-blue-500 text-2xl"></i>
                </div>
              </div>
              
              <!-- Crown on main profile -->
              <div class="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center border-2 border-background">
                <i class="ti ti-crown text-foreground text-xl"></i>
              </div>
              
              <!-- Top scattered profiles -->
              <div class="absolute top-2 left-2 w-12 h-12 rounded-full border-3 border-background overflow-visible">
                <img src="/assets/images/avatars/avatar-2.png" alt="پروفایل" class="w-full h-full object-cover rounded-full" />
                <div class="absolute -bottom-1 -right-1 w-5 h-5">
                  <i class="ti ti-rosette-discount-check-filled text-green-500 text-lg"></i>
                </div>
              </div>
              
              <div class="absolute top-1 right-2 w-14 h-14 rounded-full border-3 border-background overflow-visible">
                <img src="/assets/images/avatars/avatar-3.png" alt="پروفایل" class="w-full h-full object-cover rounded-full" />
                <div class="absolute -bottom-1 -left-1 w-6 h-6">
                  <i class="ti ti-rosette-discount-check-filled text-red-500 text-xl"></i>
                </div>
              </div>
              
              <!-- Side profiles -->
              <div class="absolute top-20 left-1 w-10 h-10 rounded-full border-3 border-background overflow-visible">
                <img src="/assets/images/avatars/avatar-4.png" alt="پروفایل" class="w-full h-full object-cover rounded-full" />
                <div class="absolute -top-1 -right-1 w-4 h-4">
                  <i class="ti ti-rosette-discount-check-filled text-purple-500 text-sm"></i>
                </div>
              </div>
              
              <div class="absolute top-20 right-1 w-11 h-11 rounded-full border-3 border-background overflow-visible">
                <img src="/assets/images/avatars/avatar-5.png" alt="پروفایل" class="w-full h-full object-cover rounded-full" />
                <div class="absolute -bottom-1 -left-1 w-5 h-5">
                  <i class="ti ti-rosette-discount-check-filled text-orange-500 text-lg"></i>
                </div>
              </div>
              
              <!-- Mid profiles -->
              <div class="absolute top-12 left-16 w-13 h-13 rounded-full border-3 border-background overflow-visible">
                <img src="/assets/images/avatars/avatar-6.png" alt="پروفایل" class="w-full h-full object-cover rounded-full" />
                <div class="absolute -top-1 -right-1 w-5 h-5">
                  <i class="ti ti-rosette-discount-check-filled text-pink-500 text-lg"></i>
                </div>
              </div>
              
              <div class="absolute top-8 right-16 w-10 h-10 rounded-full border-3 border-background overflow-visible">
                <img src="/assets/images/avatars/avatar-7.png" alt="پروفایل" class="w-full h-full object-cover rounded-full" />
                <div class="absolute -top-1 -left-1 w-4 h-4">
                  <i class="ti ti-rosette-discount-check-filled text-teal-500 text-sm"></i>
                </div>
              </div>
              
              <!-- Extra corner profiles -->
              <div class="absolute top-15 left-8 w-8 h-8 rounded-full border-2 border-background overflow-visible">
                <img src="/assets/images/avatars/avatar-2.png" alt="پروفایل" class="w-full h-full object-cover rounded-full" />
                <div class="absolute -bottom-1 -right-1 w-4 h-4">
                  <i class="ti ti-rosette-discount-check-filled text-indigo-500 text-sm"></i>
                </div>
              </div>
              
              <div class="absolute top-18 right-8 w-8 h-8 rounded-full border-2 border-background overflow-visible">
                <img src="/assets/images/avatars/avatar-4.png" alt="پروفایل" class="w-full h-full object-cover rounded-full" />
                <div class="absolute -top-1 -left-1 w-4 h-4">
                  <i class="ti ti-rosette-discount-check-filled text-yellow-500 text-sm"></i>
                </div>
              </div>
            </div>
            
            <!-- Absolute positioned text content -->
            <div class="absolute bottom-6 left-0 right-0 text-center z-30">
              <h2 class="text-2xl font-bold mb-2 text-foreground">پرمیوم لینکو</h2>
              <p class="mb-1 opacity-90 text-foreground">کاربر ویژه لینکو باشید!</p>
              <p class="text-sm opacity-80 text-foreground">با اشتراک در لینکو پرمیوم، چیزهای جدید را باز کنید.</p>
            </div>
          </div>
        </div>
        
        <!-- Time Left Counter (Mobile & Tablet) -->
        <div v-if="currentSubscription.status === 'active'" class="bg-gradient-to-t from-muted/30 via-muted/20 to-transparent p-4 relative mt-8 rounded-2xl mx-4 xl:hidden">
          <!-- Center content -->
          <div class="text-center rtl:mr-24 ltr:ml-24">
            <div class="text-6xl font-bold text-foreground leading-none mb-2">
              <span class="rtl:ml-2 ltr:mr-2">{{ currentSubscription.remainingDays }}</span><span class="text-lg">روز باقی‌مانده</span>
            </div>
          </div>
          
          <!-- Clock - Absolute positioned, no crown -->
          <div class="absolute right-0 -top-8">
            <!-- Clock without background and crown -->
            <img src="/assets/images/clock.png" alt="ساعت" class="w-40 h-40" />
          </div>
          
          <p class="text-sm text-muted-foreground mt-4 text-center rtl:mr-24 ltr:ml-24">می‌توانید زمان اشتراک خود را افزایش دهید.</p>
        </div>

        <!-- Current Subscription Status (Mobile & Tablet) -->
        <div v-if="currentSubscription.status === 'active'" class="px-4 xl:hidden">
          <div class="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-6 rounded-2xl text-white mb-4 overflow-hidden">
            <!-- Animated Background Shapes -->
            <div class="absolute inset-0 opacity-20">
              <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8 animate-pulse"></div>
              <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-4 translate-y-4 animate-pulse delay-300"></div>
              <div class="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-700"></div>
            </div>
            
            <!-- Glass Effect Overlay -->
            <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
            
            <!-- Content -->
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold">اشتراک فعلی شما</h3>
                <div class="p-2 bg-white/20 rounded-xl">
                  <i class="ti ti-crown text-2xl text-yellow-300"></i>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm opacity-80 mb-1">نوع اشتراک</p>
                  <p class="text-xl font-bold">{{ currentSubscription.type }}</p>
                </div>
                <div>
                  <p class="text-sm opacity-80 mb-1">تاریخ انقضا</p>
                  <p class="text-base font-medium">{{ currentSubscription.expiryDate }}</p>
                </div>
              </div>
              <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                <div>
                  <p class="text-sm opacity-80">وضعیت</p>
                  <span :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    currentSubscription.status === 'active' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
                  ]">
                    {{ getStatusText(currentSubscription.status) }}
                  </span>
                </div>
                <button 
                  @click="router.push('/financial')"
                  class="bg-white/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-all duration-300 border border-white/20 hover:border-white/30"
                >
                  مشاهده تاریخچه کامل
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Upgrade Plans Section -->
        <div class="px-4 mb-4">
          <h4 class="text-lg font-bold text-foreground mb-3">{{ currentSubscription.status === 'active' ? 'ارتقا اشتراک' : 'پلان‌های اشتراک' }}</h4>
          <p class="text-sm text-muted-foreground mb-4">{{ currentSubscription.status === 'active' ? 'با ارتقا اشتراک خود، زمان بیشتری اضافه کنید و از تخفیف‌های ویژه بهره‌مند شوید.' : 'یکی از پلان‌های زیر را انتخاب کنید و از امکانات ویژه لینکو بهره‌مند شوید.' }}</p>
        </div>

        <!-- Pricing Plans -->
        <div class="px-4">
          <div class="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <div 
              v-for="(plan, index) in planStore.plans" 
              :key="plan.id"
              class="bg-gradient-to-br rounded-2xl p-4 text-center relative overflow-hidden shadow-xl border"
              :class="[
                getPlanGradient(index),
                index === 0 ? 'border-yellow-300/50' : 'border-gray-400/30'
              ]"
            >
              <!-- Glass effect overlay -->
              <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
              <div class="relative z-10">
                <div class="font-bold text-lg mb-1" :class="getPlanTextColor(index)">{{ plan.title }}</div>
                <div 
                  v-if="plan.discount > 0"
                  class="rounded-lg px-2 py-1 text-xs mb-3 border inline-block"
                  :class="getPlanBgColor(index)"
                >
                  {{ plan.discount }}٪ تخفیف
                </div>
                <div v-else class="h-6 mb-3"></div>
                
                <div class="mb-4">
                  <div v-if="plan.discount > 0" class="text-lg line-through text-gray-500/70 mb-1" :class="getPlanTextColor(index)">
                    {{ Math.round(plan.price).toLocaleString('fa-IR') }} تومان
                  </div>
                  <div class="text-3xl font-bold" :class="getPlanTextColor(index)">
                    {{ Math.round(plan.price * (1 - plan.discount / 100)).toLocaleString('fa-IR') }} تومان
                  </div>
                </div>
                <button 
                  @click="goToOrder(plan.id)" 
                  class="w-full font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-sm"
                  :class="getPlanButtonClass(index)"
                >
                  سفارش
                </button>
              </div>
              <!-- Crown decoration for first plan -->
              <div v-if="index === 0" class="absolute top-3 right-3" :class="getPlanTextColor(index)">
                <i class="ti ti-crown text-xl"></i>
              </div>
              <!-- Shine effect for first plan -->
              <div v-if="index === 0" class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transform -translate-x-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <!-- Features Section Header -->
        <div class="px-4 mt-6">
          <div class="rtl:text-right ltr:text-left mb-4">
            <h3 class="text-lg font-semibold text-foreground mb-2">ویژگی‌های اشتراک ویژه</h3>
            <div class="w-12 h-0.5 bg-primary ml-auto rounded-full"></div>
          </div>
        </div>

        <!-- Premium Features List - Mobile -->
        <div class="p-4 xl:hidden">
          <div class="space-y-3">
            <!-- Dynamic features from API -->
            <NuxtLink 
              v-for="(feature, index) in features" 
              :key="feature.id"
              :to="`/dashboard/checkout/feature/${feature.slug}`"
              class="flex items-center justify-between p-3 bg-card hover:bg-accent rounded-xl transition-colors cursor-pointer border border-border"
            >
              <div class="flex items-center gap-3">
                <div :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  getIconBgClass(index)
                ]">
                  <i :class="[feature.icon || 'ti ti-star', getIconColorClass(index), 'text-xl']"></i>
                </div>
                <span class="text-foreground font-medium">{{ feature.title }}</span>
              </div>
              <i class="ti ti-chevron-left text-muted-foreground"></i>
            </NuxtLink>
            
            <!-- Fallback static items when no features loaded -->
            <template v-if="features.length === 0">
              <div class="flex items-center justify-between p-3 bg-card hover:bg-accent rounded-xl transition-colors border border-border">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                    <i class="ti ti-credit-card text-blue-500 text-xl"></i>
                  </div>
                  <span class="text-foreground font-medium">ایجاد تا ۳ کارت ویزیت تجاری</span>
                </div>
                <i class="ti ti-chevron-left text-muted-foreground"></i>
              </div>

              <div class="flex items-center justify-between p-3 bg-card hover:bg-accent rounded-xl transition-colors border border-border">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                    <i class="ti ti-qrcode text-purple-500 text-xl"></i>
                  </div>
                  <span class="text-foreground font-medium">ایجاد QR کد سفارشی</span>
                </div>
                <i class="ti ti-chevron-left text-muted-foreground"></i>
              </div>

              <div class="flex items-center justify-between p-3 bg-card hover:bg-accent rounded-xl transition-colors border border-border">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                    <i class="ti ti-chart-line text-emerald-500 text-xl"></i>
                  </div>
                  <span class="text-foreground font-medium">دسترسی به آمار مادام‌العمر</span>
                </div>
                <i class="ti ti-chevron-left text-muted-foreground"></i>
              </div>
            </template>
          </div>
        </div>
        
        <!-- Premium Features Grid - Desktop -->
        <div class="hidden xl:block px-4 mt-2">
          <div class="grid grid-cols-2 2xl:grid-cols-3 gap-4">
            <!-- Dynamic features from API -->
            <NuxtLink 
              v-for="(feature, index) in features" 
              :key="feature.id"
              :to="`/dashboard/checkout/feature/${feature.slug}`"
              class="group bg-card hover:bg-accent/50 rounded-2xl p-5 transition-all duration-300 cursor-pointer border border-border hover:border-primary/30 hover:shadow-lg"
            >
              <div class="flex items-start gap-4">
                <div :class="[
                  'w-14 h-14 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform',
                  getIconBgGradientClass(index)
                ]">
                  <i :class="[feature.icon || 'ti ti-star', getIconColorClass(index), 'text-2xl']"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-foreground font-bold mb-1 group-hover:text-primary transition-colors">{{ feature.title }}</h4>
                  <p v-if="feature.description" class="text-muted-foreground text-sm line-clamp-2">{{ feature.description }}</p>
                </div>
              </div>
              <div class="mt-4 flex items-center justify-end text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>مشاهده جزئیات</span>
                <i class="ti ti-arrow-left mr-1"></i>
              </div>
            </NuxtLink>
            
            <!-- Fallback static items when no features loaded -->
            <template v-if="features.length === 0">
              <div class="group bg-card hover:bg-accent/50 rounded-2xl p-5 transition-all duration-300 border border-border hover:border-blue-300 dark:hover:border-blue-600">
                <div class="flex items-start gap-4">
                  <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 dark:from-blue-500/30 dark:to-blue-500/10 flex items-center justify-center shrink-0">
                    <i class="ti ti-credit-card text-blue-500 text-2xl"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-foreground font-bold mb-1">کارت ویزیت تجاری</h4>
                    <p class="text-muted-foreground text-sm">ایجاد تا ۳ کارت ویزیت حرفه‌ای</p>
                  </div>
                </div>
              </div>

              <div class="group bg-card hover:bg-accent/50 rounded-2xl p-5 transition-all duration-300 border border-border hover:border-purple-300 dark:hover:border-purple-600">
                <div class="flex items-start gap-4">
                  <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 dark:from-purple-500/30 dark:to-purple-500/10 flex items-center justify-center shrink-0">
                    <i class="ti ti-qrcode text-purple-500 text-2xl"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-foreground font-bold mb-1">QR کد سفارشی</h4>
                    <p class="text-muted-foreground text-sm">ایجاد کدهای QR منحصر به فرد</p>
                  </div>
                </div>
              </div>

              <div class="group bg-card hover:bg-accent/50 rounded-2xl p-5 transition-all duration-300 border border-border hover:border-emerald-300 dark:hover:border-emerald-600">
                <div class="flex items-start gap-4">
                  <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 dark:from-emerald-500/30 dark:to-emerald-500/10 flex items-center justify-center shrink-0">
                    <i class="ti ti-chart-line text-emerald-500 text-2xl"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-foreground font-bold mb-1">آمار پیشرفته</h4>
                    <p class="text-muted-foreground text-sm">دسترسی به آمار مادام‌العمر</p>
                  </div>
                </div>
              </div>

              <div class="group bg-card hover:bg-accent/50 rounded-2xl p-5 transition-all duration-300 border border-border hover:border-pink-300 dark:hover:border-pink-600">
                <div class="flex items-start gap-4">
                  <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 dark:from-pink-500/30 dark:to-pink-500/10 flex items-center justify-center shrink-0">
                    <i class="ti ti-palette text-pink-500 text-2xl"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-foreground font-bold mb-1">تم‌های پروفایل</h4>
                    <p class="text-muted-foreground text-sm">شخصی‌سازی ظاهر پروفایل</p>
                  </div>
                </div>
              </div>

              <div class="group bg-card hover:bg-accent/50 rounded-2xl p-5 transition-all duration-300 border border-border hover:border-amber-300 dark:hover:border-amber-600">
                <div class="flex items-start gap-4">
                  <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 dark:from-amber-500/30 dark:to-amber-500/10 flex items-center justify-center shrink-0">
                    <i class="ti ti-link text-amber-500 text-2xl"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-foreground font-bold mb-1">لینک‌های پرو</h4>
                    <p class="text-muted-foreground text-sm">لینک‌های نامحدود حرفه‌ای</p>
                  </div>
                </div>
              </div>

              <div class="group bg-card hover:bg-accent/50 rounded-2xl p-5 transition-all duration-300 border border-border hover:border-cyan-300 dark:hover:border-cyan-600">
                <div class="flex items-start gap-4">
                  <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 dark:from-cyan-500/30 dark:to-cyan-500/10 flex items-center justify-center shrink-0">
                    <i class="ti ti-crown text-cyan-500 text-2xl"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-foreground font-bold mb-1">پشتیبانی VIP</h4>
                    <p class="text-muted-foreground text-sm">پشتیبانی اختصاصی پرمیوم</p>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'
import { usePlanStore } from '~/stores/plan'

const router = useRouter()
const userStore = useUserStore()
const planStore = usePlanStore()

// Reactive state - start false to avoid hydration mismatch
const isLoading = ref(false)

// Features from API
const features = ref<any[]>([])

// Subscription history data from API
const transactions = ref([])

// Current subscription data از userStore
const currentSubscription = computed(() => {
  // چک کنیم که دیتا لود شده
  if (!userStore.user) {
    return {
      type: 'رایگان',
      status: 'expired',
      remainingDays: 0,
      expiryDate: '—'
    }
  }
  
  const isPro = userStore.user?.isPro || false
  const subscriptionType = (userStore.user as any)?.subscriptionType || 'free'
  const subscriptionMonths = (userStore.user as any)?.subscriptionMonths || 0
  let endDate = (userStore.user as any)?.subscriptionEndDate || userStore.user?.subscription_end_date
  
  // محاسبه روزهای باقیمانده از تاریخ انقضا
  let daysRemaining = 0
  if (endDate) {
    const end = new Date(endDate)
    const now = new Date()
    daysRemaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }
  
  // اگر روزها منفی شد، یعنی منقضی شده
  if (daysRemaining < 0) daysRemaining = 0
  
  // تعیین نوع اشتراک بر اساس ماه‌ها
  let typeText = 'رایگان'
  if (isPro) {
    if (subscriptionMonths >= 12) {
      typeText = 'اشتراک سالانه'
    } else if (subscriptionMonths >= 6) {
      typeText = 'اشتراک ۶ ماهه'
    } else if (subscriptionMonths >= 3) {
      typeText = 'اشتراک ۳ ماهه'
    } else if (subscriptionMonths >= 1) {
      typeText = 'اشتراک ماهانه'
    } else {
      typeText = 'اشتراک ویژه'
    }
  }
  
  return {
    type: typeText,
    status: isPro ? 'active' : 'expired',
    remainingDays: Math.max(0, Math.round(daysRemaining)),
    expiryDate: endDate ? new Date(endDate).toLocaleDateString('fa-IR') : '—'
  }
})

const subscriptionHistory = computed(() => {
  return transactions.value
    .filter((t: any) => t.status === 'success' || t.status === 'successful' || t.status === 'pending')
    .map((t: any) => ({
      id: t.id,
      action: t.planTitle || 'خرید اشتراک',
      description: `اشتراک ${t.planTitle || ''} - ${t.planDuration || ''}`,
      amount: t.amount || 0,
      status: t.status === 'success' || t.status === 'successful' ? 'completed' : t.status,
      date: t.createdAt ? formatPersianDate(t.createdAt) : '—'
    }))
    .sort((a: any, b: any) => b.id - a.id)
})

// Helper to format Persian date
const formatPersianDate = (dateString: string | null) => {
  if (!dateString) return '—'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fa-IR')
  } catch {
    return dateString
  }
}

// Fetch transactions from API
const fetchTransactions = async () => {
  try {
    const { $axios } = useNuxtApp()
    const axios = $axios as any
    const response = await axios.get('transactions/list')
    transactions.value = response.data.data || response.data || []
  } catch (error) {
    transactions.value = []
  }
}

// Fetch features from API
const fetchFeatures = async () => {
  try {
    const { $axios } = useNuxtApp()
    const axios = $axios as any
    const response = await axios.get('features')
    features.value = response.data.data || response.data || []
  } catch (error) {
    features.value = []
  }
}

// Methods
const goToOrder = (planId: number) => {
  router.push({
    path: '/dashboard/checkout/order',
    query: { id: planId }
  })
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
}

const getStatusText = (status: string) => {
  const statusTexts: Record<string, string> = {
    'active': 'فعال',
    'expired': 'منقضی شده',
    'cancelled': 'لغو شده',
    'pending': 'در انتظار',
    'completed': 'تکمیل شده',
    'failed': 'ناموفق'
  }
  return statusTexts[status] || status
}

const getStatusClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    'active': 'bg-green-500/20 text-green-600',
    'completed': 'bg-green-500/20 text-green-600',
    'expired': 'bg-red-500/20 text-red-600',
    'cancelled': 'bg-red-500/20 text-red-600',
    'pending': 'bg-yellow-500/20 text-yellow-600',
    'failed': 'bg-red-500/20 text-red-600'
  }
  return statusClasses[status] || 'bg-default-500/20 text-default-600'
}

// Plan styling helpers
const getPlanGradient = (index: number) => {
  const gradients = [
    'from-yellow-300 via-amber-400 to-yellow-600',
    'from-gray-500 via-gray-600 to-gray-700',
    'from-gray-600 via-gray-700 to-gray-800',
    'from-gray-700 via-gray-800 to-gray-900'
  ]
  return gradients[index % gradients.length]
}

const getPlanTextColor = (index: number) => {
  return index === 0 ? 'text-amber-900' : 'text-white'
}

const getPlanBgColor = (index: number) => {
  const bgColors = [
    'bg-amber-800/30 border-amber-700/40 text-amber-900',
    'bg-gray-700/50 border-gray-600/50 text-white',
    'bg-gray-800/50 border-gray-700/50 text-white',
    'bg-gray-900/50 border-gray-800/50 text-white'
  ]
  return bgColors[index % bgColors.length]
}

const getPlanButtonClass = (index: number) => {
  const buttons = [
    'bg-white/90 hover:bg-white text-amber-700 shadow-lg',
    'bg-gray-300/90 hover:bg-gray-200 text-gray-800',
    'bg-gray-400/90 hover:bg-gray-300 text-gray-800',
    'bg-gray-500/90 hover:bg-gray-400 text-gray-200'
  ]
  return buttons[index % buttons.length]
}

// Feature icon color helpers - برای آیکون‌های رنگی
const iconColors = [
  { bg: 'bg-blue-500/10 dark:bg-blue-500/20', bgGradient: 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 dark:from-blue-500/30 dark:to-blue-500/10', color: 'text-blue-500' },
  { bg: 'bg-purple-500/10 dark:bg-purple-500/20', bgGradient: 'bg-gradient-to-br from-purple-500/20 to-purple-500/5 dark:from-purple-500/30 dark:to-purple-500/10', color: 'text-purple-500' },
  { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', bgGradient: 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 dark:from-emerald-500/30 dark:to-emerald-500/10', color: 'text-emerald-500' },
  { bg: 'bg-pink-500/10 dark:bg-pink-500/20', bgGradient: 'bg-gradient-to-br from-pink-500/20 to-pink-500/5 dark:from-pink-500/30 dark:to-pink-500/10', color: 'text-pink-500' },
  { bg: 'bg-amber-500/10 dark:bg-amber-500/20', bgGradient: 'bg-gradient-to-br from-amber-500/20 to-amber-500/5 dark:from-amber-500/30 dark:to-amber-500/10', color: 'text-amber-500' },
  { bg: 'bg-cyan-500/10 dark:bg-cyan-500/20', bgGradient: 'bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 dark:from-cyan-500/30 dark:to-cyan-500/10', color: 'text-cyan-500' },
  { bg: 'bg-rose-500/10 dark:bg-rose-500/20', bgGradient: 'bg-gradient-to-br from-rose-500/20 to-rose-500/5 dark:from-rose-500/30 dark:to-rose-500/10', color: 'text-rose-500' },
  { bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', bgGradient: 'bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 dark:from-indigo-500/30 dark:to-indigo-500/10', color: 'text-indigo-500' },
]

const getIconBgClass = (index: number) => {
  return iconColors[index % iconColors.length].bg
}

const getIconBgGradientClass = (index: number) => {
  return iconColors[index % iconColors.length].bgGradient
}

const getIconColorClass = (index: number) => {
  return iconColors[index % iconColors.length].color
}

// Initialize - load data in parallel without showing skeleton to avoid hydration issues
onMounted(async () => {
  console.log('💳 Checkout page mounted')
  console.log('👤 Current user before fetch:', userStore.user)
  console.log('👑 isPro before fetch:', userStore.user?.isPro)
  
  try {
    // بارگذاری همزمان همه داده‌ها برای سرعت بیشتر
    await Promise.all([
      userStore.fetchUser(),
      fetchTransactions(),
      planStore.fetchPlans(),
      fetchFeatures()
    ])
    
    console.log('✅ Data loaded in checkout')
    console.log('👤 User after fetch:', userStore.user)
    console.log('👑 isPro after fetch:', userStore.user?.isPro)
    console.log('📊 Subscription status:', currentSubscription.value)
  } catch (error) {
    console.error('Error loading checkout data:', error)
  }
})
</script>
