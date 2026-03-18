import { type Attributes, SpanStatusCode } from '@opentelemetry/api';
import { useCallback, useEffect, useState } from 'react';
import { KLAGE_NOTIFICATIONS_BASE_PATH } from '@/components/header/notifications/constants';
import { toast } from '@/components/toast/store';
import { tracer } from '@/tracing/tracer';

const tracedFetch = async (
  url: string,
  options: RequestInit,
  spanName: string,
  attributes?: Attributes,
): Promise<Response> =>
  tracer.startActiveSpan(spanName, async (span) => {
    if (attributes !== undefined) {
      span.setAttributes(attributes);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: `HTTP ${response.status}` });
      }

      return response;
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR });

      if (error instanceof Error) {
        span.recordException(error);
      }

      throw error;
    } finally {
      span.end();
    }
  });

export const useMarkAsRead = () => {
  const [loading, setLoading] = useState(false);

  const markAsRead = async (id: string) => {
    setLoading(true);

    try {
      const response = await tracedFetch(
        `${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/${id}/read`,
        { method: 'PATCH', credentials: 'include' },
        'notifications.mark_as_read',
        { 'notification.id': id },
      );

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
      const response = await tracedFetch(
        `${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/${id}/unread`,
        { method: 'PATCH', credentials: 'include' },
        'notifications.mark_as_unread',
        { 'notification.id': id },
      );

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
      const response = await tracedFetch(
        `${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/read-multiple`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ids),
        },
        'notifications.mark_many_as_read',
        { 'notification.ids': ids, 'notification.count': ids.length },
      );

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
      const response = await tracedFetch(
        `${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/unread-multiple`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ids),
        },
        'notifications.mark_many_as_unread',
        { 'notification.ids': ids, 'notification.count': ids.length },
      );

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
      const response = await tracedFetch(
        `${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/read-all`,
        { method: 'PATCH', credentials: 'include' },
        'notifications.mark_all_as_read',
      );

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
      const response = await tracedFetch(
        `${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/behandling/${behandlingId}/unread-count`,
        { method: 'GET', credentials: 'include' },
        'notifications.get_unread_count',
        { behandling_id: behandlingId },
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
