import { Table } from '@navikt/ds-react';
import React from 'react';
import { Name } from '@app/components/common-table-components/name';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { CopyButton } from '@app/components/copy-button/copy-button';
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
import { MedudunderskriverFlowStateLabel } from '../medunderskriver-flow-state-label';
import { OpenOppgavebehandling } from '../open';
import { PaaVentReason, PaaVentTil } from '../paa-vent';
import { RolFlowStateLabel } from '../rol-flow-state-label';
import { SakenGjelderFnr, SakenGjelderName } from '../saken-gjelder';
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
            <Type type={oppgave.typeId} size="medium" />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Ytelse:
        return (
          <Table.DataCell key={key}>
            <Ytelse ytelseId={oppgave.ytelseId} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Hjemmel:
      case ColumnKeyEnum.EnhetHjemmel:
        return (
          <Table.DataCell key={key}>
            <Hjemmel hjemmel={oppgave.hjemmelId} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Navn:
        return (
          <Table.DataCell key={key}>
            <SakenGjelderName oppgaveId={oppgave.id} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Fnr:
        return (
          <Table.DataCell key={key}>
            <SakenGjelderFnr oppgaveId={oppgave.id} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Age:
        return (
          <Table.DataCell key={key}>
            <Age {...oppgave} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Deadline:
        return (
          <Table.DataCell key={key}>
            <Deadline {...oppgave} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.MedunderskriverFlowState:
        return (
          <Table.DataCell key={key}>
            <MedudunderskriverFlowStateLabel typeId={oppgave.typeId} medunderskriver={oppgave.medunderskriver} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.RolFlowState:
        return (
          <Table.DataCell key={key}>
            <RolFlowStateLabel rol={oppgave.rol} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Open:
        return (
          <Table.DataCell key={key}>
            <OpenOppgavebehandling
              id={oppgave.id}
              ytelseId={oppgave.ytelseId}
              typeId={oppgave.typeId}
              tildeltSaksbehandlerident={oppgave.tildeltSaksbehandlerident}
              medunderskriverident={oppgave.medunderskriver.navIdent}
              rolIdent={oppgave.rol.navIdent}
            />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Oppgavestyring:
      case ColumnKeyEnum.OppgavestyringNonFilterable:
        return (
          <Table.DataCell key={key}>
            <Oppgavestyring {...oppgave} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.TildelingWithFilter:
      case ColumnKeyEnum.Tildeling:
        return (
          <Table.DataCell key={key}>
            <Name navIdent={oppgave.tildeltSaksbehandlerident} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Utfall:
        return (
          <Table.DataCell key={key}>
            <Utfall utfallId={oppgave.utfallId} />
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
      case ColumnKeyEnum.Saksnummer:
        return (
          <Table.DataCell key={key}>
            <CopyButton text={oppgave.saksnummer} />
          </Table.DataCell>
        );
      default:
        return <Table.DataCell key={key} />;
    }
  });
