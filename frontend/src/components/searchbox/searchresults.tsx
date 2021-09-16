import { Knapp } from 'nav-frontend-knapper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { IPersonResultat, PersonSoekApiResponse } from '../../redux-api/oppgaver';

interface SearchResultsProps {
  isLoading: boolean;
  personsoekResultat: PersonSoekApiResponse | undefined;
}

export const SearchResults = ({ personsoekResultat, isLoading }: SearchResultsProps) => {
  if (isLoading || typeof personsoekResultat === 'undefined') {
    return <Loader text={'Laster personer...'} />;
  }
  return (
    <>
      <ResultList personer={personsoekResultat.personer} />
      <p>Antall treff totalt: {personsoekResultat.antallTreffTotalt}</p>
    </>
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
            <Loader text={'Laster personer...'} />
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
      {personer.map(({ fnr }) => (
        <tr key={fnr}>
          <td>{fnr}</td>
          <td>
            <Knapp>Se saker</Knapp>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

interface LoaderProps {
  text: string;
}

const Loader: React.FC<LoaderProps> = ({ text }) => (
  <div>
    <NavFrontendSpinner />
    <span>{text}</span>
  </div>
);
