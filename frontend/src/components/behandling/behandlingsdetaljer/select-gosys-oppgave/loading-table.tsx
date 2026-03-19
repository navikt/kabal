import { Skeleton, Table } from '@navikt/ds-react';
import { TableHeader } from '@/components/behandling/behandlingsdetaljer/select-gosys-oppgave/table-header';

export const LoadingTable = () => (
  <Table size="small" zebraStripes>
    <TableHeader showFerdigstilt={false} />

    <Table.Body>
      <LoadingRow />
      <LoadingRow />
      <LoadingRow />
    </Table.Body>
  </Table>
);

export const LoadingTableSimple = () => (
  <Table size="small" zebraStripes>
    <TableHeader showFerdigstilt={false} />

    <Table.Body>
      <LoadingRow />
    </Table.Body>
  </Table>
);

const LoadingRow = () => (
  <Table.Row>
    <Table.DataCell>
      <Skeleton height={24} width={32} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={24} width={55} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={24} width={120} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={24} width={100} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={24} width={150} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={24} width={170} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={24} width={140} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={24} width={140} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={24} width={50} />
    </Table.DataCell>
  </Table.Row>
);
