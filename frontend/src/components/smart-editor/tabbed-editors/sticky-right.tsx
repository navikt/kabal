import { styled } from 'styled-components';
import { Bookmarks } from '@app/components/smart-editor/bookmarks/bookmarks';
import { CommentSection } from '@app/components/smart-editor/comments/comment-section';
import { NumberOfComments } from '@app/components/smart-editor/comments/number-of-comments';

interface StickyRightProps {
  id: string;
}

export const StickyRight = ({ id }: StickyRightProps) => (
  <StickyRightContainer>
    <NumberOfComments />
    <Bookmarks editorId={id} />
    <CommentSection />
  </StickyRightContainer>
);

const StickyRightContainer = styled.div`
  grid-area: right;
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-4);
  position: sticky;
  top: 0;
  overflow-y: auto;
`;
