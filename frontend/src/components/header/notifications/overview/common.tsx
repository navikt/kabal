import { MarkManyAsRead, MarkManyAsUnread } from '@app/components/header/notifications/mark-many';
import {
  KabalNotificationEntry,
  KabalNotificationWithCaseDataEntry,
} from '@app/components/header/notifications/notification';
import type { KabalNotification } from '@app/components/header/notifications/types';
import { BodyShort, BoxNew, HGrid, VStack } from '@navikt/ds-react';

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
  highlight?: boolean;
}

export const GroupContainer = ({ children, highlight = false }: GroupContainerProps) => (
  <BoxNew
    asChild
    background="default"
    paddingBlock="2"
    marginBlock="2"
    borderRadius="medium"
    shadow="dialog"
    className={highlight ? 'outline-2 outline-ax-border-accent' : undefined}
  >
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

      <VStack gap="2">
        <MarkManyAsRead notifications={notifications} className="mx-2" />

        <MarkManyAsUnread notifications={notifications} className="mx-2" />
      </VStack>
    </>
  );
};
