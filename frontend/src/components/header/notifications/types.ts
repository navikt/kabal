import type { INavEmployee } from '@app/types/bruker';
import type { SaksTypeEnum } from '@app/types/kodeverk';

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  MESSAGE = 'MESSAGE',
}

export const NOTIFICATION_TYPES = Object.values(NotificationType);

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  [NotificationType.MESSAGE]: 'Melding',
  [NotificationType.SYSTEM]: 'System',
};

export interface BaseKabalNotification<T extends NotificationType> {
  /** The type of the notification */
  type: T;
  /** The unique identifier for the notification */
  id: string; // Notification UUID
  /** Whether the notification has been marked as read by the user */
  read: boolean;
  /** The date and time for the event that caused the notification */
  createdAt: string; // ISO datetime string
}

interface WithActor {
  actor: INavEmployee; // The employee who triggered the notification
}

export const getHasActor = (notification: KabalNotification): notification is WithActor & KabalNotification =>
  'actor' in notification;

export interface BehandlingInfo {
  /** The unique identifier for the behandling */
  id: string;
  /** The type of the behandling */
  typeId: SaksTypeEnum;
  /** The ytelse ID of the behandling */
  ytelseId: string;
  /** The saksnummer related to the behandling */
  saksnummer: string;
}

export interface WithBehandling {
  /** The related behandling */
  behandling: BehandlingInfo;
}

export const getHasBehandling = (notification: KabalNotification): notification is WithBehandling & KabalNotification =>
  'behandling' in notification;

export interface MessageNotification
  extends BaseKabalNotification<NotificationType.MESSAGE>,
    WithActor,
    WithBehandling {
  message: {
    id: string;
    /** The message content */
    content: string;
  };
}

export interface SystemNotification extends BaseKabalNotification<NotificationType.SYSTEM> {
  /** The system message title */
  title: string;
  /** The system message content */
  message: string;
}

export type KabalNotification = MessageNotification | SystemNotification;

export interface KabalNotificationId {
  /** The unique identifier for the notification */
  id: string;
}

export interface KabalNotificationIds {
  /** The unique identifiers for the notifications */
  ids: string[];
}
