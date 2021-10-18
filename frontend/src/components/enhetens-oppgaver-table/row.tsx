import React from 'react';
import { IKlagebehandling } from '../../redux-api/oppgaver';
import { LabelMedunderskriver } from '../../styled-components/labels';
import { Age } from '../common-table-components/age';
import { Deadline } from '../common-table-components/deadline';
import { FradelKlagebehandlingButton } from '../common-table-components/fradel-button';
import { Hjemmel } from '../common-table-components/hjemmel';
import { OpenKlagebehandling } from '../common-table-components/open';
import { Tema } from '../common-table-components/tema';
import { Type } from '../common-table-components/type';

export const Row = ({
  id,
  type,
  tema,
  hjemmel,
  frist,
  ageKA,
  tildeltSaksbehandlerNavn,
  harMedunderskriver,
  isAvsluttetAvSaksbehandler,
  tildeltSaksbehandlerident,
}: IKlagebehandling): JSX.Element => (
  <tr data-testid="enhetens=oppgaver-table-row" data-klagebehandlingid={id}>
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
    <td>{tildeltSaksbehandlerNavn}</td>
    <td>{harMedunderskriver ? <LabelMedunderskriver>Sendt til medunderskriver</LabelMedunderskriver> : ''}</td>
    <td>
      <OpenKlagebehandling klagebehandlingId={id} tema={tema} />
    </td>
    <td>
      <FradelKlagebehandlingButton
        klagebehandlingId={id}
        tildeltSaksbehandlerident={tildeltSaksbehandlerident}
        isAvsluttetAvSaksbehandler={isAvsluttetAvSaksbehandler}
      />
    </td>
  </tr>
);
