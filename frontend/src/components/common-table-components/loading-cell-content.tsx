import { Skeleton } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';

export const LoadingCellContent = () => (
  <Container>
    <Skeleton variant="text" width="100%" height="100%" />
  </Container>
);

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  padding: 4px;
  width: 100%;
`;
