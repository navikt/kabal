import { ChatElipsisIcon } from '@navikt/aksel-icons';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { OrphansModal } from '@app/components/smart-editor/comments/orphans-modal';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useThreads } from './use-threads';

export const NumberOfComments = () => {
  const { attached, orphans } = useThreads();
  const { bookmarksMap } = useContext(SmartEditorContext);

  const bookmarksCount = Object.keys(bookmarksMap).length;

  if (attached.length === 0 && orphans.length === 0 && bookmarksCount === 0) {
    return <Wrapper>Ingen kommentarer eller bokmerker</Wrapper>;
  }

  return (
    <Wrapper>
      <TextContainer>{threads(attached.length)}</TextContainer>

      {orphans.length === 0 ? null : <OrphansModal />}

      <TextContainer>{bookmarks(bookmarksCount)}</TextContainer>
    </Wrapper>
  );
};

const threads = (num: number) => `${num} ${num === 1 ? 'kommentar' : 'kommentarer'}`;
const bookmarks = (num: number) => `${num} ${num === 1 ? 'bokmerke' : 'bokmerker'}`;

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => (
  <WrapperContainer>
    <StyledAlert>
      <ChatElipsisIcon aria-hidden fontSize={20} />
      {children}
    </StyledAlert>
  </WrapperContainer>
);

const WrapperContainer = styled.div`
  position: sticky;
  top: 16px;
  z-index: 10;
  grid-area: counters;
  display: flex;
  width: 100%;
  min-width: 382px;
  height: 52px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 16px;
  flex-shrink: 0;
`;

const StyledAlert = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 8px;
  align-items: center;
  padding-left: 8px;
  padding-right: 8px;
  width: 100%;
  min-width: 350px;
  height: 100%;
  background-color: white;
  box-shadow: var(--a-shadow-medium);
`;

const TextContainer = styled.span`
  display: inline-flex;
  align-items: center;
`;
