import { Search } from '@navikt/ds-react';
import { useState } from 'react';
import { styled } from 'styled-components';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { TextTypes } from '@app/types/common-text-types';
import { Filters } from './filters';
import { TextList } from './text-list/text-list';

interface Props {
  textType: TextTypes;
}

export const FilteredTextList = ({ textType }: Props) => {
  const [filter, setFilter] = useState<string>('');
  const language = useRedaktoerLanguage();

  return (
    <Container>
      <Header>
        <Filters textType={textType} />
        <Row>
          <Search
            value={filter}
            onChange={setFilter}
            placeholder="Filtrer på tittel og innhold"
            label="Filtrer på tittel og innhold"
            size="small"
            hideLabel
            spellCheck
          />
        </Row>
      </Header>
      <TextList textType={textType} filter={filter} language={language} />
    </Container>
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--a-spacing-1);
`;

const Container = styled.div`
  row-gap: var(--a-spacing-2);
  z-index: 22;
  overflow: visible;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-2);
  position: relative;
  background-color: var(--a-bg-default);
`;
