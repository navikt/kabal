import { Skeleton, VStack } from '@navikt/ds-react';

export const SELECT_SKELETON = (
  <>
    <Skeleton variant="text" width="125px" />
    <Skeleton variant="rounded" width="100%" height="32px" />
  </>
);

export const SKELETON = (
  <VStack gap="space-8">
    {SELECT_SKELETON}
    <Skeleton variant="text" width="125px" />
    <Skeleton variant="rounded" width="100%" height="32px" />
  </VStack>
);
