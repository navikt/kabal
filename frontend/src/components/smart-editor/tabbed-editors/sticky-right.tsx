import { Bookmarks } from '@app/components/smart-editor/bookmarks/bookmarks';
import { CommentSection } from '@app/components/smart-editor/comments/comment-section';
import { NumberOfComments } from '@app/components/smart-editor/comments/number-of-comments';
import { VStack } from '@navikt/ds-react';

interface StickyRightProps {
  id: string;
}

export const StickyRight = ({ id }: StickyRightProps) => (
  <VStack gap="4 0" position="sticky" top="0" overflowY="auto" className="[grid-area:right]">
    <NumberOfComments />
    <Bookmarks editorId={id} />
    <CommentSection />
  </VStack>
);
