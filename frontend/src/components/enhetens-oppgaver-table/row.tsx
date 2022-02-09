import React from 'react';
import { IOppgave } from '../../types/oppgaver';
import { Age } from '../common-table-components/age';
import { Deadline } from '../common-table-components/deadline';
import { FradelKlagebehandlingButton } from '../common-table-components/fradel-button';
import { Hjemmel } from '../common-table-components/hjemmel';
import { MedudunderskriverflytLabel } from '../common-table-components/medunderskriverflyt-label';
import { OpenOppgavebehandling } from '../common-table-components/open';
import { Ytelse } from '../common-table-components/ytelse';
import { Type } from '../type/type';

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
  erMedunderskriver,
  medunderskriverFlyt,
}: IOppgave): JSX.Element => (
  <tr data-testid="enhetens-oppgaver-table-row" data-klagebehandlingid={id}>
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
    <td>{tildeltSaksbehandlerNavn}</td>
    <td>
      <MedudunderskriverflytLabel
        erMedunderskriver={erMedunderskriver}
        harMedunderskriver={harMedunderskriver}
        medunderskriverFlyt={medunderskriverFlyt}
      />
    </td>
    <td>
      <OpenOppgavebehandling oppgavebehandlingId={id} ytelse={ytelse} type={type} />
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
