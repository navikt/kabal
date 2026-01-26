import { AppTheme, useAppTheme } from '@app/app-theme';
import { OpenForYtelseAccess } from '@app/components/common-table-components/open';
import { CopyButton } from '@app/components/copy-button/copy-button';
import { DateTime } from '@app/components/datetime/datetime';
import { useMarkAsRead, useMarkAsUnread } from '@app/components/header/notifications/api';
import { Type, Ytelse } from '@app/components/header/notifications/common';
import { useNotificationsContext } from '@app/components/header/notifications/state';
import {
  type BehandlingInfo,
  type GainedAccessNotification,
  getHasBehandling,
  type KabalNotification,
  type LostAccessNotification,
  type MessageNotification,
  NOTIFICATION_TYPE_LABELS,
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
  KeyHorizontalIcon,
} from '@navikt/aksel-icons';
import { BodyLong, Box, type BoxProps, Button, Heading, HGrid, HStack, Label, Tooltip, VStack } from '@navikt/ds-react';
import type { JSX } from 'react';
import { useLocation } from 'react-router';

interface Props {
  title: string;
  icon: React.ReactElement;
  notification: KabalNotification;
  children?: React.ReactNode;
}

const Container = ({ title, icon, notification, children }: Props) => {
  const { id, createdAt, read, type } = notification;
  const { borderColor, background, iconColor } = VARIANTS[type];
  const theme = useAppTheme();

  return (
    <Box
      as="li"
      borderRadius="4"
      borderWidth="1 1 1 4"
      borderColor={borderColor}
      background="neutral-soft"
      className={`${read ? 'opacity-60 hover:opacity-100' : 'opacity-100'} starting:opacity-0 transition-[opacity,background-color] duration-200 focus-within:opacity-100 hover:bg-ax-bg-default`}
    >
      <HStack wrap={false} gap="space-4" align="start" width="100%" paddingBlock="space-0 space-8">
        <Box
          asChild
          borderRadius="0 0 8 0"
          paddingInline="space-0 space-4"
          background={background}
          className={theme === AppTheme.LIGHT ? 'text-ax-text-neutral-contrast' : 'text-ax-text-neutral'}
        >
          <HStack as="span" align="center" gap="space-4" wrap={false} className="whitespace-nowrap">
            {icon}
            {title}
            {read ? null : <UnreadMarker color={`var(--${iconColor})`} />}
          </HStack>
        </Box>

        <DateTime
          dateTime={createdAt}
          icon={<ClockIcon aria-hidden />}
          wrap={false}
          className="ml-auto whitespace-nowrap pr-1 text-ax-small italic"
        />
      </HStack>
      <VStack gap="space-8" paddingInline="space-8" paddingBlock="space-0 space-8" flexGrow="1">
        {children}

        <HGrid gap="space-4" className="auto-cols-[1fr] grid-flow-col" flexGrow="1">
          {notification.type !== NotificationType.LOST_ACCESS && getHasBehandling(notification) ? (
            <Open {...notification.behandling} />
          ) : null}

          <MarkAsReadButton id={id} isRead={read} />
        </HGrid>
      </VStack>
    </Box>
  );
};

const Open = ({ id, ytelseId }: BehandlingInfo) => {
  const { pathname } = useLocation();
  const { closeMenuAndModal } = useNotificationsContext();

  const isOpen = pathname === `/behandling/${id}`;

  return (
    <Tooltip content={isOpen ? 'Behandling allerede åpen' : 'Åpne behandling'}>
      <HStack>
        <OpenForYtelseAccess
          id={id}
          ytelseId={ytelseId}
          size="xsmall"
          onClick={closeMenuAndModal}
          disabled={isOpen}
          className="grow"
        />
      </HStack>
    </Tooltip>
  );
};

interface VariantData {
  borderColor: BoxProps['borderColor'];
  background: BoxProps['background'];
  iconColor: `text-ax-text-${string}`;
}

const VARIANTS: Record<NotificationType, VariantData> = {
  [NotificationType.MESSAGE]: {
    borderColor: 'accent',
    background: 'accent-strong',
    iconColor: 'text-ax-text-accent-contrast',
  },
  [NotificationType.LOST_ACCESS]: {
    borderColor: 'danger',
    background: 'danger-strong',
    iconColor: 'text-ax-text-danger-contrast',
  },
  [NotificationType.GAINED_ACCESS]: {
    borderColor: 'success',
    background: 'success-strong',
    iconColor: 'text-ax-text-success-contrast',
  },
  [NotificationType.SYSTEM]: {
    borderColor: 'danger',
    background: 'danger-strong',
    iconColor: 'text-ax-text-danger-contrast',
  },
};

