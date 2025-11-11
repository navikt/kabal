import { GroupedByBehandlingNotifications } from '@app/components/header/notifications/overview/grouped-by-behandling';
import { GroupedByTypeNotifications } from '@app/components/header/notifications/overview/grouped-by-type';
import type { KabalNotification } from '@app/components/header/notifications/types';
import { Heading, HStack, Modal, ToggleGroup, Tooltip } from '@navikt/ds-react';
import { useMemo, useState } from 'react';

enum Grouping {
  TYPE = 'TYPE',
  BEHANDLING = 'BEHANDLING',
}

interface OverviewModalProps {
  ref: React.RefObject<HTMLDialogElement | null>;
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

export const OverviewModal = ({ ref, notifications, icon, unreadCount }: OverviewModalProps) => {
  const [grouping, setGrouping] = useState<Grouping>(Grouping.BEHANDLING);
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

  return (
    <Modal
      ref={ref}
      className="h-full w-full min-w-[700px] max-w-[calc(100%-2rem)]"
      closeOnBackdropClick
      header={undefined}
    >
      <Modal.Header>
        <HStack gap="4" align="center" wrap={false}>
          <HStack asChild gap="1" align="center" wrap={false}>
            <Heading level="1" size="small">
              {icon}
              Varsler ({unreadCount})
            </Heading>
          </HStack>

          <Tooltip content="Grupper varsler etter">
            <ToggleGroup
              size="small"
              value={grouping}
              onChange={(value) => setGrouping(value as Grouping)}
              className="mr-4 inline-block"
            >
              <ToggleGroup.Item value={Grouping.BEHANDLING} label="Behandling" />
              <ToggleGroup.Item value={Grouping.TYPE} label="Type" />
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
        </HStack>
      </Modal.Header>

      <Modal.Body className="flex grow flex-col overflow-y-hidden">
        {grouping === Grouping.TYPE ? (
          <GroupedByTypeNotifications notifications={filteredNotifications} />
        ) : (
          <GroupedByBehandlingNotifications notifications={filteredNotifications} />
        )}
      </Modal.Body>
    </Modal>
  );
};
