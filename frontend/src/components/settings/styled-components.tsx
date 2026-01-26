import { Box, type BoxProps, Heading, HStack, VStack } from '@navikt/ds-react';

type Props = Omit<BoxProps, 'asChild' | 'padding' | 'borderRadius' | 'shadow' | 'height'>;

export const SettingsSection = ({ children, ...rest }: Props) => (
  <Box asChild padding="space-24" borderRadius="4" shadow="dialog" height="fit" {...rest}>
    <VStack as="section" align="start">
      {children}
    </VStack>
  </Box>
);

export const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <Heading level="1" size="medium" spacing>
    <HStack align="center" gap="space-8">
      {children}
    </HStack>
  </Heading>
);
