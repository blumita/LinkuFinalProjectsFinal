// Service Worker Registration for Push Notifications
export default defineNuxtPlugin(async () => {
  // تابع خالی برای برگرداندن وقتی service worker پشتیبانی نمیشه
  const emptyProvide = () => ({
    provide: {
      swRegistration: null,
      subscribeToPush: async () => false,
      requestNotificationPermission: async () => false
    }
  })

  // فقط در مرورگرهایی که Service Worker دارن
  if (!('serviceWorker' in navigator)) {
    return emptyProvide()
  }

  // چک کردن که آیا sw.js در دسترس هست یا نه
  try {
    const swUrl = '/sw.js'
    const checkResponse = await fetch(swUrl, { method: 'HEAD' })
    if (!checkResponse.ok) {
      return emptyProvide()
    }
  } catch (error) {
    return emptyProvide()
  }

  try {
    // ثبت Service Worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })

    // چک کردن آپدیت
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      
      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'activated') {
          // Service Worker activated
        }
      })
    })

    // چک کردن آپدیت هر 1 ساعت
    setInterval(() => {
      registration.update()
    }, 60 * 60 * 1000)

    // تابع برای ثبت Push Subscription
    const subscribeToPush = async () => {
      try {
        const VAPID_PUBLIC_KEY = 'BFzttfamBJ5XHjuy55yNQTCdkR2rbgE3J0oYQHmEgoiRJPPrLWPt5lkTBZn7jS30UBdMLCeBplkznfAoZSjXkUY'
        
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        })
        
        // ارسال subscription به سرور برای ذخیره
        try {
          const { $axios } = useNuxtApp()
          const subscriptionData = subscription.toJSON()
          
          // Attach Authorization if available (SPA may store token in localStorage)
          const token = (typeof window !== 'undefined') ? localStorage.getItem('auth_token') : null
          const config: any = {}
          if (token) {
            config.headers = { Authorization: `Bearer ${token}` }
          }

          await $axios.post('/user/push-subscription', {
            subscription: subscriptionData
          }, config)
          
          return true
        } catch (error: any) {
          return false
        }
      } catch (error: any) {
        return false
      }
    }

    // درخواست Permission فوری (نه بعد از 3 ثانیه)
    if ('Notification' in window) {
      // اگه permission داده شده، چک کن که subscription داره یا نه
      if (Notification.permission === 'granted') {
        try {
          const existingSubscription = await registration.pushManager.getSubscription()
          if (!existingSubscription) {
            await subscribeToPush()
          }
        } catch (error) {
          await subscribeToPush()
        }
      }
      // اگه هنوز نداده، فوراً درخواست کن (خودکار)
      else if (Notification.permission === 'default') {
        try {
          const permission = await Notification.requestPermission()
          
          if (permission === 'granted') {
            await subscribeToPush()
          }
        } catch (error) {
          // Permission error
        }
      }
    }

    // توابع برای دسترسی از بیرون
    const requestNotificationPermission = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          return await subscribeToPush()
        }
      }
      return false
    }

    return {
      provide: {
        swRegistration: registration,
        subscribeToPush,
        requestNotificationPermission
      }
    }
  } catch (error) {
    return emptyProvide()
  }
})

// تبدیل VAPID key به Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

