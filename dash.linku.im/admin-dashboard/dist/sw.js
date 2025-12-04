// Service Worker برای دریافت Push Notifications

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');

    if (event.data) {
        const data = event.data.json();
        console.log('[Service Worker] Push data:', data);

        const title = data.title || 'اعلان جدید';
        const options = {
            body: data.message || data.body || 'پیام جدید دارید',
            icon: data.icon || '/favicon.ico',
            badge: data.badge || '/favicon.ico',
            vibrate: data.vibrate || [200, 100, 200, 100, 200],
            data: {
                url: data.url || data.actionLink || '/dashboard/notifications',
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [{
                    action: 'open',
                    title: 'مشاهده'
                },
                {
                    action: 'close',
                    title: 'بستن'
                }
            ],
            requireInteraction: false,
            silent: false,
            tag: 'notification-' + Date.now(),
            renotify: true
        };

        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    }
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click received.');

    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    const urlToOpen = event.notification.data.url || '/dashboard/notifications';

    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(function(clientList) {
            // اگر پنجره‌ای باز است، فوکس کن
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // در غیر این صورت پنجره جدید باز کن
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

self.addEventListener('notificationclose', function(event) {
    console.log('[Service Worker] Notification closed:', event);
});

// Install event
self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing...');
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating...');
    event.waitUntil(clients.claim());
});