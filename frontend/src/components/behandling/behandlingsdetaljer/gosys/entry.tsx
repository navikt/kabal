import { BodyLong, HStack, Heading, Tag, VStack } from '@navikt/ds-react';
import { format } from 'date-fns';
import { styled } from 'styled-components';
import { GosysBeskrivelseEntry } from '@app/components/behandling/behandlingsdetaljer/gosys/parsing/type';
import { CopyIdButton } from '@app/components/copy-button/copy-id-button';
import { useGetSignatureQuery } from '@app/redux-api/bruker';
import { useKlageenheter } from '@app/simple-api-state/use-kodeverk';

export const Entry = ({ author, date, content }: GosysBeskrivelseEntry) => {
  const { data: enheter } = useKlageenheter();
  const { data } = useGetSignatureQuery(author.navIdent);

  return (
    <VStack gap="1" as="section">
      <VStack gap="1" as="header">
        <Author>
          <HStack gap="1">
            <Heading size="xsmall" level="1" style={{ minWidth: 170 }}>
              {data?.longName ?? author.name ?? 'Laster...'}
            </Heading>

            <CopyIdButton id={author.navIdent} size="xsmall" style={{ gridArea: 'ident' }} />
          </HStack>

          <StyledTime>{format(date, 'dd.MM.yyyy HH:mm')}</StyledTime>
        </Author>

        <StyledTag size="xsmall" variant="alt1">
          {enheter?.find((e) => e.id === author.enhet)?.navn ?? author.enhet} ({author.enhet})
        </StyledTag>
      </VStack>

      <StyledBodyLong size="small">{content}</StyledBodyLong>
    </VStack>
  );
};

const Author = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  column-gap: var(--a-spacing-2);
`;

const StyledTag = styled(Tag)`
  white-space: nowrap;
  width: min-content;
`;

const StyledTime = styled.time`
  font-style: italic;
  white-space: nowrap;
`;

const StyledBodyLong = styled(BodyLong)`
  white-space: pre-wrap;
  border-left: var(--a-spacing-1) solid var(--a-border-subtle);
  padding-left: var(--a-spacing-2);
`;
