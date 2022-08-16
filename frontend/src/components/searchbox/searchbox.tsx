import { Search } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';

interface SearchBoxProps {
  setQuery: (query: string) => void;
}

export const SearchBox = ({ setQuery }: SearchBoxProps): JSX.Element => (
  <StyledContainer>
    <StyledSearch
      size="medium"
      variant="simple"
      onChange={(value) => setTimeout(() => setQuery(value), 0)}
      data-testid="search-input"
      placeholder="Søk på navn eller personnummer"
      label="Søk på navn eller personnummer"
    />
  </StyledContainer>
);

const StyledSearch = styled(Search)`
  max-width: 40em;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 16px;
  margin-top: 16px;
`;
