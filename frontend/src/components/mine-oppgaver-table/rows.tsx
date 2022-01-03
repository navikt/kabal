import React from 'react';
import 'nav-frontend-tabell-style';
import { IOppgaveList } from '../../types/oppgaver';
import { Loader } from '../loader/loader';
import { Row } from './row';

interface OppgaveRaderProps {
  oppgaver?: IOppgaveList;
  columnCount: number;
}

export const OppgaveRader = ({ oppgaver, columnCount }: OppgaveRaderProps): JSX.Element => {
  if (typeof oppgaver === 'undefined') {
    return (
      <tbody data-testid="mine-oppgaver-table-loading">
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
      <tbody data-testid="mine-oppgaver-table-none">
        <tr>
          <td colSpan={columnCount}>Ingen oppgaver i liste</td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody data-testid="mine-oppgaver-table-rows">
      {oppgaver.map((k) => (
        <Row {...k} key={k.id} />
      ))}
    </tbody>
  );
};
