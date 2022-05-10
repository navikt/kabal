import { Loader } from '@navikt/ds-react';
import React from 'react';
import { IOppgaveList } from '../../types/oppgaver';
import { Row } from './row';

interface OppgaveRaderProps {
  oppgaver?: IOppgaveList;
  columnCount: number;
  isFetching: boolean;
}

export const OppgaveRader = ({ oppgaver, columnCount, isFetching }: OppgaveRaderProps): JSX.Element => {
  if (typeof oppgaver === 'undefined') {
    return (
      <tbody data-testid="mine-oppgaver-table-loading" data-isfetching="false">
        <tr>
          <td colSpan={columnCount}>
            <Loader size="xlarge" title="Laster oppgaver..." />
          </td>
        </tr>
      </tbody>
    );
  }

  if (oppgaver.length === 0) {
    return (
      <tbody data-testid="mine-oppgaver-table-none" data-isfetching="false">
        <tr>
          <td colSpan={columnCount}>Ingen oppgaver i liste</td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody data-testid="mine-oppgaver-table-rows" data-isfetching={isFetching.toString()}>
      {oppgaver.map((k) => (
        <Row {...k} key={k.id} />
      ))}
    </tbody>
  );
};
