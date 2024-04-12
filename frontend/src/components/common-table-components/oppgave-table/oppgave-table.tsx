import { SortState, Table, TableProps } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { TableFooter } from '@app/components/common-table-components/footer';
import { TableHeading } from '@app/components/common-table-components/heading';
// See relevant-oppgaver.tsx for more information about this dependency cycle
// eslint-disable-next-line import/no-cycle
import { OppgaveRows } from '@app/components/common-table-components/oppgave-rows/oppgave-rows';
import {
  TableFilterHeaders,
  TablePlainHeaders,
} from '@app/components/common-table-components/oppgave-table/oppgave-table-headers';
import { SetCommonOppgaverParams } from '@app/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useOppgavePagination } from '@app/hooks/use-oppgave-pagination';
import { CommonOppgaverParams, Filters, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

interface WithParams {
  params: CommonOppgaverParams;
  setParams: SetCommonOppgaverParams;
}

interface WithoutParams {
  params?: never;
  setParams?: never;
}

type Params = WithParams | WithoutParams;

interface Props extends TableProps {
  columns: ColumnKeyEnum[];
  behandlinger: string[] | undefined;
  settingsKey: OppgaveTableRowsPerPage;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  filters?: Filters;
  heading: string;
  'data-testid': string;
}

const useResetFilters = <T extends object>(params: T | undefined): (() => T) | undefined => {
  if (params === undefined) {
    return undefined;
  }

  return () => {
    const empty: Record<string, unknown> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        empty[key] = [];
      } else {
        empty[key] = value;
      }
    });

    return empty as T;
  };
};

export const OppgaveTable = ({
  columns,
  params,
  setParams,
  behandlinger,
  settingsKey,
  isLoading,
  isFetching,
  isError,
  refetch,
  filters,
  heading,
  ...rest
}: Props & Params): JSX.Element => {
  const resetFilters = useResetFilters(params);
  const [sort, onSortChange] = useMemo<[SortState, (field?: string) => void] | [undefined, undefined]>(() => {
    if (typeof params === 'undefined') {
      return [undefined, undefined];
    }

    const sortState: SortState = {
      orderBy: params.sortering,
      direction: params.rekkefoelge === SortOrderEnum.STIGENDE ? 'ascending' : 'descending',
    };

    return [
      sortState,
      (sortering?: string) => {
        if (isSortFieldEnum(sortering)) {
          const rekkefoelge = params.sortering === sortering ? invertSort(params.rekkefoelge) : SortOrderEnum.STIGENDE;

          setParams({ ...params, sortering, rekkefoelge });
        }
      },
    ];
  }, [params, setParams]);

  const hasFilters = params !== undefined && filters !== undefined;

  const headers = hasFilters ? (
    <TableFilterHeaders
      columnKeys={columns}
      onSortChange={onSortChange}
      params={params}
      setParams={setParams}
      filters={filters}
    />
  ) : (
    <TablePlainHeaders columnKeys={columns} />
  );

  const { oppgaver, ...footerProps } = useOppgavePagination(settingsKey, behandlinger);

  const onResetFilters =
    resetFilters === undefined || setParams === undefined ? undefined : () => setParams(resetFilters());

  return (
    <>
      <TableHeading onResetFilters={onResetFilters}>{heading}</TableHeading>
      <Table {...rest} zebraStripes sort={sort} onSortChange={onSortChange}>
        <Table.Header data-testid={`${rest['data-testid']}-header`}>
          <Table.Row>{headers}</Table.Row>
        </Table.Header>
        <OppgaveRows
          data-testid={`${rest['data-testid']}-rows`}
          oppgaver={oppgaver}
          columns={columns}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          pageSize={footerProps.pageSize}
        />
        <TableFooter
          {...footerProps}
          columnCount={columns.length}
          onRefresh={refetch}
          isLoading={isLoading}
          isFetching={isFetching}
          settingsKey={settingsKey}
          data-testid={`${rest['data-testid']}-footer`}
        />
      </Table>
    </>
  );
};

const isSortFieldEnum = (field: string | undefined): field is SortFieldEnum =>
  Object.values(SortFieldEnum).some((v) => v === field);

const invertSort = (order: SortOrderEnum) =>
  order === SortOrderEnum.STIGENDE ? SortOrderEnum.SYNKENDE : SortOrderEnum.STIGENDE;
