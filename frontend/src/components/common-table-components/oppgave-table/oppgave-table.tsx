import { SortState, Table, TableProps } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { TableFooter } from '@app/components/common-table-components/footer';
import { OppgaveRows } from '@app/components/common-table-components/oppgave-rows/oppgave-rows';
import {
  TableFilterHeaders,
  TablePlainHeaders,
} from '@app/components/common-table-components/oppgave-table/oppgave-table-headers';
import { SetCommonOppgaverParams } from '@app/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { TableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useOppgavePagination } from '@app/hooks/use-oppgave-pagination';
import { CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

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
  settingsKey: TableRowsPerPage;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  'data-testid': string;
}

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
  ...rest
}: Props & Params): JSX.Element => {
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

  const headers =
    params === undefined ? (
      <TablePlainHeaders columnKeys={columns} />
    ) : (
      <TableFilterHeaders columnKeys={columns} onSortChange={onSortChange} params={params} setParams={setParams} />
    );

  const { oppgaver, ...footerProps } = useOppgavePagination(settingsKey, behandlinger);

  return (
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
  );
};

const isSortFieldEnum = (field: string | undefined): field is SortFieldEnum =>
  Object.values(SortFieldEnum).some((v) => v === field);

const invertSort = (order: SortOrderEnum) =>
  order === SortOrderEnum.STIGENDE ? SortOrderEnum.SYNKENDE : SortOrderEnum.STIGENDE;
