import { Skeleton } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const SkeletonThread = () => (
  <StyledThread>
    <ThreadContent>
      <Skeleton variant="text" height={21} width="50%" />
      <Skeleton variant="text" height={19} width={115} />
      <Skeleton variant="text" height={21} width="80%" />
    </ThreadContent>
    <RightSkeleton variant="text" height={21} width={40} />
  </StyledThread>
);

const StyledThread = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: white;
  padding: 16px;
  border: 1px solid #c9c9c9;
  border-radius: var(--a-border-radius-medium);
  margin-left: 12px;
  margin-right: 12px;
  user-select: none;
  opacity: 0.5;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  transition-property: box-shadow;
  scroll-snap-align: start;

  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
`;

const ThreadContent = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
`;

const RightSkeleton = styled(Skeleton)`
  align-self: flex-end;
`;
