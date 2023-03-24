import { PaperplaneIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Textarea } from '@navikt/ds-react';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { StyledCommentButtonContainer } from '../styled-components';

interface Props extends Omit<ButtonsProps, 'onSubmit' | 'disabled'> {
  close: () => void;
  isLoading: boolean;
  label: string;
  onFocus?: () => void;
  onSubmit: (value: string) => Promise<void>;
  text?: string;
  autoFocus?: boolean;
}

export const WriteComment = ({
  close,
  isLoading,
  label,
  onFocus = () => {},
  onSubmit,
  primaryButtonLabel,
  text = '',
  autoFocus = false,
}: Props) => {
  const [value, setValue] = useState(text);
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (ref.current !== null) {
      ref.current.setSelectionRange(0, text.length, 'forward');
    }
  }, [text.length]);

  const save = () => onSubmit(value).then(() => setValue(''));

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      save();

      return;
    }

    if (event.key === 'Escape') {
      close();
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
        minRows={3}
        onChange={({ target }) => setValue(target.value)}
        onFocus={onFocus}
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
};

interface ButtonsProps {
  close: () => void;
  disabled: boolean;
  isLoading: boolean;
  onSubmit: () => void;
  primaryButtonLabel: string;
}

const Buttons = ({ primaryButtonLabel, close, isLoading, onSubmit, disabled }: ButtonsProps) => (
  <StyledCommentButtonContainer>
    <Button
      disabled={disabled}
      icon={<PaperplaneIcon aria-hidden />}
      loading={isLoading}
      onClick={onSubmit}
      size="small"
      title="Ctrl/⌘ + Enter"
      type="button"
      variant="primary"
    >
      {primaryButtonLabel}
    </Button>
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
  </StyledCommentButtonContainer>
);
