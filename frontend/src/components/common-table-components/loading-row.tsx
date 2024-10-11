import { LoadingCellContent } from '@app/components/common-table-components/loading-cell-content';
import { Table } from '@navikt/ds-react';

interface Props {
  testId: string;
  columnCount: number;
  behandlingid?: string;
}

export const LoadingRow = ({ testId, columnCount, behandlingid }: Props) => (
  <Table.Row data-testid={testId} data-behandlingid={behandlingid} data-state="loading">
    {new Array(columnCount).fill(null).map((_, index) => (
      <Table.DataCell key={index}>
        <LoadingCellContent key={index} />
      </Table.DataCell>
    ))}
  </Table.Row>
);
