// Firebase Cloud Messaging Service Worker for Motopartes de Cuba S.R.L
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  projectId: "gifted-glow-x3kqt",
  appId: "1:220802931995:web:2599473d7a281e4158c7be",
  apiKey: "AIzaSyApt-t4So4CByODJ_7dNMhgmL_bsjKONEg",
  messagingSenderId: "220802931995"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  const notificationTitle = payload.notification?.title || 'Nuevo Repuesto en Motopartes de Cuba S.R.L';
  const notificationOptions = {
    body: payload.notification?.body || 'Se ha agregado una nueva pieza al catálogo.',
    icon: '/logo.svg',
    badge: '/logo.svg',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
