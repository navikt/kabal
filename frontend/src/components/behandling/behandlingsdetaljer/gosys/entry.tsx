import {
  type GosysBeskrivelseEntry,
  GosysEntryAuthorType,
  type GosysEntryEmployee,
  type GosysEntrySystem,
} from '@app/components/behandling/behandlingsdetaljer/gosys/parsing/type';
import { CopyButton } from '@app/components/copy-button/copy-button';
import { CopyIdButton } from '@app/components/copy-button/copy-id-button';
import { useGetSignatureQuery } from '@app/redux-api/bruker';
import { useKlageenheter } from '@app/simple-api-state/use-kodeverk';
import { BodyLong, HStack, Heading, Tag, Tooltip, VStack } from '@navikt/ds-react';
import { format } from 'date-fns';
import { styled } from 'styled-components';

export const Entry = ({ author, content, date }: GosysBeskrivelseEntry) => (
  <VStack gap="1" as="section">
    <HStack as="header" gap="1" wrap={false} overflow="hidden">
      <Header author={author} />
    </HStack>

    <StyledBodyLong size="small">{content}</StyledBodyLong>

    <StyledTime>{format(date, 'dd.MM.yyyy HH:mm')}</StyledTime>
  </VStack>
);

const Header = ({ author }: Pick<GosysBeskrivelseEntry, 'author'>) => {
  if (author === null) {
    return (
      <>
        <System name="Ukjent" />
        <StyledTag size="xsmall" variant="warning">
          Ukjent
        </StyledTag>
      </>
    );
  }

  if (author.type === GosysEntryAuthorType.SYSTEM) {
    return (
      <>
        <System {...author} />
        <StyledTag size="xsmall" variant="neutral-filled">
          System
        </StyledTag>
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
    <StyledTag size="xsmall" variant="alt1">
      {enheter?.find((e) => e.id === enhet)?.navn ?? 'Ukjent enhet'} ({enhet})
    </StyledTag>
  );
};

const Employee = ({ navIdent, name }: Omit<GosysEntryEmployee, 'type'>) => {
  const { data } = useGetSignatureQuery(navIdent);

  return (
    <>
      <AuthorName>{data?.longName ?? name ?? 'Laster...'}</AuthorName>

      <StyledCopyIdButton id={navIdent} size="xsmall" />
    </>
  );
};

const System = ({ name }: Omit<GosysEntrySystem, 'type'>) => (
  <>
    <AuthorName>{name}</AuthorName>

    <StyledCopyButton copyText={name} text={name} activeText={name} size="xsmall" />
  </>
);

const AuthorName = ({ children }: { children: string }) => (
  <Tooltip content={children} placement="top">
    <StyledName size="xsmall" level="1">
      {children}
    </StyledName>
  </Tooltip>
);

const StyledName = styled(Heading)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledTag = styled(Tag)`
  white-space: nowrap;
  width: min-content;
`;

const StyledTime = styled.time`
  font-size: var(--a-font-size-small);
  font-style: italic;
  white-space: nowrap;
  margin-left: auto;
`;

const StyledBodyLong = styled(BodyLong)`
  white-space: pre-wrap;
  border-left: var(--a-spacing-1) solid var(--a-border-subtle);
  padding-left: var(--a-spacing-2);
`;

const StyledCopyButton = styled(CopyButton)`
  flex-shrink: 0;
`;

const StyledCopyIdButton = styled(CopyIdButton)`
  flex-shrink: 0;
`;
