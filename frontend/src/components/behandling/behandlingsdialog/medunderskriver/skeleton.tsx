import { Skeleton } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-3);
`;

export const SKELETON = (
  <SkeletonContainer>
    <Skeleton variant="text" width="125px" />
    <Skeleton variant="rounded" width="100%" height="32px" />
  </SkeletonContainer>
);
