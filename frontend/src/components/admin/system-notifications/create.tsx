import {
  type AdminSystemNotification,
  systemNotificationsStore,
} from '@app/components/admin/system-notifications/state';
import { KLAGE_NOTIFICATIONS_BASE_PATH } from '@app/components/header/notifications/constants';
import { toast } from '@app/components/toast/store';
import { PaperplaneIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Heading, Textarea, TextField, VStack } from '@navikt/ds-react';
import { useState } from 'react';

export const CreateSystemNotification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

  const handleCreateNotification = async () => {
    const invalidTitle = title.length === 0;
    const invalidMessage = message.length === 0;

    if (invalidTitle) {
      setTitleError('Skriv en tittel');
    } else {
      setTitleError(null);
    }

    if (invalidMessage) {
      setMessageError('Skriv en melding');
    } else {
      setMessageError(null);
    }

    if (invalidTitle || invalidMessage) {
      return;
    }

    setIsLoading(true);

    try {
      await createSystemNotification({ title, message });

      setTitle('');
      setMessage('');
      toast.success('Systemvarsel opprettet!');
    } catch (error) {
      console.error('Error creating system notification:', error);
      toast.error('Klarte ikke å opprette systemvarsel.');
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleCreateNotification();
    }
  };

  return (
    <VStack as="section" gap="4">
      <VStack>
        <Heading level="2" size="small" spacing>
          Opprett systemvarsel
        </Heading>

        <BodyLong size="small" spacing>
          Opprett et systemvarsel som vises til alle brukere.
        </BodyLong>

        <TextField
          size="small"
          label="Tittel"
          placeholder="Tittel"
          value={title}
          onChange={(e) => {
            setTitleError(null);
            setTitle(e.target.value);
          }}
          error={titleError}
          onKeyDown={onKeyDown}
        />

        <Textarea
          size="small"
          minRows={4}
          maxRows={4}
          resize="vertical"
          label="Melding"
          placeholder="Melding"
          value={message}
          onChange={(e) => {
            setMessageError(null);
            setMessage(e.target.value);
          }}
          error={messageError}
          onKeyDown={onKeyDown}
        />
      </VStack>

      <Button
        variant="primary"
        size="small"
        icon={<PaperplaneIcon aria-hidden />}
        onClick={handleCreateNotification}
        disabled={isLoading}
        loading={isLoading}
      >
        Opprett systemvarsel
      </Button>
    </VStack>
  );
};

const PATH = `${KLAGE_NOTIFICATIONS_BASE_PATH}/admin/notifications/system`;

const createSystemNotification = async ({ title, message }: Pick<AdminSystemNotification, 'title' | 'message'>) => {
  const response = await fetch(PATH, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, message }),
  });

  if (!response.ok) {
    throw new Error('Failed to create system notification');
  }

  const data = await response.json();

  if (!isAdminSystemNotification(data)) {
    throw new Error('Invalid system notification data received');
  }

  systemNotificationsStore.set((notifications) => [data, ...notifications]);
};

const isAdminSystemNotification = (notification: unknown): notification is AdminSystemNotification => {
  if (typeof notification !== 'object' || notification === null) {
    return false;
  }

  const { id, title, message, createdAt } = notification as AdminSystemNotification;

  return (
    typeof id === 'string' && typeof title === 'string' && typeof message === 'string' && typeof createdAt === 'string'
  );
};
