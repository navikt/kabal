import { Box, HStack } from '@navikt/ds-react';

interface StyledToolbarProps {
  children: React.ReactNode;
}

export const StyledToolbar = ({ children }: StyledToolbarProps) => (
  <HStack asChild position="sticky" justify="center" wrap={false} top="4" left="0" style={{ zIndex: 21 }}>
    <Box background="bg-default" shadow="medium" padding="05" marginBlock="0 4" width="210mm" gridColumn="toolbar">
      {children}
    </Box>
  </HStack>
);
