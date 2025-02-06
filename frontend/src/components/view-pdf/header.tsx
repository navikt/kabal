import { Box, HStack } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface HeaderProps {
  children: React.ReactNode;
}

export const Header = ({ children }: HeaderProps) => (
  <HStack asChild align="center" justify="start" gap="0 1" position="relative" width="100%">
    <Box background="surface-success-subtle" padding="2" style={{ zIndex: 1 }}>
      {children}
    </Box>
  </HStack>
);

export const StyledDocumentTitle = styled.h1`
  font-size: var(--a-spacing-4);
  font-weight: bold;
  margin: 0;
  padding-left: var(--a-spacing-2);
  padding-right: var(--a-spacing-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
