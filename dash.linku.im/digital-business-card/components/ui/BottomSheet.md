# UiBottomSheet Component

کامپوننت `UiBottomSheet` یک wrapper global برای نمایش bottom sheet در موبایل و modal در دسکتاپ است. این کامپوننت در پوشه `components/ui/` قرار دارد.

## استفاده

```vue
<template>
  <UiBottomSheet
    :visible="isOpen"
    title="عنوان"
    @close="isOpen = false"
  >
    <!-- محتوای مودال شما اینجا -->
    <div>
      <p>محتوای مودال</p>
      <button>دکمه‌ها</button>
    </div>
  </UiBottomSheet>
</template>
```

## مثال‌های عملی

### ShareModal
```vue
<template>
  <UiBottomSheet
    :visible="visible"
    title="اشتراک کارت"
    @close="$emit('close')"
  >
    <div class="qr-section">
      <!-- QR کد و دکمه‌ها -->
    </div>
    <div class="social-links">
      <!-- لینک‌های شبکه‌های اجتماعی -->
    </div>
  </UiBottomSheet>
</template>
```

### ActionMenu (فقط برای موبایل)
```vue
<template>
  <div>
    <!-- دکمه منو -->
    <button @click="open = !open">منو</button>
    
    <!-- دسکتاپ: dropdown معمولی -->
    <div v-if="open && !isMobile" class="dropdown">
      <!-- آیتم‌های منو -->
    </div>

    <!-- موبایل: bottom sheet -->
    <UiBottomSheet
      :visible="open && isMobile"
      title="منوی عملیات"
      @close="open = false"
    >
      <ul>
        <li>گزینه ۱</li>
        <li>گزینه ۲</li>
      </ul>
    </UiBottomSheet>
  </div>
</template>
```

## Props

| نام | نوع | پیش‌فرض | توضیح |
|-----|-----|---------|-------|
| `visible` | Boolean | `false` | نمایش/مخفی کردن کامپوننت |
| `title` | String | `''` | عنوان نمایش در هیدر موبایل |
| `showMobileHeader` | Boolean | `true` | نمایش هیدر در موبایل |
| `showDesktopClose` | Boolean | `true` | نمایش دکمه بستن در دسکتاپ |
| `desktopCentered` | Boolean | `true` | وسط‌چین کردن در دسکتاپ |
| `desktopSize` | String | `'max-w-4xl'` | اندازه در دسکتاپ |
| `heightClass` | String | `'max-h-[90vh]'` | کلاس ارتفاع |
| `contentPadding` | String | `'lg:p-16 p-6 pt-6 md:pt-16'` | padding محتوا |
| `scrollable` | Boolean | `true` | قابلیت اسکرول |
| `closeOnOverlay` | Boolean | `true` | بستن با کلیک روی overlay |

## Events

- `@close`: هنگام بستن کامپوننت

## ویژگی‌ها

- **Responsive**: در موبایل bottom sheet، در دسکتاپ modal
- **Teleport**: استفاده از Vue teleport برای رندر در body
- **Smooth Animation**: انیمیشن‌های نرم با CSS cubic-bezier
- **Flexible**: قابل تنظیم با props مختلف
- **Accessible**: قابلیت بستن با ESC و کلیک خارج
