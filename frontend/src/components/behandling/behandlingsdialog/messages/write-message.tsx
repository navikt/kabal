import { StaticDataContext } from '@app/components/app/static-data-context';
import { toast } from '@app/components/toast/store';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useHasSaksbehandler } from '@app/hooks/use-has-saksbehandler';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { isMetaKey, Keys } from '@app/keys';
import { useGetMySignatureQuery } from '@app/redux-api/bruker';
import { usePostMessageMutation } from '@app/redux-api/messages';
import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, HStack, Loader, Textarea, Tooltip, VStack } from '@navikt/ds-react';
import { useContext, useEffect, useState } from 'react';

const SEND_FAILED_MESSAGE = 'Kunne ikke sende melding. Prøv igjen senere.';

export const WriteMessage = () => {
  const isFullfoert = useIsFullfoert();
  const { user } = useContext(StaticDataContext);
  const { navIdent, navn } = user;
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [postMessage, { isSuccess, isLoading: messageIsSending }] = usePostMessageMutation();
  const oppgaveId = useOppgaveId();
  const { data: signature, isLoading: signatureIsLoading } = useGetMySignatureQuery();
  const isSaksbehandler = useIsTildeltSaksbehandler();
  const hasSaksbehandler = useHasSaksbehandler();
  const [notify, setNotify] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      setMessage('');
    }
  }, [isSuccess]);

  if (signatureIsLoading || signature === undefined) {
    return <Loader size="xlarge" />;
  }

  if (isFullfoert) {
    return null;
  }

  const post = async () => {
    if (messageIsSending || typeof oppgaveId !== 'string') {
      return;
    }

    if (message.length === 0) {
      setErrorMessage('Meldingen må ha et innhold');

      return;
    }

    try {
      await postMessage({
        oppgaveId,
        text: message.trim(),
        author: { navIdent, navn },
        notify,
      });

      if (notify) {
        setNotify(false);
      }
    } catch {
      setErrorMessage(SEND_FAILED_MESSAGE);
      toast.error(SEND_FAILED_MESSAGE);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isMetaKey(event) && event.key === Keys.Enter) {
      post();
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setErrorMessage(null);
    setMessage(event.target.value);
  };

  const onNotifyChange = () => setNotify((p) => !p);

  return (
    <VStack>
      <Textarea
        size="small"
        onKeyDown={onKeyDown}
        value={message}
        onChange={onChange}
        error={errorMessage}
        label="Skriv en melding"
        hideLabel
      />

      <HStack marginBlock="2 0" justify="space-between" align="center" gap="2">
        <Tooltip content={getTooltip(isSaksbehandler, hasSaksbehandler)} describesChild>
          <span>
            <Checkbox
              size="small"
              checked={hasSaksbehandler ? notify : false}
              onChange={onNotifyChange}
              disabled={!hasSaksbehandler} // Cannot send notification if no saksbehandler is assigned
            >
              Send varsel
            </Checkbox>
          </span>
        </Tooltip>

        <Button
          type="button"
          size="small"
          variant="secondary-neutral"
          onClick={post}
          loading={messageIsSending}
          icon={<PaperplaneIcon aria-hidden />}
        >
          Legg til melding
        </Button>
      </HStack>
    </VStack>
  );
};

const getTooltip = (isSaksbehandler: boolean, hasSaksbehandler: boolean): string => {
  if (!hasSaksbehandler) {
    return 'Kan ikke sende varsel når ingen saksbehandler er tildelt';
  }

  return isSaksbehandler ? 'Send varsel til deg selv' : 'Send varsel til saksbehandler';
};
