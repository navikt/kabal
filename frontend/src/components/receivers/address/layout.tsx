import { Box, type BoxProps, VStack } from '@navikt/ds-react';

export enum AddressState {
  SAVED = 0,
  OVERRIDDEN = 1,
  UNSAVED = 2,
}

interface ContainerProps {
  children: React.ReactNode;
  state: AddressState;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export const Container = ({ children, state, onKeyDown }: ContainerProps) => (
  <VStack
    asChild
    position="relative"
    justify="center"
    minHeight="8"
    gap="space-8"
    padding="space-8"
    onKeyDown={onKeyDown}
  >
    <Box background={getBackgroundColor(state)}>{children}</Box>
  </VStack>
);

const getBackgroundColor = (state: AddressState): BoxProps['background'] => {
  switch (state) {
    case AddressState.SAVED:
      return undefined;
    case AddressState.OVERRIDDEN:
      return 'meta-purple-moderate';
    case AddressState.UNSAVED:
      return 'warning-moderate';
  }
};
