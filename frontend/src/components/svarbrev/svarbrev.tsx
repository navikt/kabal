import { SortHeader } from '@app/components/common-table-components/sort-header';
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
import { SortOrderEnum } from '@app/types/oppgaver';
import { Heading, type SortState, Table, VStack } from '@navikt/ds-react';
import { type ReactNode, useCallback, useEffect } from 'react';

interface TableHeadersProps {
  sortering: string;
  rekkefoelge: SortOrderEnum;
  onSortChange: (sortKey: string) => void;
}

const TableHeaders = (props: TableHeadersProps) => (
  <Table.Header className="sticky top-12 z-1 whitespace-nowrap bg-ax-bg-default">
    <Table.Row>
      <Table.HeaderCell>Aktiv</Table.HeaderCell>

      <Table.HeaderCell>Type</Table.HeaderCell>

      <SortHeader sortKey={SortKey.YTELSE} {...props}>
        Ytelse
      </SortHeader>

      <SortHeader sortKey={SortKey.TIME} {...props}>
        Saksbehandlingstid
      </SortHeader>

      <Table.HeaderCell className="w-full">Tekst til svarbrev (valgfri)</Table.HeaderCell>

      <SortHeader sortKey={SortKey.MODIFIED} {...props}>
        Sist endret
      </SortHeader>

      <Table.HeaderCell />
    </Table.Row>
  </Table.Header>
);

interface ContainerProps extends FilterProps {
  children: ReactNode;
  sort: SortState;
  onSortChange: (sortKey: string) => void;
}

const Container = ({ children, sort, onSortChange, ...filterProps }: ContainerProps) => (
  <VStack maxWidth="2000px">
    <Heading level="1" size="medium">
      Svarbrev
    </Heading>

    <Filters {...filterProps} />

    <Table size="small" zebraStripes sort={sort} onSortChange={onSortChange}>
      <TableHeaders
        sortering={sort.orderBy}
        rekkefoelge={DIRECTION_TO_REKKEFOELGE[sort.direction]}
        onSortChange={onSortChange}
      />
      {children}
    </Table>
  </VStack>
);

const DIRECTION_TO_REKKEFOELGE: Record<SortState['direction'], SortOrderEnum> = {
  [SortDirection.ASCENDING]: SortOrderEnum.ASC,
  [SortDirection.DESCENDING]: SortOrderEnum.DESC,
  none: SortOrderEnum.ASC,
};

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
