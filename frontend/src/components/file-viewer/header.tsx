import { Box, HStack } from '@navikt/ds-react';

interface HeaderProps {
  children: React.ReactNode;
}

export const Header = ({ children }: HeaderProps) => (
  <HStack asChild align="center" justify="space-between" gap="space-4" position="relative" width="100%" wrap={false}>
    <Box background="success-soft" padding="space-8" className="z-1">
      {children}
    </Box>
  </HStack>
);
