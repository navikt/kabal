import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Button, HStack, Pagination, Table } from '@navikt/ds-react';
import { PageInfo } from '@/components/common-table-components/page-info';
import { RowsPerPage } from '@/components/rows-per-page';
import type { OppgaveTableRowsPerPage } from '@/hooks/settings/use-setting';
import { pushEvent } from '@/observability';

interface Props {
  page: number;
  from: number;
  to: number;
  total: number;
  pageSize: number;
  settingsKey: OppgaveTableRowsPerPage;
  columnCount: number;
  setPage: (page: number) => void;
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
  onRefresh,
  isLoading,
  isFetching,
}: Props) => (
  <tfoot>
    <Table.Row>
      <Table.DataCell colSpan={columnCount}>
        <HStack align="center" justify="space-between" width="100%">
          <HStack align="center" gap="space-4">
            <Button
              data-color="neutral"
              size="small"
              variant="tertiary"
              onClick={() => {
                pushEvent('refresh-oppgave-list', settingsKey);
                onRefresh();
              }}
              loading={isLoading || isFetching}
              icon={<ArrowsCirclepathIcon aria-hidden />}
              title="Oppdater"
              aria-label="Oppdater"
            />
            <PageInfo total={total} fromNumber={from} toNumber={to} />
          </HStack>
          {pageSize >= total ? null : (
            <Pagination
              page={page}
              count={Math.max(Math.ceil(total / pageSize), 1)}
              prevNextTexts
              onPageChange={(p) => {
                pushEvent('oppgave-list-change-page', settingsKey, { page: p.toString() });
                setPage(p);
              }}
            />
          )}
          <RowsPerPage settingKey={settingsKey} pageSize={pageSize} />
        </HStack>
      </Table.DataCell>
    </Table.Row>
  </tfoot>
);
