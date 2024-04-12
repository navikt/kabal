import { Table, TableProps } from '@navikt/ds-react';
import React from 'react';
import { Registreringshjemler } from '@app/components/common-table-components/oppgave-table/filter-dropdowns/registreringshjemler';
import {
  FinishedColumnHeader,
  ReturnedColumnHeader,
} from '@app/components/common-table-components/oppgave-table/finished-column-header';
import { SetCommonOppgaverParams } from '@app/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum, TABLE_HEADERS } from '@app/components/common-table-components/types';
import { CommonOppgaverParams, Filters, SortFieldEnum } from '@app/types/oppgaver';
import { Hjemmel } from './filter-dropdowns/hjemmel';
import { Medunderskriver } from './filter-dropdowns/medunderskriver';
import { Rol } from './filter-dropdowns/rol';
import { Saksbehandler } from './filter-dropdowns/saksbehandler';
import { Sakstype } from './filter-dropdowns/sakstype';
import { Ytelse } from './filter-dropdowns/ytelse';

interface TablePlainHeadersProps {
  columnKeys: ColumnKeyEnum[];
}

export const TablePlainHeaders = ({ columnKeys }: TablePlainHeadersProps) =>
  columnKeys.map((key) => <Table.ColumnHeader key={key}>{TABLE_HEADERS[key]}</Table.ColumnHeader>);

interface TableFilterHeadersProps extends TablePlainHeadersProps {
  params: CommonOppgaverParams;
  setParams: SetCommonOppgaverParams;
  onSortChange: TableProps['onSortChange'];
  filters: Filters;
}

export const TableFilterHeaders = ({ columnKeys, onSortChange, params, setParams, filters }: TableFilterHeadersProps) =>
  // eslint-disable-next-line complexity
  columnKeys.map((key) => {
    if (params === undefined || setParams === undefined) {
      return <Table.ColumnHeader key={key}>{TABLE_HEADERS[key]}</Table.ColumnHeader>;
    }

    switch (key) {
      case ColumnKeyEnum.Type:
        return <Sakstype key={key} columnKey={key} params={params} setParams={setParams} options={filters.typer} />;
      case ColumnKeyEnum.Ytelse:
        return <Ytelse key={key} columnKey={key} params={params} setParams={setParams} options={filters.ytelser} />;
      case ColumnKeyEnum.Innsendingshjemler:
        return <Hjemmel key={key} columnKey={key} params={params} setParams={setParams} options={filters.hjemler} />;
      case ColumnKeyEnum.Registreringshjemler:
        return (
          <Registreringshjemler
            key={key}
            columnKey={key}
            params={params}
            setParams={setParams}
            options={filters.registreringshjemler}
          />
        );
      case ColumnKeyEnum.Age:
        return (
          <Table.ColumnHeader key={key} sortable sortKey={SortFieldEnum.ALDER}>
            Alder
          </Table.ColumnHeader>
        );
      case ColumnKeyEnum.Deadline:
        return (
          <Table.ColumnHeader key={key} sortable sortKey={SortFieldEnum.FRIST}>
            Frist
          </Table.ColumnHeader>
        );
      case ColumnKeyEnum.PaaVentTil:
        return (
          <Table.ColumnHeader key={key} sortable sortKey={SortFieldEnum.PAA_VENT_TO}>
            På vent til
          </Table.ColumnHeader>
        );
      case ColumnKeyEnum.TildelingWithFilter:
      case ColumnKeyEnum.Oppgavestyring:
        return (
          <Saksbehandler
            key={key}
            columnKey={key}
            params={params}
            setParams={setParams}
            options={filters.tildelteSaksbehandlere}
          />
        );
      case ColumnKeyEnum.Medunderskriver:
        return (
          <Medunderskriver
            key={key}
            columnKey={key}
            params={params}
            setParams={setParams}
            options={filters.medunderskrivere}
          />
        );
      case ColumnKeyEnum.Finished:
        return (
          <FinishedColumnHeader
            key={key}
            params={params}
            setParams={setParams}
            onSortChange={onSortChange}
            ferdigstiltFrom={filters.ferdigstiltFrom}
            ferdigstiltTo={filters.ferdigstiltTo}
          />
        );
      case ColumnKeyEnum.Returnert:
        return (
          <ReturnedColumnHeader
            key={key}
            params={params}
            setParams={setParams}
            onSortChange={onSortChange}
            returnertFrom={filters.returnertFrom}
            returnertTo={filters.returnertTo}
          />
        );
      case ColumnKeyEnum.Rol:
        return <Rol key={key} columnKey={key} params={params} setParams={setParams} options={filters.tildelteRol} />;
      case ColumnKeyEnum.RolYtelse:
        return <Ytelse key={key} columnKey={key} params={params} setParams={setParams} options={filters.ytelser} />;
      // return <RolYtelse key={key} columnKey={key} params={params} setParams={setParams} options={filters.ytelser} />;
      case ColumnKeyEnum.RolInnsendingshjemler:
        // return <RolHjemmel key={key} columnKey={key} params={params} setParams={setParams} options={filters.hjemler} />;
        return <Hjemmel key={key} columnKey={key} params={params} setParams={setParams} options={filters.hjemler} />;
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
        return <Table.ColumnHeader key={key}>{TABLE_HEADERS[key]}</Table.ColumnHeader>;
    }

    return <Table.ColumnHeader key={key} />;
  });
