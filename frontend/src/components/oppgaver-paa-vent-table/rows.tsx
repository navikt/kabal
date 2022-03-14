import React from 'react';
import { IOppgaveList } from '../../types/oppgaver';
import { Loader } from '../loader/loader';
import { Row } from './row';

interface OppgaveRaderProps {
  oppgaver?: IOppgaveList;
  columnCount: number;
  isLoading: boolean;
  isError: boolean;
}

export const OppgaveRader = ({ oppgaver, columnCount, isLoading, isError }: OppgaveRaderProps): JSX.Element => {
  if (isError) {
    return (
      <tbody data-testid="mine-oppgaver-table-error">
        <tr>
          <td colSpan={columnCount}>Kunne ikke laste oppgaver.</td>
        </tr>
      </tbody>
    );
  }

  if (isLoading || typeof oppgaver === 'undefined') {
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
