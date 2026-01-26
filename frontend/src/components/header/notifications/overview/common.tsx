import { MarkManyAsRead, MarkManyAsUnread } from '@app/components/header/notifications/mark-many';
import {
  KabalNotificationEntry,
  KabalNotificationWithCaseDataEntry,
} from '@app/components/header/notifications/notification';
import type { KabalNotification } from '@app/components/header/notifications/types';
import { BodyShort, Box, HGrid, VStack } from '@navikt/ds-react';

interface GroupedGridProps {
  columns: number;
  children: React.ReactNode;
}

export const GroupedGrid = ({ columns, children }: GroupedGridProps) => (
  <HGrid gap="space-16" overflowY="hidden" columns={`repeat(${columns}, 350px)`} height="100%">
    {children}
  </HGrid>
);

interface GroupContainerProps {
  children: React.ReactNode;
  highlight?: boolean;
}

export const GroupContainer = ({ children, highlight = false }: GroupContainerProps) => (
  <Box
    asChild
    background="default"
    paddingBlock="space-8"
    marginBlock="space-8"
    borderRadius="4"
    shadow="dialog"
    className={highlight ? 'outline-2 outline-ax-border-accent' : undefined}
  >
    <VStack as="section" overflowY="hidden" className="group/notifications">
      {children}
    </VStack>
  </Box>
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
      <VStack
        as="ol"
        gap="space-16"
        height="100%"
        overflowY="auto"
        marginBlock="space-0 space-1"
        paddingBlock="space-8 space-0"
        paddingInline="space-8"
      >
        {notifications.map((notification) => (
          <Entry key={notification.id} {...notification} />
        ))}
      </VStack>

      <VStack gap="space-8">
        <MarkManyAsRead notifications={notifications} className="mx-2" />

        <MarkManyAsUnread notifications={notifications} className="mx-2" />
      </VStack>
    </>
  );
};
