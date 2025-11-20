import type { SystemNotification } from '@app/components/header/notifications/types';
import { Observable } from '@app/observable';

export type AdminSystemNotification = Omit<SystemNotification, 'read'>;

export const systemNotificationsStore = new Observable<AdminSystemNotification[]>([]);
