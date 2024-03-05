import { Search } from '@navikt/ds-react';
import React, { useState } from 'react';
import { styled } from 'styled-components';
import { TextTypes } from '@app/types/common-text-types';
import { Filters } from './filters';
import { TextList } from './text-list/text-list';

interface Props {
  textType: TextTypes;
}

export const FilteredTextList = ({ textType }: Props) => {
  const [filter, setFilter] = useState<string>('');

  return (
    <Container>
      <Header>
        <Filters textType={textType} />
        <Search
          value={filter}
          onChange={setFilter}
          placeholder="Filtrer på tittel og innhold"
          label="Filtrer på tittel og innhold"
          size="small"
          hideLabel
          spellCheck
        />
      </Header>
      <TextList textType={textType} filter={filter} />
    </Container>
  );
};

const Container = styled.div`
  row-gap: 8px;
  z-index: 22;
  overflow: visible;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  background-color: #fff;
`;
