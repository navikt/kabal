import { Age } from '@app/components/common-table-components/age';
import { Deadline, ReadOnlyDeadline } from '@app/components/common-table-components/deadline';
import { FradelingReason } from '@app/components/common-table-components/fradeling-reason';
import { LoadingCellContent } from '@app/components/common-table-components/loading-cell-content';
import { LoadingRow } from '@app/components/common-table-components/loading-row';
import { Medunderskriver } from '@app/components/common-table-components/medunderskriver';
import { MedudunderskriverFlowStateLabel } from '@app/components/common-table-components/medunderskriver-flow-state-label';
import { Name } from '@app/components/common-table-components/name';
import { OpenOppgavebehandling } from '@app/components/common-table-components/open';
import { PaaVentReason, PaaVentTil } from '@app/components/common-table-components/paa-vent';
import { Rol } from '@app/components/common-table-components/rol';
import { RolFlowStateLabel } from '@app/components/common-table-components/rol-flow-state-label';
import { RolTildeling } from '@app/components/common-table-components/rol-tildeling';
import { SakenGjelderFnr, SakenGjelderName } from '@app/components/common-table-components/saken-gjelder';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { Utfall } from '@app/components/common-table-components/utfall';
import { Ytelse } from '@app/components/common-table-components/ytelse';
import { CopyButton } from '@app/components/copy-button/copy-button';
import { Feilregistrering } from '@app/components/feilregistrering/feilregistrering';
import { Innsendingshjemler, Registreringshjemler } from '@app/components/hjemler/hjemler';
import { Oppgavestyring } from '@app/components/oppgavestyring/oppgavestyring';
// See relevant-oppgaver.tsx for more information about this dependency cycle
import { RelevantOppgaver } from '@app/components/relevant-oppgaver/relevant-oppgaver';
import { Type } from '@app/components/type/type';
import { isoDateToPretty } from '@app/domain/date';
import { useGetOppgaveQuery } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { FlowState } from '@app/types/oppgave-common';
import type { IOppgave } from '@app/types/oppgaver';
import { HStack, Table } from '@navikt/ds-react';

interface Props {
  oppgaveId: string;
  columns: ColumnKeyEnum[];
  testId: string;
}

export const OppgaveRow = ({ oppgaveId, columns, testId }: Props): React.JSX.Element => {
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
      case ColumnKeyEnum.TypeWithAnkeITrygderetten:
        return (
          <Table.DataCell key={key}>
            <Type type={oppgave.typeId} size="medium" />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Ytelse:
      case ColumnKeyEnum.RolYtelse:
        return (
          <Table.DataCell key={key}>
            <Ytelse ytelseId={oppgave.ytelseId} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Innsendingshjemler:
      case ColumnKeyEnum.RolInnsendingshjemler:
      case ColumnKeyEnum.EnhetInnsendingshjemler:
        return (
          <Table.DataCell key={key}>
            <Innsendingshjemler hjemmelIdList={oppgave.hjemmelIdList} loading={<LoadingCellContent />} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Registreringshjemler:
        return (
          <Table.DataCell key={key}>
            <Registreringshjemler hjemmelIdList={oppgave.registreringshjemmelIdList} loading={<LoadingCellContent />} />
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
      case ColumnKeyEnum.VarsletFrist:
        return (
          <Table.DataCell key={key}>
            <ReadOnlyDeadline frist={oppgave.varsletFrist} timesPreviouslyExtended={oppgave.timesPreviouslyExtended} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Medunderskriver:
        return (
          <Table.DataCell key={key}>
            <Medunderskriver
              oppgaveId={oppgave.id}
              medunderskriverIdent={oppgave.medunderskriver.employee?.navIdent ?? null}
            />
          </Table.DataCell>
        );
      case ColumnKeyEnum.FlowStates:
        return (
          <Table.DataCell key={key}>
            <HStack wrap gap="2">
              <MedudunderskriverFlowStateLabel typeId={oppgave.typeId} medunderskriver={oppgave.medunderskriver} />
              <RolFlowStateLabel rol={oppgave.rol} />
            </HStack>
          </Table.DataCell>
        );
      case ColumnKeyEnum.Rol:
        return (
          <Table.DataCell key={key}>
            <Rol oppgaveId={oppgave.id} rolIdent={oppgave.rol.employee?.navIdent ?? null} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Open:
      case ColumnKeyEnum.OpenWithYtelseAccess:
        return (
          <Table.DataCell key={key}>
            <OpenOppgavebehandling
              id={oppgave.id}
              ytelseId={oppgave.ytelseId}
              typeId={oppgave.typeId}
              tildeltSaksbehandlerident={oppgave.tildeltSaksbehandlerident}
              medunderskriverident={oppgave.medunderskriver.employee?.navIdent ?? null}
              rol={oppgave.rol}
              applyYtelseAccess={key === ColumnKeyEnum.OpenWithYtelseAccess}
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
      case ColumnKeyEnum.Returnert:
        return (
          <Table.DataCell key={key}>
            {oppgave.rol.flowState === FlowState.RETURNED ? isoDateToPretty(oppgave.rol.returnertDate) : null}
          </Table.DataCell>
        );
      case ColumnKeyEnum.Feilregistrering:
      case ColumnKeyEnum.Feilregistrert:
        return (
          <Table.DataCell key={key}>
            <Feilregistrering
              oppgaveId={oppgave.id}
              feilregistrert={oppgave.feilregistrert}
              tildeltSaksbehandlerident={oppgave.tildeltSaksbehandlerident}
              variant="secondary-neutral"
              position="below"
              align="right"
            />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Saksnummer:
        return (
          <Table.DataCell key={key}>
            <CopyButton text={oppgave.saksnummer} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.RolTildeling:
        return (
          <Table.DataCell key={key}>
            <RolTildeling oppgave={oppgave} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.RelevantOppgaver:
        return (
          <Table.DataCell key={key}>
            <RelevantOppgaver oppgaveId={oppgave.id} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.FradelingReason:
        return (
          <Table.DataCell key={key}>
            <FradelingReason oppgaveId={oppgave.id} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.PreviousSaksbehandler: {
        if (oppgave.previousSaksbehandler === null) {
          return <Table.DataCell key={key} />;
        }

        return (
          <Table.DataCell key={key}>
            {oppgave.previousSaksbehandler.navn} ({oppgave.previousSaksbehandler.navIdent})
          </Table.DataCell>
        );
      }
      case ColumnKeyEnum.DatoSendtTilTr: {
        if (oppgave.datoSendtTilTR === null) {
          return <Table.DataCell key={key} />;
        }

        return (
          <Table.DataCell key={key}>
            <time dateTime={oppgave.datoSendtTilTR}>{isoDateToPretty(oppgave.datoSendtTilTR)}</time>
          </Table.DataCell>
        );
      }
    }

    return <Table.DataCell key={key} />;
  });
