import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Pagination, Table } from '@navikt/ds-react';
import { useEffect } from 'react';
import { styled } from 'styled-components';
import { PageInfo } from '@app/components/common-table-components/page-info';
import { RowsPerPage } from '@app/components/rows-per-page';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { pushEvent } from '@app/observability';
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
}: Props) => {
  useEffect(() => {
    if (pageSize === -1) {
      setPage(1);
    }

    const maxPage = Math.floor(total / pageSize) + 1;

    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [page, pageSize, setPage, total]);

  return (
    <tfoot data-testid={testId}>
      <Table.Row>
        <Table.DataCell colSpan={columnCount}>
          <StyledFooterContent>
            <Left>
              <Button
                size="small"
                variant="tertiary-neutral"
                onClick={() => {
                  pushEvent('refresh-oppgave-list', {}, testId);
                  onRefresh();
                }}
                loading={isLoading || isFetching}
                icon={<ArrowsCirclepathIcon aria-hidden />}
                title="Oppdater"
                data-testid={`${testId}-refresh-button`}
              />
              <PageInfo total={total} fromNumber={from} toNumber={to} />
            </Left>
            {pageSize >= total ? null : (
              <Pagination
                page={page}
                count={Math.max(Math.ceil(total / pageSize), 1)}
                prevNextTexts
                onPageChange={(p) => {
                  pushEvent('oppgave-list-change-page', { page: p.toString() }, testId);
                  setPage(p);
                }}
                data-testid={`${testId}-pagination`}
              />
            )}
            <RowsPerPage settingKey={settingsKey} pageSize={pageSize} data-testid={`${testId}-rows-per-page`} />
          </StyledFooterContent>
        </Table.DataCell>
      </Table.Row>
    </tfoot>
  );
};

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
