import type { INavEmployee } from '@app/types/bruker';
import type { SaksTypeEnum } from '@app/types/kodeverk';

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  LOST_ACCESS = 'LOST_ACCESS',
  GAINED_ACCESS = 'GAINED_ACCESS',
  MESSAGE = 'MESSAGE',
  JOURNALPOST = 'JOURNALPOST',
}

export const NOTIFICATION_TYPES = Object.values(NotificationType);

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  [NotificationType.MESSAGE]: 'Melding',
  [NotificationType.JOURNALPOST]: 'Journalpost',
  [NotificationType.LOST_ACCESS]: 'Mistet tilgang',
  [NotificationType.GAINED_ACCESS]: 'Fått tilbake tilgang',
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

export interface JournalpostNotification extends BaseKabalNotification<NotificationType.JOURNALPOST>, WithBehandling {
  journalpost: {
    /** The ID of the related journal post */
    id: string;
    /** The ID of the related tema */
    temaId: string;
    /** Names of documents in the journalpost. The first document is the main document. */
    documentNames: string[];
  };
}

export interface LostAccessNotification extends BaseKabalNotification<NotificationType.LOST_ACCESS>, WithBehandling {
  message: string;
}

export interface GainedAccessNotification
  extends BaseKabalNotification<NotificationType.GAINED_ACCESS>,
    WithBehandling {
  message: string;
}

export interface SystemNotification extends BaseKabalNotification<NotificationType.SYSTEM> {
  /** The system message title */
  title: string;
  /** The system message content */
  message: string;
}

export type KabalNotification =
  | MessageNotification
  | JournalpostNotification
  | LostAccessNotification
  | GainedAccessNotification
  | SystemNotification;

export interface KabalNotificationId {
  /** The unique identifier for the notification */
  id: string;
}

export interface KabalNotificationIds {
  /** The unique identifiers for the notifications */
  ids: string[];
}
