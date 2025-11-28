import { CopyButton } from '@app/components/copy-button/copy-button';
import { Type, Ytelse } from '@app/components/header/notifications/common';
import { GroupContainer, GroupedGrid, NotificationsGroup } from '@app/components/header/notifications/overview/common';
import {
  type BehandlingInfo,
  type KabalNotification,
  NOTIFICATION_TYPE_LABELS,
  NotificationType,
} from '@app/components/header/notifications/types';
import { useMaybeOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { Heading, HStack } from '@navikt/ds-react';

interface GroupedNotificationsProps {
  notifications: readonly KabalNotification[];
}

export const GroupedByBehandlingNotifications = ({ notifications }: GroupedNotificationsProps) => {
  const oppgaveId = useMaybeOppgaveId();
  const systemNotifications = notifications.filter((n) => n.type === NotificationType.SYSTEM);
  const groupedAndSorted = useGroupedAndSortedNotifications(notifications);

  return (
    <GroupedGrid columns={groupedAndSorted.length + 1}>
      <GroupContainer>
        <Heading level="1" size="xsmall" className="mb-2 px-2">
          {NOTIFICATION_TYPE_LABELS[NotificationType.SYSTEM]}
        </Heading>

        <NotificationsGroup notifications={systemNotifications} />
      </GroupContainer>

      {groupedAndSorted.map(({ behandling, notifications }) => (
        <GroupContainer key={behandling.id} highlight={behandling.id === oppgaveId}>
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

          <NotificationsGroup notifications={notifications} />
        </GroupContainer>
      ))}
    </GroupedGrid>
  );
};

const useGroupedAndSortedNotifications = (notifications: readonly KabalNotification[]) => {
  const behandlingMap: Map<string, { behandling: BehandlingInfo; notifications: KabalNotification[] }> = new Map();
  const oppgaveId = useMaybeOppgaveId();

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

  const first = oppgaveId === null ? null : (behandlingMap.get(oppgaveId) ?? null);

  if (first === null) {
    return behandlingMap
      .values()
      .toArray()
      .toSorted((a, b) =>
        getNewestNotificationDate(b.notifications).localeCompare(getNewestNotificationDate(a.notifications)),
      );
  }

  return [first].concat(
    behandlingMap
      .values()
      .toArray()
      .filter((b) => b.behandling.id !== first.behandling.id)
      .toSorted((a, b) =>
        getNewestNotificationDate(b.notifications).localeCompare(getNewestNotificationDate(a.notifications)),
      ),
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
