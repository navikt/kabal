import { BoxNew, HStack } from '@navikt/ds-react';

export const ToolbarSeparator = () => (
  <HStack asChild width="1px" height="8" marginInline="1">
    <BoxNew background="neutral-soft" />
  </HStack>
);
