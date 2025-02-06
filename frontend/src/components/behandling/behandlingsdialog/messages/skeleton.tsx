import { Skeleton, VStack } from '@navikt/ds-react';

export const SKELETON = (
  <VStack gap="3">
    <Skeleton variant="text" width="125px" height="24px" />
    <Skeleton variant="rounded" width="100%" height="62px" />
    <Skeleton variant="rounded" width="164px" height="34px" />
  </VStack>
);
