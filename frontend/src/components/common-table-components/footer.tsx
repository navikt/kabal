import { Pagination, Table } from '@navikt/ds-react';
import React from 'react';
import { PageInfo } from '@app/components/common-table-components/page-info';
import { RowsPerPage } from '@app/components/rows-per-page';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { StyledFooterContent } from '@app/styled-components/table';

interface Props {
  page: number;
  from: number;
  to: number;
  total: number;
  pageSize: number;
  settingsKey: OppgaveTableRowsPerPage;
  columnCount: number;
  setPage: (page: number) => void;
}

export const TableFooter = ({ columnCount, from, to, total, page, pageSize, settingsKey, setPage }: Props) => (
  <tfoot>
    <Table.Row>
      <Table.DataCell colSpan={columnCount}>
        <StyledFooterContent>
          <PageInfo total={total} fromNumber={from} toNumber={to} />
          {pageSize >= total ? null : (
            <Pagination
              page={page}
              count={Math.max(Math.ceil(total / pageSize), 1)}
              prevNextTexts
              onPageChange={setPage}
            />
          )}
          <RowsPerPage settingKey={settingsKey} pageSize={pageSize} />
        </StyledFooterContent>
      </Table.DataCell>
    </Table.Row>
  </tfoot>
);
