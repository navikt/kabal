import { Box, VStack } from '@navikt/ds-react';

interface BehandlingSectionProps {
  children: React.ReactNode;
}

export const StyledBehandlingSection = ({ children }: BehandlingSectionProps) => (
  <Box padding="space-16" minHeight="100%" background="default">
    {children}
  </Box>
);

interface DateContainerProps {
  children: React.ReactNode;
}

export const DateContainer = ({ children }: DateContainerProps) => (
  <VStack marginBlock="space-0 space-1">{children}</VStack>
);
