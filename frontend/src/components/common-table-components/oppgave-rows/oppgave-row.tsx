/* eslint-disable max-lines */
import { Table } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { FradelingReason } from '@app/components/common-table-components/fradeling-reason';
import { Medunderskriver } from '@app/components/common-table-components/medunderskriver';
import { Name } from '@app/components/common-table-components/name';
import { Rol } from '@app/components/common-table-components/rol';
import { RolTildeling } from '@app/components/common-table-components/rol-tildeling';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { CopyButton } from '@app/components/copy-button/copy-button';
import { Feilregistrering } from '@app/components/feilregistrering/feilregistrering';
// See relevant-oppgaver.tsx for more information about this dependency cycle
// eslint-disable-next-line import/no-cycle
import { RelevantOppgaver } from '@app/components/relevant-oppgaver/relevant-oppgaver';
import { isoDateToPretty } from '@app/domain/date';
import { useGetOppgaveQuery } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { IOppgave } from '@app/types/oppgaver';
import { Oppgavestyring } from '../../oppgavestyring/oppgavestyring';
import { Type } from '../../type/type';
import { Age } from '../age';
import { Deadline, ReadOnlyDeadline } from '../deadline';
import { Innsendingshjemler, Registreringshjemler } from '../hjemler';
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
  // eslint-disable-next-line complexity
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
            <Innsendingshjemler hjemmelIdList={oppgave.hjemmelIdList} />
          </Table.DataCell>
        );
      case ColumnKeyEnum.Registreringshjemler:
        return (
          <Table.DataCell key={key}>
            <Registreringshjemler hjemmelIdList={oppgave.registreringshjemmelIdList} />
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
            <ReadOnlyDeadline frist={oppgave.varsletFrist} />
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
            <FlowStateContainer>
              <MedudunderskriverFlowStateLabel typeId={oppgave.typeId} medunderskriver={oppgave.medunderskriver} />
              {oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE ? (
                <RolFlowStateLabel rol={oppgave.rol} />
              ) : null}
            </FlowStateContainer>
          </Table.DataCell>
        );
      case ColumnKeyEnum.Rol:
        return (
          <Table.DataCell key={key}>
            <Rol oppgaveId={oppgave.id} rolIdent={oppgave.rol.employee?.navIdent ?? null} />
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
              medunderskriverident={oppgave.medunderskriver.employee?.navIdent ?? null}
              rol={oppgave.rol}
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
              fagsystemId={oppgave.fagsystemId}
              tildeltSaksbehandlerident={oppgave.tildeltSaksbehandlerident}
              variant="secondary-neutral"
              $position="below"
              $align="right"
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
      case ColumnKeyEnum.PreviousSaksbehandler:
        if (oppgave.previousSaksbehandler === null) {
          return <Table.DataCell key={key} />;
        }

        return (
          <Table.DataCell key={key}>
            {oppgave.previousSaksbehandler.navn} ({oppgave.previousSaksbehandler.navIdent})
          </Table.DataCell>
        );
      case ColumnKeyEnum.DatoSendtTilTr:
        if (oppgave.datoSendtTilTR === null) {
          return <Table.DataCell key={key} />;
        }

        return (
          <Table.DataCell key={key}>
            <time dateTime={oppgave.datoSendtTilTR}>{isoDateToPretty(oppgave.datoSendtTilTR)}</time>
          </Table.DataCell>
        );
    }

    return <Table.DataCell key={key} />;
  });

const FlowStateContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--a-spacing-2);
`;
