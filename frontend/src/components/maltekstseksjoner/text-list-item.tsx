import { Box, HStack } from '@navikt/ds-react';
import type { HTMLAttributes } from 'react';

interface TextListItemProps {
  isActive: boolean;
  isDragging: boolean;
}

export const TextListItem = ({
  isActive,
  isDragging,
  ...rest
}: Omit<HTMLAttributes<HTMLElement>, 'className' | 'style'> & TextListItemProps) => (
  <HStack
    asChild
    position="relative"
    align="center"
    gap="space-8"
    paddingInline="space-8 space-0"
    className="transition-colors duration-200 ease-in-out"
    wrap={false}
  >
    <Box
      as="li"
      borderRadius="4"
      background={isActive ? 'accent-moderate' : undefined}
      style={{
        opacity: isDragging ? 0.6 : 1,
      }}
      className="hover:bg-ax-bg-accent-moderate-hover"
      {...rest}
    />
  </HStack>
);
