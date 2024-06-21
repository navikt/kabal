import { Skeleton, Table } from '@navikt/ds-react';

const SkeletonRow = () => (
  <Table.Row style={{ height: 50 }}>
    <Table.DataCell>
      <Skeleton width={24} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton width={355} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton width={228} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton width={83} height={16} />
      <Skeleton width={63} height={16} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton width={221} />
    </Table.DataCell>
  </Table.Row>
);

const ROWS = new Array(30).fill(null).map((_, i) => <SkeletonRow key={i} />);

export const SkeletonBody = () => <Table.Body>{ROWS}</Table.Body>;
