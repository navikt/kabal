import { Box, Skeleton, VStack } from '@navikt/ds-react';

export const SkeletonThread = () => (
  <Box
    asChild
    background="default"
    borderWidth="1"
    borderColor="neutral-subtle"
    borderRadius="4"
    className="select-none snap-start opacity-50 transition-shadow duration-200 ease-in-out hover:shadow-ax-dialog"
  >
    <VStack as="section" gap="space-16" marginInline="space-12" padding="space-16">
      <VStack gap="space-4 space-0">
        <Skeleton variant="text" height={21} width="50%" />
        <Skeleton variant="text" height={19} width={115} />
        <Skeleton variant="text" height={21} width="80%" />
      </VStack>

      <Skeleton variant="text" height={21} width={40} className="self-end" />
    </VStack>
  </Box>
);
