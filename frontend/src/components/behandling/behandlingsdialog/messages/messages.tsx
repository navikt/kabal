import { BodyShort, Heading } from '@navikt/ds-react';
import React from 'react';
import { SKELETON } from '@app/components/behandling/behandlingsdialog/messages/skeleton';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useGetSignatureQuery } from '@app/redux-api/bruker';
import { IMessage, useGetMessagesQuery } from '@app/redux-api/messages';
import {
  StyledAuthor,
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
    return SKELETON;
  }

  const isFeilregistrert = oppgave.feilregistrering !== null;

  return (
    <StyledMessagesContainer>
      <Heading level="1" size="xsmall" spacing>
        Meldinger
      </Heading>
      <WriteMessage />
      {messages.length === 0 && (isFullfoert || isFeilregistrert) ? <BodyShort>Ingen meldinger</BodyShort> : null}
      <StyledMessages data-testid="messages-list">
        {messages.map((message) => (
          <Message {...message} key={message.id} />
        ))}
      </StyledMessages>
    </StyledMessagesContainer>
  );
};

const Message = ({ author, modified, text, created }: IMessage) => {
  const { data } = useGetSignatureQuery(author.saksbehandlerIdent);

  return (
    <StyledMessage data-testid="message-list-item">
      <StyledAuthor>{data?.customLongName ?? author.name}</StyledAuthor>
      <StyledMessageContent>{isoDateTimeToPretty(modified ?? created)}</StyledMessageContent>
      <StyledMessageContent>{text}</StyledMessageContent>
    </StyledMessage>
  );
};
