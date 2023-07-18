import React from 'react';
import { styled } from 'styled-components';
import { Thread } from './thread';
import { useThreads } from './use-threads';

export const ThreadList = () => {
  const { attached, orphans, isLoading } = useThreads();

  if (isLoading || (attached.length === 0 && orphans.length === 0)) {
    return null;
  }

  return (
    <StyledThreadSections>
      <StyledThreadListContainer>
        {attached.map((thread) => (
          <Thread key={thread.id} thread={thread} isFocused={thread.isFocused} />
        ))}
      </StyledThreadListContainer>
      <StyledThreadListContainer>
        <Header show={orphans.length !== 0} />
        {orphans.map((thread) => (
          <Thread key={thread.id} thread={thread} isFocused={thread.isFocused} />
        ))}
      </StyledThreadListContainer>
    </StyledThreadSections>
  );
};

const StyledThreadSections = styled.div`
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  padding-top: 16px;
  padding-bottom: 32px;
  overflow-y: auto;
  scroll-snap-type: y proximity;
  scroll-padding-bottom: 24px;
  scroll-padding-top: 48px;
`;

const StyledThreadListContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

interface HeaderProps {
  show: boolean;
}

const Header = ({ show }: HeaderProps) => {
  if (!show) {
    return null;
  }

  return (
    <>
      <StyledHeader>Andre kommentarer</StyledHeader>
      <Description>Kommentarer som ikke lenger har noen direkte tilknytning til dokumentinnholdet.</Description>
    </>
  );
};

const Description = styled.p`
  margin-left: 24px;
  margin-right: 24px;
  white-space: pre-wrap;
`;

const StyledHeader = styled.h1`
  font-size: 20px;
  margin-left: 24px;
  margin-right: 24px;
`;
