import { CopyButton } from '@app/components/copy-button/copy-button';
import { CopyIdButton } from '@app/components/copy-button/copy-id-button';
import {
  type GosysBeskrivelseEntry,
  GosysEntryAuthorType,
  type GosysEntryEmployee,
  type GosysEntrySystem,
} from '@app/components/gosys/beskrivelse/parsing/type';
import { useGetSignatureQuery } from '@app/redux-api/bruker';
import { useKlageenheter } from '@app/simple-api-state/use-kodeverk';
import { BodyLong, Heading, HStack, Tag, Tooltip, VStack } from '@navikt/ds-react';
import { format } from 'date-fns';

export const Entry = ({ author, content, date }: GosysBeskrivelseEntry) => (
  <VStack gap="1" as="section">
    <HStack as="header" gap="1" wrap={false} overflow="hidden">
      <Header author={author} />
    </HStack>

    <BodyLong
      size="small"
      className="whitespace-pre-wrap border-ax-border-neutral-subtle border-l-4 pl-2 empty:before:italic empty:before:content-['Ingen_tekst']"
    >
      {content}
    </BodyLong>

    <time className="ml-auto whitespace-nowrap text-ax-small italic">{format(date, 'dd.MM.yyyy HH:mm')}</time>
  </VStack>
);

const Header = ({ author }: Pick<GosysBeskrivelseEntry, 'author'>) => {
  if (author === null) {
    return (
      <>
        <System name="Ukjent" />
        <Tag size="xsmall" variant="warning" className="w-min whitespace-nowrap">
          Ukjent
        </Tag>
      </>
    );
  }

  if (author.type === GosysEntryAuthorType.SYSTEM) {
    return (
      <>
        <System {...author} />
        <Tag size="xsmall" variant="neutral-filled" className="w-min whitespace-nowrap">
          System
        </Tag>
      </>
    );
  }

  return (
    <>
      <Employee {...author} />
      <Enhet enhet={author.enhet} />
    </>
  );
};

const Enhet = ({ enhet }: Pick<GosysEntryEmployee, 'enhet'>) => {
  const { data: enheter } = useKlageenheter();

  return (
    <Tag size="xsmall" variant="alt1" className="w-min whitespace-nowrap">
      {enheter?.find((e) => e.id === enhet)?.navn ?? 'Ukjent enhet'} ({enhet})
    </Tag>
  );
};

const Employee = ({ navIdent, name }: Omit<GosysEntryEmployee, 'type'>) => {
  const { data } = useGetSignatureQuery(navIdent);

  return (
    <>
      <AuthorName>{data?.longName ?? name ?? 'Laster...'}</AuthorName>

      <CopyIdButton id={navIdent} size="xsmall" className="shrink-0" />
    </>
  );
};

const System = ({ name }: Omit<GosysEntrySystem, 'type'>) => (
  <>
    <AuthorName>{name}</AuthorName>

    <CopyButton copyText={name} text={name} activeText={name} size="xsmall" className="shrink-0" />
  </>
);

const AuthorName = ({ children }: { children: string }) => (
  <Tooltip content={children} placement="top">
    <Heading size="xsmall" level="1" className="truncate">
      {children}
    </Heading>
  </Tooltip>
);
