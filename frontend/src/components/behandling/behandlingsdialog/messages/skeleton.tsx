import { Skeleton } from '@navikt/ds-react';
import { styled } from 'styled-components';

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-3);
`;

export const SKELETON = (
  <SkeletonContainer>
    <Skeleton variant="text" width="125px" height="24px" />
    <Skeleton variant="rounded" width="100%" height="62px" />
    <Skeleton variant="rounded" width="164px" height="34px" />
  </SkeletonContainer>
);
