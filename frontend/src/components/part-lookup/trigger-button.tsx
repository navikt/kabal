import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';

interface TriggerButtonProps {
  label: string;
  size: 'small' | 'medium';
  disabled: boolean;
  open: boolean;
  externalLoading: boolean;
  popoverId: string;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const TriggerButton = ({
  ref,
  label,
  size,
  disabled,
  open,
  externalLoading,
  popoverId,
  onClick,
  onKeyDown,
}: TriggerButtonProps & { ref: React.Ref<HTMLButtonElement> }) => (
  <Tooltip content={label}>
    <Button
      ref={ref}
      type="button"
      data-color="neutral"
      variant="tertiary"
      size={size}
      onClick={onClick}
      onKeyDown={onKeyDown}
      disabled={disabled}
      icon={<MagnifyingGlassIcon aria-hidden />}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label={label}
      aria-controls={open ? popoverId : undefined}
      loading={externalLoading}
    />
  </Tooltip>
);
