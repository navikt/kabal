import { Box, type BoxProps, Fieldset, HStack, Heading, VStack } from '@navikt/ds-react';
import { styled } from 'styled-components';

type Props = Omit<BoxProps, 'asChild' | 'padding' | 'borderRadius' | 'shadow' | 'height'>;

export const SettingsSection = ({ children, ...rest }: Props) => (
  <Box asChild padding="6" borderRadius="medium" shadow="medium" height="fit" {...rest}>
    <VStack as="section" align="start">
      {children}
    </VStack>
  </Box>
);

export const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <Heading level="1" size="medium" spacing>
    <HStack align="center" gap="2">
      {children}
    </HStack>
  </Heading>
);

export const StyledFieldset = styled(Fieldset)`
  display: grid;
  grid-template-columns: repeat(auto-fit, 300px);
  width: 100%;
`;
