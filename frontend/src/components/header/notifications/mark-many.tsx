import { useMarkManyAsRead, useMarkManyAsUnread } from '@app/components/header/notifications/api';
import type { KabalNotification } from '@app/components/header/notifications/types';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

interface MarkManyAsReadProps {
  notifications: readonly KabalNotification[];
  className?: string;
}

export const MarkManyAsRead = ({ notifications, className }: MarkManyAsReadProps) => {
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
      className={className}
    >
      Marker alle ({unreadNotifications.length}) som lest
    </Button>
  );
};

interface MarkManyAsUnreadProps {
  notifications: readonly KabalNotification[];
  className?: string;
}

export const MarkManyAsUnread = ({ notifications, className }: MarkManyAsUnreadProps) => {
  const { markManyAsUnread, loading } = useMarkManyAsUnread();

  const readNotifications = notifications.filter((n) => n.read);

  if (readNotifications.length === 0) {
    return null;
  }

  return (
    <Button
      variant="tertiary-neutral"
      size="small"
      onClick={() => markManyAsUnread(readNotifications.map((n) => n.id))}
      loading={loading}
      icon={<EnvelopeOpenIcon aria-hidden />}
      className={className}
    >
      Marker alle ({readNotifications.length}) som ulest
    </Button>
  );
};
