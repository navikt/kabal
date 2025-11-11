import { StaticDataContext } from '@app/components/app/static-data-context';
import { Message } from '@app/components/behandling/behandlingsdialog/messages/message';
import { SKELETON } from '@app/components/behandling/behandlingsdialog/messages/skeleton';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { type IMessage, useGetMessagesQuery } from '@app/redux-api/messages';
import { BodyShort, type BoxNewProps, Button, Heading, VStack } from '@navikt/ds-react';
import { useContext, useState } from 'react';
import { WriteMessage } from './write-message';

export const UnfinishedCaseMessages = () => {
  const oppgaveId = useOppgaveId();
  const [showAll, setShowAll] = useState(false);
  const { user } = useContext(StaticDataContext);
  const { data: messages, isLoading: isMessagesLoading, isSuccess: isMessagesSuccess } = useGetMessagesQuery(oppgaveId);

  if (isMessagesLoading) {
    return SKELETON;
  }

  if (!isMessagesSuccess) {
    return (
      <section className="pb-4">
        <Heading level="1" size="xsmall" spacing>
          Meldinger
        </Heading>

        <BodyShort size="small" className="text-ax-text-neutral-subtle italic">
          Kunne ikke hente meldinger
        </BodyShort>
      </section>
    );
  }

  const messageGroups = groupMessages(messages);
  const relevantGroups = getRelevantMessages(messageGroups);
  const relevantMessagesCount = relevantGroups.reduce((acc, { group }) => acc + group.length, 0);

  const nonRelevantCount = messages.length - relevantMessagesCount;

  return (
    <section className="pb-4">
      <Heading level="1" size="xsmall" spacing>
        Meldinger ({messages.length})
      </Heading>

      <WriteMessage />

      {messages.length === 0 ? (
        <BodyShort size="small" className="text-ax-text-neutral-subtle italic">
          Ingen meldinger
        </BodyShort>
      ) : null}

      <VStack gap="6" marginBlock="2 0">
        {(showAll ? messageGroups : relevantGroups).map(({ group, author }) => {
          const mine = author.navIdent === user.navIdent;
          const borderRadius: BoxNewProps['borderRadius'] = mine ? 'large large 0 large' : 'large large large 0';
          const background: BoxNewProps['background'] = mine ? 'neutral-moderate' : 'accent-moderate';

          return (
            <VStack as="section" key={getGroupKey(group)} gap="2" align={mine ? 'end' : 'start'}>
              {group.map((message, index) => (
                <Message
                  key={message.id}
                  {...message}
                  mine={mine}
                  isFirst={index === 0}
                  background={background}
                  borderRadius={borderRadius}
                />
              ))}
            </VStack>
          );
        })}

        {nonRelevantCount !== 0 ? (
          <Button variant="tertiary" size="small" onClick={() => setShowAll((p) => !p)}>
            {showAll ? 'Skjul' : 'Vis'} {nonRelevantCount} tidligere {nonRelevantCount === 1 ? 'melding' : 'meldinger'}
          </Button>
        ) : null}
      </VStack>
    </section>
  );
};

const getGroupKey = (group: IMessage[]) => {
  const earliestMessage = group.at(-1);

  if (earliestMessage === undefined) {
    return '';
  }

  const { author, created } = earliestMessage;

  return `${author.navIdent}-${created}`;
};

interface MessageGroup {
  author: IMessage['author'];
  group: IMessage[];
}

const groupMessages = (messages: IMessage[]) => {
  const [firstMessage, ...rest] = messages;

  if (firstMessage === undefined) {
    return [];
  }

  let lastGroup: MessageGroup = { author: firstMessage.author, group: [firstMessage] };

  const grouped: MessageGroup[] = [lastGroup];

  let lastMessage = firstMessage;

  for (const message of rest) {
    if (
      message.author.navIdent === lastMessage.author.navIdent && // Check if authors are equal.
      message.created.startsWith(lastMessage.created.slice(0, 10)) // Check if messages are on the same day, month and year.
    ) {
      lastGroup.group.push(message);
    } else {
      lastGroup = { author: message.author, group: [message] };
      grouped.push(lastGroup);
    }

    lastMessage = message;
  }

  return grouped;
};

const RELEVANT_MESSAGES_COUNT = 3;

const getRelevantMessages = (groups: MessageGroup[]) => {
  const relevantGroups: MessageGroup[] = [];

  for (const { group, ...rest } of groups) {
    const remainingSlots = RELEVANT_MESSAGES_COUNT - relevantGroups.reduce((acc, g) => acc + g.group.length, 0);

    if (remainingSlots === 0) {
      break;
    }

    if (group.length > remainingSlots) {
      relevantGroups.push({ group: group.slice(0, remainingSlots), ...rest });
      break;
    }

    relevantGroups.push({ group, ...rest });
  }

  return relevantGroups;
};
