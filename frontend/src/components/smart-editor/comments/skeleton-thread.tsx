import { BoxNew, Skeleton, VStack } from '@navikt/ds-react';

export const SkeletonThread = () => (
  <BoxNew
    asChild
    background="default"
    borderWidth="1"
    borderColor="neutral-subtle"
    borderRadius="medium"
    className="select-none snap-start opacity-50 transition-shadow duration-200 ease-in-out hover:shadow-ax-dialog"
  >
    <VStack as="section" gap="4" marginInline="3" padding="4">
      <VStack gap="1 0">
        <Skeleton variant="text" height={21} width="50%" />
        <Skeleton variant="text" height={19} width={115} />
        <Skeleton variant="text" height={21} width="80%" />
      </VStack>

      <Skeleton variant="text" height={21} width={40} className="self-end" />
    </VStack>
  </BoxNew>
);
