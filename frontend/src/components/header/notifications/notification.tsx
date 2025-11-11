import { AppTheme, useAppTheme } from '@app/app-theme';
import { OpenForYtelseAccess } from '@app/components/common-table-components/open';
import { CopyButton } from '@app/components/copy-button/copy-button';
import { DateTime } from '@app/components/datetime/datetime';
import { useMarkAsRead, useMarkAsUnread } from '@app/components/header/notifications/api';
import { Type, Ytelse } from '@app/components/header/notifications/common';
import { useNotificationsContext } from '@app/components/header/notifications/state';
import {
  type BehandlingInfo,
  getHasBehandling,
  type KabalNotification,
  type MessageNotification,
  NotificationType,
  type SystemNotification,
} from '@app/components/header/notifications/types';
import type { INavEmployee } from '@app/types/bruker';
import { BellDotFillIcon, ChatAddIcon, ClockIcon, EnvelopeClosedIcon, EnvelopeOpenIcon } from '@navikt/aksel-icons';
import {
  BodyLong,
  BoxNew,
  type BoxNewProps,
  Button,
  Heading,
  HGrid,
  HStack,
  Label,
  Tooltip,
  VStack,
} from '@navikt/ds-react';
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
  const hasBehandling = getHasBehandling(notification);
  const theme = useAppTheme();

  return (
    <BoxNew
      as="li"
      borderRadius="medium"
      borderWidth="1 1 1 4"
      borderColor={borderColor}
      background="neutral-soft"
      className={`${read ? 'opacity-60 hover:opacity-100' : 'opacity-100'} starting:opacity-0 transition-[opacity,background-color] duration-200 focus-within:opacity-100 hover:bg-ax-bg-default`}
    >
      <HStack wrap={false} gap="1" align="start" width="100%" paddingBlock="0 2">
        <BoxNew
          asChild
          borderRadius="0 0 medium 0"
          paddingInline="0 1"
          background={background}
          className={theme === AppTheme.LIGHT ? 'text-ax-text-neutral-contrast' : 'text-ax-text-neutral'}
        >
          <HStack as="span" align="center" gap="1" wrap={false} className="whitespace-nowrap">
            {icon}
            {title}
            {read ? null : <UnreadMarker color={`var(--${iconColor})`} />}
          </HStack>
        </BoxNew>

        <DateTime
          dateTime={createdAt}
          icon={<ClockIcon aria-hidden />}
          wrap={false}
          className="ml-auto whitespace-nowrap pr-1 text-ax-small italic"
        />
      </HStack>

      <VStack gap="2" paddingInline="2" paddingBlock="0 2" flexGrow="1">
        {children}

        <HGrid gap="1" className="auto-cols-[1fr] grid-flow-col" flexGrow="1">
          {hasBehandling ? <Open {...notification.behandling} /> : null}

          <MarkAsReadButton id={id} isRead={read} />
        </HGrid>
      </VStack>
    </BoxNew>
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
  [NotificationType.MESSAGE]: {
    borderColor: 'accent',
    background: 'accent-strong',
    iconColor: 'text-ax-text-accent-contrast',
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

    <BoxNew asChild borderWidth="0 0 0 2" borderColor="neutral" paddingInline="2 0">
      <BodyLong size="small" className="wrap-break-word whitespace-pre-line italic">
        {notification.message.content}
      </BodyLong>
    </BoxNew>
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
    case NotificationType.SYSTEM:
      return <System notification={notification} />;
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
        variant="tertiary-neutral"
        size="small"
        onClick={() => (isRead ? markAsUnread(id) : markAsRead(id))}
        loading={markAsReadLoading || markAsUnreadLoading}
        icon={isRead ? <EnvelopeClosedIcon aria-hidden /> : <EnvelopeOpenIcon aria-hidden />}
      />
    </Tooltip>
  );
};
