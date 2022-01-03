import React from 'react';
import styled from 'styled-components';
import { ISearchPerson } from '../../../types/oppgaver';
import { Result } from './result';

interface SearchResultsProps {
  people: ISearchPerson[];
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
