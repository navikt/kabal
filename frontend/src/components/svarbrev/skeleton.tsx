import { HStack, Skeleton, Table } from '@navikt/ds-react';

const SkeletonRow = () => (
  <Table.Row>
    <Table.DataCell>
      <Skeleton variant="rounded" />
    </Table.DataCell>

    <Table.DataCell>
      <Skeleton variant="rectangle" width={52} />
    </Table.DataCell>

    <Table.DataCell>
      <Skeleton variant="text" width={355} />
    </Table.DataCell>

    <Table.DataCell>
      <HStack align="center" gap="0 1">
        <Skeleton variant="rounded" width={60} />
        <Skeleton variant="rounded" width={180} />
      </HStack>
    </Table.DataCell>

    <Table.DataCell>
      <HStack align="center" gap="0 1">
        <Skeleton variant="rounded" width="100%" />
        <Skeleton variant="rounded" width={28} />
      </HStack>
    </Table.DataCell>

    <Table.DataCell>
      <Skeleton variant="text" width={115} />
    </Table.DataCell>

    <Table.DataCell>
      <HStack align="center" gap="0 1" minWidth={`${3 * 32 + 2 * 4}px`}>
        <Skeleton variant="rounded" width={28} height={28} />
        <Skeleton variant="rounded" width={28} height={28} />
      </HStack>
    </Table.DataCell>
  </Table.Row>
);

const ROWS = new Array(60)
  .fill(0)
  .map((_, i) => i)
  .map((i) => <SkeletonRow key={i} />);

export const SkeletonBody = () => <Table.Body>{ROWS}</Table.Body>;
