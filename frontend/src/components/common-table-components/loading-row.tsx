import { Table } from '@navikt/ds-react';
import { LoadingCellContent } from '@/components/common-table-components/loading-cell-content';

interface Props {
  testId: string;
  columnCount: number;
  behandlingid?: string;
}

export const LoadingRow = ({ testId, columnCount, behandlingid }: Props) => (
  <Table.Row data-testid={testId} data-behandlingid={behandlingid} data-state="loading">
    {new Array(columnCount)
      .fill(0)
      .map((_, index) => index)
      .map((index) => (
        <Table.DataCell key={index}>
          <LoadingCellContent key={index} />
        </Table.DataCell>
      ))}
  </Table.Row>
);
