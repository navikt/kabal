import { Knapp } from 'nav-frontend-knapper';
import { Textarea } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useEffect, useState } from 'react';
import { useKlagebehandlingId } from '../../../../hooks/use-klagebehandling-id';
import { useGetBrukerQuery } from '../../../../redux-api/bruker';
import { usePostMessageMutation } from '../../../../redux-api/messages';
import { StyleSendMessage, StyledWriteMessage } from './styled-components';

export const WriteMessage = () => {
  const klagebehandlingId = useKlagebehandlingId();
  const { data: user, isLoading } = useGetBrukerQuery();
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [postMessage, { isSuccess, isLoading: messageIsLoading }] = usePostMessageMutation();

  useEffect(() => {
    if (isSuccess) {
      setMessage('');
    }
  }, [isSuccess, setMessage]);

  if (typeof user === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const post = () => {
    if (messageIsLoading) {
      return;
    }

    if (!message.length) {
      setErrorMessage('Meldingen må ha et innhold');

      return;
    }

    postMessage({
      klagebehandlingId,
      text: message,
      author: {
        name: user.info.sammensattNavn,
        saksbehandlerIdent: user.info.navIdent,
      },
    });
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
      <Textarea onKeyPress={onKeyPress} value={message} onChange={onChange} maxLength={0} feil={errorMessage} />
      <StyleSendMessage>
        <Knapp mini onClick={post} spinner={messageIsLoading}>
          Send
        </Knapp>
      </StyleSendMessage>
    </StyledWriteMessage>
  );
};
