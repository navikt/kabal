import { Loader } from '@navikt/ds-react';
import React from 'react';
import { isoDateTimeToPretty } from '../../../../domain/date';
import { useOppgave } from '../../../../hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useIsFullfoert } from '../../../../hooks/use-is-fullfoert';
import { IMessage, useGetMessagesQuery } from '../../../../redux-api/messages';
import {
  StyledAuthor,
  StyledHeader,
  StyledMessage,
  StyledMessageContent,
  StyledMessages,
  StyledMessagesContainer,
} from './styled-components';
import { WriteMessage } from './write-message';

export const Messages = () => {
  const oppgaveId = useOppgaveId();
  const { data: oppgave } = useOppgave();
  const isFullfoert = useIsFullfoert();

  const options = isFullfoert ? undefined : { pollingInterval: 30 * 1000 };

  const { data: messages, isLoading } = useGetMessagesQuery(oppgaveId, options);

  if (typeof oppgave === 'undefined' || typeof messages === 'undefined' || isLoading) {
    return <Loader size="xlarge" />;
  }

  return (
    <StyledMessagesContainer>
      <StyledHeader>Meldinger:</StyledHeader>
      <WriteMessage />
      <StyledMessages data-testid="messages-list">
        {messages.map((message) => (
          <Message {...message} key={message.id} />
        ))}
      </StyledMessages>
    </StyledMessagesContainer>
  );
};

export const Message = ({ author, modified, text, created }: IMessage) => (
  <StyledMessage data-testid="message-list-item">
    <StyledAuthor>{author.name}</StyledAuthor>
    <StyledMessageContent>{isoDateTimeToPretty(modified ?? created)}</StyledMessageContent>
    <StyledMessageContent>{text}</StyledMessageContent>
  </StyledMessage>
);
