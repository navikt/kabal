import { EventName, manager } from '@app/components/header/notifications/subscription';
import type {
  KabalNotification,
  KabalNotificationId,
  KabalNotificationIds,
} from '@app/components/header/notifications/types';
import { Observable } from '@app/observable';

export const notificationsStore = new Observable<KabalNotification[]>([]);

// Create notifications
manager.addJsonEventListener<KabalNotification>(EventName.CREATE, (notification) =>
  notificationsStore.set((current) =>
    current.some((n) => n.id === notification.id) ? current : [notification, ...current],
  ),
);

manager.addJsonEventListener<KabalNotification[]>(EventName.CREATE_MULTIPLE, (notifications) => {
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
