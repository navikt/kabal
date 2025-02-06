import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { Box, VStack } from '@navikt/ds-react';
import { useRef } from 'react';

export enum Direction {
  LEFT = 0,
  RIGHT = 1,
}

interface Props {
  children: React.ReactNode;
  close: () => void;
  direction: Direction;
}

export const PopupContainer = ({ children, close, direction }: Props) => {
  const ref = useRef(null);
  useOnClickOutside(ref, close);

  const isLeft = direction === Direction.LEFT;

  return (
    <VStack asChild gap="4" style={{ bottom: '100%', left: isLeft ? 'auto' : 0, right: isLeft ? 0 : 'auto' }} ref={ref}>
      <Box position="absolute" background="bg-default" shadow="medium" padding="4">
        {children}
      </Box>
    </VStack>
  );
};
