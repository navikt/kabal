import { Box, HStack } from '@navikt/ds-react';

export const ToolbarSeparator = () => (
  <HStack asChild width="1px" height="8" marginInline="1">
    <Box background="bg-subtle" />
  </HStack>
);
