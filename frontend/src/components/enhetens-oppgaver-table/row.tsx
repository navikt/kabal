import { Table } from '@navikt/ds-react';
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
  <Table.Row data-testid="enhetens-oppgaver-table-row" data-klagebehandlingid={id}>
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
    <Table.DataCell>{tildeltSaksbehandlerNavn}</Table.DataCell>
    <Table.DataCell>
      <MedudunderskriverflytLabel
        type={type}
        erMedunderskriver={erMedunderskriver}
        harMedunderskriver={harMedunderskriver}
        medunderskriverFlyt={medunderskriverFlyt}
      />
    </Table.DataCell>
    <Table.DataCell>
      <OpenOppgavebehandling oppgavebehandlingId={id} ytelse={ytelse} type={type} />
    </Table.DataCell>
    <Table.DataCell>
      <FradelKlagebehandlingButton
        klagebehandlingId={id}
        tildeltSaksbehandlerident={tildeltSaksbehandlerident}
        isAvsluttetAvSaksbehandler={isAvsluttetAvSaksbehandler}
      />
    </Table.DataCell>
  </Table.Row>
);
