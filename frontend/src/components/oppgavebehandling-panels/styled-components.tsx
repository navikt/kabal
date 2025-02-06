import { Box, VStack } from '@navikt/ds-react';
import type { HTMLAttributes } from 'react';

export const PanelContainer = ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <VStack asChild height="100%" maxHeight="100%" minWidth="fit-content" position="relative" {...props}>
    <Box background="bg-default" shadow="medium" borderRadius="medium" overflowX="hidden" as="section">
      {children}
    </Box>
  </VStack>
);
