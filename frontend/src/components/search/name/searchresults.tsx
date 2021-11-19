import React from 'react';
import styled from 'styled-components';
import { Name } from '../../../domain/types';
import { Result } from './result';

interface SearchResultsProps {
  people: Person[];
}

interface Person {
  fnr: string;
  navn: Name;
}

export const SearchResults = ({ people }: SearchResultsProps) => (
  <>
    <StyledResultList data-testid="search-result-list">
      {people.map((person) => (
        <Result key={person.fnr} {...person} />
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
