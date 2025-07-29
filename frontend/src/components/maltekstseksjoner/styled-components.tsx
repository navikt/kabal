import { BoxNew, type BoxNewProps, HStack } from '@navikt/ds-react';
import type { HTMLAttributes } from 'react';

interface TextListItemProps {
  isActive: boolean;
  isDragging: boolean;
}

const getHoverBackgroundColor = ({ isActive, isDragging }: TextListItemProps): BoxNewProps['background'] => {
  if (isDragging) {
    return 'neutral-moderate';
  }

  if (isActive) {
    return 'accent-moderate';
  }

  return 'accent-soft';
};

const getBackgroundColor = ({ isActive, isDragging }: TextListItemProps): BoxNewProps['background'] => {
  if (isDragging) {
    return 'neutral-moderate';
  }

  if (isActive) {
    return 'accent-moderate';
  }

  return undefined; // Transparent
};

export const TextListItem = ({
  className,
  style,
  isActive: $isActive,
  isDragging: $isDragging,
  ...rest
}: HTMLAttributes<HTMLElement> & TextListItemProps) => (
  <HStack
    asChild
    position="relative"
    align="center"
    gap="space-8"
    paddingInline="space-8 space-0"
    className={`transition-colors duration-200 ease-in-out ${className}`}
    wrap={false}
  >
    <BoxNew
      as="li"
      borderRadius="medium"
      background={getBackgroundColor({ isActive: $isActive, isDragging: $isDragging })}
      style={{
        ...style,
        ['--hover-background-color' as string]: getHoverBackgroundColor({
          isActive: $isActive,
          isDragging: $isDragging,
        }),
        ['--drag-shadow' as string]: $isDragging ? 'inset 0 0 0 1px rgba(0, 0, 0, 0.2)' : 'none',
        ['--drag-color' as string]: $isDragging ? 'rgba(0, 0, 0, 0.5)' : 'inherit',
      }}
      className="text-(--drag-color) shadow-(--drag-shadow) hover:bg-(--hover-background-color)"
      {...rest}
    />
  </HStack>
);

interface ListItemProps extends HTMLAttributes<HTMLElement> {
  isActive: boolean;
  isDropTarget?: boolean;
  isDragOver?: boolean;
  isDragging?: boolean;
  dragOverText: string;
}

export const ListItem = ({
  isActive,
  isDropTarget,
  isDragOver,
  isDragging,
  dragOverText,
  children,
  ...rest
}: ListItemProps) => (
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
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        width="100%"
        height="100%"
        align="center"
        justify="center"
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
