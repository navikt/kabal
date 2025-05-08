import { Box, VStack } from '@navikt/ds-react';

interface BehandlingSectionProps {
  children: React.ReactNode;
}

export const StyledBehandlingSection = ({ children }: BehandlingSectionProps) => (
  <Box padding="4" minHeight="100%" background="bg-default">
    {children}
  </Box>
);

interface DateContainerProps {
  children: React.ReactNode;
}

export const DateContainer = ({ children }: DateContainerProps) => <VStack marginBlock="0 4">{children}</VStack>;
