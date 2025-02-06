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
        style={{
          scrollSnapType: 'y proximity',
          scrollPaddingBottom: 'var(--a-spacing-6)',
          scrollPaddingTop: 'var(--a-spacing-12)',
        }}
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
      style={{
        scrollSnapType: 'y proximity',
        scrollPaddingBottom: 'var(--a-spacing-6)',
        scrollPaddingTop: 'var(--a-spacing-12)',
      }}
    >
      {attached.map((thread) => (
        <ExpandableThread key={thread.id} thread={thread} isFocused={thread.isFocused} />
      ))}
    </VStack>
  );
};
