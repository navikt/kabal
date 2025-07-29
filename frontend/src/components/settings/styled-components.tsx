import { BoxNew, type BoxNewProps, Heading, HStack, VStack } from '@navikt/ds-react';

type Props = Omit<BoxNewProps, 'asChild' | 'padding' | 'borderRadius' | 'shadow' | 'height'>;

export const SettingsSection = ({ children, ...rest }: Props) => (
  <BoxNew asChild padding="6" borderRadius="medium" shadow="dialog" height="fit" {...rest}>
    <VStack as="section" align="start">
      {children}
    </VStack>
  </BoxNew>
);

export const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <Heading level="1" size="medium" spacing>
    <HStack align="center" gap="2">
      {children}
    </HStack>
  </Heading>
);
