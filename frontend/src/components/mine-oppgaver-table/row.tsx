import React from 'react';
import { IOppgave } from '../../types/oppgaver';
import { Age } from '../common-table-components/age';
import { Deadline } from '../common-table-components/deadline';
import { FradelKlagebehandlingButton } from '../common-table-components/fradel-button';
import { Hjemmel } from '../common-table-components/hjemmel';
import { MedudunderskriverflytLabel } from '../common-table-components/medunderskriverflyt-label';
import { OpenOppgavebehandling } from '../common-table-components/open';
import { Ytelse } from '../common-table-components/ytelse';
import { CopyFnrButton } from '../copy-button/copy-fnr-button';
import { Type } from '../type/type';

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
    <td>
      <CopyFnrButton fnr={person?.fnr} />
    </td>
    <td>
      <Age age={ageKA} />
    </td>
    <td>
      <Deadline age={ageKA} frist={frist} />
    </td>
    <td>
      <MedudunderskriverflytLabel
        type={type}
        medunderskriverFlyt={medunderskriverFlyt}
        erMedunderskriver={erMedunderskriver}
        harMedunderskriver={harMedunderskriver}
      />
    </td>
    <td>
      <OpenOppgavebehandling oppgavebehandlingId={id} ytelse={ytelse} type={type} />
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
