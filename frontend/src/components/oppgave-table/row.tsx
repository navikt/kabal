import React from 'react';
import { IKlagebehandling } from '../../redux-api/oppgaver';
import { Age } from '../common-table-components/age';
import { Deadline } from '../common-table-components/deadline';
import { Hjemmel } from '../common-table-components/hjemmel';
import { Tema } from '../common-table-components/tema';
import { TildelKlagebehandlingButton } from '../common-table-components/tildel-button';
import { Type } from '../common-table-components/type';

export const Row = ({ id, type, tema, hjemmel, frist, ageKA }: IKlagebehandling): JSX.Element => (
  <tr data-testid="oppgave-table-row" data-klagebehandlingid={id}>
    <td>
      <Type type={type} />
    </td>
    <td>
      <Tema tema={tema} />
    </td>
    <td>
      <Hjemmel hjemmel={hjemmel} />
    </td>
    <td>
      <Age age={ageKA} />
    </td>
    <td>
      <Deadline age={ageKA} frist={frist} />
    </td>
    <td>
      <TildelKlagebehandlingButton klagebehandlingId={id} tema={tema} />
    </td>
  </tr>
);
