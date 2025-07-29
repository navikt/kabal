import { type FilterProps, Filters } from '@app/components/svarbrev/filters';
import { clearPdfCache } from '@app/components/svarbrev/modal/get-pdf-url';
import { type ModalEnum, Row } from '@app/components/svarbrev/row/row';
import { SkeletonBody } from '@app/components/svarbrev/skeleton';
import { useFilterSort } from '@app/components/svarbrev/use-filter-sort';
import {
  getDefaultSortDirection,
  isSortKey,
  SortDirection,
  SortKey,
  useSvarbrevSearchParams,
} from '@app/components/svarbrev/use-search-params';
import { useGetSvarbrevSettingsQuery } from '@app/redux-api/svarbrev';
import { BoxNew, Heading, type SortState, Table, VStack } from '@navikt/ds-react';
import { type ReactNode, useCallback, useEffect } from 'react';

const TableHeaders = () => (
  <BoxNew asChild position="sticky" top="8" background="default">
    <Table.Header className="z-1 whitespace-nowrap">
      <Table.Row>
        <Table.HeaderCell>Aktiv</Table.HeaderCell>
        <Table.HeaderCell>Type</Table.HeaderCell>
        <Table.ColumnHeader sortable sortKey={SortKey.YTELSE}>
          Ytelse
        </Table.ColumnHeader>
        <Table.ColumnHeader sortable sortKey={SortKey.TIME}>
          Saksbehandlingstid
        </Table.ColumnHeader>
        <Table.HeaderCell className="w-full">Tekst til svarbrev (valgfri)</Table.HeaderCell>
        <Table.ColumnHeader sortable sortKey={SortKey.MODIFIED}>
          Sist endret
        </Table.ColumnHeader>
        <Table.HeaderCell />
      </Table.Row>
    </Table.Header>
  </BoxNew>
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

    <Table size="small" zebraStripes sort={sort} onSortChange={onSortChange} className="relative">
      <TableHeaders />
      {children}
    </Table>
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
