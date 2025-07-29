import { BoxNew, HStack, Loader, VStack } from '@navikt/ds-react';

interface Props {
  text: string;
}

export const AppLoader = ({ text }: Props) => (
  <HStack asChild align="center" justify="center" height="100vh" width="100vw">
    <BoxNew background="overlay">
      <VStack align="center" justify="center">
        <Loader size="2xlarge" variant="neutral" transparent title={text} />
        <span>{text}</span>
      </VStack>
    </BoxNew>
  </HStack>
);
