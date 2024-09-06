import { ChatElipsisIcon } from '@navikt/aksel-icons';
import { styled } from 'styled-components';
import { OrphansModal } from '@app/components/smart-editor/comments/orphans-modal';
import { useAnnotationsCounts } from '@app/components/smart-editor/comments/use-annotations-counts';

export const NumberOfComments = () => {
  const { attached, orphans, bookmarks: bookmarksCount } = useAnnotationsCounts();

  if (attached === 0 && orphans === 0 && bookmarksCount === 0) {
    return null;
  }

  return (
    <Wrapper>
      <TextContainer>{threads(attached)}</TextContainer>

      {orphans === 0 ? null : <OrphansModal />}

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
  top: var(--a-spacing-4);
  z-index: 10;
  grid-area: counters;
  display: flex;
  width: 100%;
  min-width: 382px;
  height: 52px;
  padding-left: var(--a-spacing-4);
  padding-right: var(--a-spacing-4);
  padding-bottom: var(--a-spacing-4);
  flex-shrink: 0;
`;

const StyledAlert = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: var(--a-spacing-2);
  align-items: center;
  padding-left: var(--a-spacing-2);
  padding-right: var(--a-spacing-2);
  width: 100%;
  min-width: 350px;
  height: 100%;
  background-color: var(--a-bg-default);
  box-shadow: var(--a-shadow-medium);
`;

const TextContainer = styled.span`
  display: inline-flex;
  align-items: center;
`;
