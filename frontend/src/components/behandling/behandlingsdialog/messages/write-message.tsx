import { StaticDataContext } from '@app/components/app/static-data-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useGetMySignatureQuery } from '@app/redux-api/bruker';
import { usePostMessageMutation } from '@app/redux-api/messages';
import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Button, Loader, Textarea } from '@navikt/ds-react';
import { useContext, useEffect, useState } from 'react';
import { StyleSendMessage, StyledWriteMessage } from './styled-components';

export const WriteMessage = () => {
  const isFullfoert = useIsFullfoert();
  const { user } = useContext(StaticDataContext);
  const { navIdent, navn } = user;
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [postMessage, { isSuccess, isLoading: messageIsLoading }] = usePostMessageMutation();
  const oppgaveId = useOppgaveId();
  const { data: signature, isLoading: signatureIsLoading } = useGetMySignatureQuery();

  useEffect(() => {
    if (isSuccess) {
      setMessage('');
    }
  }, [isSuccess, setMessage]);

  if (signatureIsLoading || typeof signature === 'undefined') {
    return <Loader size="xlarge" />;
  }

  if (isFullfoert) {
    return null;
  }

  const post = () => {
    if (messageIsLoading || typeof oppgaveId !== 'string') {
      return;
    }

    if (!message.length) {
      setErrorMessage('Meldingen må ha et innhold');

      return;
    }

    postMessage({
      oppgaveId,
      text: message.trim(),
      author: { navIdent, navn },
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      post();
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setErrorMessage(null);
    setMessage(event.target.value);
  };

  return (
    <StyledWriteMessage>
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
      <StyleSendMessage>
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={post}
          loading={messageIsLoading}
          data-testid="send-message-button"
          icon={<PaperplaneIcon aria-hidden />}
        >
          Legg til melding
        </Button>
      </StyleSendMessage>
    </StyledWriteMessage>
  );
};
