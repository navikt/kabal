import { YtelseAccessedOpen } from '@app/components/common-table-components/open';
import { CopyButton } from '@app/components/copy-button/copy-button';
import { Type, Ytelse } from '@app/components/header/notifications/common';
import { GroupContainer, GroupedGrid, NotificationsGroup } from '@app/components/header/notifications/overview/common';
import {
  type BehandlingInfo,
  type KabalNotification,
  NOTIFICATION_TYPE_LABELS,
  NotificationType,
} from '@app/components/header/notifications/types';
import { Heading, HStack } from '@navikt/ds-react';

interface GroupedNotificationsProps {
  notifications: readonly KabalNotification[];
}

export const GroupedByBehandlingNotifications = ({ notifications }: GroupedNotificationsProps) => {
  const systemNotifications = notifications.filter((n) => n.type === NotificationType.SYSTEM);
  const groupedAndSorted = useGroupedAndSortedNotifications(notifications);

  return (
    <GroupedGrid columns={groupedAndSorted.length + 1}>
      <GroupContainer>
        <Heading level="1" size="xsmall" className="mb-8 px-2">
          {NOTIFICATION_TYPE_LABELS[NotificationType.SYSTEM]}
        </Heading>

        <NotificationsGroup notifications={systemNotifications} />
      </GroupContainer>

      {groupedAndSorted.map(({ behandling, notifications }) => (
        <GroupContainer key={behandling.id}>
          <HStack asChild gap="1" align="center" justify="start" paddingInline="2" wrap={false} marginBlock="0 2">
            <Heading level="1" size="xsmall">
              <Type typeId={behandling.typeId} />
              <Ytelse ytelseId={behandling.ytelseId} />
              <CopyButton
                text={behandling.saksnummer}
                activeText={behandling.saksnummer}
                size="xsmall"
                className="shrink-0"
              />
            </Heading>
          </HStack>

          <HStack paddingInline="2">
            <YtelseAccessedOpen {...behandling} size="xsmall" className="w-full" />
          </HStack>

          <NotificationsGroup notifications={notifications} />
        </GroupContainer>
      ))}
    </GroupedGrid>
  );
};

const useGroupedAndSortedNotifications = (notifications: readonly KabalNotification[]) => {
  const behandlingMap: Map<string, { behandling: BehandlingInfo; notifications: KabalNotification[] }> = new Map();

  for (const notification of notifications) {
    if (notification.type === NotificationType.SYSTEM) {
      continue;
    }

    const { id } = notification.behandling;

    const existing = behandlingMap.get(id);

    if (existing !== undefined) {
      existing.notifications.push(notification);
      continue;
    }

    behandlingMap.set(id, { behandling: notification.behandling, notifications: [notification] });
  }

  return behandlingMap
    .values()
    .toArray()
    .toSorted((a, b) =>
      getNewestNotificationDate(a.notifications).localeCompare(getNewestNotificationDate(b.notifications)),
    );
};

const getNewestNotificationDate = (notifications: KabalNotification[]) => {
  const [first, ...rest] = notifications;

  if (first === undefined) {
    return '0000-00-00T00:00:00Z';
  }

  let newest = first.createdAt;

  for (const notification of rest) {
    if (notification.createdAt > newest) {
      newest = notification.createdAt;
    }
  }

  return newest;
};
