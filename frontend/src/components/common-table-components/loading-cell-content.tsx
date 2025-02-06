import { HStack, Skeleton, type SkeletonProps } from '@navikt/ds-react';

export const LoadingCellContent = (props: SkeletonProps) => (
  <HStack align="center" justify="center" padding="1" width="100%" height="34px">
    <Skeleton variant="text" width="100%" height="100%" {...props} />
  </HStack>
);
