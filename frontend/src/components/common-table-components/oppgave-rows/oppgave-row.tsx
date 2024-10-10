import { FradelingReason } from '@app/components/common-table-components/fradeling-reason';
import { Medunderskriver } from '@app/components/common-table-components/medunderskriver';
import { Name } from '@app/components/common-table-components/name';
import { Rol } from '@app/components/common-table-components/rol';
import { RolTildeling } from '@app/components/common-table-components/rol-tildeling';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { CopyButton } from '@app/components/copy-button/copy-button';
import { Feilregistrering } from '@app/components/feilregistrering/feilregistrering';
// See relevant-oppgaver.tsx for more information about this dependency cycle
import { RelevantOppgaver } from '@app/components/relevant-oppgaver/relevant-oppgaver';
import { isoDateToPretty } from '@app/domain/date';
import { useGetOppgaveQuery } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import type { IOppgave } from '@app/types/oppgaver';
import { Table } from '@navikt/ds-react';
import { styled } from 'styled-components';
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
  columnKeys.map((key) => {
    switch (key) {
      case ColumnKeyEnum.Type:
      case ColumnKeyEnum.TypeWithAnkeITrygderetten:
        return (
          <StyledDataCell key={key}>
            <Type type={oppgave.typeId} size="medium" />
          </StyledDataCell>
        );
      case ColumnKeyEnum.Ytelse:
      case ColumnKeyEnum.RolYtelse:
        return (
          <StyledDataCell key={key}>
            <Ytelse ytelseId={oppgave.ytelseId} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.Innsendingshjemler:
      case ColumnKeyEnum.RolInnsendingshjemler:
      case ColumnKeyEnum.EnhetInnsendingshjemler:
        return (
          <StyledDataCell key={key}>
            <Innsendingshjemler hjemmelIdList={oppgave.hjemmelIdList} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.Registreringshjemler:
        return (
          <StyledDataCell key={key}>
            <Registreringshjemler hjemmelIdList={oppgave.registreringshjemmelIdList} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.Navn:
        return (
          <StyledDataCell key={key}>
            <SakenGjelderName oppgaveId={oppgave.id} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.Fnr:
        return (
          <StyledDataCell key={key}>
            <SakenGjelderFnr oppgaveId={oppgave.id} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.Age:
        return (
          <StyledDataCell key={key}>
            <Age {...oppgave} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.Deadline:
        return (
          <StyledDataCell key={key}>
            <Deadline {...oppgave} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.VarsletFrist:
        return (
          <StyledDataCell key={key}>
            <ReadOnlyDeadline frist={oppgave.varsletFrist} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.Medunderskriver:
        return (
          <StyledDataCell key={key}>
            <Medunderskriver
              oppgaveId={oppgave.id}
              medunderskriverIdent={oppgave.medunderskriver.employee?.navIdent ?? null}
            />
          </StyledDataCell>
        );
      case ColumnKeyEnum.FlowStates:
        return (
          <StyledDataCell key={key}>
            <FlowStateContainer>
              <MedudunderskriverFlowStateLabel typeId={oppgave.typeId} medunderskriver={oppgave.medunderskriver} />
              {oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE ? (
                <RolFlowStateLabel rol={oppgave.rol} />
              ) : null}
            </FlowStateContainer>
          </StyledDataCell>
        );
      case ColumnKeyEnum.Rol:
        return (
          <StyledDataCell key={key}>
            <Rol oppgaveId={oppgave.id} rolIdent={oppgave.rol.employee?.navIdent ?? null} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.Open:
      case ColumnKeyEnum.OpenWithYtelseAccess:
        return (
          <StyledDataCell key={key}>
            <OpenOppgavebehandling
              id={oppgave.id}
              ytelseId={oppgave.ytelseId}
              typeId={oppgave.typeId}
              tildeltSaksbehandlerident={oppgave.tildeltSaksbehandlerident}
              medunderskriverident={oppgave.medunderskriver.employee?.navIdent ?? null}
              rol={oppgave.rol}
              applyYtelseAccess={key === ColumnKeyEnum.OpenWithYtelseAccess}
            />
          </StyledDataCell>
        );
      case ColumnKeyEnum.Oppgavestyring:
      case ColumnKeyEnum.OppgavestyringNonFilterable:
        return (
          <StyledDataCell key={key}>
            <Oppgavestyring {...oppgave} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.TildelingWithFilter:
      case ColumnKeyEnum.Tildeling:
        return (
          <StyledDataCell key={key}>
            <Name navIdent={oppgave.tildeltSaksbehandlerident} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.Utfall:
        return (
          <StyledDataCell key={key}>
            <Utfall utfallId={oppgave.utfallId} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.PaaVentTil:
        return (
          <StyledDataCell key={key}>
            <PaaVentTil sattPaaVent={oppgave.sattPaaVent} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.PaaVentReason:
        return (
          <StyledDataCell key={key}>
            <PaaVentReason sattPaaVent={oppgave.sattPaaVent} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.Finished:
        return <StyledDataCell key={key}>{isoDateToPretty(oppgave.avsluttetAvSaksbehandlerDate)}</StyledDataCell>;
      case ColumnKeyEnum.Returnert:
        return (
          <StyledDataCell key={key}>
            {oppgave.rol.flowState === FlowState.RETURNED ? isoDateToPretty(oppgave.rol.returnertDate) : null}
          </StyledDataCell>
        );
      case ColumnKeyEnum.Feilregistrering:
      case ColumnKeyEnum.Feilregistrert:
        return (
          <StyledDataCell key={key}>
            <Feilregistrering
              oppgaveId={oppgave.id}
              feilregistrert={oppgave.feilregistrert}
              fagsystemId={oppgave.fagsystemId}
              tildeltSaksbehandlerident={oppgave.tildeltSaksbehandlerident}
              variant="secondary-neutral"
              $position="below"
              $align="right"
            />
          </StyledDataCell>
        );
      case ColumnKeyEnum.Saksnummer:
        return (
          <StyledDataCell key={key}>
            <CopyButton text={oppgave.saksnummer} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.RolTildeling:
        return (
          <StyledDataCell key={key}>
            <RolTildeling oppgave={oppgave} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.RelevantOppgaver:
        return (
          <StyledDataCell key={key}>
            <RelevantOppgaver oppgaveId={oppgave.id} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.FradelingReason:
        return (
          <StyledDataCell key={key}>
            <FradelingReason oppgaveId={oppgave.id} />
          </StyledDataCell>
        );
      case ColumnKeyEnum.PreviousSaksbehandler:
        if (oppgave.previousSaksbehandler === null) {
          return <StyledDataCell key={key} />;
        }

        return (
          <StyledDataCell key={key}>
            {oppgave.previousSaksbehandler.navn} ({oppgave.previousSaksbehandler.navIdent})
          </StyledDataCell>
        );
      case ColumnKeyEnum.DatoSendtTilTr:
        if (oppgave.datoSendtTilTR === null) {
          return <StyledDataCell key={key} />;
        }

        return (
          <StyledDataCell key={key}>
            <time dateTime={oppgave.datoSendtTilTR}>{isoDateToPretty(oppgave.datoSendtTilTR)}</time>
          </StyledDataCell>
        );
    }

    return <StyledDataCell key={key} />;
  });

const StyledDataCell = styled(Table.DataCell)`
  &:empty {
    padding: 0;
  }
`;

const FlowStateContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--a-spacing-2);
`;
