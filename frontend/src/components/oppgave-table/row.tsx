import { Table } from '@navikt/ds-react';
import React from 'react';
import { IOppgave } from '../../types/oppgaver';
import { Age } from '../common-table-components/age';
import { Deadline } from '../common-table-components/deadline';
import { Hjemmel } from '../common-table-components/hjemmel';
import { TildelKlagebehandlingButton } from '../common-table-components/tildel-button';
import { Ytelse } from '../common-table-components/ytelse';
import { Type } from '../type/type';

export const Row = ({ id, type, ytelse, hjemmel, frist, ageKA }: IOppgave): JSX.Element => (
  <Table.Row data-testid="oppgave-table-row" data-klagebehandlingid={id}>
    <Table.DataCell>
      <Type type={type} />
    </Table.DataCell>
    <Table.DataCell>
      <Ytelse ytelseId={ytelse} />
    </Table.DataCell>
    <Table.DataCell>
      <Hjemmel hjemmel={hjemmel} />
    </Table.DataCell>
    <Table.DataCell>
      <Age age={ageKA} />
    </Table.DataCell>
    <Table.DataCell>
      <Deadline age={ageKA} frist={frist} />
    </Table.DataCell>
    <Table.DataCell>
      <TildelKlagebehandlingButton klagebehandlingId={id} ytelse={ytelse} />
    </Table.DataCell>
  </Table.Row>
);
