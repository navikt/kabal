import type { SystemNotification } from '@/components/header/notifications/types';
import { Observable } from '@/observable';

export type AdminSystemNotification = Omit<SystemNotification, 'read'>;

export const systemNotificationsStore = new Observable<AdminSystemNotification[]>([]);
