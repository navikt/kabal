import { VStack } from '@navikt/ds-react';
import { ExpandableThread } from './expandable-thread';
import { SkeletonThread } from './skeleton-thread';
import { useThreads } from './use-threads';

export const ThreadList = () => {
  const { attached, isLoading } = useThreads();

  if (isLoading) {
    return (
      <VStack
        as="section"
        align="end"
        gap="4"
        paddingInline="4 0"
        paddingBlock="0 8"
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
      gap="4"
      paddingInline="4 0"
      paddingBlock="0 8"
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
