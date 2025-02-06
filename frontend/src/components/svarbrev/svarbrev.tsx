import { type FilterProps, Filters } from '@app/components/svarbrev/filters';
import { clearPdfCache } from '@app/components/svarbrev/modal/get-pdf-url';
import { type ModalEnum, Row } from '@app/components/svarbrev/row/row';
import { SkeletonBody } from '@app/components/svarbrev/skeleton';
import { useFilterSort } from '@app/components/svarbrev/use-filter-sort';
import {
  SortDirection,
  SortKey,
  getDefaultSortDirection,
  isSortKey,
  useSvarbrevSearchParams,
} from '@app/components/svarbrev/use-search-params';
import { useGetSvarbrevSettingsQuery } from '@app/redux-api/svarbrev';
import { Heading, type SortState, Table, VStack } from '@navikt/ds-react';
import { type ReactNode, useCallback, useEffect } from 'react';
import { styled } from 'styled-components';

const TableHeaders = () => (
  <StyledTableHeader>
    <Table.Row>
      <Table.HeaderCell>Aktiv</Table.HeaderCell>
      <Table.HeaderCell>Type</Table.HeaderCell>
      <Table.ColumnHeader sortable sortKey={SortKey.YTELSE}>
        Ytelse
      </Table.ColumnHeader>
      <Table.ColumnHeader sortable sortKey={SortKey.TIME}>
        Saksbehandlingstid
      </Table.ColumnHeader>
      <Table.HeaderCell style={{ width: '100%' }}>Tekst til svarbrev (valgfri)</Table.HeaderCell>
      <Table.ColumnHeader sortable sortKey={SortKey.MODIFIED}>
        Sist endret
      </Table.ColumnHeader>
      <Table.HeaderCell />
    </Table.Row>
  </StyledTableHeader>
);

interface ContainerProps extends FilterProps {
  children: ReactNode;
  sort: SortState | undefined;
  onSortChange: (sortKey: string | undefined) => void;
}

const Container = ({ children, sort, onSortChange, ...filterProps }: ContainerProps) => (
  <VStack maxHeight="100%" maxWidth="2000px" overflow="auto">
    <Heading level="1" size="medium" spacing>
      Svarbrev
    </Heading>

    <Filters {...filterProps} />

    <StyledTable size="small" zebraStripes sort={sort} onSortChange={onSortChange}>
      <TableHeaders />
      {children}
    </StyledTable>
  </VStack>
);

interface Props {
  modal?: ModalEnum;
}

export const Svarbrev = ({ modal }: Props) => {
  const { data: settings, isLoading } = useGetSvarbrevSettingsQuery();
  const {
    ytelseFilter,
    setYtelseFilter,
    textFilter,
    setTextFilter,
    typeFilter,
    setTypeFilter,
    activeFilter,
    setActiveFilter,
    sort,
    setSort,
  } = useSvarbrevSearchParams();
  const { sortedFilteredSettings, sortFilterIsLoading } = useFilterSort({
    allSettings: settings,
    typeFilter,
    activeFilter,
    ytelseFilter,
    textFilter,
    sort,
  });

  const onSortChange = useCallback(
    (sortKey: string | undefined) => {
      if (sortKey === undefined || !isSortKey(sortKey)) {
        setSort(undefined);

        return;
      }

      if (sort?.orderBy === sortKey) {
        setSort({
          orderBy: sortKey,
          direction: sort.direction === SortDirection.ASCENDING ? SortDirection.DESCENDING : SortDirection.ASCENDING,
        });
      } else {
        setSort({ orderBy: sortKey, direction: getDefaultSortDirection(sortKey) });
      }
    },
    [setSort, sort.direction, sort?.orderBy],
  );

  // Clear PDF Object URL cache on unmount.
  useEffect(() => clearPdfCache, []);

  if (isLoading || sortFilterIsLoading) {
    return (
      <Container
        ytelseFilter={ytelseFilter}
        setYtelseFilter={setYtelseFilter}
        textFilter={textFilter}
        setTextFilter={setTextFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sort={sort}
        onSortChange={onSortChange}
      >
        <SkeletonBody />
      </Container>
    );
  }

  return (
    <Container
      ytelseFilter={ytelseFilter}
      setYtelseFilter={setYtelseFilter}
      textFilter={textFilter}
      setTextFilter={setTextFilter}
      typeFilter={typeFilter}
      setTypeFilter={setTypeFilter}
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
      sort={sort}
      onSortChange={onSortChange}
    >
      <Table.Body>
        {sortedFilteredSettings.map((s) => (
          <Row key={s.id} {...s} modal={modal} />
        ))}
      </Table.Body>
    </Container>
  );
};

const StyledTableHeader = styled(Table.Header)`
  position: sticky;
  top: var(--a-spacing-8);
  background-color: var(--a-surface-default);
  z-index: 1;
  white-space: nowrap;
  box-shadow: var(--a-shadow-medium);
`;

const StyledTable = styled(Table)`
  position: relative;
`;
