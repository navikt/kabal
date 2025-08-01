import { merge } from '@app/functions/classes';
import { BoxNew, type BoxNewProps, HStack } from '@navikt/ds-react';
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
      rest.onDragEnter?.(e);
    },
    [active, rest.onDragEnter],
  );

  const onDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      dragEnterCount.current -= 1;

      if (dragEnterCount.current === 0) {
        setIsDragOver(false);
      }
      rest.onDragLeave?.(e);
    },
    [rest.onDragLeave],
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
  const outlineClassname = danger ? 'outline-border-danger' : 'outline-border-action';
  const textStrokeClassname = danger ? 'text-stroke-text-on-danger' : 'text-stroke-text-on-action';

  return (
    <HStack
      asChild
      role="presentation"
      position="absolute"
      align="center"
      justify="center"
      top="0"
      left="0"
      right="0"
      bottom="0"
      gap="1"
      wrap={false}
      className={merge(
        `font-bold outline-dashed outline-2 backdrop-blur-[2px] ${textStrokeClassname} ${outlineClassname}`,
        className,
      )}
    >
      <BoxNew borderRadius="medium" background={getBackgroundClassname(isDragOver, danger)}>
        {icon} <span>{label}</span>
      </BoxNew>
    </HStack>
  );
};

const getBackgroundClassname = (isDragOver: boolean, danger: boolean): BoxNewProps['background'] => {
  if (danger) {
    return isDragOver ? 'danger-moderateA' : 'danger-softA';
  }

  return isDragOver ? 'accent-moderateA' : 'neutral-moderateA';
};
