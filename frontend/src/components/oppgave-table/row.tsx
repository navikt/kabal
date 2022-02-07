import React from 'react';
import { IOppgave } from '../../types/oppgaver';
import { Age } from '../common-table-components/age';
import { Deadline } from '../common-table-components/deadline';
import { Hjemmel } from '../common-table-components/hjemmel';
import { TildelKlagebehandlingButton } from '../common-table-components/tildel-button';
import { Ytelse } from '../common-table-components/ytelse';
import { Type } from '../type/type';

export const Row = ({ id, type, ytelse, hjemmel, frist, ageKA }: IOppgave): JSX.Element => (
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
