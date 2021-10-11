import { Search } from '@navikt/ds-icons';
import React from 'react';
import styled from 'styled-components';

interface SearchBoxProps {
  query: string;
  setQuery: (query: string) => void;
}

export const SearchBox = ({ query, setQuery }: SearchBoxProps): JSX.Element => (
  <>
    <StyledLabelContainer>
      <StyledLabelText>Søk med fødselsnummer eller navn:</StyledLabelText>
      <StyledInput type="text" value={query} onChange={({ target }) => setQuery(target.value)} />
      <StyledSearchButton onClick={() => setQuery(query)}>
        <StyledSearchIcon />
      </StyledSearchButton>
    </StyledLabelContainer>
  </>
);

const StyledLabelContainer = styled.label`
  display: flex;
  flex-wrap: wrap;
`;

const StyledLabelText = styled.div`
  flex-grow: 1;
  width: 100%;
`;

const StyledInput = styled.input`
  padding: 0.5em;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border: 1px solid rgb(106, 106, 106);
  height: 2.5em;
  width: 40em;
`;

const StyledSearchButton = styled.button`
  border: none;
  background-color: #0067c5;
  margin: 0;
  color: white;
  cursor: pointer;
  height: 2.5em;
  width: 2.5em;
`;

const StyledSearchIcon = styled(Search)`
  height: 100%;
  width: 100%;
`;
