import { Dialog, HStack, ToggleGroup, Tooltip } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { MarkAllAsReadButton } from '@/components/header/notifications/mark-all';
import { GroupedByBehandlingNotifications } from '@/components/header/notifications/overview/grouped-by-behandling';
import { GroupedByTypeNotifications } from '@/components/header/notifications/overview/grouped-by-type';
import { useNotificationsContext } from '@/components/header/notifications/state';
import type { KabalNotification } from '@/components/header/notifications/types';
import { NotificationsGrouping, useNotificationsOverviewGrouping } from '@/hooks/settings/use-setting';

interface OverviewModalProps {
  notifications: readonly KabalNotification[];
  icon: React.ReactElement;
  unreadCount: number;
}

enum FilterEnum {
  ALL = 'ALL',
  READ = 'READ',
  UNREAD = 'UNREAD',
}

const FILTER_VALUES = Object.values(FilterEnum);

const isFilterValue = (value: string): value is FilterEnum => FILTER_VALUES.includes(value as FilterEnum);

export const OverviewModal = ({ notifications, icon, unreadCount }: OverviewModalProps) => {
  const { value: grouping = NotificationsGrouping.BEHANDLING, setValue: setGrouping } =
    useNotificationsOverviewGrouping();
  const [filter, setFilter] = useState<FilterEnum>(FilterEnum.UNREAD);

  const filteredNotifications = useMemo(() => {
    if (filter === FilterEnum.ALL) {
      return notifications;
    }

    if (filter === FilterEnum.READ) {
      return notifications.filter((n) => n.read);
    }

    return notifications.filter((n) => !n.read);
  }, [notifications, filter]);

  const { isModalOpen, setIsModalOpen } = useNotificationsContext();

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Popup className="h-full w-full min-w-175 max-w-[calc(100%-2rem)]">
        <Dialog.Header>
          <Dialog.Title className="flex items-center gap-1">
            {icon}
            Varsler ({unreadCount})
          </Dialog.Title>
          <HStack gap="space-16" align="center" wrap={false}>
            <Tooltip content="Grupper varsler etter">
              <ToggleGroup
                size="small"
                value={grouping}
                onChange={(value) => setGrouping(value as NotificationsGrouping)}
                className="mr-4 inline-block"
              >
                <ToggleGroup.Item value={NotificationsGrouping.BEHANDLING} label="Behandling" />
                <ToggleGroup.Item value={NotificationsGrouping.TYPE} label="Type" />
              </ToggleGroup>
            </Tooltip>

            <ToggleGroup
              size="small"
              value={filter}
              onChange={(value) => {
                if (isFilterValue(value)) {
                  setFilter(value);
                }
              }}
              className="mr-4 inline-block"
            >
              <ToggleGroup.Item value={FilterEnum.UNREAD} label="Vis bare uleste" />
              <ToggleGroup.Item value={FilterEnum.READ} label="Vis bare leste" />
              <ToggleGroup.Item value={FilterEnum.ALL} label="Vis alle" />
            </ToggleGroup>

            {unreadCount === 0 ? null : <MarkAllAsReadButton unreadCount={unreadCount} />}
          </HStack>
        </Dialog.Header>

        <Dialog.Body className="flex grow flex-col overflow-y-hidden">
          {grouping === NotificationsGrouping.TYPE ? (
            <GroupedByTypeNotifications notifications={filteredNotifications} />
          ) : (
            <GroupedByBehandlingNotifications notifications={filteredNotifications} />
          )}
        </Dialog.Body>
      </Dialog.Popup>
    </Dialog>
  );
};
