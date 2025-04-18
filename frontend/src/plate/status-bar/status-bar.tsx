import { Scaling } from '@app/plate/status-bar/scaling';
import { Box, HStack } from '@navikt/ds-react';

interface Props {
  children?: React.ReactNode;
}

export const StatusBar = ({ children }: Props) => (
  <HStack asChild align="center" justify="space-between" paddingBlock="05" paddingInline="2" width="100%">
    <Box background="bg-subtle" borderWidth="1 0 0 0" borderColor="border-default" borderRadius="0 0 medium medium">
      <Scaling />
      {children}
    </Box>
  </HStack>
);
