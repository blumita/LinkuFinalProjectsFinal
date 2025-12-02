import { h, render } from 'vue'
import Toast from '~/components/ui/Toast.vue'

// تعریف types
interface ToastOptions {
  title?: string
  message?: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  autoClose?: boolean
  [key: string]: any
}

interface ToastItem extends ToastOptions {
  id: number
  container: HTMLElement
  vnode: any
  title: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration: number
  autoClose: boolean
}

// لیست toast های فعال - فقط در client
let toasts: ToastItem[] = []

// شمارنده برای ID یکتا
let toastId = 0

// تابع اصلی برای نمایش toast
const showToast = (options: ToastOptions): number => {
  // فقط در client اجرا شود
  if (typeof document === 'undefined') return 0
  
  const id = ++toastId
  
  const toastOptions = {
    id,
    title: options.title || 'اعلان',
    message: options.message || '',
    type: options.type || 'success',
    duration: options.duration ?? 3000,
    autoClose: options.autoClose ?? true,
    ...options
  }
  
  // ایجاد container برای toast
  const container = document.createElement('div')
  container.id = `toast-${id}`
  document.body.appendChild(container)
  
  // ایجاد component instance
  const vnode = h(Toast, {
    ...toastOptions,
    onClose: () => {
      // حذف toast از DOM
      if (container.parentNode) {
        container.parentNode.removeChild(container)
      }
      
      // حذف از لیست
      const index = toasts.findIndex(t => t.id === id)
      if (index > -1) {
        toasts.splice(index, 1)
      }
    }
  })
  
  // render کردن toast
  render(vnode, container)
  
  // اضافه کردن به لیست
  toasts.push({
    id,
    container,
    vnode,
    title: toastOptions.title,
    message: toastOptions.message,
    type: toastOptions.type,
    duration: toastOptions.duration,
    autoClose: toastOptions.autoClose
  })
  
  return id
}

// تابع‌های کمکی برای انواع مختلف toast
const success = (title: string, message = '', options: ToastOptions = {}): number => {
  return showToast({
    title,
    message,
    type: 'success',
    ...options
  })
}

const error = (title: string, message = '', options: ToastOptions = {}): number => {
  return showToast({
    title,
    message,
    type: 'error',
    duration: 5000, // خطاها بیشتر نمایش داده شوند
    ...options
  })
}

const info = (title: string, message = '', options: ToastOptions = {}): number => {
  return showToast({
    title,
    message,
    type: 'info',
    ...options
  })
}

const warning = (title: string, message = '', options: ToastOptions = {}): number => {
  return showToast({
    title,
    message,
    type: 'warning',
    duration: 4000,
    ...options
  })
}

// بستن toast خاص
const closeToast = (id: number): void => {
  if (typeof document === 'undefined') return
  
  const toast = toasts.find(t => t.id === id)
  if (toast && toast.container.parentNode) {
    toast.container.parentNode.removeChild(toast.container)
    const index = toasts.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.splice(index, 1)
    }
  }
}

// بستن همه toast ها
const clearAll = (): void => {
  if (typeof document === 'undefined') return
  
  toasts.forEach(toast => {
    if (toast.container.parentNode) {
      toast.container.parentNode.removeChild(toast.container)
    }
  })
  toasts = []
}

// Hook اصلی
export const useToast = () => {
  return {
    // متدهای اصلی
    show: showToast,
    success,
    error,
    info,
    warning,
    
    // متدهای مدیریت
    close: closeToast,
    clearAll,
    
    // state - برگردان آرایه ساده به جای ref
    toasts: () => [...toasts]
  }
}

// متدهای سراسری برای استفاده آسان‌تر
export const toast = {
  success,
  error,
  info,
  warning,
  show: showToast,
  close: closeToast,
  clearAll
}
