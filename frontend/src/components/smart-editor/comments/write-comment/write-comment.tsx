import { Keys, MOD_KEY_TEXT, isMetaKey } from '@app/keys';
import { PaperplaneIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, HStack, Textarea, Tooltip } from '@navikt/ds-react';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

interface Props extends Omit<ButtonsProps, 'onSubmit' | 'disabled'> {
  close?: () => void;
  isLoading: boolean;
  label: string;
  onSubmit: (value: string) => Promise<void>;
  text?: string;
  autoFocus?: boolean;
}

export const WriteComment = forwardRef<HTMLTextAreaElement | null, Props>(
  ({ close, isLoading, label, onSubmit, primaryButtonLabel, text = '', autoFocus = false }, outerRef) => {
    const [value, setValue] = useState(text);
    const ref = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(outerRef, () => ref.current);

    useEffect(() => {
      if (autoFocus && ref.current !== null) {
        ref.current.focus();
        ref.current.setSelectionRange(ref.current.value.length, ref.current.value.length, 'forward');
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, [autoFocus]);

    const save = () => onSubmit(value).then(() => setValue(''));

    const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
      if (isMetaKey(event) && event.key === Keys.Enter) {
        event.preventDefault();
        save();

        return;
      }

      if (event.key === Keys.Escape) {
        close?.();
      }
    };

    return (
      <>
        <Textarea
          autoFocus={autoFocus}
          disabled={isLoading}
          hideLabel
          label={label}
          maxLength={0}
          minRows={1}
          onChange={({ target }) => setValue(target.value)}
          onKeyDown={onKeyDown}
          placeholder="Skriv inn en kommentar"
          ref={ref}
          size="small"
          value={value}
        />
        <Buttons
          close={close}
          disabled={value.length === 0}
          isLoading={isLoading}
          onSubmit={save}
          primaryButtonLabel={primaryButtonLabel}
        />
      </>
    );
  },
);

WriteComment.displayName = 'WriteComment';

interface ButtonsProps {
  close?: () => void;
  disabled: boolean;
  isLoading: boolean;
  onSubmit: () => void;
  primaryButtonLabel: string;
}

const Buttons = ({ primaryButtonLabel, close, isLoading, onSubmit, disabled }: ButtonsProps) => (
  <HStack justify="space-between" wrap gap="4" marginBlock="4 0" marginInline="0 5" width="100%">
    <Tooltip content={primaryButtonLabel} keys={[MOD_KEY_TEXT, 'Enter']}>
      <Button
        disabled={disabled}
        icon={<PaperplaneIcon aria-hidden />}
        loading={isLoading}
        onClick={onSubmit}
        size="small"
        type="button"
        variant="primary"
      >
        {primaryButtonLabel}
      </Button>
    </Tooltip>
    {close === undefined ? null : (
      <Tooltip content="Avbryt" keys={['Esc']}>
        <Button
          disabled={isLoading}
          icon={<XMarkIcon aria-hidden />}
          onClick={close}
          size="small"
          title="Escape"
          type="button"
          variant="secondary"
        >
          Avbryt
        </Button>
      </Tooltip>
    )}
  </HStack>
);
