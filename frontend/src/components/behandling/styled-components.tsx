import { Box, VStack } from '@navikt/ds-react';

interface BehandlingSectionProps {
  children: React.ReactNode;
}

export const StyledBehandlingSection = ({ children }: BehandlingSectionProps) => (
  <Box asChild paddingInline="space-16" className="pb-180" minHeight="100%" background="default">
    <VStack gap="space-16">{children}</VStack>
  </Box>
);

interface DateContainerProps {
  children: React.ReactNode;
}

export const DateContainer = ({ children }: DateContainerProps) => (
  <VStack marginBlock="space-0 space-1">{children}</VStack>
);

export const PartBox = ({ children }: BehandlingSectionProps) => (
  <Box
    asChild
    background="neutral-soft"
    padding="space-16"
    borderColor="neutral-subtle"
    borderRadius="8"
    borderWidth="1"
  >
    <VStack gap="space-8" marginBlock="space-0 space-1">
      {children}
    </VStack>
  </Box>
);
