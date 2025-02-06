import { Box, HStack } from '@navikt/ds-react';
import { useEffect, useRef } from 'react';

interface PopupProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const Popup = ({ isOpen, children }: PopupProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      ref.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <HStack
      asChild
      wrap={false}
      maxHeight="400px"
      maxWidth="275px"
      position="absolute"
      left="0"
      style={{ top: '100%', zIndex: 22, scrollMarginBottom: 'var(--a-spacing-4)' }}
    >
      <Box background="bg-default" borderRadius="medium" borderWidth="1" borderColor="border-divider" shadow="medium">
        {children}
      </Box>
    </HStack>
  );
};
