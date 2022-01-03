import React from 'react';
import { formatSakenGjelder } from '../../functions/format-id';
import { IOppgave } from '../../types/oppgaver';
import { Age } from '../common-table-components/age';
import { Deadline } from '../common-table-components/deadline';
import { FradelKlagebehandlingButton } from '../common-table-components/fradel-button';
import { Hjemmel } from '../common-table-components/hjemmel';
import { OpenKlagebehandling } from '../common-table-components/open';
import { Type } from '../common-table-components/type';
import { Ytelse } from '../common-table-components/ytelse';
import { MedudunderskriverflytLabel } from './medunderskrivflyt-label';

export const Row = ({
  id,
  type,
  hjemmel,
  frist,
  person,
  ageKA,
  medunderskriverFlyt,
  erMedunderskriver,
  harMedunderskriver,
  isAvsluttetAvSaksbehandler,
  tildeltSaksbehandlerident,
  ytelse,
}: IOppgave): JSX.Element => (
  <tr data-testid="mine-oppgaver-row" data-klagebehandlingid={id}>
    <td>
      <Type type={type} />
    </td>
    <td>
      <Ytelse ytelseId={ytelse} />
    </td>
    <td>
      <Hjemmel hjemmel={hjemmel} />
    </td>
    <td>{person?.navn}</td>
    <td>{formatSakenGjelder(person?.fnr)}</td>
    <td>
      <Age age={ageKA} />
    </td>
    <td>
      <Deadline age={ageKA} frist={frist} />
    </td>
    <td>
      <MedudunderskriverflytLabel
        medunderskriverflyt={medunderskriverFlyt}
        erMedunderskriver={erMedunderskriver}
        harMedunderskriver={harMedunderskriver}
      />
    </td>
    <td>
      <OpenKlagebehandling klagebehandlingId={id} ytelse={ytelse} />
    </td>
    <td>
      <FradelKlagebehandlingButton
        klagebehandlingId={id}
        isAvsluttetAvSaksbehandler={isAvsluttetAvSaksbehandler}
        tildeltSaksbehandlerident={tildeltSaksbehandlerident}
      />
    </td>
  </tr>
);
