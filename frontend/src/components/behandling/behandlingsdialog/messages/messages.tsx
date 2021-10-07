import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { isoDateTimeToPretty } from '../../../../domain/date';
import { useKlagebehandlingId } from '../../../../hooks/use-klagebehandling-id';
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
  const klagebehandlingId = useKlagebehandlingId();
  const { data: messages, isLoading } = useGetMessagesQuery(klagebehandlingId, { pollingInterval: 3 * 1000 });

  if (typeof messages === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  return (
    <StyledMessagesContainer>
      <StyledHeader>Meldinger:</StyledHeader>
      <WriteMessage />

      <StyledMessages>
        {messages.map((message) => (
          <Message {...message} key={message.id} />
        ))}
      </StyledMessages>
    </StyledMessagesContainer>
  );
};

export const Message = ({ author, modified, text, created }: IMessage) => (
  <StyledMessage>
    <StyledAuthor>{author.name}</StyledAuthor>
    <StyledMessageContent>{isoDateTimeToPretty(modified ?? created)}</StyledMessageContent>
    <StyledMessageContent>{text}</StyledMessageContent>
  </StyledMessage>
);
