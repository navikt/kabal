import { Box, VStack, type VStackProps } from '@navikt/ds-react';
import type { Ref } from 'react';

type PanelContainerProps = VStackProps & {
  ref?: Ref<HTMLElement>;
};

export const PanelContainer = ({
  children,
  ref,
  position = 'relative',
  height = '100%',
  maxHeight = '100%',
  minWidth = 'fit-content',
  ...props
}: PanelContainerProps) => (
  <VStack asChild height={height} maxHeight={maxHeight} minWidth={minWidth} position={position} {...props}>
    <Box ref={ref} background="default" shadow="dialog" borderRadius="4" overflowX="hidden" as="section">
      {children}
    </Box>
  </VStack>
);
