import { Table } from '@navikt/ds-react';
import React from 'react';
import { ColumnKeyEnum } from '@app/components/common-table-components/oppgave-rows/types';
import { Feilregistrering } from '@app/components/feilregistrering/feilregistrering';
import { isoDateToPretty } from '@app/domain/date';
import { useGetOppgaveQuery } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { IOppgave } from '@app/types/oppgaver';
import { Oppgavestyring } from '../../oppgavestyring/oppgavestyring';
import { Type } from '../../type/type';
import { Age } from '../age';
import { Deadline } from '../deadline';
import { Hjemmel } from '../hjemmel';
import { LoadingRow } from '../loading-row';
import { MedudunderskriverflytLabel } from '../medunderskriverflyt-label';
import { OpenOppgavebehandling } from '../open';
import { PaaVentReason, PaaVentTil } from '../paa-vent';
import { Fnr, Name } from '../person';
import { Utfall } from '../utfall';
import { Ytelse } from '../ytelse';

interface Props {
  oppgaveId: string;
  columns: ColumnKeyEnum[];
  testId: string;
}

export const OppgaveRow = ({ oppgaveId, columns, testId }: Props): JSX.Element => {
  const { data: oppgave, isLoading } = useGetOppgaveQuery(oppgaveId, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (isLoading || typeof oppgave === 'undefined') {
    return <LoadingRow columnCount={columns.length} testId={testId} behandlingid={oppgaveId} />;
  }

  return (
    <Table.Row data-testid={testId} data-behandlingid={oppgaveId} data-state="ready">
      {getColumns(columns, oppgave)}
    </Table.Row>
  );
};

const getColumns = (columnKeys: ColumnKeyEnum[], oppgave: IOppgave) =>
  columnKeys.map((key) => {
    switch (key) {
      case ColumnKeyEnum.Type:
        return (
          <Table.DataCell key={key}>
            <Type type={oppgave.type} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Ytelse:
        return (
          <Table.DataCell key={key}>
            <Ytelse ytelseId={oppgave.ytelse} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Hjemmel:
        return (
          <Table.DataCell key={key}>
            <Hjemmel hjemmel={oppgave.hjemmel} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Navn:
        return (
          <Table.DataCell key={key}>
            <Name oppgaveId={oppgave.id} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Fnr:
        return (
          <Table.DataCell key={key}>
            <Fnr oppgaveId={oppgave.id} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Age:
        return (
          <Table.DataCell key={key}>
            <Age age={oppgave.ageKA} mottattDate={oppgave.mottatt} oppgaveId={oppgave.id} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Deadline:
        return (
          <Table.DataCell key={key}>
            <Deadline frist={oppgave.frist} oppgaveId={oppgave.id} type={oppgave.type} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Medunderskriverflyt:
        return (
          <Table.DataCell key={key}>
            <MedudunderskriverflytLabel
              type={oppgave.type}
              medunderskriverFlyt={oppgave.medunderskriverFlyt}
              erMedunderskriver={oppgave.erMedunderskriver}
              harMedunderskriver={oppgave.harMedunderskriver}
            />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Open:
        return (
          <Table.DataCell key={key}>
            <OpenOppgavebehandling
              oppgavebehandlingId={oppgave.id}
              ytelse={oppgave.ytelse}
              type={oppgave.type}
              tildeltSaksbehandlerident={oppgave.tildeltSaksbehandlerident}
              medunderskriverident={oppgave.medunderskriverident}
            />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Oppgavestyring:
        return (
          <Table.DataCell key={key}>
            <Oppgavestyring {...oppgave} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Tildeling:
        return <Table.DataCell key={key}>{oppgave.tildeltSaksbehandlerNavn}</Table.DataCell>;
      case ColumnKeyEnum.Utfall:
        return (
          <Table.DataCell key={key}>
            <Utfall utfallId={oppgave.utfall} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.PaaVentTil:
        return (
          <Table.DataCell key={key}>
            <PaaVentTil sattPaaVent={oppgave.sattPaaVent} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.PaaVentReason:
        return (
          <Table.DataCell key={key}>
            <PaaVentReason sattPaaVent={oppgave.sattPaaVent} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Finished:
        return <Table.DataCell key={key}>{isoDateToPretty(oppgave.avsluttetAvSaksbehandlerDate)}</Table.DataCell>;
      case ColumnKeyEnum.Feilregistrering:
      case ColumnKeyEnum.Feilregistrert:
        return (
          <Table.DataCell key={key}>
            <Feilregistrering
              oppgaveId={oppgave.id}
              feilregistrert={oppgave.feilregistrert}
              fagsystemId={oppgave.fagsystemId}
              tildeltSaksbehandlerident={oppgave.tildeltSaksbehandlerident}
              variant="secondary-neutral"
              $position="below"
            />
          </Table.DataCell>
        );
      default:
        return <Table.DataCell key={key} />;
    }
  });
