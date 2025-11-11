import { GroupContainer, GroupedGrid, NotificationsGroup } from '@app/components/header/notifications/overview/common';
import {
  type KabalNotification,
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_TYPES,
} from '@app/components/header/notifications/types';
import { Heading } from '@navikt/ds-react';

interface GroupedNotificationsProps {
  notifications: readonly KabalNotification[];
}

export const GroupedByTypeNotifications = ({ notifications }: GroupedNotificationsProps) => (
  <GroupedGrid columns={NOTIFICATION_TYPES.length}>
    {NOTIFICATION_TYPES.map((t) => {
      const filtered = notifications.filter((n) => n.type === t);

      return (
        <GroupContainer key={t}>
          <Heading level="1" size="xsmall" spacing className="px-2">
            {NOTIFICATION_TYPE_LABELS[t]}
          </Heading>

          <NotificationsGroup notifications={filtered} showCaseData />
        </GroupContainer>
      );
    })}
  </GroupedGrid>
);
