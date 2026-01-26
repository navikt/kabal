import { Box, HStack } from '@navikt/ds-react';

interface StyledToolbarProps {
  children: React.ReactNode;
}

export const StyledToolbar = ({ children }: StyledToolbarProps) => (
  <HStack
    asChild
    position="sticky"
    wrap={false}
    top="space-16"
    left="space-0"
    className="z-22"
    marginBlock="space-0 space-1"
  >
    <Box background="raised" shadow="dialog" padding="space-2" width="210mm" className="[grid-area:toolbar]">
      {children}
    </Box>
  </HStack>
);
