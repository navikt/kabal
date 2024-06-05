import { Heading, Loader, Tag } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { styled } from 'styled-components';
import { useGetMaltekstseksjonQuery } from '@app/redux-api/maltekstseksjoner/queries';
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
      <Header>
        <Heading level="1" size="medium">
          {maltekstseksjon.title.length > 0 ? maltekstseksjon.title : '<Ingen tittel>'}
        </Heading>
        <Tag variant="info" size="xsmall">
          Maltekstseksjon
        </Tag>
      </Header>
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
  margin-top: 16px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  border-bottom-left-radius: var(--a-border-radius-medium);
  border-top-left-radius: var(--a-border-radius-medium);
  padding-bottom: 8px;
  padding-top: 16px;
  padding-left: 12px;
  border-left: 4px solid var(--a-surface-info);
`;

const StyledTextPreview = styled(TextPreview)<{ $highlight: boolean }>`
  outline: ${({ $highlight }) => ($highlight ? '4px solid var(--a-border-action-selected)' : 'none')};
  outline-offset: 2px;
  border-radius: var(--a-border-radius-medium);
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 8px;
`;
