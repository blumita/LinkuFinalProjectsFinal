// نوع ورودی‌های فرم (برای Lead Form یا سایر فرم‌ها)
export interface FormField {
  id: number | string
  label: string
  type: 'text' | 'dropdown' | 'checkbox' | 'file'
  required: boolean
  options?: string[]
  preset?: 'custom' | 'countries' | 'states'
}

// نوع لینک‌هایی که کاربر اضافه می‌کند
export interface LinkItem {
  id: number | string
  title: string
  value: string
  type: 'social' | 'contact' | 'default' | 'payment'
  action?: 'call' | 'sms' | 'email' | 'social' | 'custom'
  icon?: string | { path: string }       // برای پشتیبانی از آیکون‌های آپلودشده یا مسیر مستقیم
  customIcon?: string                    // Base64 یا آدرس سفارشی آپلودشده
  description?: string                   // توضیحات اختیاری برای لینک
  enabled: boolean
  baseUrl?: string
  username?: string
}

// انواع layoutهای کارت دیجیتال
export type LayoutType = 'right' | 'left' | 'center' | 'portrait' | 'single'

// رنگ تم کارت
export type ThemeColor = string

// ساختار اصلی کارت که می‌توان به Preview نیز پاس داد
export interface FormData {
  layout: LayoutType
  themeColor: ThemeColor
  iconColor: {
    background: string
    text: string
  }
  name: string
  location: string
  job: string
  company: string
  bio: string
  saveContact: string
  profileImage: string | null
  coverImage: string | null
  logoImage: string | null
  links: LinkItem[]
  isLeadCaptureEnabled: boolean
  formTitle?: string
  connectButtonText?: string
  formDisclaimer?: string
  fields: FormField[]
}
