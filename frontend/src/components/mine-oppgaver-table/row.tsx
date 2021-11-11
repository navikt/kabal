import React from 'react';
import { formatSakenGjelder } from '../../functions/format-id';
import { IKlagebehandling } from '../../redux-api/oppgaver';
import { Age } from '../common-table-components/age';
import { Deadline } from '../common-table-components/deadline';
import { FradelKlagebehandlingButton } from '../common-table-components/fradel-button';
import { Hjemmel } from '../common-table-components/hjemmel';
import { OpenKlagebehandling } from '../common-table-components/open';
import { Tema } from '../common-table-components/tema';
import { Type } from '../common-table-components/type';
import { MedudunderskriverflytLabel } from './medunderskrivflyt-label';

export const Row = ({
  id,
  type,
  tema,
  hjemmel,
  frist,
  person,
  ageKA,
  medunderskriverFlyt,
  erMedunderskriver,
  harMedunderskriver,
  isAvsluttetAvSaksbehandler,
  tildeltSaksbehandlerident,
}: IKlagebehandling): JSX.Element => (
  <tr data-testid="mine-oppgaver-row" data-klagebehandlingid={id}>
    <td>
      <Type type={type} />
    </td>
    <td>
      <Tema tema={tema} />
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
      <OpenKlagebehandling klagebehandlingId={id} tema={tema} />
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
