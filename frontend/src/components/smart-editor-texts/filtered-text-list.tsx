import { Search } from '@navikt/ds-react';
import React, { useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { TextTypes } from '@app/types/texts/texts';
import { Filters } from './filters';
import { TextList } from './smart-editor-texts-list';

interface Props {
  textType: TextTypes;
}

export const FilteredTextList = ({ textType }: Props) => {
  const [filter, setFilter] = useState<string>('');
  const filterRegex = useMemo(() => stringToRegExp(filter), [filter]);

  return (
    <Container>
      <Header>
        <Filters textType={textType} />
        <Search
          value={filter}
          onChange={setFilter}
          placeholder="Filtrer på tittel"
          label="Filtrer på tittel"
          size="small"
          hideLabel
        />
      </Header>
      <TextList textType={textType} filter={filterRegex} />
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: min-content 1fr;
  row-gap: 8px;
  height: 100%;
  z-index: 22;
  overflow: visible;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  background-color: #fff;
`;
