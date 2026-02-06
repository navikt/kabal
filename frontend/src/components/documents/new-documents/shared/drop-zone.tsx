import { merge } from '@app/functions/classes';
import { Box, type BoxProps, HStack } from '@navikt/ds-react';
import { useCallback, useRef, useState } from 'react';

interface DropZoneProps extends React.HTMLAttributes<HTMLDivElement>, OverlayContentProps {
  /**
   * Whether to show the drop overlay or not.
   */
  active: boolean;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  danger?: boolean;
  className?: string;
  children?: React.ReactNode;
  overlayClassName?: string;
}

export const DropZone = ({
  label,
  icon,
  active,
  className,
  danger = false,
  onDrop,
  children,
  overlayClassName,
  onDragEnter: externalOnDragEnter,
  onDragLeave: externalOnDragLeave,
  ...rest
}: DropZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const dragEnterCount = useRef(0);

  const internalOnDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      dragEnterCount.current = 0;

      setIsDragOver(false);

      onDrop(e);
    },
    [onDrop],
  );

  const onDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      dragEnterCount.current += 1;

      setIsDragOver(active);
      externalOnDragEnter?.(e);
    },
    [active, externalOnDragEnter],
  );

  const onDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      dragEnterCount.current -= 1;

      if (dragEnterCount.current === 0) {
        setIsDragOver(false);
      }
      externalOnDragLeave?.(e);
    },
    [externalOnDragLeave],
  );

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: ¯\_(ツ)_/¯
    <div
      data-drop-zone
      onDrop={internalOnDrop}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      className={merge('relative', className)}
      {...rest}
    >
      {children}
      {active ? (
        <Overlay label={label} icon={icon} danger={danger} isDragOver={isDragOver} className={overlayClassName} />
      ) : null}
    </div>
  );
};

interface OverlayContentProps {
  label?: string;
  icon?: React.ReactNode;
}

interface OverlayProps extends OverlayContentProps {
  danger: boolean;
  isDragOver: boolean;
  className?: string;
}

const Overlay = ({ danger, isDragOver, icon, label, className }: OverlayProps) => {
  const outlineClassname = danger ? 'outline-ax-border-danger' : 'outline-ax-border-accent';
  const textStrokeClassname = danger ? 'text-stroke-text-on-danger' : 'text-stroke-text-on-action';

  return (
    <HStack
      asChild
      role="presentation"
      position="absolute"
      align="center"
      justify="center"
      top="space-0"
      left="space-0"
      right="space-0"
      bottom="space-0"
      gap="space-4"
      wrap={false}
      className={merge(
        `font-ax-bold outline-dashed outline-2 backdrop-blur-[2px] ${textStrokeClassname} ${outlineClassname}`,
        className,
      )}
    >
      <Box borderRadius="4" background={getBackgroundClassname(isDragOver, danger)}>
        {icon} <span>{label}</span>
      </Box>
    </HStack>
  );
};

const getBackgroundClassname = (isDragOver: boolean, danger: boolean): BoxProps['background'] => {
  if (danger) {
    return isDragOver ? 'danger-moderateA' : 'danger-softA';
  }

  return isDragOver ? 'accent-moderateA' : 'neutral-moderateA';
};
