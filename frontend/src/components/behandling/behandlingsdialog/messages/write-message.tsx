import { StaticDataContext } from '@app/components/app/static-data-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { isMetaKey, Keys } from '@app/keys';
import { useGetMySignatureQuery } from '@app/redux-api/bruker';
import { usePostMessageMutation } from '@app/redux-api/messages';
import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, type CheckboxProps, HStack, Loader, Textarea, Tooltip, VStack } from '@navikt/ds-react';
import { useContext, useEffect, useState } from 'react';

enum NotifyEnum {
  UNSET = -1,
  NO = 0,
  YES = 1,
}

export const WriteMessage = () => {
  const isFullfoert = useIsFullfoert();
  const { user } = useContext(StaticDataContext);
  const { navIdent, navn } = user;
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [postMessage, { isSuccess, isLoading: messageIsLoading }] = usePostMessageMutation();
  const oppgaveId = useOppgaveId();
  const { data: signature, isLoading: signatureIsLoading } = useGetMySignatureQuery();
  const isSaksbehandler = useIsTildeltSaksbehandler();
  const [notify, setNotify] = useState<NotifyEnum>(isSaksbehandler ? NotifyEnum.NO : NotifyEnum.UNSET);
  const [notifyError, setNotifyError] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      setMessage('');
    }
  }, [isSuccess]);

  if (signatureIsLoading || typeof signature === 'undefined') {
    return <Loader size="xlarge" />;
  }

  if (isFullfoert) {
    return null;
  }

  const post = () => {
    if (notify === NotifyEnum.UNSET) {
      setNotifyError(true);

      return;
    }

    if (messageIsLoading || typeof oppgaveId !== 'string') {
      return;
    }

    if (message.length === 0) {
      setErrorMessage('Meldingen må ha et innhold');

      return;
    }

    postMessage({
      oppgaveId,
      text: message.trim(),
      author: { navIdent, navn },
      notify: notify === NotifyEnum.YES,
    });
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

  const onNotifyChange = () => {
    setNotifyError(false);
    setNotify(notify === NotifyEnum.YES ? NotifyEnum.NO : NotifyEnum.YES);
  };

  return (
    <VStack>
      <Textarea
        size="small"
        onKeyDown={onKeyDown}
        value={message}
        onChange={onChange}
        maxLength={0}
        error={errorMessage}
        data-testid="message-textarea"
        label="Skriv en melding"
        hideLabel
      />

      <HStack marginBlock="2 0" justify="space-between" align="center" gap="2">
        <Tooltip
          content={
            isSaksbehandler ? 'Kan ikke sende varsel til deg selv' : 'Om det skal sendes varsel til saksbehandler'
          }
          describesChild
        >
          <span>
            <Checkbox
              checked={CHECKED[notify]}
              indeterminate={notify === NotifyEnum.UNSET}
              onChange={onNotifyChange}
              size="small"
              error={notifyError}
              disabled={isSaksbehandler}
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
          loading={messageIsLoading}
          data-testid="send-message-button"
          icon={<PaperplaneIcon aria-hidden />}
        >
          Legg til melding
        </Button>
      </HStack>
    </VStack>
  );
};

const CHECKED: Record<NotifyEnum, CheckboxProps['checked']> = {
  [NotifyEnum.UNSET]: undefined,
  [NotifyEnum.NO]: false,
  [NotifyEnum.YES]: true,
};
