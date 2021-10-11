import React from 'react';
import 'nav-frontend-tabell-style';
import { MedunderskriverFlyt } from '../../redux-api/oppgave-state-types';
import { IKlagebehandling } from '../../redux-api/oppgaver';
import { Loader } from '../loader/loader';
import { Row } from './row';

interface OppgaveRaderProps {
  oppgaver?: IKlagebehandling[];
  columnCount: number;
  showOnlyMedunderskriver: boolean;
}

export const OppgaveRader = ({ oppgaver, columnCount, showOnlyMedunderskriver }: OppgaveRaderProps): JSX.Element => {
  if (typeof oppgaver === 'undefined') {
    return (
      <tbody>
        <tr>
          <td colSpan={columnCount}>
            <Loader>Laster oppgaver...</Loader>
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

  if (showOnlyMedunderskriver) {
    return (
      <tbody>
        {oppgaver
          .filter(
            (oppgave) =>
              oppgave.erMedunderskriver &&
              oppgave.medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER
          )
          .map((k) => (
            <Row {...k} key={k.id} />
          ))}
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
