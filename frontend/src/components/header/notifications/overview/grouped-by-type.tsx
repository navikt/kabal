import { GroupContainer, GroupedGrid, NotificationsGroup } from '@app/components/header/notifications/overview/common';
import { type KabalNotification, NotificationType } from '@app/components/header/notifications/types';
import { Heading } from '@navikt/ds-react';

interface GroupedNotificationsProps {
  notifications: readonly KabalNotification[];
}

interface Column {
  heading: string;
  types: NotificationType[];
}

const COLUMNS: Column[] = [
  { heading: 'System', types: [NotificationType.SYSTEM] },
  { heading: 'Tilgang', types: [NotificationType.LOST_ACCESS, NotificationType.GAINED_ACCESS] },
  { heading: 'Meldinger', types: [NotificationType.MESSAGE] },
];

export const GroupedByTypeNotifications = ({ notifications }: GroupedNotificationsProps) => (
  <GroupedGrid columns={COLUMNS.length}>
    {COLUMNS.map(({ heading, types }) => {
      const filtered = notifications.filter((n) => types.includes(n.type));

      return (
        <GroupContainer key={types.join('-')}>
          <Heading level="1" size="xsmall" spacing className="px-2">
            {heading}
          </Heading>

          <NotificationsGroup notifications={filtered} showCaseData />
        </GroupContainer>
      );
    })}
  </GroupedGrid>
);
