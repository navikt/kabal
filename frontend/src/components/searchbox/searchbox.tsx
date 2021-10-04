import { Search } from '@navikt/ds-icons';
import React, { useState } from 'react';
import styled from 'styled-components';

interface SearchBoxProps {
  onChange: (query: string) => void;
}

export const SearchBox = ({ onChange }: SearchBoxProps): JSX.Element => {
  const [query, setQuery] = useState<string>('');

  return (
    <>
      <StyledLabelContainer>
        <StyledLabelText>Søk med personnummer eller navn:</StyledLabelText>
        <StyledInput
          type="text"
          onChange={({ target }) => {
            setQuery(target.value);
            onChange(target.value);
          }}
        />
        <StyledSearchButton onClick={() => onChange(query)}>
          <StyledSearchIcon />
        </StyledSearchButton>
      </StyledLabelContainer>
    </>
  );
};

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
