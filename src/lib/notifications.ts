import { Repuesto } from '../types';

export interface CatalogNotification {
  id: string;
  title: string;
  body: string;
  repuestoId?: string;
  model?: string;
  timestamp: string;
  read: boolean;
}

const STORAGE_KEY = 'motopartes_cuba_notifications';
const PERMISSION_KEY = 'motopartes_cuba_push_enabled';

/**
 * Check if the browser supports notifications
 */
export function isPushSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current browser notification permission
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Request user permission for push notifications
 */
export async function requestPushPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isPushSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      localStorage.setItem(PERMISSION_KEY, 'true');
      // Register service worker if available
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js').catch((err) => {
          console.warn('Service worker registration note:', err);
        });
      }
    } else {
      localStorage.setItem(PERMISSION_KEY, 'false');
    }
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return Notification.permission;
  }
}

/**
 * Load stored notifications
 */
export function getStoredNotifications(): CatalogNotification[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save notifications list
 */
export function saveNotifications(notifications: CatalogNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, 30)));
  } catch {
    // ignore
  }
}

/**
 * Trigger both a browser push notification (if permitted) and log to notification feed
 */
export function dispatchRepuestoNotification(
  repuesto: Repuesto,
  customTitle?: string
): CatalogNotification {
  const title = customTitle || `🏍️ ¡Nuevo repuesto disponible: ${repuesto.name}!`;
  const body = `${repuesto.modelLabel} · Cód: ${repuesto.code} | Precio: $${repuesto.priceCUP.toLocaleString('es-ES')} CUP ($${repuesto.priceUSD} USD) listo para despacho.`;

  // 1. Dispatch System Browser Notification if granted
  if (isPushSupported() && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/logo.svg',
        badge: '/logo.svg',
        tag: `repuesto-${repuesto.id}`,
      });
    } catch (err) {
      console.warn('Browser notification creation notice:', err);
    }
  }

  // 2. Format in-app record
  const notification: CatalogNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
    body,
    repuestoId: repuesto.id,
    model: repuesto.model,
    timestamp: new Date().toISOString(),
    read: false,
  };

  const existing = getStoredNotifications();
  saveNotifications([notification, ...existing]);

  return notification;
}
