import { HStack, InlineMessage, Table, Tag } from '@navikt/ds-react';
import { Age } from '@/components/common-table-components/age';
import { Deadline, ReadOnlyDeadline } from '@/components/common-table-components/deadline';
import { FradelingReason } from '@/components/common-table-components/fradeling-reason';
import { InnsendingshjemlerList, Registreringshjemler } from '@/components/common-table-components/hjemler';
import { LoadingRow } from '@/components/common-table-components/loading-row';
import { Medunderskriver } from '@/components/common-table-components/medunderskriver';
import {
  MUFlowStateLabelWithoutSelf,
  MUFlowStateLabelWithSelf,
} from '@/components/common-table-components/medunderskriver-flow-state-label';
import { Name } from '@/components/common-table-components/name';
import { OpenForRoleAccess, OpenForYtelseAccess } from '@/components/common-table-components/open';
import { PaaVentReason, PaaVentTil } from '@/components/common-table-components/paa-vent';
import { Rol } from '@/components/common-table-components/rol';
import { RolFlowStateLabel } from '@/components/common-table-components/rol-flow-state-label';
import { RolTildeling } from '@/components/common-table-components/rol-tildeling';
import { SakenGjelderFnr, SakenGjelderName } from '@/components/common-table-components/saken-gjelder';
import { ColumnKeyEnum } from '@/components/common-table-components/types';
import { Ytelse } from '@/components/common-table-components/ytelse';
import { CopyButton } from '@/components/copy-button/copy-button';
import { Feilregistrert } from '@/components/feilregistrering/feilregistrert';
import { Oppgavestyring } from '@/components/oppgavestyring/oppgavestyring';
// See relevant-oppgaver.tsx for more information about this dependency cycle
import { RelevantOppgaver } from '@/components/relevant-oppgaver/relevant-oppgaver';
import { Type } from '@/components/type/type';
import { UtfallTag } from '@/components/utfall-tag/utfall-tag';
import { isoDateToPretty } from '@/domain/date';
import { useGetOppgaveQuery } from '@/redux-api/oppgaver/queries/oppgave-data';
import { isApiDataError } from '@/types/errors';
import { FlowState } from '@/types/oppgave-common';
import type { IOppgave } from '@/types/oppgaver';

interface Props {
  oppgaveId: string;
  columns: ColumnKeyEnum[];
}

export const OppgaveRow = ({ oppgaveId, columns }: Props): React.JSX.Element => {
  const {
    data: oppgave,
    isLoading,
    error,
  } = useGetOppgaveQuery(oppgaveId, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (error !== undefined) {
    return (
      <Table.Row>
        <Table.DataCell colSpan={columns.length}>
          {isApiDataError(error) ? (
            <InlineMessage status="error" size="small">
              Kunne ikke laste oppgave: {error.data.title}
              {error.data.detail === undefined ? ' ' : ` (${error.data.detail}) `} - status: {error.data.status}
            </InlineMessage>
          ) : (
            <InlineMessage status="error" size="small">
              Kunne ikke laste oppgave. {`(${JSON.stringify(error)})`}
            </InlineMessage>
          )}
        </Table.DataCell>
      </Table.Row>
    );
  }

  if (isLoading || typeof oppgave === 'undefined') {
    return <LoadingRow columnCount={columns.length} behandlingid={oppgaveId} />;
  }

  return <Table.Row data-behandlingid={oppgaveId}>{getColumns(columns, oppgave)}</Table.Row>;
};

const getColumns = (columnKeys: ColumnKeyEnum[], oppgave: IOppgave) =>
  columnKeys.map((key) => {
    switch (key) {
      case ColumnKeyEnum.Type:
      case ColumnKeyEnum.TypeWithTrygderetten:
      case ColumnKeyEnum.TypeForSakerITR:
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
            <InnsendingshjemlerList hjemmelIdList={oppgave.hjemmelIdList} size="medium" />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Registreringshjemler:
        return (
          <Table.DataCell key={key}>
            <Registreringshjemler hjemmelIdList={oppgave.registreringshjemmelIdList} size="medium" />
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
      case ColumnKeyEnum.FlowStatesWithSelf:
        return (
          <Table.DataCell key={key}>
            <HStack wrap gap="space-8">
              <MUFlowStateLabelWithSelf typeId={oppgave.typeId} medunderskriver={oppgave.medunderskriver} />
              <RolFlowStateLabel rol={oppgave.rol} />
            </HStack>
          </Table.DataCell>
        );
      case ColumnKeyEnum.FlowStatesWithoutSelf:
        return (
          <Table.DataCell key={key}>
            <HStack wrap gap="space-8">
              <MUFlowStateLabelWithoutSelf typeId={oppgave.typeId} medunderskriver={oppgave.medunderskriver} />
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
            {key === ColumnKeyEnum.OpenWithYtelseAccess ? (
              <OpenForYtelseAccess id={oppgave.id} ytelseId={oppgave.ytelseId} />
            ) : (
              <OpenForRoleAccess
                id={oppgave.id}
                tildeltSaksbehandlerident={oppgave.tildeltSaksbehandlerident}
                medunderskriverident={oppgave.medunderskriver.employee?.navIdent ?? null}
                rol={oppgave.rol}
              />
            )}
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
            <UtfallTag utfallId={oppgave.utfallId} size="medium" className="whitespace-nowrap" />
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
      case ColumnKeyEnum.Feilregistrert:
        return (
          <Table.DataCell key={key}>
            <Feilregistrert feilregistrert={oppgave.feilregistrert} />
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
            <div className="flex flex-row gap-2">
              <span>{oppgave.previousSaksbehandler.navn}</span>

              <Tag variant="strong" data-color="neutral" size="small">
                {oppgave.previousSaksbehandler.navIdent}
              </Tag>
            </div>
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
