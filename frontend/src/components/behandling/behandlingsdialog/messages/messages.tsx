import { StaticDataContext } from '@app/components/app/static-data-context';
import { SKELETON } from '@app/components/behandling/behandlingsdialog/messages/skeleton';
import { PRETTY_FORMAT, PRETTY_TIME } from '@app/components/date-picker/constants';
import { isoDateTimeToPretty } from '@app/domain/date';
import { formatEmployeeName } from '@app/domain/employee-name';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { type IMessage, useGetMessagesQuery } from '@app/redux-api/messages';
import { BellFillIcon } from '@navikt/aksel-icons';
import { BodyLong, BodyShort, BoxNew, Button, Heading, HStack, Tooltip, VStack } from '@navikt/ds-react';
import { format, isToday } from 'date-fns';
import { useContext, useState } from 'react';
import { WriteMessage } from './write-message';

const RELEVANT_MESSAGES_COUNT = 3;

export const Messages = () => {
  const oppgaveId = useOppgaveId();
  const { data: oppgave } = useOppgave();
  const isFullfoert = useIsFullfoert();
  const [showAll, setShowAll] = useState(false);
  const { user } = useContext(StaticDataContext);

  const { data: messages, isLoading } = useGetMessagesQuery(oppgaveId);

  if (typeof oppgave === 'undefined' || typeof messages === 'undefined' || isLoading) {
    return SKELETON;
  }

  const isFeilregistrert = oppgave.feilregistrering !== null;

  const messageGroups = groupMessages(messages);
  const relevantGroups = getRelevantMessages(messageGroups);

  const nonRelevantCount = messages.length - relevantGroups.reduce((acc, { group }) => acc + group.length, 0);

  return (
    <section className="pb-4">
      <Heading level="1" size="xsmall" spacing>
        Meldinger ({messages.length})
      </Heading>
      <WriteMessage />

      {messages.length === 0 && (isFullfoert || isFeilregistrert) ? <BodyShort>Ingen meldinger</BodyShort> : null}

      <VStack gap="6" marginBlock="2 0">
        {(showAll ? messageGroups : relevantGroups).map(({ id, group }) => (
          <VStack as="section" key={id} gap="2">
            {group.map(({ id, author, text, created, notify }, index) => {
              const mine = author.navIdent === user.navIdent;

              return (
                <BoxNew
                  key={id}
                  borderRadius={mine ? 'large large 0 large' : 'large large large 0'}
                  padding="2"
                  background={mine ? 'neutral-moderateA' : 'accent-moderateA'}
                  borderColor="neutral-subtleA"
                  borderWidth="1"
                  position="relative"
                  width="fit-content"
                  minWidth="80px"
                  className={`group/bubble opacity-100 starting:opacity-0 duration-200 ${mine ? 'ml-auto' : 'mr-auto'}`}
                >
                  {index === 0 ? (
                    <MessageHeader author={author} created={created} notify={notify} />
                  ) : (
                    <MessageTime created={created} notify={notify} />
                  )}
                  <BodyLong size="small" className="wrap-break-word whitespace-pre-line">
                    {text}
                  </BodyLong>
                </BoxNew>
              );
            })}
          </VStack>
        ))}

        {nonRelevantCount !== 0 ? (
          <Button variant="tertiary" size="small" onClick={() => setShowAll((p) => !p)}>
            {showAll ? 'Skjul' : 'Vis'} {nonRelevantCount} tidligere {nonRelevantCount === 1 ? 'melding' : 'meldinger'}
          </Button>
        ) : null}
      </VStack>
    </section>
  );
};

const MessageHeader = ({ author, created, notify }: Pick<IMessage, 'author' | 'created' | 'notify'>) => {
  const { user } = useContext(StaticDataContext);
  const name = author.navIdent === user.navIdent ? 'Meg' : formatEmployeeName(author);

  return (
    <HStack asChild wrap={false} align="center" justify="space-between" gap="2">
      <h1 className="mb-2 overflow-hidden text-ax-small">
        <Tooltip content={name}>
          <span className="truncate text-ax-text-neutral-subtle">{name}</span>
        </Tooltip>

        <HStack
          wrap={false}
          align="center"
          gap="1"
          flexShrink="0"
          className="shrink-0 text-ax-small text-ax-text-neutral-subtle italic"
        >
          {notify ? <MessageNotification /> : null}

          <Tooltip content={isoDateTimeToPretty(created) ?? created}>
            <time dateTime={created}>{displayTime(created)}</time>
          </Tooltip>
        </HStack>
      </h1>
    </HStack>
  );
};

const MessageTime = ({ created, notify }: Pick<IMessage, 'created' | 'notify'>) => (
  <HStack asChild wrap={false} position="absolute" top="2" right="2" align="center" gap="1" flexShrink="0">
    <BoxNew
      background="neutral-moderate"
      paddingInline="1 0"
      paddingBlock="0 1"
      className="text-ax-small text-ax-text-neutral-subtle italic opacity-0 transition-opacity duration-200 group-hover/bubble:opacity-100"
    >
      {notify ? <MessageNotification /> : null}

      <Tooltip content={isoDateTimeToPretty(created) ?? created}>
        <time dateTime={created}>{displayTime(created)}</time>
      </Tooltip>
    </BoxNew>
  </HStack>
);

const displayTime = (date: string) => format(date, isToday(new Date(date)) ? PRETTY_TIME : PRETTY_FORMAT);

const MessageNotification = () => (
  <Tooltip content="Varsel ble sendt til saksbehandler">
    <BoxNew role="presentation">
      <BellFillIcon aria-hidden />
    </BoxNew>
  </Tooltip>
);

const getGroupKey = (group: IMessage[]) => {
  const earliestMessage = group.at(-1);

  if (earliestMessage === undefined) {
    return '';
  }

  const { author, created } = earliestMessage;

  return `${author.navIdent}-${created}`;
};

interface MessageGroup {
  id: string;
  group: IMessage[];
}

const groupMessages = (messages: IMessage[]) => {
  const [firstMessage, ...rest] = messages;

  if (firstMessage === undefined) {
    return [];
  }

  let lastGroup: IMessage[] = [firstMessage];

  const grouped: IMessage[][] = [lastGroup];

  let lastMessage = firstMessage;

  for (const message of rest) {
    const authorId = message.author.navIdent;

    if (authorId === lastMessage.author.navIdent) {
      lastGroup.push(message);
    } else {
      lastGroup = [message];
      grouped.push(lastGroup);
    }

    lastMessage = message;
  }

  return grouped.map<MessageGroup>((group) => ({ id: getGroupKey(group), group }));
};

const getRelevantMessages = (groups: MessageGroup[]) => {
  const relevantGroups: MessageGroup[] = [];

  for (const { id, group } of groups) {
    const remainingSlots = RELEVANT_MESSAGES_COUNT - relevantGroups.length;

    if (remainingSlots === 0) {
      break;
    }

    if (group.length > remainingSlots) {
      relevantGroups.push({ id, group: group.slice(0, remainingSlots) });
      break;
    }

    relevantGroups.push({ id, group });
  }

  return relevantGroups;
};
