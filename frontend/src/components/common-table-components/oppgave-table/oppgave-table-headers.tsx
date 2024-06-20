import { TableProps } from '@navikt/ds-react';
import { DateColumnHeader } from '@app/components/common-table-components/oppgave-table/date-column-header';
import { Registreringshjemler } from '@app/components/common-table-components/oppgave-table/filter-dropdowns/registreringshjemler';
import { StyledColumnHeader } from '@app/components/common-table-components/oppgave-table/styled-components';
import { SetCommonOppgaverParams } from '@app/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum, TABLE_HEADERS } from '@app/components/common-table-components/types';
import { CommonOppgaverParams, SortFieldEnum } from '@app/types/oppgaver';
import { EnhetHjemmel } from './filter-dropdowns/enhet-hjemmel';
import { Hjemmel } from './filter-dropdowns/hjemmel';
import { Medunderskriver } from './filter-dropdowns/medunderskriver';
import { Rol } from './filter-dropdowns/rol';
import { RolHjemmel } from './filter-dropdowns/rol-hjemmel';
import { RolYtelse } from './filter-dropdowns/rol-ytelse';
import { Saksbehandler } from './filter-dropdowns/saksbehandler';
import { Sakstype, SakstypeWithAnkeITrygderetten } from './filter-dropdowns/sakstype';
import { Ytelse } from './filter-dropdowns/ytelse';

interface TablePlainHeadersProps {
  columnKeys: ColumnKeyEnum[];
}

export const TablePlainHeaders = ({ columnKeys }: TablePlainHeadersProps) =>
  columnKeys.map((key) => <StyledColumnHeader key={key}>{TABLE_HEADERS[key]}</StyledColumnHeader>);

interface TableFilterHeadersProps extends TablePlainHeadersProps {
  params: CommonOppgaverParams;
  setParams: SetCommonOppgaverParams;
  onSortChange: TableProps['onSortChange'];
}

export const TableFilterHeaders = ({ columnKeys, onSortChange, params, setParams }: TableFilterHeadersProps) =>
  // eslint-disable-next-line complexity
  columnKeys.map((key) => {
    if (params === undefined || setParams === undefined) {
      return <StyledColumnHeader key={key}>{TABLE_HEADERS[key]}</StyledColumnHeader>;
    }

    const baseColumnHeaderProps = { params, setParams, onSortChange };

    switch (key) {
      case ColumnKeyEnum.Type:
        return <Sakstype key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.TypeWithAnkeITrygderetten:
        return <SakstypeWithAnkeITrygderetten key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.Ytelse:
        return <Ytelse key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.Innsendingshjemler:
        return <Hjemmel key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.EnhetInnsendingshjemler:
        return <EnhetHjemmel key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.Registreringshjemler:
        return <Registreringshjemler key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.Age:
        return (
          <StyledColumnHeader key={key} sortable sortKey={SortFieldEnum.ALDER}>
            {TABLE_HEADERS[key]}
          </StyledColumnHeader>
        );
      case ColumnKeyEnum.Deadline:
        return (
          <DateColumnHeader
            key={key}
            {...baseColumnHeaderProps}
            fromKey="fristFrom"
            toKey="fristTo"
            sortKey={SortFieldEnum.FRIST}
          >
            {TABLE_HEADERS[key]}
          </DateColumnHeader>
        );
      case ColumnKeyEnum.VarsletFrist:
        return (
          <DateColumnHeader
            key={key}
            {...baseColumnHeaderProps}
            fromKey="varsletFristFrom"
            toKey="varsletFristTo"
            sortKey={SortFieldEnum.VARSLET_FRIST}
          >
            {TABLE_HEADERS[key]}
          </DateColumnHeader>
        );
      case ColumnKeyEnum.PaaVentTil:
        return (
          <StyledColumnHeader key={key} sortable sortKey={SortFieldEnum.PAA_VENT_TO}>
            {TABLE_HEADERS[key]}
          </StyledColumnHeader>
        );
      case ColumnKeyEnum.TildelingWithFilter:
      case ColumnKeyEnum.Oppgavestyring:
        return <Saksbehandler key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.Medunderskriver:
        return <Medunderskriver key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.Finished:
        return (
          <DateColumnHeader
            {...baseColumnHeaderProps}
            key={key}
            fromKey="ferdigstiltFrom"
            toKey="ferdigstiltTo"
            sortKey={SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER}
          >
            {TABLE_HEADERS[key]}
          </DateColumnHeader>
        );
      case ColumnKeyEnum.Returnert:
        return (
          <DateColumnHeader
            {...baseColumnHeaderProps}
            key={key}
            fromKey="returnertFrom"
            toKey="returnertTo"
            sortKey={SortFieldEnum.RETURNERT_FRA_ROL}
          >
            {TABLE_HEADERS[key]}
          </DateColumnHeader>
        );
      case ColumnKeyEnum.Rol:
        return <Rol key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.RolYtelse:
        return <RolYtelse key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.RolInnsendingshjemler:
        return <RolHjemmel key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.Navn:
      case ColumnKeyEnum.Fnr:
      case ColumnKeyEnum.FlowStates:
      case ColumnKeyEnum.Open:
      case ColumnKeyEnum.Tildeling:
      case ColumnKeyEnum.OppgavestyringNonFilterable:
      case ColumnKeyEnum.Utfall:
      case ColumnKeyEnum.PaaVentReason:
      case ColumnKeyEnum.Feilregistrering:
      case ColumnKeyEnum.Feilregistrert:
      case ColumnKeyEnum.Saksnummer:
      case ColumnKeyEnum.RolTildeling:
      case ColumnKeyEnum.RelevantOppgaver:
      case ColumnKeyEnum.FradelingReason:
      case ColumnKeyEnum.PreviousSaksbehandler:
      case ColumnKeyEnum.DatoSendtTilTr:
        return <StyledColumnHeader key={key}>{TABLE_HEADERS[key]}</StyledColumnHeader>;
    }

    return <StyledColumnHeader key={key} />;
  });
