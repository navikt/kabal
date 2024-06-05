import { Skeleton } from '@navikt/ds-react';
import { styled } from 'styled-components';

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-2);
`;

export const SELECT_SKELETON = (
  <>
    <Skeleton variant="text" width="125px" />
    <Skeleton variant="rounded" width="100%" height="32px" />
  </>
);

export const SKELETON = (
  <SkeletonContainer>
    {SELECT_SKELETON}
    <Skeleton variant="text" width="125px" />
    <Skeleton variant="rounded" width="100%" height="32px" />
  </SkeletonContainer>
);
