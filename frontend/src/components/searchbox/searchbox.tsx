import { Search } from '@navikt/ds-icons';
import React from 'react';
import styled from 'styled-components';

interface SearchBoxProps {
  query: string;
  setQuery: (query: string) => void;
}

export const SearchBox = ({ query, setQuery }: SearchBoxProps): JSX.Element => (
  <>
    <StyledContainer>
      <StyledInput
        type="text"
        value={query}
        onChange={({ target }) => setQuery(target.value)}
        data-testid="search-input"
        placeholder="Søk på navn eller personnummer"
      />
      <StyledSearchButton onClick={() => setQuery(query)}>
        <StyledSearchIcon />
      </StyledSearchButton>
    </StyledContainer>
  </>
);

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 1em;
`;

const StyledInput = styled.input`
  padding: 0.5em;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: 1px solid #6a6a6a;
  height: 40px;
  width: 40em;
  outline: none;
  border-radius: 4px 0 0 4px;

  &:focus {
    outline-offset: -2px;
    border: 3px solid #254b6d;
  }
`;

const StyledSearchButton = styled.button`
  border: none;
  background-color: #0067c5;
  margin: 0;
  color: white;
  cursor: pointer;
  height: 40px;
  width: 40px;
  border-radius: 0 4px 4px 0;
`;

const StyledSearchIcon = styled(Search)`
  height: 70%;
  width: 70%;
`;
