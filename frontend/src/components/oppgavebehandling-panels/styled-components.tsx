import { Box, VStack, type VStackProps } from '@navikt/ds-react';

export const PanelContainer = ({
  children,
  position = 'relative',
  height = '100%',
  maxHeight = '100%',
  minWidth = 'fit-content',
  ...props
}: VStackProps) => (
  <VStack asChild height={height} maxHeight={maxHeight} minWidth={minWidth} position={position} {...props}>
    <Box background="default" shadow="dialog" borderRadius="4" overflowX="hidden" as="section">
      {children}
    </Box>
  </VStack>
);
