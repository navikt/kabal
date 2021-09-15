import React from 'react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import 'nav-frontend-tabell-style';
import { IKlagebehandling, LoadKlagebehandlingerParams, useGetKlagebehandlingerQuery } from '../../redux-api/oppgaver';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { TableHeader } from './header';
import { Row } from './row';
import { SCTableContainer, StyledTable, StyledCaption } from './styled-components';

const MAX_OPPGAVER = 100;

export const MineOppgaverTable: React.FC = () => {
  const { data: bruker } = useGetBrukerQuery();

  const queryParams: typeof skipToken | LoadKlagebehandlingerParams =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          start: 0,
          antall: MAX_OPPGAVER,
          sortering: 'FRIST',
          rekkefoelge: 'STIGENDE',
          erTildeltSaksbehandler: true,
          temaer: [],
          typer: [],
          hjemler: [],
          navIdent: bruker.onPremisesSamAccountName,
          tildeltSaksbehandler: bruker.onPremisesSamAccountName,
          projeksjon: 'UTVIDET',
        };

  const { data: oppgaver } = useGetKlagebehandlingerQuery(queryParams, {
    pollingInterval: 30 * 1000,
  });

  const doneQueryParams: typeof skipToken | LoadKlagebehandlingerParams =
    queryParams === skipToken ? skipToken : { ...queryParams, ferdigstiltFom: new Date().toISOString().split('T')[0] };

  const { data: doneOppgaver } = useGetKlagebehandlingerQuery(doneQueryParams, {
    pollingInterval: 180 * 1000,
  });

  const oppgaverHeaderTitles: string[] = ['Type', 'Tema', 'Hjemmel', 'Navn', 'Fnr.', 'Frist', '', ''];
  const doneOppgaverHeaderTitles: string[] = ['Type', 'Tema', 'Hjemmel', 'Navn', 'Fnr.', 'Fullført', 'Utfall'];

  return (
    <SCTableContainer>
      <StyledTable className="tabell tabell--stripet">
        <TableHeader headers={oppgaverHeaderTitles} />
        <OppgaveRader oppgaver={oppgaver?.klagebehandlinger} columnCount={oppgaverHeaderTitles.length} />
      </StyledTable>
      <StyledTable className="tabell tabell--stripet">
        <StyledCaption>Fullførte oppgaver siste 7 dager</StyledCaption>
        <TableHeader headers={doneOppgaverHeaderTitles} />
        <OppgaveRader oppgaver={doneOppgaver?.klagebehandlinger} columnCount={doneOppgaverHeaderTitles.length} />
      </StyledTable>
    </SCTableContainer>
  );
};

interface OppgaveRaderProps {
  oppgaver?: IKlagebehandling[];
  columnCount: number;
}

const OppgaveRader: React.FC<OppgaveRaderProps> = ({ oppgaver, columnCount }) => {
  if (typeof oppgaver === 'undefined') {
    return (
      <tbody>
        <tr>
          <td colSpan={columnCount}>
            <Loader text={'Laster oppgaver...'} />
          </td>
        </tr>
      </tbody>
    );
  }
  if (oppgaver.length === 0) {
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
      {oppgaver.map((k) => (
        <Row {...k} key={k.id} />
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
