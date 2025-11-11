import { KLAGE_NOTIFICATIONS_BASE_PATH } from '@app/components/header/notifications/constants';
import { ServerSentEventManager } from '@app/server-sent-events';

export enum EventName {
  CREATE = 'create',
  CREATE_MULTIPLE = 'create_multiple',
  READ = 'read',
  READ_MULTIPLE = 'read_multiple',
  UNREAD = 'unread',
  UNREAD_MULTIPLE = 'unread_multiple',
  DELETE = 'delete',
  DELETE_MULTIPLE = 'delete_multiple',
}

export const manager = new ServerSentEventManager<EventName>(
  `${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/events`,
);
