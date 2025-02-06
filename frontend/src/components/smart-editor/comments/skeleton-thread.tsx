import { Skeleton, VStack } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const SkeletonThread = () => (
  <StyledThread>
    <VStack gap="1 0">
      <Skeleton variant="text" height={21} width="50%" />
      <Skeleton variant="text" height={19} width={115} />
      <Skeleton variant="text" height={21} width="80%" />
    </VStack>
    <RightSkeleton variant="text" height={21} width={40} />
  </StyledThread>
);

const StyledThread = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-4);
  background-color: var(--a-bg-default);
  padding: var(--a-spacing-4);
  border: 1px solid #c9c9c9;
  border-radius: var(--a-border-radius-medium);
  margin-left: var(--a-spacing-3);
  margin-right: var(--a-spacing-3);
  user-select: none;
  opacity: 0.5;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  transition-property: box-shadow;
  scroll-snap-align: start;

  &:hover {
    box-shadow: var(--a-shadow-medium);
  }
`;

const RightSkeleton = styled(Skeleton)`
  align-self: flex-end;
`;
