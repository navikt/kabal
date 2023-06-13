import { Skeleton, Table } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';

interface Props {
  testId: string;
  columnCount: number;
  behandlingid?: string;
}

export const LoadingRow = ({ testId, columnCount, behandlingid }: Props) => (
  <Table.Row data-testid={testId} data-behandlingid={behandlingid} data-state="loading">
    {new Array(columnCount).fill(null).map((_, index) => (
      <Table.DataCell key={index}>
        <Container>
          <Skeleton variant="text" width="100%" height="100%" />
        </Container>
      </Table.DataCell>
    ))}
  </Table.Row>
);

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  padding: 4px;
`;
