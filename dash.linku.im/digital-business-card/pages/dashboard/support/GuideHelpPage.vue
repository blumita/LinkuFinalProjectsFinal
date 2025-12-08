<template>
  <div class="min-h-screen bg-background">
    <!-- Mobile Header -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div class="flex items-center justify-between px-4 h-16">
        <button @click="goBack('/dashboard/support')" class="p-2 hover:bg-secondary rounded-lg transition-colors">
          <i class="ti ti-arrow-right text-primary text-xl"></i>
        </button>
        <h1 class="text-lg font-bold text-foreground">راهنما و کمک</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="pt-20 pb-4 px-4">
      <div class="space-y-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-6 animate-pulse">
          <!-- Welcome Section Skeleton -->
          <div class="bg-muted rounded-xl p-6 border border-muted">
            <div class="h-6 w-40 bg-muted-foreground/20 rounded mb-2"></div>
            <div class="h-4 w-full bg-muted-foreground/20 rounded"></div>
            <div class="h-4 w-3/4 bg-muted-foreground/20 rounded mt-2"></div>
          </div>

          <!-- Quick Start Skeleton -->
          <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div class="h-6 w-24 bg-muted rounded mb-4"></div>
            
            <div class="space-y-4">
              <div v-for="n in 3" :key="n" class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-muted rounded-full flex-shrink-0 mt-1"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 w-20 bg-muted rounded"></div>
                  <div class="h-3 w-full bg-muted-foreground/20 rounded"></div>
                  <div class="h-3 w-2/3 bg-muted-foreground/20 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Features Section Skeleton -->
          <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div class="h-6 w-32 bg-muted rounded mb-4"></div>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="n in 6" :key="n" class="bg-muted/50 rounded-xl p-4 text-center">
                <div class="w-10 h-10 bg-muted rounded-xl mx-auto mb-3"></div>
                <div class="h-4 w-16 bg-muted rounded mx-auto mb-2"></div>
                <div class="h-3 w-12 bg-muted-foreground/20 rounded mx-auto"></div>
              </div>
            </div>
          </div>

          <!-- FAQ Section Skeleton -->
          <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div class="h-6 w-28 bg-muted rounded mb-4"></div>
            <div class="space-y-3">
              <div v-for="n in 4" :key="n" class="border border-border rounded-lg p-4">
                <div class="flex items-center gap-3">
                  <div class="w-5 h-5 bg-muted rounded"></div>
                  <div class="h-4 flex-1 bg-muted rounded"></div>
                  <div class="w-4 h-4 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Support Skeleton -->
          <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div class="h-6 w-24 bg-muted rounded mb-4"></div>
            <div class="space-y-3">
              <div v-for="n in 3" :key="n" class="flex items-center gap-3 p-3 rounded-lg border border-border">
                <div class="w-10 h-10 bg-muted rounded-full"></div>
                <div class="flex-1 space-y-1">
                  <div class="h-4 w-20 bg-muted rounded"></div>
                  <div class="h-3 w-32 bg-muted-foreground/20 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Welcome -->
        <div v-else class="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
          <h3 class="text-xl font-bold text-foreground mb-2">خوش آمدید به لینکو!</h3>
          <p class="text-muted-foreground">در این راهنما نحوه استفاده از قابلیت‌های مختلف لینکو را یاد خواهید گرفت.</p>
        </div>

        <!-- Quick Start -->
        <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h4 class="text-lg font-semibold text-foreground mb-4">شروع سریع</h4>
          
          <div class="space-y-4">
            <div class="flex items-start space-x-4">
              <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span class="text-primary text-sm font-bold">۱</span>
              </div>
              <div>
                <h5 class="text-foreground font-medium mb-1">ایجاد لینک</h5>
                <p class="text-muted-foreground text-sm">روی دکمه "+" در صفحه اصلی کلیک کنید و لینک خود را وارد کنید</p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span class="text-primary text-sm font-bold">۲</span>
              </div>
              <div>
                <h5 class="text-foreground font-medium mb-1">سفارشی‌سازی</h5>
                <p class="text-muted-foreground text-sm">نام و توضیحات مناسب برای لینک خود انتخاب کنید</p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span class="text-primary text-sm font-bold">۳</span>
              </div>
              <div>
                <h5 class="text-foreground font-medium mb-1">به‌اشتراک‌گذاری</h5>
                <p class="text-muted-foreground text-sm">لینک کوتاه شده را کپی کنید یا QR کد آن را دانلود کنید</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Features Guide -->
        <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h4 class="text-lg font-semibold text-foreground mb-4">راهنمای ویژگی‌ها</h4>
          
          <div class="space-y-4">
            <button class="w-full flex items-center justify-between p-3 bg-background rounded-lg hover:bg-accent transition-colors">
              <div class="flex items-center space-x-3">
                <i class="ti ti-link text-primary"></i>
                <div class="text-left">
                  <div class="text-foreground font-medium">مدیریت لینک‌ها</div>
                  <div class="text-muted-foreground text-sm">ایجاد، ویرایش و حذف لینک‌ها</div>
                </div>
              </div>
              <i class="ti ti-chevron-left text-muted-foreground"></i>
            </button>

            <button class="w-full flex items-center justify-between p-3 bg-background rounded-lg hover:bg-accent transition-colors">
              <div class="flex items-center space-x-3">
                <i class="ti ti-qrcode text-primary"></i>
                <div class="text-left">
                  <div class="text-foreground font-medium">QR کد</div>
                  <div class="text-muted-foreground text-sm">تولید و دانلود QR کد</div>
                </div>
              </div>
              <i class="ti ti-chevron-left text-muted-foreground"></i>
            </button>

            <button class="w-full flex items-center justify-between p-3 bg-background rounded-lg hover:bg-accent transition-colors">
              <div class="flex items-center space-x-3">
                <i class="ti ti-chart-bar text-primary"></i>
                <div class="text-left">
                  <div class="text-foreground font-medium">آمار و تحلیل</div>
                  <div class="text-muted-foreground text-sm">مشاهده آمار کلیک و بازدید</div>
                </div>
              </div>
              <i class="ti ti-chevron-left text-muted-foreground"></i>
            </button>

            <button class="w-full flex items-center justify-between p-3 bg-background rounded-lg hover:bg-accent transition-colors">
              <div class="flex items-center space-x-3">
                <i class="ti ti-folders text-primary"></i>
                <div class="text-left">
                  <div class="text-foreground font-medium">دسته‌بندی</div>
                  <div class="text-muted-foreground text-sm">سازماندهی لینک‌ها در پوشه‌ها</div>
                </div>
              </div>
              <i class="ti ti-chevron-left text-muted-foreground"></i>
            </button>
          </div>
        </div>

        <!-- Tips & Tricks -->
        <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h4 class="text-lg font-semibold text-foreground mb-4">نکات و ترفندها</h4>
          
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h5 class="text-foreground font-medium mb-1">استفاده از نام‌های مناسب</h5>
                <p class="text-muted-foreground text-sm">نام‌های توصیفی برای لینک‌هایتان انتخاب کنید تا راحت‌تر آن‌ها را پیدا کنید.</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h5 class="text-foreground font-medium mb-1">بررسی آمار به‌طور منظم</h5>
                <p class="text-muted-foreground text-sm">آمار کلیک‌ها را بررسی کنید تا عملکرد لینک‌هایتان را ارزیابی کنید.</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h5 class="text-foreground font-medium mb-1">استفاده از QR کد</h5>
                <p class="text-muted-foreground text-sm">برای اشتراک‌گذاری آسان، از QR کد استفاده کنید.</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h5 class="text-foreground font-medium mb-1">تنظیم انقضا</h5>
                <p class="text-muted-foreground text-sm">برای لینک‌های موقت، تاریخ انقضا تنظیم کنید.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Keyboard Shortcuts -->
        <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h4 class="text-lg font-semibold text-foreground mb-4">میانبرهای کیبورد</h4>
          
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-muted-foreground">ایجاد لینک جدید</span>
              <div class="flex space-x-1">
                <kbd class="px-2 py-1 bg-background border border-border rounded text-xs text-foreground">Ctrl</kbd>
                <span class="text-muted-foreground">+</span>
                <kbd class="px-2 py-1 bg-background border border-border rounded text-xs text-foreground">N</kbd>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-muted-foreground">جستجو</span>
              <div class="flex space-x-1">
                <kbd class="px-2 py-1 bg-background border border-border rounded text-xs text-foreground">Ctrl</kbd>
                <span class="text-muted-foreground">+</span>
                <kbd class="px-2 py-1 bg-background border border-border rounded text-xs text-foreground">F</kbd>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-muted-foreground">تنظیمات</span>
              <div class="flex space-x-1">
                <kbd class="px-2 py-1 bg-background border border-border rounded text-xs text-foreground">Ctrl</kbd>
                <span class="text-muted-foreground">+</span>
                <kbd class="px-2 py-1 bg-background border border-border rounded text-xs text-foreground">,</kbd>
              </div>
            </div>
          </div>
        </div>

        <!-- Video Tutorials -->
        <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h4 class="text-lg font-semibold text-foreground mb-4">ویدیوهای آموزشی</h4>
          
          <div class="grid grid-cols-1 gap-4">
            <div class="flex items-center space-x-3 p-3 bg-background rounded-lg">
              <div class="w-16 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="ti ti-play text-primary text-xl"></i>
              </div>
              <div class="flex-1">
                <h5 class="text-foreground font-medium">مقدمه‌ای بر لینکو</h5>
                <p class="text-muted-foreground text-sm">۵ دقیقه</p>
              </div>
            </div>

            <div class="flex items-center space-x-3 p-3 bg-background rounded-lg">
              <div class="w-16 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="ti ti-play text-primary text-xl"></i>
              </div>
              <div class="flex-1">
                <h5 class="text-foreground font-medium">ایجاد و مدیریت لینک</h5>
                <p class="text-muted-foreground text-sm">۸ دقیقه</p>
              </div>
            </div>

            <div class="flex items-center space-x-3 p-3 bg-background rounded-lg">
              <div class="w-16 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="ti ti-play text-primary text-xl"></i>
              </div>
              <div class="flex-1">
                <h5 class="text-foreground font-medium">تحلیل آمار و گزارش‌ها</h5>
                <p class="text-muted-foreground text-sm">۶ دقیقه</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Support -->
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h4 class="text-lg font-semibold text-foreground mb-2">نیاز به کمک دارید؟</h4>
          <p class="text-muted-foreground mb-4">تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست.</p>
          
          <button class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors">
            تماس با پشتیبانی
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSafeNavigation } from '~/composables/useSafeNavigation'
const { goBack } = useSafeNavigation()

// Loading state
const isLoading = ref(true)

// Initialize loading
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>
