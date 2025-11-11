import { useAppTheme } from '@app/app-theme';
import { MarkManyAsRead } from '@app/components/header/notifications/mark-many';
import { KabalNotificationWithCaseDataEntry } from '@app/components/header/notifications/notification';
import { OverviewModal } from '@app/components/header/notifications/overview/overview';
import { useNotificationsContext } from '@app/components/header/notifications/state';
import { notificationsStore } from '@app/components/header/notifications/store';
import { getHasBehandling, type KabalNotification } from '@app/components/header/notifications/types';
import { useMaybeOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { BellFillIcon, BellIcon, ChevronDownIcon, ChevronUpIcon, SidebarBothIcon } from '@navikt/aksel-icons';
import {
  ActionMenu,
  BodyShort,
  BoxNew,
  Button,
  Heading,
  HStack,
  InternalHeader,
  Theme,
  Tooltip,
  VStack,
} from '@navikt/ds-react';
import { useMemo, useState, useSyncExternalStore } from 'react';

export const Notifications = () => {
  const oppgaveId = useMaybeOppgaveId();
  const notifications = useSyncExternalStore(notificationsStore.subscribe, notificationsStore.get);

  const unreadNotifications = notifications.filter((n) => !n.read);
  const unreadCount = unreadNotifications.length;
  const hasUnreadNotifications = unreadCount !== 0;
  const Icon = hasUnreadNotifications ? BellFillIcon : BellIcon;
  const color = hasUnreadNotifications ? 'var(--ax-text-danger-decoration)' : 'var(--ax-text-neutral)';

  const theme = useAppTheme();
  const { modalRef, isMenuOpen, setIsMenuOpen } = useNotificationsContext();

  return (
    <>
      <ActionMenu onOpenChange={setIsMenuOpen} open={isMenuOpen}>
        <Tooltip content="Varsler" placement="bottom">
          <ActionMenu.Trigger>
            <InternalHeader.Button aria-label="Varsler" className="relative">
              <Icon
                title="Varsler"
                fontSize="1.5em"
                color={color}
                className={hasUnreadNotifications ? 'animate-wiggle' : undefined}
              />

              <BoxNew
                as="span"
                position="absolute"
                background={hasUnreadNotifications ? 'danger-strong' : 'neutral-strong'}
                top="1"
                right="1"
                paddingBlock="05"
                paddingInline="1"
                borderRadius="full"
                shadow="dialog"
                aria-label="Antall uleste varsler"
                className="font-ax-bold text-ax-small leading-none"
              >
                {unreadCount > 999 ? '999+' : unreadCount}
              </BoxNew>
            </InternalHeader.Button>
          </ActionMenu.Trigger>
        </Tooltip>

        <Theme theme={theme}>
          <ActionMenu.Content align="start" className="max-h-[calc(100vh-48px-8px-8px)] w-90">
            <ActionMenu.Item
              onSelect={() => modalRef.current?.showModal()}
              icon={<SidebarBothIcon />}
              className="mb-4 w-full cursor-pointer"
            >
              Oversikt
            </ActionMenu.Item>

            {oppgaveId === null ? (
              <Group notifications={unreadNotifications} title="Alle oppgaver" />
            ) : (
              <OppgaveNotifications notifications={unreadNotifications} oppgaveId={oppgaveId} />
            )}
          </ActionMenu.Content>
        </Theme>
      </ActionMenu>

      <Theme theme={theme}>
        <OverviewModal
          ref={modalRef}
          notifications={notifications}
          icon={<Icon title="Varsler" color={color} />}
          unreadCount={unreadCount}
        />
      </Theme>
    </>
  );
};

interface OppgaveNotificationsProps {
  notifications: readonly KabalNotification[];
  oppgaveId: string;
}

const OppgaveNotifications = ({ notifications, oppgaveId }: OppgaveNotificationsProps) => {
  const { current, other } = useMemo(() => {
    const current: KabalNotification[] = [];
    const other: KabalNotification[] = [];

    for (const n of notifications) {
      if (getHasBehandling(n) && n.behandling.id === oppgaveId) {
        current.push(n);
      } else {
        other.push(n);
      }
    }

    return { current, other };
  }, [oppgaveId, notifications.filter, notifications]);

  return (
    <VStack gap="4">
      <Group notifications={current} title="Åpen oppgave" />
      <ExpandableGroup notifications={other} title="Andre oppgaver" />
    </VStack>
  );
};

interface GroupProps {
  title: string;
  notifications: readonly KabalNotification[];
}

const Group = ({ title, notifications }: GroupProps) => (
  <VStack as="section" gap="2">
    <Heading size="xsmall">
      {title} ({notifications.length})
    </Heading>

    <Content notifications={notifications} />
  </VStack>
);

const ExpandableGroup = ({ title, notifications }: GroupProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <VStack as="section" gap="2">
      <HStack asChild justify="space-between" align="center" className="cursor-pointer">
        <Heading
          size="xsmall"
          onClick={() => setIsExpanded((e) => !e)}
          textColor={notifications.length === 0 ? 'subtle' : 'default'}
        >
          {title} ({notifications.length})
          <Button variant="tertiary-neutral" size="small" icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />} />
        </Heading>
      </HStack>

      {isExpanded ? <Content notifications={notifications} /> : null}
    </VStack>
  );
};

interface ContentProps {
  notifications: readonly KabalNotification[];
}

const Content = ({ notifications }: ContentProps) => {
  if (notifications.length === 0) {
    return (
      <BodyShort size="small" className="text-ax-text-neutral-subtle italic" spacing>
        Ingen varsler 🎉
      </BodyShort>
    );
  }

  return (
    <>
      <VStack as="ol" gap="4">
        {notifications.map((notification) => (
          <KabalNotificationWithCaseDataEntry key={notification.id} {...notification} />
        ))}
      </VStack>

      <MarkManyAsRead notifications={notifications} />
    </>
  );
};
