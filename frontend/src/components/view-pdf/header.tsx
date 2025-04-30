import { Box, HStack } from '@navikt/ds-react';

interface HeaderProps {
  children: React.ReactNode;
}

export const Header = ({ children }: HeaderProps) => (
  <HStack asChild align="center" justify="start" gap="0 1" position="relative" width="100%" wrap={false}>
    <Box background="surface-success-subtle" padding="2" className="z-1">
      {children}
    </Box>
  </HStack>
);
