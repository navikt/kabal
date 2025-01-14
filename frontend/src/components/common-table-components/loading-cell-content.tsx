import { Skeleton, type SkeletonProps } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const LoadingCellContent = (props: SkeletonProps) => (
  <Container>
    <Skeleton variant="text" width="100%" height="100%" {...props} />
  </Container>
);

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  padding: var(--a-spacing-1);
  width: 100%;
`;
