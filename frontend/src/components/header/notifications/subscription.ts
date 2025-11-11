import { KLAGE_NOTIFICATIONS_BASE_PATH } from '@app/components/header/notifications/constants';
import { notificationsStore } from '@app/components/header/notifications/store';
import type { KabalNotification, KabalNotificationId } from '@app/components/header/notifications/types';
import { ServerSentEventManager } from '@app/server-sent-events';

enum EventNames {
  CREATE = 'create',
  READ = 'read',
  UNREAD = 'unread',
  DELETE = 'delete',
}

const manager = new ServerSentEventManager<EventNames>(`${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/events`);

manager.addJsonEventListener<KabalNotification>(EventNames.CREATE, (notification) => {
  notificationsStore.set((current) => [...current, notification]);
});

manager.addJsonEventListener<KabalNotificationId>(EventNames.READ, ({ id }) => {
  notificationsStore.set((current) => current.map((n) => (n.id === id ? { ...n, read: true } : n)));
});

manager.addJsonEventListener<KabalNotificationId>(EventNames.UNREAD, ({ id }) => {
  notificationsStore.set((current) => current.map((n) => (n.id === id ? { ...n, read: false } : n)));
});

manager.addEventListener(EventNames.DELETE, ({ data }) => {
  notificationsStore.set((current) => current.filter((n) => n.id !== data));
});
