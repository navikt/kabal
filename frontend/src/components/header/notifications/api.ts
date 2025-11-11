import { KLAGE_NOTIFICATIONS_BASE_PATH } from '@app/components/header/notifications/constants';
import { notificationsStore } from '@app/components/header/notifications/store';
import { toast } from '@app/components/toast/store';
import { useState } from 'react';

export const useMarkAsRead = () => {
  const [loading, setLoading] = useState(false);

  const markAsRead = async (id: string) => {
    setLoading(true);

    notificationsStore.set((current) => current.map((n) => (n.id === id && !n.read ? { ...n, read: true } : n))); // TODO: Remove when SSE is working

    try {
      const response = await fetch(`${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/${id}/read`, {
        method: 'PATCH',
        credentials: 'include',
      });

      return response.ok;
    } catch (e) {
      console.error('Failed to mark notification as read', e);

      toast.error('Kunne ikke markere varsel som lest. Vennligst prøv igjen.');
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

    notificationsStore.set((current) => current.map((n) => (n.id === id && n.read ? { ...n, read: false } : n))); // TODO: Remove when SSE is working

    try {
      const response = await fetch(`${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/${id}/unread`, {
        method: 'PATCH',
        credentials: 'include',
      });

      return response.ok;
    } catch (e) {
      console.error('Failed to mark notification as unread', e);

      toast.error('Kunne ikke markere varsel som ulest. Vennligst prøv igjen.');
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

    notificationsStore.set((current) => current.map((n) => (ids.includes(n.id) && !n.read ? { ...n, read: true } : n))); // TODO: Remove when SSE is working

    try {
      const response = await fetch(`${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/read-multiple`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });

      return response.ok;
    } catch (e) {
      console.error('Failed to mark notifications as read', e);

      toast.error('Kunne ikke markere varsler som lest. Vennligst prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  return { markManyAsRead, loading };
};

export const useMarkAllAsRead = () => {
  const [loading, setLoading] = useState(false);

  const markAllAsRead = async () => {
    setLoading(true);

    notificationsStore.set((current) => current.map((n) => (n.read ? n : { ...n, read: true }))); // TODO: Remove when SSE is working

    try {
      const response = await fetch(`${KLAGE_NOTIFICATIONS_BASE_PATH}/user/notifications/read-all`, {
        method: 'PATCH',
        credentials: 'include',
      });

      return response.ok;
    } catch (e) {
      console.error('Failed to mark all notifications as read', e);

      toast.error('Kunne ikke markere varsler som lest. Vennligst prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  return { markAllAsRead, loading };
};
