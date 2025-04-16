import { OrphansModal } from '@app/components/smart-editor/comments/orphans-modal';
import { useAnnotationsCounts } from '@app/components/smart-editor/comments/use-annotations-counts';
import { ChatElipsisIcon } from '@navikt/aksel-icons';
import { Box, HStack } from '@navikt/ds-react';

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
  <HStack
    asChild
    align="center"
    gap="0 2"
    position="sticky"
    minWidth="382px"
    height="36px"
    top="4"
    className="z-10 [grid-area:counters]"
  >
    <Box background="bg-default" shadow="medium" marginInline="4" marginBlock="4" paddingInline="2" flexShrink="0">
      <ChatElipsisIcon aria-hidden fontSize={20} />
      {children}
    </Box>
  </HStack>
);

interface TextContainerProps {
  children: React.ReactNode;
}

const TextContainer = ({ children }: TextContainerProps) => (
  <span className="inline-flex items-center">{children}</span>
);
