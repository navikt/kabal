import { Box, type BoxProps, VStack } from '@navikt/ds-react';

interface Props {
  children: React.ReactNode;
  accent: BoxProps['borderColor'];
  as?: keyof React.JSX.IntrinsicElements;
}

export const StyledReceiver = ({ children, accent, as = 'div' }: Props) => (
  <VStack asChild marginBlock="space-0 space-8" className="last:mb-0">
    <Box
      borderRadius="4"
      borderWidth="1 1 1 4"
      borderColor="neutral"
      style={{ borderLeftColor: `var(--ax-border-${accent})` }}
      as={as}
    >
      {children}
    </Box>
  </VStack>
);
