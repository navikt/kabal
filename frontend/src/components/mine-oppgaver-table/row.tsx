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
  ytelse,
}: IOppgave): JSX.Element => (
  <Table.Row data-testid="mine-oppgaver-row" data-klagebehandlingid={id}>
    <Table.DataCell>
      <Type type={type} />
    </Table.DataCell>
    <Table.DataCell>
      <Ytelse ytelseId={ytelse} />
    </Table.DataCell>
    <Table.DataCell>
      <Hjemmel hjemmel={hjemmel} />
    </Table.DataCell>
    <Table.DataCell>{person?.navn}</Table.DataCell>
    <Table.DataCell>
      <CopyFnrButton fnr={person?.fnr} />
    </Table.DataCell>
    <Table.DataCell>
      <Age age={ageKA} />
    </Table.DataCell>
    <Table.DataCell>
      <Deadline age={ageKA} frist={frist} />
    </Table.DataCell>
    <Table.DataCell>
      <MedudunderskriverflytLabel
        type={type}
        medunderskriverFlyt={medunderskriverFlyt}
        erMedunderskriver={erMedunderskriver}
        harMedunderskriver={harMedunderskriver}
      />
    </Table.DataCell>
    <Table.DataCell>
      <OpenOppgavebehandling oppgavebehandlingId={id} ytelse={ytelse} type={type} />
    </Table.DataCell>
    <Table.DataCell>
      <FradelKlagebehandlingButton klagebehandlingId={id} isAvsluttetAvSaksbehandler={isAvsluttetAvSaksbehandler} />
    </Table.DataCell>
  </Table.Row>
);
