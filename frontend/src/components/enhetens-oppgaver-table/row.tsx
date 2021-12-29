import React from 'react';
import { IOppgave } from '../../redux-api/oppgaver-types';
import { LabelMedunderskriver } from '../../styled-components/labels';
import { Age } from '../common-table-components/age';
import { Deadline } from '../common-table-components/deadline';
import { FradelKlagebehandlingButton } from '../common-table-components/fradel-button';
import { Hjemmel } from '../common-table-components/hjemmel';
import { OpenKlagebehandling } from '../common-table-components/open';
import { Type } from '../common-table-components/type';
import { Ytelse } from '../common-table-components/ytelse';

export const Row = ({
  id,
  type,
  ytelse,
  hjemmel,
  frist,
  ageKA,
  tildeltSaksbehandlerNavn,
  harMedunderskriver,
  isAvsluttetAvSaksbehandler,
  tildeltSaksbehandlerident,
}: IOppgave): JSX.Element => (
  <tr data-testid="enhetens=oppgaver-table-row" data-klagebehandlingid={id}>
    <td>
      <Type type={type} />
    </td>
    <td>
      <Ytelse ytelseId={ytelse} type={type} />
    </td>
    <td>
      <Hjemmel hjemmel={hjemmel} type={type} />
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
      <OpenKlagebehandling klagebehandlingId={id} ytelse={ytelse} />
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
