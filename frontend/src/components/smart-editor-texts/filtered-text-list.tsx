import { Search } from '@navikt/ds-react';
import React, { useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { TextTypes } from '@app/types/common-text-types';
import { Filters } from './filters';
import { TextList } from './text-list';

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
