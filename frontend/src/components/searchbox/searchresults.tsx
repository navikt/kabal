import React from 'react';
import styled from 'styled-components';
import { IPersonResultat, PersonSoekApiResponse } from '../../redux-api/oppgaver';
import { Loader } from '../loader/loader';
import { Result } from './result';

interface SearchResultsProps {
  isLoading: boolean;
  personsoekResultat: PersonSoekApiResponse | undefined;
}

export const SearchResults = ({ personsoekResultat, isLoading }: SearchResultsProps) => {
  if (isLoading || typeof personsoekResultat === 'undefined') {
    return <Loader>Laster personer...</Loader>;
  }

  return (
    <ResultsContainer>
      <ResultList personer={personsoekResultat.personer} />
      <p>Antall treff totalt: {personsoekResultat.antallTreffTotalt}</p>
    </ResultsContainer>
  );
};

interface ResultatListProps {
  personer: IPersonResultat[];
}

const ResultList = ({ personer }: ResultatListProps) => {
  if (typeof personer === 'undefined') {
    return <Loader>Laster personer...</Loader>;
  }

  if (personer.length === 0) {
    return <span>Ingen treff</span>;
  }

  return (
    <StyledResultList>
      {personer.map((person) => (
        <Result key={person.fnr} person={person} />
      ))}
    </StyledResultList>
  );
};

const ResultsContainer = styled.div`
  margin-top: 20px;
`;

const StyledResultList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
