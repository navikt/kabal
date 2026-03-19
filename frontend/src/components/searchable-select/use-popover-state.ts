import { useCallback, useRef, useState } from 'react';
import { Keys } from '@/keys';

interface UsePopoverStateOptions {
  onOpen?: () => void;
  onClose?: () => void;
}

export const usePopoverState = ({ onOpen, onClose }: UsePopoverStateOptions = {}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closedByPopoverRef = useRef(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
    onOpen?.();
  }, [onOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
    closedByPopoverRef.current = true;
    requestAnimationFrame(() => {
      closedByPopoverRef.current = false;
    });
    buttonRef.current?.focus();
    onClose?.();
  }, [onClose]);

  const handleButtonClick = useCallback(() => {
    if (closedByPopoverRef.current) {
      closedByPopoverRef.current = false;

      return;
    }

    if (open) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [open, handleClose, handleOpen]);

  const onButtonKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === Keys.ArrowDown || e.key === Keys.ArrowUp) {
        e.preventDefault();
        handleOpen();
      }
    },
    [handleOpen],
  );

  return { open, buttonRef, handleOpen, handleClose, handleButtonClick, onButtonKeyDown };
};
