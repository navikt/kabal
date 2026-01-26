import { Scaling } from '@app/plate/status-bar/scaling';
import { Box, HStack } from '@navikt/ds-react';

interface Props {
  children?: React.ReactNode;
}

export const StatusBar = ({ children }: Props) => (
  <HStack asChild align="center" justify="space-between" paddingBlock="space-2" paddingInline="space-8" width="100%">
    <Box background="neutral-soft" borderWidth="1 0 0 0" borderColor="neutral" borderRadius="0 0 8 8">
      <Scaling />
      {children}
    </Box>
  </HStack>
);
