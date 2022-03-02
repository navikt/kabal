import React from 'react';
import 'nav-frontend-tabell-style';
import { IOppgaveList } from '../../types/oppgaver';
import { Loader } from '../loader/loader';
import { Row } from './row';

interface OppgaveRaderProps {
  oppgaver?: IOppgaveList;
  columnCount: number;
  isFetching: boolean;
}

export const OppgaveRader = ({ oppgaver, columnCount, isFetching }: OppgaveRaderProps): JSX.Element => {
  if (typeof oppgaver === 'undefined') {
    return (
      <tbody data-testid="oppgave-table-loading" data-isfetching="false">
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
      <tbody data-testid="oppgave-table-none" data-isfetching="false">
        <tr>
          <td colSpan={columnCount}>Ingen oppgaver</td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody data-testid="oppgave-table-rows" data-isfetching={isFetching.toString()}>
      {oppgaver.map((k) => (
        <Row {...k} key={k.id} />
      ))}
    </tbody>
  );
};
