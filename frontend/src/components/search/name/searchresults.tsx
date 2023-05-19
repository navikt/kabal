import React from 'react';
import styled from 'styled-components';
import { IPartBase } from '@app/types/oppgave-common';
import { Result } from './result';

interface SearchResultsProps {
  people: IPartBase[];
}

export const SearchResults = ({ people }: SearchResultsProps) => (
  <>
    <StyledResultList data-testid="search-result-list">
      {people.map((person) => (
        <Result key={person.id} {...person} />
      ))}
    </StyledResultList>
    <p>Antall treff totalt: {people.length}</p>
  </>
);

const StyledResultList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
