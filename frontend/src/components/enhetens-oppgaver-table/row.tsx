import { Table } from '@navikt/ds-react';
import React from 'react';
import { IOppgave } from '@app/types/oppgaver';
import { Age } from '../common-table-components/age';
import { Deadline } from '../common-table-components/deadline';
import { Hjemmel } from '../common-table-components/hjemmel';
import { MedudunderskriverflytLabel } from '../common-table-components/medunderskriverflyt-label';
import { OpenOppgavebehandling } from '../common-table-components/open';
import { Ytelse } from '../common-table-components/ytelse';
import { Oppgavestyring } from '../oppgavestyring/oppgavestyring';
import { Type } from '../type/type';

export const Row = (oppgave: IOppgave): JSX.Element => (
  <Table.Row data-testid="enhetens-oppgaver-table-row" data-klagebehandlingid={oppgave.id}>
    <Table.DataCell>
      <Type type={oppgave.type} />
    </Table.DataCell>
    <Table.DataCell>
      <Ytelse ytelseId={oppgave.ytelse} />
    </Table.DataCell>
    <Table.DataCell>
      <Hjemmel hjemmel={oppgave.hjemmel} />
    </Table.DataCell>
    <Table.DataCell>
      <Age age={oppgave.ageKA} mottattDate={oppgave.mottatt} oppgaveId={oppgave.id} />
    </Table.DataCell>
    <Table.DataCell>
      <Deadline age={oppgave.ageKA} frist={oppgave.frist} oppgaveId={oppgave.id} type={oppgave.type} />
    </Table.DataCell>
    <Table.DataCell>
      <MedudunderskriverflytLabel
        type={oppgave.type}
        erMedunderskriver={oppgave.erMedunderskriver}
        harMedunderskriver={oppgave.harMedunderskriver}
        medunderskriverFlyt={oppgave.medunderskriverFlyt}
      />
    </Table.DataCell>
    <Table.DataCell>
      <OpenOppgavebehandling
        oppgavebehandlingId={oppgave.id}
        ytelse={oppgave.ytelse}
        type={oppgave.type}
        tildeltSaksbehandlerident={oppgave.tildeltSaksbehandlerident}
        medunderskriverident={oppgave.medunderskriverident}
      />
    </Table.DataCell>
    <Table.DataCell>
      <Oppgavestyring {...oppgave} />
    </Table.DataCell>
  </Table.Row>
);
