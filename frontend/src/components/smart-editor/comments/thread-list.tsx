import { styled } from 'styled-components';
import { ExpandableThread } from './expandable-thread';
import { SkeletonThread } from './skeleton-thread';
import { useThreads } from './use-threads';

export const ThreadList = () => {
  const { attached, isLoading } = useThreads();

  if (isLoading) {
    return (
      <StyledThreadSections>
        <StyledThreadListContainer>
          <SkeletonThread />
          <SkeletonThread />
          <SkeletonThread />
        </StyledThreadListContainer>
      </StyledThreadSections>
    );
  }

  return (
    <StyledThreadSections>
      <StyledThreadListContainer>
        {attached.map((thread) => (
          <ExpandableThread key={thread.id} thread={thread} isFocused={thread.isFocused} />
        ))}
      </StyledThreadListContainer>
    </StyledThreadSections>
  );
};

const StyledThreadSections = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  row-gap: var(--a-spacing-4);
  padding-left: var(--a-spacing-4);
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  padding-bottom: var(--a-spacing-8);
  overflow-y: auto;
  overflow-x: hidden;
  scroll-snap-type: y proximity;
  scroll-padding-bottom: var(--a-spacing-6);
  scroll-padding-top: var(--a-spacing-12);
`;

const StyledThreadListContainer = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-4);
  height: 100%;
`;
