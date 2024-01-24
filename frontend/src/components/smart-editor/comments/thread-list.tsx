import { Alert, Heading, HelpText } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { SkeletonThread } from './skeleton-thread';
import { Thread } from './thread';
import { useThreads } from './use-threads';

export const ThreadList = () => {
  const { attached, orphans, isLoading } = useThreads();

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

  if (attached.length === 0 && orphans.length === 0) {
    return (
      <StyledThreadSections>
        <NoCommentsContainer>
          <Alert variant="success" size="small">
            Ingen kommentarer
          </Alert>
        </NoCommentsContainer>
      </StyledThreadSections>
    );
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
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  row-gap: 16px;
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
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 340px;
`;

const NoCommentsContainer = styled.div`
  padding-left: 24px;
  padding-right: 24px;
`;

interface HeaderProps {
  show: boolean;
}

const Header = ({ show }: HeaderProps) => {
  if (!show) {
    return null;
  }

  return (
    <Explainer>
      <StyledHeading level="1" size="medium">
        <span>Andre kommentarer</span>
        <HelpText>Kommentarer som ikke lenger har noen direkte tilknytning til dokumentinnholdet.</HelpText>
      </StyledHeading>
    </Explainer>
  );
};

const Explainer = styled.div`
  margin-left: 16px;
  margin-right: 16px;
`;

const StyledHeading = styled(Heading)`
  display: flex;
  flex-direction: row;
  column-gap: 8px;
  align-items: center;
`;
