import React from 'react';
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
  row-gap: 16px;
  padding-left: 16px;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  padding-bottom: 32px;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-snap-type: y proximity;
  scroll-padding-bottom: 24px;
  scroll-padding-top: 48px;
`;

const StyledThreadListContainer = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
`;
