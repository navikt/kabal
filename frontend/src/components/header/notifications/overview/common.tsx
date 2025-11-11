import { useMarkManyAsRead } from '@app/components/header/notifications/api';
import {
  KabalNotificationEntry,
  KabalNotificationWithCaseDataEntry,
} from '@app/components/header/notifications/notification';
import type { KabalNotification } from '@app/components/header/notifications/types';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { BodyShort, BoxNew, Button, HGrid, VStack } from '@navikt/ds-react';

interface GroupedGridProps {
  columns: number;
  children: React.ReactNode;
}

export const GroupedGrid = ({ columns, children }: GroupedGridProps) => (
  <HGrid gap="4" overflowY="hidden" columns={`repeat(${columns}, 350px)`} height="100%">
    {children}
  </HGrid>
);

interface GroupContainerProps {
  children: React.ReactNode;
}

export const GroupContainer = ({ children }: GroupContainerProps) => (
  <BoxNew asChild background="default" paddingBlock="2" borderRadius="medium" shadow="dialog">
    <VStack as="section" overflowY="hidden" className="group/notifications">
      {children}
    </VStack>
  </BoxNew>
);

interface NotificationsGroupProps {
  notifications: readonly KabalNotification[];
  showCaseData?: boolean;
}

export const NotificationsGroup = ({ notifications, showCaseData = false }: NotificationsGroupProps) => {
  if (notifications.length === 0) {
    return <BodyShort className="px-2 text-ax-text-neutral-subtle italic">Ingen varsler</BodyShort>;
  }

  const Entry = showCaseData ? KabalNotificationWithCaseDataEntry : KabalNotificationEntry;

  return (
    <>
      <VStack as="ol" gap="4" height="100%" overflowY="auto" marginBlock="0 4" paddingBlock="2 0" paddingInline="2">
        {notifications.map((notification) => (
          <Entry key={notification.id} {...notification} />
        ))}
      </VStack>

      <MarkManyAsRead notifications={notifications} />
    </>
  );
};

interface MarkManyAsReadProps {
  notifications: readonly KabalNotification[];
}

const MarkManyAsRead = ({ notifications }: MarkManyAsReadProps) => {
  const { markManyAsRead, loading } = useMarkManyAsRead();

  const unreadNotifications = notifications.filter((n) => !n.read);

  if (unreadNotifications.length === 0) {
    return null;
  }

  return (
    <Button
      variant="tertiary-neutral"
      size="small"
      onClick={() => markManyAsRead(unreadNotifications.map((n) => n.id))}
      loading={loading}
      icon={<EnvelopeOpenIcon aria-hidden />}
      className="mx-2"
    >
      Marker alle ({unreadNotifications.length}) som lest
    </Button>
  );
};