interface NotificationEntryProps<T extends KabalNotification> {
  notification: T;
  children?: React.ReactNode;
}

const Message = ({ notification, children }: NotificationEntryProps<MessageNotification>) => (
  <Container title="Ny melding" icon={<ChatAddIcon aria-hidden />} notification={notification}>
    {children}

    <Actor {...notification.actor} />

    <Box asChild borderWidth="0 0 0 2" borderColor="neutral" paddingInline="space-8 space-0">
      <BodyLong size="small" className="wrap-break-word whitespace-pre-line italic">
        {notification.message.content}
      </BodyLong>
    </Box>
  </Container>
);

const LostAccess = ({ notification, children }: NotificationEntryProps<LostAccessNotification>) => (
  <Container
    title={NOTIFICATION_TYPE_LABELS[NotificationType.LOST_ACCESS]}
    icon={<CircleSlashIcon aria-hidden />}
    notification={notification}
  >
    {children}

    <Box asChild borderWidth="0 0 0 2" borderColor="neutral" paddingInline="space-8 space-0">
      <BodyLong size="small" className="wrap-break-word whitespace-pre-line italic">
        {notification.message}
      </BodyLong>
    </Box>
  </Container>
);

const GainedAccess = ({ notification, children }: NotificationEntryProps<GainedAccessNotification>) => (
  <Container
    title={NOTIFICATION_TYPE_LABELS[NotificationType.GAINED_ACCESS]}
    icon={<KeyHorizontalIcon aria-hidden />}
    notification={notification}
  >
    {children}

    <Box asChild borderWidth="0 0 0 2" borderColor="neutral" paddingInline="space-8 space-0">
      <BodyLong size="small" className="wrap-break-word whitespace-pre-line italic">
        {notification.message}
      </BodyLong>
    </Box>
  </Container>
);

export const System = ({ notification, children }: NotificationEntryProps<SystemNotification>) => (
  <Container title="Systemvarsel" icon={<ChatAddIcon aria-hidden />} notification={notification}>
    {children}

    <Heading size="xsmall" level="1">
      {notification.title}
    </Heading>

    <BodyLong size="small" className="wrap-break-word whitespace-pre-line">
      {notification.message}
    </BodyLong>
  </Container>
);

export const KabalNotificationEntry = (notification: KabalNotification): JSX.Element => {
  switch (notification.type) {
    case NotificationType.MESSAGE:
      return <Message notification={notification} />;
    case NotificationType.LOST_ACCESS:
      return <LostAccess notification={notification} />;
    case NotificationType.GAINED_ACCESS:
      return <GainedAccess notification={notification} />;
    case NotificationType.SYSTEM:
      return <System notification={notification} />;
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
    case NotificationType.LOST_ACCESS:
      return (
        <LostAccess notification={notification}>
          <CaseData {...notification.behandling} />
        </LostAccess>
      );
    case NotificationType.GAINED_ACCESS:
      return (
        <GainedAccess notification={notification}>
          <CaseData {...notification.behandling} />
        </GainedAccess>
      );
    case NotificationType.SYSTEM:
      return <System notification={notification} />;
  }
};

const CaseData = ({ typeId, ytelseId, saksnummer }: BehandlingInfo) => (
  <HStack wrap={false} align="center" gap="space-4" width="100%">
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
  <Tooltip content="Ulest varsel" placement="top" describesChild>
    <BellDotFillIcon aria-hidden role="presentation" color={color} />
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
    <Tooltip content={isRead ? 'Marker som ulest' : 'Marker som lest'}>
      <Button
        data-color="neutral"
        variant="tertiary"
        size="small"
        onClick={() => (isRead ? markAsUnread(id) : markAsRead(id))}
        loading={markAsReadLoading || markAsUnreadLoading}
        icon={isRead ? <EnvelopeClosedIcon aria-hidden /> : <EnvelopeOpenIcon aria-hidden />}
      />
    </Tooltip>
  );
};
