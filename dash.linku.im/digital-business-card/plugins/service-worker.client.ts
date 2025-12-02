// Service Worker Registration for Push Notifications
export default defineNuxtPlugin(async () => {
  // فقط در مرورگرهایی که Service Worker دارن
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported')
    return
  }

  // چک کردن که آیا sw.js در دسترس هست یا نه
  try {
    const swUrl = '/sw.js'
    const checkResponse = await fetch(swUrl, { method: 'HEAD' })
    if (!checkResponse.ok) {
      console.warn('Service Worker file not accessible, skipping registration')
      return
    }
  } catch (error) {
    console.warn('Service Worker file check failed, skipping registration:', error)
    return
  }

  try {
    // ثبت Service Worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })

    console.log('Service Worker registered successfully:', registration)

    // چک کردن آپدیت
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      console.log('New Service Worker found')
      
      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'activated') {
          console.log('New Service Worker activated')
          // می‌تونی اینجا به کاربر بگی که رفرش کنه
        }
      })
    })

    // چک کردن آپدیت هر 1 ساعت
    setInterval(() => {
      registration.update()
    }, 60 * 60 * 1000)

    // درخواست Permission برای نوتیفیکیشن (بعد از نصب PWA)
    if ('Notification' in window && Notification.permission === 'default') {
      // صبر کن تا کاربر اپ رو نصب کنه (یا یه بار باز کنه)
      setTimeout(async () => {
        try {
          const permission = await Notification.requestPermission()
          console.log('Notification permission:', permission)
          
          if (permission === 'granted') {
            // دریافت Push Subscription از Service Worker
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(
                'BFzttfamBJ5XHjuy55yNQTCdkR2rbgE3J0oYQHmEgoiRJPPrLWPt5lkTBZn7jS30UBdMLCeBplkznfAoZSjXkUY'
              )
            })
            
            console.log('Push subscription:', subscription)
            
            // ارسال subscription به سرور برای ذخیره
            try {
              const { $axios } = useNuxtApp()
              await $axios.post('/user/push-subscription', {
                subscription: subscription.toJSON()
              })
              console.log('✓ Subscription saved to server')
            } catch (error) {
              console.error('Failed to save subscription:', error)
            }
          }
        } catch (error) {
          console.error('Error requesting notification permission:', error)
        }
      }, 3000) // 3 ثانیه بعد از باز شدن اپ
    }

    return {
      provide: {
        swRegistration: registration
      }
    }
  } catch (error) {
    console.error('Service Worker registration failed:', error)
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

