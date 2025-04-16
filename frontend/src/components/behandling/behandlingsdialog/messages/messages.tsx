import { SKELETON } from '@app/components/behandling/behandlingsdialog/messages/skeleton';
import { isoDateTimeToPretty } from '@app/domain/date';
import { formatEmployeeName } from '@app/domain/employee-name';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { type IMessage, useGetMessagesQuery } from '@app/redux-api/messages';
import { BodyShort, Heading } from '@navikt/ds-react';
import { WriteMessage } from './write-message';

export const Messages = () => {
  const oppgaveId = useOppgaveId();
  const { data: oppgave } = useOppgave();
  const isFullfoert = useIsFullfoert();

  const { data: messages, isLoading } = useGetMessagesQuery(oppgaveId);

  if (typeof oppgave === 'undefined' || typeof messages === 'undefined' || isLoading) {
    return SKELETON;
  }

  const isFeilregistrert = oppgave.feilregistrering !== null;

  return (
    <section className="pb-4">
      <Heading level="1" size="xsmall" spacing>
        Meldinger ({messages.length})
      </Heading>
      <WriteMessage />
      {messages.length === 0 && (isFullfoert || isFeilregistrert) ? <BodyShort>Ingen meldinger</BodyShort> : null}
      <ul data-testid="messages-list" className="list-none">
        {messages.map((message) => (
          <Message key={message.id} {...message} />
        ))}
      </ul>
    </section>
  );
};

const Message = ({ id, author, modified, text, created }: IMessage) => {
  const time = modified ?? created;

  return (
    <li data-testid="message-list-item" data-message-id={id} className="mt-1">
      <p className="font-bold">{formatEmployeeName(author)}</p>
      <time dateTime={time} className="text-small italic">
        {isoDateTimeToPretty(time)}
      </time>
      <p data-testid="message-list-item-text" className="whitespace-pre-line break-words">
        {text}
      </p>
    </li>
  );
};
