import { Box, HStack } from '@navikt/ds-react';

export interface PopupProps {
  isOpen: boolean;
  direction?: 'left' | 'right';
  maxWidth?: string;
  maxHeight?: number;
  children: React.ReactNode;
}

export const Popup = ({ isOpen, direction, maxWidth, maxHeight = 500, children }: PopupProps) => {
  if (!isOpen) {
    return null;
  }

  const isLeft = direction === 'left';

  return (
    <HStack
      asChild
      maxHeight={`${maxHeight}px`}
      maxWidth={maxWidth ?? 'unset'}
      minWidth="275px"
      className={`top-full z-22 ${isLeft ? 'right-0' : 'left-0'}`}
    >
      <Box background="bg-default" borderRadius="medium" shadow="medium" position="absolute">
        {children}
      </Box>
    </HStack>
  );
};
