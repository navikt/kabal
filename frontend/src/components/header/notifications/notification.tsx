import { YtelseAccessedOpen } from '@app/components/common-table-components/open';
import { CopyButton } from '@app/components/copy-button/copy-button';
import { DateTime } from '@app/components/datetime/datetime';
import { useMarkAsRead, useMarkAsUnread } from '@app/components/header/notifications/api';
import { Type, Ytelse } from '@app/components/header/notifications/common';
import {
  type BehandlingInfo,
  getHasBehandling,
  type JournalpostNotification,
  type KabalNotification,
  type LostAccessNotification,
  type MessageNotification,
  NotificationType,
  type SystemNotification,
} from '@app/components/header/notifications/types';
import type { INavEmployee } from '@app/types/bruker';
import {
  BellDotFillIcon,
  ChatAddIcon,
  CircleSlashIcon,
  ClockIcon,
  EnvelopeClosedIcon,
  EnvelopeOpenIcon,
  FilePlusIcon,
} from '@navikt/aksel-icons';
import {
  BodyLong,
  BoxNew,
  type BoxNewProps,
  Button,
  Heading,
  HGrid,
  HStack,
  Label,
  Tag,
  Tooltip,
  VStack,
} from '@navikt/ds-react';
import type { JSX } from 'react';

interface Props {
  title: string;
  icon: React.ReactElement;
  notification: KabalNotification;
  children?: React.ReactNode;
}

const Container = ({ title, icon, notification, children }: Props) => {
  const { id, createdAt, read, type } = notification;
  const { borderColor, background, iconColor } = VARIANTS[type];
  const hasBehandling = getHasBehandling(notification);

  return (
    <BoxNew
      as="li"
      borderRadius="medium"
      borderWidth="1 1 1 4"
      borderColor={borderColor}
      background="neutral-soft"
      className={`group/notification ${read ? 'opacity-60' : 'opacity-100'} starting:opacity-0 transition-[opacity,background-color] duration-200 focus-within:opacity-100 hover:bg-ax-bg-default hover:opacity-100`}
    >
      <HStack wrap={false} gap="1" align="start" width="100%" paddingBlock="0 2">
        <BoxNew asChild borderRadius="0 0 medium 0" paddingInline="0 1" background={background}>
          <HStack as="span" align="center" gap="1" wrap={false} className="whitespace-nowrap">
            {icon}
            {title}
            {read ? null : <UnreadMarker color={`var(--${iconColor})`} />}
          </HStack>
        </BoxNew>

        <DateTime
          dateTime={createdAt}
          icon={<ClockIcon />}
          wrap={false}
          className="ml-auto whitespace-nowrap pr-1 text-ax-small italic"
        />
      </HStack>

      <VStack gap="2" paddingInline="2" paddingBlock="0 2" flexGrow="1">
        {children}

        <HGrid gap="1" className="auto-cols-[1fr] grid-flow-col" flexGrow="1">
          {hasBehandling ? (
            <YtelseAccessedOpen
              {...notification.behandling}
              size="xsmall"
              className="opacity-0 transition-opacity duration-200 group-focus-within/notification:opacity-100 group-hover/notification:opacity-100"
            />
          ) : null}

          <MarkAsReadButton id={id} isRead={read} />
        </HGrid>
      </VStack>
    </BoxNew>
  );
};

interface VariantData {
  borderColor: BoxNewProps['borderColor'];
  background: BoxNewProps['background'];
  iconColor: `text-ax-text-${string}`;
}

const VARIANTS: Record<NotificationType, VariantData> = {
  [NotificationType.SYSTEM]: {
    borderColor: 'danger',
    background: 'danger-strong',
    iconColor: 'text-ax-text-danger-contrast',
  },
  [NotificationType.LOST_ACCESS]: {
    borderColor: 'danger',
    background: 'danger-strong',
    iconColor: 'text-ax-text-danger-contrast',
  },
  [NotificationType.MESSAGE]: {
    borderColor: 'accent',
    background: 'accent-strong',
    iconColor: 'text-ax-text-accent-contrast',
  },
  [NotificationType.JOURNALPOST]: {
    borderColor: 'warning',
    background: 'warning-strong',
    iconColor: 'text-ax-text-warning-contrast',
  },
};

interface NotificationEntryProps<T extends KabalNotification> {
  notification: T;
  children?: React.ReactNode;
}

