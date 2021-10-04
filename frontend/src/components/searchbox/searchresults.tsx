import { Knapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import { IPersonResultat, PersonSoekApiResponse } from '../../redux-api/oppgaver';
import { Loader } from '../loader/loader';

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
interface RowsProps {
  personer: IPersonResultat[];
  columnCount: number;
}

const ResultList = ({ personer }: ResultatListProps) => (
  <table className="tabell">
    <Rows personer={personer} columnCount={3} />
  </table>
);

const Rows = ({ personer, columnCount }: RowsProps) => {
  if (typeof personer === 'undefined') {
    return (
      <tbody>
        <tr>
          <td colSpan={columnCount}>
            <Loader>Laster personer...</Loader>
          </td>
        </tr>
      </tbody>
    );
  }

  if (personer.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columnCount}>Ingen oppgaver i liste</td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {personer.map(({ navn, fnr }) => (
        <tr key={fnr}>
          <td>{formatName(navn)}</td>
          <td>{fnr}</td>
          <td>
            <Knapp>Se saker</Knapp>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

const ResultsContainer = styled.div`
  margin-top: 20px;
`;

const formatName = (rawString: string): string => {
  if (rawString === '') {
    return '';
  }

  const nameArray = rawString
    .replace(/[\\[\]']+/g, '')
    .toLowerCase()
    .split(' ');

  return nameArray
    .map((name: string) => name.charAt(0).toUpperCase() + name.slice(1))
    .reduce((firstName: string, lastName: string) => firstName + ' ' + lastName);
};
