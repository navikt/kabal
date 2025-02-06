import { ErrorAlert } from '@app/components/search/common/error-alert';
import { FeilregistrerteOppgaverTable } from '@app/components/search/common/feilregistrerte-oppgaver-table';
import { FullfoerteOppgaverTable } from '@app/components/search/common/fullfoerte-oppgaver-table';
import { LedigeOppgaverTable } from '@app/components/search/common/ledige-oppgaver-table';
import { OppgaverPaaVentTable } from '@app/components/search/common/oppgaver-paa-vent-table';
import { OppgaverPageWrapper } from '@app/pages/page-wrapper';
import type { staggeredBaseQuery } from '@app/redux-api/common';
import type { IOppgaverResponse } from '@app/types/oppgaver';
import { HStack, Skeleton, Table } from '@navikt/ds-react';
import type { TypedUseQueryHookResult } from '@reduxjs/toolkit/query/react';

// https://github.com/reduxjs/redux-toolkit/issues/1937#issuecomment-1842868277
// https://redux-toolkit.js.org/rtk-query/usage-with-typescript#typing-query-and-mutation-endpoints
type OppgaverHookResult = TypedUseQueryHookResult<IOppgaverResponse, string, ReturnType<typeof staggeredBaseQuery>>;
export type OppgaverQuery = Omit<OppgaverHookResult, 'refetch'> & { refetch: () => void };

export const Oppgaver = ({ data, isFetching, isLoading, error, refetch }: OppgaverQuery) => {
  if (isLoading) {
    return <SkeletonTables />;
  }

  if (error !== undefined) {
    return (
      <HStack margin="4">
        <ErrorAlert error={error} refetch={refetch} isFetching={isFetching}>
          Feil ved henting av oppgaver
        </ErrorAlert>
      </HStack>
    );
  }

  if (data === undefined) {
    return null;
  }

  const footerProps = { onRefresh: refetch, isLoading: isFetching };

  return (
    <OppgaverPageWrapper testId="search-result">
      <LedigeOppgaverTable oppgaveIds={data.aapneBehandlinger} {...footerProps} />
      <OppgaverPaaVentTable oppgaveIds={data.paaVentBehandlinger} {...footerProps} />
      <FullfoerteOppgaverTable oppgaveIds={data.avsluttedeBehandlinger} {...footerProps} />
      <FeilregistrerteOppgaverTable oppgaveIds={data.feilregistrerteBehandlinger} {...footerProps} />
    </OppgaverPageWrapper>
  );
};

const SkeletonTables = () => (
  <Table zebraStripes size="small" style={{ marginLeft: 16 }}>
    <Table.Body>
      <SkeletonTable />
      <SkeletonTable />
    </Table.Body>
  </Table>
);

const SkeletonTable = () => (
  <Table.Row>
    <Table.DataCell>
      <Skeleton height={48} width={70} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={48} width={150} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={48} width={100} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={48} width={75} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={48} width={70} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={48} width={100} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={48} width={90} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={48} width={200} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={48} width={90} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={48} width={120} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={48} width={300} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={48} width={80} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={48} width={120} />
    </Table.DataCell>
  </Table.Row>
);
