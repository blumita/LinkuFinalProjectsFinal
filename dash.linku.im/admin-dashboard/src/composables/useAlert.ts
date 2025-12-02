import { ref } from 'vue'

export interface AlertOptions {
  type?: 'success' | 'error' | 'warning' | 'info' | 'confirm' | 'delete'
  title: string
  message: string
  details?: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  autoClose?: number
}

const isAlertVisible = ref(false)
const alertOptions = ref<AlertOptions>({
  type: 'info',
  title: '',
  message: ''
})

const alertPromiseResolve = ref<((value: boolean) => void) | null>(null)

export const useAlert = () => {
  const showAlert = (options: AlertOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      alertOptions.value = {
        confirmText: 'تایید',
        cancelText: 'انصراف',
        showCancel: true,
        ...options
      }

      alertPromiseResolve.value = resolve
      isAlertVisible.value = true
    })
  }

  const hideAlert = () => {
    isAlertVisible.value = false
    if (alertPromiseResolve.value) {
      alertPromiseResolve.value(false)
      alertPromiseResolve.value = null
    }
  }

  const confirmAlert = () => {
    isAlertVisible.value = false
    if (alertPromiseResolve.value) {
      alertPromiseResolve.value(true)
      alertPromiseResolve.value = null
    }
  }

  const cancelAlert = () => {
    isAlertVisible.value = false
    if (alertPromiseResolve.value) {
      alertPromiseResolve.value(false)
      alertPromiseResolve.value = null
    }
  }

  // Helper methods for common alert types
  const showSuccess = (title: string, message: string, autoClose = 3000) => {
    return showAlert({
      type: 'success',
      title,
      message,
      showCancel: false,
      confirmText: 'متوجه شدم',
      autoClose
    })
  }

  const showError = (title: string, message: string) => {
    return showAlert({
      type: 'error',
      title,
      message,
      showCancel: false,
      confirmText: 'متوجه شدم'
    })
  }

  const showWarning = (title: string, message: string) => {
    return showAlert({
      type: 'warning',
      title,
      message,
      confirmText: 'متوجه شدم'
    })
  }

  const showConfirm = (title: string, message: string, details?: string) => {
    return showAlert({
      type: 'confirm',
      title,
      message,
      details,
      confirmText: 'تایید',
      cancelText: 'انصراف',
      showCancel: true
    })
  }

  const showDeleteConfirm = (title: string, message: string, itemName?: string) => {
    const details = itemName
      ? `<strong class="text-red-600 dark:text-red-400">${itemName}</strong> به طور کامل حذف خواهد شد و قابل بازگردانی نیست.`
      : 'این عمل غیرقابل بازگشت است.'

    return showAlert({
      type: 'delete',
      title,
      message,
      details,
      confirmText: 'حذف کن',
      cancelText: 'انصراف',
      showCancel: true
    })
  }

  return {
    isAlertVisible,
    alertOptions,
    showAlert,
    hideAlert,
    confirmAlert,
    cancelAlert,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
    showDeleteConfirm
  }
}
