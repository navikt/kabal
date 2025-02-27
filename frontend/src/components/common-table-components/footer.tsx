import { PageInfo } from '@app/components/common-table-components/page-info';
import { RowsPerPage } from '@app/components/rows-per-page';
import type { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { pushEvent } from '@app/observability';
import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Button, HStack, Pagination, Table } from '@navikt/ds-react';

interface Props {
  page: number;
  from: number;
  to: number;
  total: number;
  pageSize: number;
  settingsKey: OppgaveTableRowsPerPage;
  columnCount: number;
  setPage: (page: number) => void;
  'data-testid': string;
  onRefresh: () => void;
  isLoading: boolean;
  isFetching: boolean;
}

export const TableFooter = ({
  columnCount,
  from,
  to,
  total,
  page,
  pageSize,
  settingsKey,
  setPage,
  'data-testid': testId,
  onRefresh,
  isLoading,
  isFetching,
}: Props) => (
  <tfoot data-testid={testId}>
    <Table.Row>
      <Table.DataCell colSpan={columnCount}>
        <HStack align="center" justify="space-between" width="100%">
          <HStack align="center" gap="1">
            <Button
              size="small"
              variant="tertiary-neutral"
              onClick={() => {
                pushEvent('refresh-oppgave-list', testId);
                onRefresh();
              }}
              loading={isLoading || isFetching}
              icon={<ArrowsCirclepathIcon aria-hidden />}
              title="Oppdater"
              data-testid={`${testId}-refresh-button`}
            />
            <PageInfo total={total} fromNumber={from} toNumber={to} />
          </HStack>
          {pageSize >= total ? null : (
            <Pagination
              page={page}
              count={Math.max(Math.ceil(total / pageSize), 1)}
              prevNextTexts
              onPageChange={(p) => {
                pushEvent('oppgave-list-change-page', testId, { page: p.toString() });
                setPage(p);
              }}
              data-testid={`${testId}-pagination`}
            />
          )}
          <RowsPerPage settingKey={settingsKey} pageSize={pageSize} data-testid={`${testId}-rows-per-page`} />
        </HStack>
      </Table.DataCell>
    </Table.Row>
  </tfoot>
);
