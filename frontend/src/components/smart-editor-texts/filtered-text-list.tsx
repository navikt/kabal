import { Search } from '@navikt/ds-react';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { stringToRegExp } from '../../functions/string-to-regex';
import { TextTypes } from '../../types/texts/texts';
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
        <Filters />
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
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: sticky;
  top: 0;
  background-color: #fff;
  box-shadow: 0px 5px 5px -3px rgb(0, 0, 0, 20%);
  border-radius: 4px;
`;
