import { Table } from '@navikt/ds-react';
import React from 'react';
import { IOppgave } from '../../types/oppgaver';
import { Age } from '../common-table-components/age';
import { Deadline } from '../common-table-components/deadline';
import { Hjemmel } from '../common-table-components/hjemmel';
import { Ytelse } from '../common-table-components/ytelse';
import { Oppgavestyring } from '../oppgavestyring/oppgavestyring';
import { Type } from '../type/type';

export const Row = (oppgave: IOppgave): JSX.Element => (
  <Table.Row data-testid="oppgave-table-row" data-klagebehandlingid={oppgave.id}>
    <Table.DataCell>
      <Type type={oppgave.type} />
    </Table.DataCell>
    <Table.DataCell>
      <Ytelse ytelseId={oppgave.ytelse} />
    </Table.DataCell>
    <Table.DataCell>
      <Hjemmel hjemmel={oppgave.hjemmel} />
    </Table.DataCell>
    <Table.DataCell>
      <Age age={oppgave.ageKA} />
    </Table.DataCell>
    <Table.DataCell>
      <Deadline age={oppgave.ageKA} frist={oppgave.frist} />
    </Table.DataCell>
    <Table.DataCell>
      <Oppgavestyring {...oppgave} />
    </Table.DataCell>
  </Table.Row>
);
