import { GroupContainer, GroupedGrid, NotificationsGroup } from '@app/components/header/notifications/overview/common';
import { type KabalNotification, NotificationType } from '@app/components/header/notifications/types';
import { Heading } from '@navikt/ds-react';

interface GroupedNotificationsProps {
  notifications: readonly KabalNotification[];
}

export const GroupedByTypeNotifications = ({ notifications }: GroupedNotificationsProps) => (
  <GroupedGrid columns={3}>
    <Column heading="System" types={[NotificationType.SYSTEM]} notifications={notifications} />
    <Column
      heading="Tilgang"
      types={[NotificationType.LOST_ACCESS, NotificationType.GAINED_ACCESS]}
      notifications={notifications}
    />
    <Column heading="Meldinger" types={[NotificationType.MESSAGE]} notifications={notifications} />
  </GroupedGrid>
);

interface ColumnProps {
  heading: string;
  types: NotificationType[];
  notifications: readonly KabalNotification[];
}

const Column = ({ heading, types, notifications }: ColumnProps) => {
  const filtered = notifications.filter((n) => types.includes(n.type));

  return (
    <GroupContainer>
      <Heading level="1" size="xsmall" spacing className="px-2">
        {heading}
      </Heading>

      <NotificationsGroup notifications={filtered} showCaseData />
    </GroupContainer>
  );
};
