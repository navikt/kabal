import { KLAGE_NOTIFICATIONS_BASE_PATH } from '@/components/header/notifications/constants';
import type {
  KabalNotification,
  KabalNotificationEvent,
  KabalNotificationId,
  KabalNotificationIds,
  KabalNotificationListEvent,
} from '@/components/header/notifications/types';
import { Observable } from '@/observable';
import { ServerSentEventManager } from '@/server-sent-events';

enum EventName {
  CREATE = 'create',
  CREATE_MULTIPLE = 'create_multiple',
  READ = 'read',
  READ_MULTIPLE = 'read_multiple',
  UNREAD = 'unread',
  UNREAD_MULTIPLE = 'unread_multiple',
  DELETE = 'delete',
  DELETE_MULTIPLE = 'delete_multiple',
}

export const notificationsStore = new Observable<KabalNotification[]>([]);

const manager = new ServerSentEventManager<EventName>(
  'notifications',
  `${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/events`,
);

import.meta.hot?.dispose(() => manager.close());

// Create notifications
manager.addJsonEventListener<KabalNotificationEvent>(EventName.CREATE, (notification) =>
  notificationsStore.set((current) =>
    current.some((n) => n.id === notification.id) ? current : [notification, ...current],
  ),
);

manager.addJsonEventListener<KabalNotificationListEvent>(EventName.CREATE_MULTIPLE, ({ notifications }) => {
  notificationsStore.set((current) => {
    if (current.length === 0) {
      return notifications;
    }

    const newNotifications = notifications.filter((n) => !current.some((c) => c.id === n.id));

    return newNotifications.length === 0
      ? current
      : [...newNotifications, ...current].toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
  });
});

// Mark as read
manager.addJsonEventListener<KabalNotificationId>(EventName.READ, ({ id }) =>
  notificationsStore.set((current) => current.map((n) => (n.id === id ? { ...n, read: true } : n))),
);

manager.addJsonEventListener<KabalNotificationIds>(EventName.READ_MULTIPLE, ({ ids }) =>
  notificationsStore.set((current) => current.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n))),
);

// Mark as unread
manager.addJsonEventListener<KabalNotificationId>(EventName.UNREAD, ({ id }) =>
  notificationsStore.set((current) => current.map((n) => (n.id === id ? { ...n, read: false } : n))),
);

manager.addJsonEventListener<KabalNotificationIds>(EventName.UNREAD_MULTIPLE, ({ ids }) =>
  notificationsStore.set((current) => current.map((n) => (ids.includes(n.id) ? { ...n, read: false } : n))),
);

// Delete notifications
manager.addJsonEventListener<KabalNotificationId>(EventName.DELETE, ({ id }) =>
  notificationsStore.set((current) =>
    current.some((n) => n.id === id) ? current.filter((n) => n.id !== id) : current,
  ),
);

manager.addJsonEventListener<KabalNotificationIds>(EventName.DELETE_MULTIPLE, ({ ids }) =>
  notificationsStore.set((current) => current.filter((n) => !ids.includes(n.id))),
);
