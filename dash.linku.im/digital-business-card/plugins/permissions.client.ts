// پلاگین درخواست دسترسی‌های PWA
export default defineNuxtPlugin(() => {
  // فقط در کلاینت اجرا شود
  if (typeof window === 'undefined') return

  const requestAllPermissions = async () => {
    const results: Record<string, string> = {}
    
    try {
      // 1. دسترسی دوربین - حذف شد، فقط در QR Scanner درخواست می‌شود
      // دوربین فقط در صفحه QR Scanner درخواست می‌شود تا از اختلال در تجربه کاربری جلوگیری شود

      // 2. دسترسی لوکیشن
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' })
        if (permission.state === 'prompt') {
          await new Promise<void>((resolve) => {
            navigator.geolocation.getCurrentPosition(
              () => {
                results.location = 'granted'
                resolve()
              },
              () => {
                results.location = 'denied'
                resolve()
              },
              { timeout: 10000 }
            )
          })
        } else {
          results.location = permission.state
        }
      } catch (e) {
        results.location = 'unsupported'
      }

      // 3. دسترسی NFC (فقط اندروید کروم)
      if ('NDEFReader' in window) {
        try {
          const ndef = new (window as any).NDEFReader()
          await ndef.scan()
          results.nfc = 'granted'
        } catch (e: any) {
          if (e.name === 'NotAllowedError') {
            results.nfc = 'denied'
          } else {
            results.nfc = 'error'
          }
        }
      } else {
        results.nfc = 'unsupported'
      }

      // 4. دسترسی نوتیفیکیشن
      if ('Notification' in window) {
        try {
          if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission()
            results.notification = permission
          } else {
            results.notification = Notification.permission
          }
        } catch (e) {
          results.notification = 'denied'
        }
      } else {
        results.notification = 'unsupported'
      }
    } catch (error) {
      console.error('Error in requestAllPermissions:', error)
    }

    return results
  }

  // بررسی آیا قبلاً دسترسی‌ها گرفته شده
  const hasRequestedPermissions = () => {
    return localStorage.getItem('permissions_requested') === 'true'
  }

  const markPermissionsRequested = () => {
    localStorage.setItem('permissions_requested', 'true')
  }

  // درخواست دسترسی‌ها بعد از لاگین
  const requestPermissionsAfterLogin = async () => {
    try {
      if (hasRequestedPermissions()) return

      // صبر کن تا صفحه کامل لود بشه
      await new Promise(resolve => setTimeout(resolve, 2000))

      const results = await requestAllPermissions()
      console.log('Permissions results:', results)
      
      markPermissionsRequested()
      return results
    } catch (error) {
      console.error('Error in requestPermissionsAfterLogin:', error)
      markPermissionsRequested() // حتی با خطا، فلگ رو ست کن تا دیگه تلاش نکنه
      return {}
    }
  }

  return {
    provide: {
      permissions: {
        requestAll: requestAllPermissions,
        requestAfterLogin: requestPermissionsAfterLogin,
        hasRequested: hasRequestedPermissions,
        reset: () => localStorage.removeItem('permissions_requested')
      }
    }
  }
})
