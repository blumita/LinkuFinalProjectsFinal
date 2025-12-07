/**
 * سرویس مدیریت Push Notifications
 */

import axios from 'axios'

// کلید عمومی VAPID از بک‌اند (fallback)
let VAPID_PUBLIC_KEY = 'BBrc3IGoGmr0QFGKjlze9bcN13pPYTxNiKlsumViMDsMocHhc6MTnWJYb5CP0bI-nni13kBrzXK4vKkDY2QA2yc';

/**
 * دریافت VAPID key از API
 */
async function fetchVapidKey(): Promise<string> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://api.linku.im'
    const response = await axios.get(`${apiUrl}/vapid-public-key`)
    if (response.data.publicKey) {
      VAPID_PUBLIC_KEY = response.data.publicKey
      console.log('✅ VAPID key loaded from API:', VAPID_PUBLIC_KEY.substring(0, 20) + '...')
    }
  } catch (error) {
    console.warn('⚠️ Failed to load VAPID from API, using default:', error)
  }
  return VAPID_PUBLIC_KEY
}

/**
 * تبدیل Base64 URL-safe به Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * بررسی پشتیبانی مرورگر از Push Notifications
 */
export function isPushNotificationSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * درخواست اجازه دریافت نوتیفیکیشن از کاربر
 */
export async function askUserPermission(): Promise<NotificationPermission> {
  if (!isPushNotificationSupported()) {
    throw new Error('مرورگر شما از نوتیفیکیشن پشتیبانی نمی‌کند');
  }

  return await Notification.requestPermission();
}

/**
 * ثبت Service Worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!isPushNotificationSupported()) {
    throw new Error('Service Worker پشتیبانی نمی‌شود');
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none'
    });

    console.log('Service Worker registered successfully:', registration);

    // منتظر می‌مانیم تا Service Worker فعال شود
    await navigator.serviceWorker.ready;

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    throw error;
  }
}

/**
 * ایجاد subscription برای دریافت Push
 */
export async function createPushSubscription(): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready;

    // بررسی subscription موجود
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      console.log('Push subscription already exists:', subscription);
      return subscription;
    }

    // دریافت VAPID key از API
    const vapidKey = await fetchVapidKey()

    // ایجاد subscription جدید
    const convertedVapidKey = urlBase64ToUint8Array(vapidKey);

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });

    console.log('Push subscription created:', subscription);
    return subscription;

  } catch (error) {
    console.error('Failed to create push subscription:', error);
    throw error;
  }
}

/**
 * دریافت subscription فعلی
 */
export async function getPushSubscription(): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error('Failed to get push subscription:', error);
    return null;
  }
}

/**
 * لغو subscription
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      console.log('Push subscription cancelled');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Failed to unsubscribe:', error);
    return false;
  }
}

/**
 * ارسال subscription به سرور
 */
export async function sendSubscriptionToServer(subscription: PushSubscription): Promise<boolean> {
  try {
    const subscriptionJson = subscription.toJSON();

    // No localStorage - just log it
    console.log('Subscription to send:', subscriptionJson);

    return true;
  } catch (error) {
    console.error('Failed to send subscription to server:', error);
    return false;
  }
}

/**
 * راه‌اندازی کامل Push Notifications
 */
export async function initializePushNotifications(): Promise<{
  success: boolean;
  subscription?: PushSubscription;
  error?: string;
}> {
  try {
    // 1. بررسی پشتیبانی
    if (!isPushNotificationSupported()) {
      return {
        success: false,
        error: 'مرورگر شما از نوتیفیکیشن پشتیبانی نمی‌کند'
      };
    }

    // 2. بررسی اجازه فعلی
    if (Notification.permission === 'denied') {
      return {
        success: false,
        error: 'اجازه دریافت نوتیفیکیشن رد شده است'
      };
    }

    // 3. درخواست اجازه اگر هنوز داده نشده
    if (Notification.permission === 'default') {
      const permission = await askUserPermission();
      if (permission !== 'granted') {
        return {
          success: false,
          error: 'کاربر اجازه نوتیفیکیشن را نداد'
        };
      }
    }

    // 4. ثبت Service Worker
    await registerServiceWorker();

    // 5. ایجاد Subscription
    const subscription = await createPushSubscription();

    if (!subscription) {
      return {
        success: false,
        error: 'خطا در ایجاد subscription'
      };
    }

    // 6. ارسال به سرور
    await sendSubscriptionToServer(subscription);

    return {
      success: true,
      subscription
    };

  } catch (error: any) {
    console.error('Push notification initialization failed:', error);
    return {
      success: false,
      error: error.message || 'خطای ناشناخته'
    };
  }
}

/**
 * نمایش نوتیفیکیشن تست
 */
export async function showTestNotification(): Promise<void> {
  if (!isPushNotificationSupported()) {
    alert('مرورگر شما از نوتیفیکیشن پشتیبانی نمی‌کند');
    return;
  }

  if (Notification.permission === 'granted') {
    const registration = await navigator.serviceWorker.ready;

    await registration.showNotification('نوتیفیکیشن تست', {
      body: 'اگر این پیام را می‌بینید، نوتیفیکیشن‌ها کار می‌کنند!',
      icon: '/favicon.ico',

      tag: 'test-notification'
    });
  } else {
    alert('لطفا ابتدا اجازه دریافت نوتیفیکیشن را بدهید');
  }
}
