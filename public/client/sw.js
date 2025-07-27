// Log when the service worker is installed
self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker...', event);
    self.skipWaiting(); // Ensure the service worker activates immediately
});

// Log when the service worker is activated
self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker...', event);
    return self.clients.claim(); // Take control of all clients immediately
});

self.addEventListener('push', function (event) {
    console.log('[Service Worker] Push notification received:', event);
    console.log('[Service Worker] Push notification data:', event.data ? event.data.text() : 'no data');
    
    if (event.data) {
        try {
            const data = event.data.json();
            console.log('[Service Worker] Push data parsed:', data);
            
            const options = {
                body: data.body || 'New notification',
                icon: data.icon || '/icon.png',
                badge: '/badge.png',
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: '2',
                    url: data.url || '/',
                },
            };
            
            console.log('[Service Worker] Showing notification with options:', options);
            event.waitUntil(self.registration.showNotification(data.title || 'Notification', options));
        } catch (error) {
            console.error('[Service Worker] Error handling push notification:', error);
            
            // Fallback notification if JSON parsing fails
            const options = {
                body: 'You have a new notification',
                icon: '/icon.png',
                badge: '/badge.png',
                vibrate: [100, 50, 100],
            };
            
            console.log('[Service Worker] Showing fallback notification');
            event.waitUntil(self.registration.showNotification('New Notification', options));
        }
    } else {
        console.warn('[Service Worker] Push event received but no data');
    }
})

self.addEventListener('notificationclick', function (event) {
    console.log('Notification click received:', event);
    
    // Close the notification
    event.notification.close();
    
    // Get the URL from the notification data or use the root URL as fallback
    const url = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';
    
    // Navigate to the URL
    event.waitUntil(
        clients.matchAll({type: 'window'}).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                // If so, focus it
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // If not, open a new window/tab
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
})