import { ExpandableThread } from '@app/components/smart-editor/comments/expandable-thread';
import { SkeletonThread } from '@app/components/smart-editor/comments/skeleton-thread';
import { useThreads } from '@app/components/smart-editor/comments/use-threads';
import { VStack } from '@navikt/ds-react';

export const ThreadList = () => {
  const { attached, isLoading } = useThreads();

  if (isLoading) {
    return (
      <VStack
        as="section"
        align="end"
        gap="space-16"
        paddingInline="space-16 space-0"
        paddingBlock="space-0 space-32"
        flexShrink="0"
        height="100%"
        width="100%"
        overflowY="auto"
        overflowX="hidden"
        className="snap-y snap-proximity scroll-pt-12 scroll-pb-6"
      >
        <SkeletonThread />
        <SkeletonThread />
        <SkeletonThread />
      </VStack>
    );
  }

  return (
    <VStack
      as="section"
      align="end"
      gap="space-16"
      paddingInline="space-16 space-0"
      paddingBlock="space-0 space-32"
      flexShrink="0"
      height="100%"
      width="100%"
      overflowY="auto"
      overflowX="hidden"
      className="snap-y snap-proximity scroll-pt-12 scroll-pb-6"
    >
      {attached.map((thread, i) => (
        <ExpandableThread key={thread.id} thread={thread} isFocused={thread.isFocused} style={{ zIndex: i + 1 }} />
      ))}
    </VStack>
  );
};
