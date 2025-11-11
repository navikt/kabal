import { useMarkAllAsRead } from '@app/components/header/notifications/api';
import { KabalNotificationWithCaseDataEntry } from '@app/components/header/notifications/notification';
import { OverviewModal } from '@app/components/header/notifications/overview/overview';
import { notificationsStore } from '@app/components/header/notifications/store';
import type { KabalNotification } from '@app/components/header/notifications/types';
import { BellFillIcon, BellIcon, EnvelopeOpenIcon, SidebarBothIcon } from '@navikt/aksel-icons';
import { ActionMenu, BodyShort, BoxNew, InternalHeader, Tooltip, VStack } from '@navikt/ds-react';
import { useRef, useSyncExternalStore } from 'react';

const useSortedNotifications = () => {
  const notifications = useSyncExternalStore(notificationsStore.subscribe, notificationsStore.get);

  return notifications.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const Notifications = () => {
  const notifications = useSortedNotifications();

  const unreadNotifications = notifications.filter((n) => !n.read);
  const unreadCount = unreadNotifications.length;
  const hasUnreadNotifications = unreadCount !== 0;
  const Icon = hasUnreadNotifications ? BellFillIcon : BellIcon;
  const color = hasUnreadNotifications ? 'var(--ax-text-danger-decoration)' : 'var(--ax-text-neutral)';

  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <ActionMenu>
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
                background="danger-strong"
                top="1"
                right="1"
                paddingBlock="05"
                paddingInline="1"
                borderRadius="full"
                shadow="dialog"
                aria-label="Antall uleste varsler"
                className="font-ax-bold text-ax-small leading-none"
              >
                {unreadCount}
              </BoxNew>
            </InternalHeader.Button>
          </ActionMenu.Trigger>
        </Tooltip>

        <ActionMenu.Content align="start" className="w-90">
          <ActionMenu.Item
            onSelect={() => modalRef.current?.showModal()}
            icon={<SidebarBothIcon />}
            className="mb-4 w-full cursor-pointer"
          >
            Oversikt
          </ActionMenu.Item>

          <Content notifications={unreadNotifications} unreadCount={unreadCount} />
        </ActionMenu.Content>
      </ActionMenu>

      <OverviewModal
        ref={modalRef}
        notifications={notifications}
        icon={<Icon title="Varsler" color={color} />}
        unreadCount={unreadCount}
      />
    </>
  );
};

interface ContentProps {
  notifications: readonly KabalNotification[];
  unreadCount: number;
}

const Content = ({ notifications, unreadCount }: ContentProps) => {
  if (notifications.length === 0) {
    return (
      <BodyShort size="small" className="text-ax-text-neutral-subtle italic">
        Ingen varsler
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

      <MarkAllAsReadButton unreadCount={unreadCount} />
    </>
  );
};

interface MarkAllAsReadButtonProps {
  unreadCount: number;
}

const MarkAllAsReadButton = ({ unreadCount }: MarkAllAsReadButtonProps) => {
  const { markAllAsRead, loading } = useMarkAllAsRead();

  return (
    <ActionMenu.Item
      onSelect={markAllAsRead}
      icon={<EnvelopeOpenIcon aria-hidden />}
      disabled={loading}
      className="my-4 cursor-pointer"
    >
      Marker alle ({unreadCount}) som lest
    </ActionMenu.Item>
  );
};
