import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Pagination, Table } from '@navikt/ds-react';
import React, { useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { PageInfo } from '@app/components/common-table-components/page-info';
import { RowsPerPage } from '@app/components/rows-per-page';
import { useNumberSetting } from '@app/hooks/settings/helpers';
import { StyledFooterContent } from '@app/styled-components/table';
import { IPartBase } from '@app/types/oppgave-common';
import { Result } from './result';

interface SearchResultsProps {
  people: IPartBase[];
  onRefresh: () => void;
  isLoading: boolean;
  isFetching: boolean;
}

const SETTINGS_KEY = 'search/name/rows_per_page';
const DEFAULT_PAGE_SIZE = 10;

export const SearchResults = ({ people, onRefresh, isFetching, isLoading }: SearchResultsProps) => {
  const [page, setPage] = useState(1);
  const { value = DEFAULT_PAGE_SIZE } = useNumberSetting(SETTINGS_KEY);

  const total = people.length;
  const pageSize = value === -1 ? total : value;
  const from = (page - 1) * pageSize;
  const to = Math.min(total, from + pageSize);

  const slicedPeople = useMemo(() => people.slice(from, from + pageSize), [pageSize, from, people]);

  return (
    <Container>
      <Table zebraStripes data-testid="search-result-list">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col" />
            <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
            <Table.HeaderCell scope="col">Fødselsnummer</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {slicedPeople.map((person) => (
            <Result key={person.id} {...person} />
          ))}
        </Table.Body>
        <tfoot>
          <Table.Row>
            <Table.DataCell colSpan={3}>
              <StyledFooterContent>
                <Left>
                  <Button
                    size="small"
                    variant="tertiary-neutral"
                    onClick={onRefresh}
                    loading={isLoading || isFetching}
                    icon={<ArrowsCirclepathIcon aria-hidden />}
                    title="Oppdater"
                    data-testid="search-results-refresh-button"
                  />
                  <PageInfo total={total} fromNumber={from + 1} toNumber={to} />
                </Left>
                <Pagination
                  page={page}
                  count={Math.max(Math.ceil(total / pageSize), 1)}
                  prevNextTexts
                  onPageChange={setPage}
                  data-testid="search-results-pagination"
                />
                <RowsPerPage settingKey={SETTINGS_KEY} pageSize={pageSize} data-testid="search-results-rows-per-page" />
              </StyledFooterContent>
            </Table.DataCell>
          </Table.Row>
        </tfoot>
      </Table>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 16px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
