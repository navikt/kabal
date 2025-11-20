import {
  type AdminSystemNotification,
  systemNotificationsStore,
} from '@app/components/admin/system-notifications/state';
import { DateTime } from '@app/components/datetime/datetime';
import { KLAGE_NOTIFICATIONS_BASE_PATH } from '@app/components/header/notifications/constants';
import { toast } from '@app/components/toast/store';
import { ChatAddIcon, ClockIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyLong, BodyShort, BoxNew, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { useEffect, useState, useSyncExternalStore } from 'react';

export const ListSystemNotifications = () => {
  const systemNotifications = useSyncExternalStore(systemNotificationsStore.subscribe, systemNotificationsStore.get);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      const notifications = await fetchSystemNotifications();
      systemNotificationsStore.set(notifications);
      setIsLoading(false);
    };

    fetchNotifications();
  }, []);

  return (
    <VStack as="section">
      <Heading level="2" size="small" spacing>
        Systemvarsler
      </Heading>

      <VStack as="ol" gap="4" marginBlock="0 4">
        {isLoading ? (
          <BodyShort size="small" className="text-center text-ax-text-neutral-subtle italic">
            Laster systemvarsler...
          </BodyShort>
        ) : null}
        {!isLoading && systemNotifications.length === 0 ? (
          <BodyShort size="small" className="text-center text-ax-text-neutral-subtle italic">
            Ingen systemvarsler
          </BodyShort>
        ) : null}
        {systemNotifications.map((notification) => (
          <Notification key={notification.id} {...notification} />
        ))}
      </VStack>

      <DeleteAllButton systemNotifications={systemNotifications} />
    </VStack>
  );
};

const Notification = ({ id, title, message, createdAt }: AdminSystemNotification) => {
  return (
    <BoxNew
      as="li"
      borderRadius="medium"
      borderWidth="1 1 1 4"
      borderColor="danger"
      background="neutral-soft"
      className={
        'opacity-100 starting:opacity-0 transition-[opacity,background-color] duration-200 hover:bg-ax-bg-default'
      }
    >
      <HStack wrap={false} gap="1" align="start" width="100%" paddingBlock="0 2">
        <BoxNew asChild borderRadius="0 0 medium 0" paddingInline="0 1" background="danger-strong">
          <HStack as="span" align="center" gap="1" wrap={false} className="whitespace-nowrap">
            <ChatAddIcon aria-hidden color="text-ax-text-danger-contrast" />
            Systemvarsel
          </HStack>
        </BoxNew>

        <DateTime
          dateTime={createdAt}
          icon={<ClockIcon aria-hidden />}
          wrap={false}
          className="ml-auto whitespace-nowrap pr-1 text-ax-small italic"
        />
      </HStack>

      <VStack gap="2" paddingInline="2" paddingBlock="0 2" flexGrow="1">
        <Heading size="xsmall" level="1">
          {title}
        </Heading>

        <BodyLong size="small" className="wrap-break-word whitespace-pre-line">
          {message}
        </BodyLong>

        <DeleteButton id={id} />
      </VStack>
    </BoxNew>
  );
};

interface DeleteButtonProps {
  id: string;
}

const DeleteButton = ({ id }: DeleteButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteSystemNotification(id);
    setIsDeleting(false);
  };

  return (
    <Button variant="danger" size="small" onClick={handleDelete} icon={<TrashIcon aria-hidden />} loading={isDeleting}>
      Slett
    </Button>
  );
};

interface DeleteAllButtonProps {
  systemNotifications: readonly AdminSystemNotification[];
}

const DeleteAllButton = ({ systemNotifications }: DeleteAllButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    await deleteMultipleSystemNotifications(systemNotifications.map((n) => n.id));
    setIsDeleting(false);
  };

  return (
    <Button
      variant="secondary-neutral"
      size="small"
      onClick={handleDeleteAll}
      icon={<TrashIcon aria-hidden />}
      loading={isDeleting}
    >
      Slett alle ({systemNotifications.length})
    </Button>
  );
};

const deleteSystemNotification = async (id: string) => {
  try {
    const response = await fetch(`${KLAGE_NOTIFICATIONS_BASE_PATH}/admin/notifications/system/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete system notification');
    }

    systemNotificationsStore.set(systemNotificationsStore.get().filter((notification) => notification.id !== id));
    toast.success('Systemvarsel slettet.');
  } catch (e) {
    console.error('Error deleting system notification', e);
    toast.error('Kunne ikke slette systemvarsel.');
  }
};

const deleteMultipleSystemNotifications = async (ids: string[]) => {
  try {
    const response = await fetch(`${KLAGE_NOTIFICATIONS_BASE_PATH}/admin/notifications/system`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(ids),
    });

    if (!response.ok) {
      throw new Error('Failed to delete all system notifications');
    }

    systemNotificationsStore.set([]);
    toast.success('Alle systemvarsler slettet.');
  } catch (e) {
    console.error('Error deleting all system notifications', e);
    toast.error('Kunne ikke slette alle systemvarsler.');
  }
};

const fetchSystemNotifications = async () => {
  try {
    const response = await fetch(`${KLAGE_NOTIFICATIONS_BASE_PATH}/admin/notifications/system`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch system notifications');
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.error('Error fetching system notifications', e);
    toast.error('Kunne ikke hente systemvarsler.');
    return [];
  }
};
