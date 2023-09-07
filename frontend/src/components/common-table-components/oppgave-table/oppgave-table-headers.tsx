import { Table, TableProps } from '@navikt/ds-react';
import React from 'react';
import {
  EnhetHjemmel,
  Hjemmel,
  Saksbehandler,
  Sakstype,
  Ytelse,
} from '@app/components/common-table-components/oppgave-table/filter-dropdowns';
import {
  FinishedColumnHeader,
  ReturnedColumnHeader,
} from '@app/components/common-table-components/oppgave-table/finished-column-header';
import { SetCommonOppgaverParams } from '@app/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum, TABLE_HEADERS } from '@app/components/common-table-components/types';
import { CommonOppgaverParams, SortFieldEnum } from '@app/types/oppgaver';

interface TablePlainHeadersProps {
  columnKeys: ColumnKeyEnum[];
}

export const TablePlainHeaders = ({ columnKeys }: TablePlainHeadersProps) =>
  columnKeys.map((key) => <Table.ColumnHeader key={key}>{TABLE_HEADERS[key]}</Table.ColumnHeader>);

interface TableFilterHeadersProps extends TablePlainHeadersProps {
  params: CommonOppgaverParams;
  setParams: SetCommonOppgaverParams;
  onSortChange: TableProps['onSortChange'];
}

export const TableFilterHeaders = ({ columnKeys, onSortChange, params, setParams }: TableFilterHeadersProps) =>
  columnKeys.map((key) => {
    if (params === undefined || setParams === undefined) {
      return <Table.ColumnHeader key={key}>{TABLE_HEADERS[key]}</Table.ColumnHeader>;
    }

    switch (key) {
      case ColumnKeyEnum.Type:
        return <Sakstype key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.Ytelse:
        return <Ytelse key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.Hjemmel:
        return <Hjemmel key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.EnhetHjemmel:
        return <EnhetHjemmel key={key} columnKey={key} params={params} setParams={setParams} />;
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
      case ColumnKeyEnum.TildelingWithFilter:
      case ColumnKeyEnum.Oppgavestyring:
        return <Saksbehandler key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.Finished:
        return <FinishedColumnHeader key={key} params={params} setParams={setParams} onSortChange={onSortChange} />;
      case ColumnKeyEnum.Returnert:
        return <ReturnedColumnHeader key={key} params={params} setParams={setParams} onSortChange={onSortChange} />;
      default:
        return <Table.ColumnHeader key={key}>{TABLE_HEADERS[key]}</Table.ColumnHeader>;
    }
  });
