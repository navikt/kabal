import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { isoDateTimeToPretty } from '../../../../domain/date';
import { useOppgave } from '../../../../hooks/oppgavebehandling/use-oppgave';
import { useIsFullfoert } from '../../../../hooks/use-is-fullfoert';
import { useOppgaveId } from '../../../../hooks/use-oppgave-id';
import { useOppgaveType } from '../../../../hooks/use-oppgave-type';
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
  const { data: oppgavebehandling } = useOppgave();
  const isFullfoert = useIsFullfoert();
  const type = useOppgaveType();

  const options = isFullfoert ? undefined : { pollingInterval: 30 * 1000 };

  const { data: messages, isLoading } = useGetMessagesQuery({ oppgaveId, type }, options);

  if (typeof oppgavebehandling === 'undefined' || typeof messages === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
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
