import { Skeleton, Table } from '@navikt/ds-react';
import { styled } from 'styled-components';

const SkeletonRow = () => (
  <Table.Row style={{ height: 41.5 }}>
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
      <Row>
        <Skeleton variant="rounded" width={60} />
        <Skeleton variant="rounded" width={180} />
      </Row>
    </Table.DataCell>

    <Table.DataCell>
      <Row>
        <Skeleton variant="rounded" width="100%" />
        <Skeleton variant="rounded" width={28} />
      </Row>
    </Table.DataCell>

    <Table.DataCell>
      <Skeleton variant="text" width={115} />
    </Table.DataCell>

    <Table.DataCell>
      <Buttons>
        <Skeleton variant="rounded" width={28} height={28} />
        <Skeleton variant="rounded" width={28} height={28} />
      </Buttons>
    </Table.DataCell>
  </Table.Row>
);

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: var(--a-spacing-1);
`;

const Buttons = styled(Row)`
  min-width: ${3 * 32 + 2 * 4}px;
`;

const ROWS = new Array(60).fill(null).map((_, i) => <SkeletonRow key={i} />);

export const SkeletonBody = () => <Table.Body>{ROWS}</Table.Body>;