const Message = ({ notification, children }: NotificationEntryProps<MessageNotification>) => (
  <Container title="Ny melding" icon={<ChatAddIcon />} notification={notification}>
    {children}

    <Actor {...notification.actor} />

    <BoxNew asChild borderWidth="0 0 0 2" borderColor="neutral" paddingInline="2 0">
      <BodyLong size="small" className="italic">
        {notification.content}
      </BodyLong>
    </BoxNew>
  </Container>
);

const Journalpost = ({ notification, children }: NotificationEntryProps<JournalpostNotification>) => {
  const [documentName, ...attachmentNames] = notification.documentNames;

  return (
    <Container title="Ny journalpost" icon={<FilePlusIcon />} notification={notification}>
      {children}

      <BodyLong size="small">
        <Tag variant="neutral" size="xsmall">
          {documentName}
        </Tag>
        , med {attachmentNames.length} vedlegg.
      </BodyLong>
    </Container>
  );
};

const LostAccess = ({ notification, children }: NotificationEntryProps<LostAccessNotification>) => (
  <Container title="Mistet tilgang" icon={<CircleSlashIcon />} notification={notification}>
    {children}

    <BoxNew asChild borderWidth="0 0 0 2" borderColor="neutral" paddingInline="2 0">
      <BodyLong size="small" className="italic">
        {notification.reason}
      </BodyLong>
    </BoxNew>
  </Container>
);

const System = ({ notification, children }: NotificationEntryProps<SystemNotification>) => (
  <Container title="Systemmelding" icon={<ChatAddIcon />} notification={notification}>
    {children}

    <Heading size="xsmall" level="1">
      {notification.title}
    </Heading>

    <BodyLong size="small">{notification.content}</BodyLong>
  </Container>
);

export const KabalNotificationEntry = (notification: KabalNotification): JSX.Element => {
  switch (notification.type) {
    case NotificationType.MESSAGE:
      return <Message notification={notification} />;
    case NotificationType.JOURNALPOST:
      return <Journalpost notification={notification} />;
    case NotificationType.SYSTEM:
      return <System notification={notification} />;
    case NotificationType.LOST_ACCESS:
      return <LostAccess notification={notification} />;
  }
};

export const KabalNotificationWithCaseDataEntry = (notification: KabalNotification): JSX.Element => {
  switch (notification.type) {
    case NotificationType.MESSAGE:
      return (
        <Message notification={notification}>
          <CaseData {...notification.behandling} />
        </Message>
      );
    case NotificationType.JOURNALPOST:
      return (
        <Journalpost notification={notification}>
          <CaseData {...notification.behandling} />
        </Journalpost>
      );
    case NotificationType.SYSTEM:
      return <System notification={notification} />;
    case NotificationType.LOST_ACCESS:
      return (
        <LostAccess notification={notification}>
          <CaseData {...notification.behandling} />
        </LostAccess>
      );
  }
};

const CaseData = ({ typeId, ytelseId, saksnummer }: BehandlingInfo) => (
  <HStack wrap={false} align="center" gap="1" width="100%">
    <Type typeId={typeId} />
    <Ytelse ytelseId={ytelseId} />
    <CopyButton text={saksnummer} activeText={saksnummer} size="xsmall" className="shrink-0" />
  </HStack>
);

const Actor = ({ navn, navIdent }: INavEmployee) => (
  <Label size="small">
    {navn} ({navIdent})
  </Label>
);

interface UnreadMarkerProps {
  color: string;
}

const UnreadMarker = ({ color }: UnreadMarkerProps) => (
  <Tooltip content="Ulest varsel" placement="top">
    <BellDotFillIcon color={color} />
  </Tooltip>
);

interface MarkAsReadButtonProps {
  id: string;
  isRead: boolean;
}

const MarkAsReadButton = ({ id, isRead }: MarkAsReadButtonProps) => {
  const { markAsRead, loading: markAsReadLoading } = useMarkAsRead();
  const { markAsUnread, loading: markAsUnreadLoading } = useMarkAsUnread();

  return (
    <Tooltip content={isRead ? 'Marker som ulest' : 'Marker som lest'} placement="top">
      <Button
        variant="tertiary-neutral"
        size="small"
        onClick={() => (isRead ? markAsUnread(id) : markAsRead(id))}
        loading={markAsReadLoading || markAsUnreadLoading}
        icon={isRead ? <EnvelopeClosedIcon aria-hidden /> : <EnvelopeOpenIcon aria-hidden />}
        className="opacity-0 transition-opacity duration-200 group-focus-within/notification:opacity-100 group-hover/notification:opacity-100"
      />
    </Tooltip>
  );
};
