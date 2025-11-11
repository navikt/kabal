import { KLAGE_NOTIFICATIONS_BASE_PATH } from '@app/components/header/notifications/constants';
import { toast } from '@app/components/toast/store';
import { useCallback, useEffect, useState } from 'react';

export const useMarkAsRead = () => {
  const [loading, setLoading] = useState(false);

  const markAsRead = async (id: string) => {
    setLoading(true);

    try {
      const response = await fetch(`${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/${id}/read`, {
        method: 'PATCH',
        credentials: 'include',
      });

      return response.ok;
    } catch (e) {
      console.error('Failed to mark notification as read', e);

      toast.error('Kunne ikke markere varsel som lest.');
    } finally {
      setLoading(false);
    }
  };

  return { markAsRead, loading };
};

export const useMarkAsUnread = () => {
  const [loading, setLoading] = useState(false);

  const markAsUnread = async (id: string) => {
    setLoading(true);

    try {
      const response = await fetch(`${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/${id}/unread`, {
        method: 'PATCH',
        credentials: 'include',
      });

      return response.ok;
    } catch (e) {
      console.error('Failed to mark notification as unread', e);

      toast.error('Kunne ikke markere varsel som ulest.');
    } finally {
      setLoading(false);
    }
  };

  return { markAsUnread, loading };
};

export const useMarkManyAsRead = () => {
  const [loading, setLoading] = useState(false);

  const markManyAsRead = async (ids: string[]) => {
    setLoading(true);

    try {
      const response = await fetch(`${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/read-multiple`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ids),
      });

      return response.ok;
    } catch (e) {
      console.error('Failed to mark notifications as read', e);

      toast.error('Kunne ikke markere varsler som lest.');
    } finally {
      setLoading(false);
    }
  };

  return { markManyAsRead, loading };
};

export const useMarkManyAsUnread = () => {
  const [loading, setLoading] = useState(false);

  const markManyAsUnread = async (ids: string[]) => {
    setLoading(true);

    try {
      const response = await fetch(`${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/unread-multiple`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ids),
      });

      return response.ok;
    } catch (e) {
      console.error('Failed to mark notifications as unread', e);

      toast.error('Kunne ikke markere varsler som lest.');
    } finally {
      setLoading(false);
    }
  };

  return { markManyAsUnread, loading };
};

export const useMarkAllAsRead = () => {
  const [loading, setLoading] = useState(false);

  const markAllAsRead = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/read-all`, {
        method: 'PATCH',
        credentials: 'include',
      });

      return response.ok;
    } catch (e) {
      console.error('Failed to mark all notifications as read', e);

      toast.error('Kunne ikke markere varsler som lest.');
    } finally {
      setLoading(false);
    }
  };

  return { markAllAsRead, loading };
};

interface UnreadBehandlingCountReponse {
  unreadMessageCount: number;
}

const isUnreadBehandlingCountResponse = (data: unknown): data is UnreadBehandlingCountReponse =>
  data !== null &&
  typeof data === 'object' &&
  'unreadMessageCount' in data &&
  typeof data.unreadMessageCount === 'number';

export const useUnreadBehandlingCount = (behandlingId: string) => {
  const [unreadMessageCount, setUnreadMessageCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);

  const fetchUnreadBehandlingCount = useCallback(async (behandlingId: string) => {
    setIsFetching(true);

    try {
      const response = await fetch(
        `${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/behandling/${behandlingId}/unread-count`,
        { method: 'GET', credentials: 'include' },
      );

      if (response.ok) {
        const data: unknown = await response.json();

        if (isUnreadBehandlingCountResponse(data)) {
          setUnreadMessageCount(data.unreadMessageCount);
        }
      } else {
        toast.error('Kunne ikke hente antall uleste varsler.');
      }
    } catch (e) {
      console.error('Failed to fetch unread behandling count', e);

      toast.error('Kunne ikke hente antall uleste varsler.');
    } finally {
      setIsFetching(false);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadBehandlingCount(behandlingId);
  }, [fetchUnreadBehandlingCount, behandlingId]);

  return { unreadMessageCount, fetchUnreadBehandlingCount, isLoading, isFetching };
};
