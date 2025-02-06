import { Box, HStack, Loader } from '@navikt/ds-react';

interface Props {
  text: string;
}

export const AppLoader = ({ text }: Props) => (
  <HStack asChild align="center" justify="center" height="100vh" width="100vw">
    <Box background="surface-subtle">
      <HStack align="center">
        <Loader size="2xlarge" variant="neutral" transparent title={text} />
        <span>{text}</span>
      </HStack>
    </Box>
  </HStack>
);
