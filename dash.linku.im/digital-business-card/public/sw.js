// Service Worker for Push Notifications
const CACHE_NAME = 'linku-v1'

// Install event
self.addEventListener('install', (event) => {
    self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim())
})

// Push event - دریافت نوتیفیکیشن واقعی گوشی
self.addEventListener('push', (event) => {
    let notificationData = {
        title: 'لینکو',
        body: 'شما یک پیام جدید دارید',
        icon: '/AppImages/android/android-launchericon-192-192.png',
        badge: '/AppImages/android/android-launchericon-96-96.png',
        tag: 'linku-notification',
        requireInteraction: false,
        vibrate: [200, 100, 200], // الگوی لرزش گوشی
        silent: false, // صدا فعال
        renotify: true, // اگه notification قبلی باز باشه دوباره صدا بده
        timestamp: Date.now(),
        data: {
            url: '/dashboard/notifications'
        }
    }

    if (event.data) {
        try {
            const data = event.data.json()
            notificationData = {
                title: data.title || 'لینکو',
                body: data.message || data.body || 'شما یک پیام جدید دارید',
                icon: '/AppImages/android/android-launchericon-192-192.png',
                badge: '/AppImages/android/android-launchericon-96-96.png',
                tag: data.tag || 'linku-notification',
                requireInteraction: data.requireInteraction || false,
                vibrate: data.vibrate || [200, 100, 200],
                silent: false,
                renotify: true,
                timestamp: Date.now(),
                data: {
                    url: data.url || data.actionLink || '/dashboard/notifications',
                    ...data
                }
            }
        } catch (e) {
            // Parse error
        }
    }

    event.waitUntil(
        self.registration.showNotification(notificationData.title, notificationData)
    )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close()

    const urlToOpen = (event.notification.data && event.notification.data.url) || '/dashboard/notifications'

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
            // اگه یه تب باز داریم، اونو فوکوس کن
            for (let client of clientList) {
                if (client.url.includes(self.registration.scope) && 'focus' in client) {
                    client.focus()
                    return client.navigate(urlToOpen)
                }
            }
            // اگه تب بازی نیست، یه تب جدید باز کن
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen)
            }
        })
    )
})

// Background sync for offline notifications
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-notifications') {
        event.waitUntil(syncNotifications())
    }
})

async function syncNotifications() {
    try {
        // Fetch pending notifications
        const response = await fetch('/api/notifications/pending')
        const data = await response.json()

        // Show notifications
        if (data.notifications && data.notifications.length > 0) {
            for (const notification of data.notifications) {
                await self.registration.showNotification(notification.title, {
                    body: notification.message,
                    icon: '/AppImages/android/android-launchericon-192-192.png',
                    badge: '/AppImages/android/android-launchericon-96-96.png',
                    data: notification
                })
            }
        }
    } catch (error) {
        // Sync error
    }
}