import { BoxNew, HStack } from '@navikt/ds-react';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
  isActive: boolean;
  isDropTarget?: boolean;
  isDragOver?: boolean;
  isDragging?: boolean;
  dragOverText: string;
}

export const MaltekstseksjonListItem = ({
  isActive,
  isDropTarget,
  isDragOver,
  isDragging,
  dragOverText,
  children,
  ...rest
}: Props) => (
  <BoxNew
    position="relative"
    borderRadius="medium"
    background={isActive ? 'accent-moderate' : undefined}
    style={{
      opacity: isDragging ? 0.5 : 1,
      ['--hover-background-color' as string]: isActive ? 'var(--ax-bg-accent-moderate)' : 'var(--ax-bg-accent-soft)',
    }}
    className="transition-colors duration-200 ease-in-out hover:bg-(--hover-background-color)"
    {...rest}
  >
    {children}
    {isDropTarget ? (
      <HStack
        asChild
        top="0"
        left="0"
        right="0"
        bottom="0"
        width="100%"
        height="100%"
        align="center"
        justify="center"
        position="absolute"
      >
        <BoxNew
          borderRadius="medium"
          borderWidth="2"
          borderColor="accent"
          background={isDragOver ? 'accent-moderateA' : 'neutral-moderateA'}
          className="border-dashed text-shadow-[1px_1px_white,_-1px_-1px_var(--ax-bg-default)] backdrop-blur-[2px]"
        >
          {dragOverText}
        </BoxNew>
      </HStack>
    ) : null}
  </BoxNew>
);
