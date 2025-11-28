import { useMarkAllAsRead } from '@app/components/header/notifications/api';
import { useNotificationsContext } from '@app/components/header/notifications/state';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

interface MarkAllAsReadButtonProps {
  unreadCount: number;
}

export const MarkAllAsReadButton = ({ unreadCount }: MarkAllAsReadButtonProps) => {
  const { markAllAsRead, loading } = useMarkAllAsRead();
  const { closeMenuAndModal } = useNotificationsContext();

  const onClick = async () => {
    await markAllAsRead();
    closeMenuAndModal();
  };

  return (
    <Button
      variant="tertiary-neutral"
      size="small"
      onClick={onClick}
      icon={<EnvelopeOpenIcon aria-hidden />}
      loading={loading}
      className="my-4 cursor-pointer"
    >
      Marker alle ({unreadCount}) som lest
    </Button>
  );
};
