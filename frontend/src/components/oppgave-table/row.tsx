import React from 'react';
import { IKlagebehandling } from '../../redux-api/oppgaver';
import { Age } from '../common-table-components/age';
import { Deadline } from '../common-table-components/deadline';
import { Hjemmel } from '../common-table-components/hjemmel';
import { TildelKlagebehandlingButton } from '../common-table-components/tildel-button';
import { Type } from '../common-table-components/type';
import { Ytelse } from '../common-table-components/ytelse';

export const Row = ({ id, type, ytelse, hjemmel, frist, ageKA }: IKlagebehandling): JSX.Element => (
  <tr data-testid="oppgave-table-row" data-klagebehandlingid={id}>
    <td>
      <Type type={type} />
    </td>
    <td>
      <Ytelse ytelseId={ytelse} />
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
      <TildelKlagebehandlingButton klagebehandlingId={id} ytelse={ytelse} />
    </td>
  </tr>
);
