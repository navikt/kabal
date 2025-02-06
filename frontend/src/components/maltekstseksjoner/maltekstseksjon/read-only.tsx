import { useGetMaltekstseksjonQuery } from '@app/redux-api/maltekstseksjoner/queries';
import { HStack, Heading, Loader, Tag } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { styled } from 'styled-components';
import { TextPreview } from '../texts/preview';

interface Props {
  id: string | null;
  textToHighlight?: string;
}

export const MaltekstseksjonReadOnly = ({ id, textToHighlight }: Props) => {
  const { data: maltekstseksjon } = useGetMaltekstseksjonQuery(id ?? skipToken);

  if (id === null) {
    return null;
  }

  if (maltekstseksjon === undefined) {
    return <Loader title="Laster..." />;
  }

  return (
    <Section>
      <HStack align="center" justify="start" gap="0 2" as="header">
        <Heading level="1" size="medium">
          {maltekstseksjon.title.length > 0 ? maltekstseksjon.title : '<Ingen tittel>'}
        </Heading>
        <Tag variant="info" size="xsmall">
          Maltekstseksjon
        </Tag>
      </HStack>
      <List>
        {maltekstseksjon.textIdList.map((textId) => (
          <li key={textId}>
            <StyledTextPreview textId={textId} $highlight={textId === textToHighlight} />
          </li>
        ))}
      </List>
    </Section>
  );
};

const Section = styled.section`
  margin-top: var(--a-spacing-4);
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-2);
  border-bottom-left-radius: var(--a-border-radius-medium);
  border-top-left-radius: var(--a-border-radius-medium);
  padding-bottom: var(--a-spacing-2);
  padding-top: var(--a-spacing-4);
  padding-left: var(--a-spacing-3);
  border-left: var(--a-spacing-1) solid var(--a-surface-info);
`;

const StyledTextPreview = styled(TextPreview)<{ $highlight: boolean }>`
  outline: ${({ $highlight }) => ($highlight ? '4px solid var(--a-border-action-selected)' : 'none')};
  outline-offset: var(--a-spacing-05);
  border-radius: var(--a-border-radius-medium);
`;
