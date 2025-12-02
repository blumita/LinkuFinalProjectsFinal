<template>
  <div class="p-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">
        راهنمای استفاده از داشبورد لینکو
      </h1>
      <p class="text-slate-600 dark:text-slate-400">
        راهنمای کامل برای استفاده از تمام امکانات سیستم مدیریت
      </p>
    </div>

    <!-- Quick Start -->
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
      <h2 class="text-xl font-bold mb-3 flex items-center">
        <i class="ti ti-rocket ml-3"></i>
        شروع سریع
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span class="text-sm font-bold">1</span>
            </div>
            <h3 class="font-semibold">ورود به سیستم</h3>
          </div>
          <p class="text-sm opacity-90">
            با نام کاربری و رمز عبور خود وارد داشبورد شوید
          </p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span class="text-sm font-bold">2</span>
            </div>
            <h3 class="font-semibold">ایجاد لینک</h3>
          </div>
          <p class="text-sm opacity-90">
            لینک‌های کوتاه برای محصولات خود ایجاد کنید
          </p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span class="text-sm font-bold">3</span>
            </div>
            <h3 class="font-semibold">مدیریت کنید</h3>
          </div>
          <p class="text-sm opacity-90">
            کاربران، محصولات و گزارشات را مدیریت کنید
          </p>
        </div>
      </div>
    </div>

    <!-- Features Guide -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Dashboard -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <i class="ti ti-dashboard text-blue-600 ml-3"></i>
            داشبورد اصلی
          </h3>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">آمار کلی</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                مشاهده آمار کلی کاربران، محصولات و درآمد
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">نمودارهای تحلیلی</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                نمودار فروش، بازدید و کلیک‌ها به تفکیک زمان
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">فعالیت‌های اخیر</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                مشاهده آخرین فعالیت‌های انجام شده در سیستم
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Link Management -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <i class="ti ti-link text-green-600 ml-3"></i>
            مدیریت لینک‌ها
          </h3>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">ایجاد لینک کوتاه</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                تبدیل URL های طولانی به لینک‌های کوتاه و قابل اشتراک
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">دسته‌بندی لینک‌ها</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                سازماندهی لینک‌ها در دسته‌های مختلف (اجتماعی، کسب‌وکار، آموزشی)
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">آمار کلیک</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                مشاهده تعداد کلیک و بازدید هر لینک
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Management -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <i class="ti ti-credit-card text-purple-600 ml-3"></i>
            مدیریت محصولات
          </h3>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">انواع پروفایل‌ها</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                مدیریت انواع مختلف پروفایل‌های ویزیت دیجیتال
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">طراحی و قالب</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                تنظیم طراحی و قالب‌های مختلف برای پروفایل‌ها
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">مدیریت قیمت</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                تعیین قیمت برای انواع مختلف محصولات
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- User Management -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <i class="ti ti-users text-orange-600 ml-3"></i>
            مدیریت کاربران
          </h3>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">لیست کاربران</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                مشاهده و مدیریت تمام کاربران ثبت‌نام شده
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">مسدودسازی</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                امکان مسدود کردن کاربران متخلف
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">خروجی اکسل</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                دانلود لیست کاربران در فرمت اکسل با فیلتر تاریخ
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Management -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <i class="ti ti-shield text-red-600 ml-3"></i>
            مدیریت مدیران
          </h3>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">سطوح دسترسی</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                تعریف سطوح مختلف دسترسی (سوپر ادمین، ادمین، ناظر)
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">مجوزها</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                تعیین مجوزهای مختلف برای هر مدیر
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">تعلیق حساب</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                امکان تعلیق موقت حساب مدیران
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Reports Management -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <i class="ti ti-flag text-yellow-600 ml-3"></i>
            مدیریت گزارشات
          </h3>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">گزارش‌های تخلف</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                بررسی گزارشات کاربران از محتوای نامناسب
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">اولویت‌بندی</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                تعیین اولویت گزارشات (کم، متوسط، بالا، اضطراری)
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-slate-900 dark:text-white">بررسی مدارک</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                بررسی تصاویر و مدارک ارائه شده در گزارشات
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tips & Tricks -->
    <div class="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
      <div class="p-6 border-b border-slate-200 dark:border-slate-700">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center">
          <i class="ti ti-bulb text-yellow-500 ml-3"></i>
          نکات و ترفندها
        </h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <i class="ti ti-keyboard text-yellow-600 dark:text-yellow-400"></i>
              </div>
              <div>
                <h4 class="font-medium text-slate-900 dark:text-white">میانبرهای کیبورد</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400">
                  از <kbd class="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs">Ctrl+N</kbd> برای ایجاد سریع محتوا استفاده کنید
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <i class="ti ti-search text-blue-600 dark:text-blue-400"></i>
              </div>
              <div>
                <h4 class="font-medium text-slate-900 dark:text-white">جستجوی پیشرفته</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400">
                  از فیلترهای موجود برای جستجوی دقیق‌تر استفاده کنید
                </p>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <i class="ti ti-download text-green-600 dark:text-green-400"></i>
              </div>
              <div>
                <h4 class="font-medium text-slate-900 dark:text-white">خروجی گیری</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400">
                  برای تحلیل بهتر، داده‌ها را در فرمت اکسل دانلود کنید
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <i class="ti ti-moon text-purple-600 dark:text-purple-400"></i>
              </div>
              <div>
                <h4 class="font-medium text-slate-900 dark:text-white">حالت تاریک</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400">
                  برای راحتی چشم در شب از حالت تاریک استفاده کنید
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Keyboard Shortcuts -->
    <div class="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
      <div class="p-6 border-b border-slate-200 dark:border-slate-700">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center">
          <i class="ti ti-keyboard text-blue-500 ml-3"></i>
          میانبرهای کیبورد
        </h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <span class="text-sm text-slate-700 dark:text-slate-300">ایجاد جدید</span>
            <kbd class="px-2 py-1 bg-white dark:bg-slate-600 rounded text-xs font-mono">Ctrl+N</kbd>
          </div>
          <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <span class="text-sm text-slate-700 dark:text-slate-300">ذخیره</span>
            <kbd class="px-2 py-1 bg-white dark:bg-slate-600 rounded text-xs font-mono">Ctrl+S</kbd>
          </div>
          <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <span class="text-sm text-slate-700 dark:text-slate-300">جستجو</span>
            <kbd class="px-2 py-1 bg-white dark:bg-slate-600 rounded text-xs font-mono">Ctrl+F</kbd>
          </div>
          <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <span class="text-sm text-slate-700 dark:text-slate-300">بازگشت</span>
            <kbd class="px-2 py-1 bg-white dark:bg-slate-600 rounded text-xs font-mono">Esc</kbd>
          </div>
          <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <span class="text-sm text-slate-700 dark:text-slate-300">تازه‌سازی</span>
            <kbd class="px-2 py-1 bg-white dark:bg-slate-600 rounded text-xs font-mono">F5</kbd>
          </div>
          <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <span class="text-sm text-slate-700 dark:text-slate-300">راهنما</span>
            <kbd class="px-2 py-1 bg-white dark:bg-slate-600 rounded text-xs font-mono">F1</kbd>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Support -->
    <div class="mt-8 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl p-6 text-white">
      <div class="text-center">
        <h3 class="text-xl font-bold mb-3">نیاز به کمک دارید؟</h3>
        <p class="mb-4 opacity-90">تیم پشتیبانی ما آماده کمک به شماست</p>
        <div class="flex flex-wrap justify-center gap-4">
          <a href="mailto:support@linku.ir" class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all flex items-center gap-2">
            <i class="ti ti-mail"></i>
            support@linku.ir
          </a>
          <a href="tel:+982112345678" class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all flex items-center gap-2">
            <i class="ti ti-phone"></i>
            021-12345678
          </a>
          <a href="https://t.me/linkusupport" class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all flex items-center gap-2">
            <i class="ti ti-brand-telegram"></i>
            پشتیبانی تلگرام
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'GuideComponent'
})
</script>

<style scoped>
kbd {
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}
</style>
