import { Keys } from '@app/keys';
import { TextField } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  tittel: string;
  setFilename: (filename: string) => Promise<void>;
  autoFocus?: boolean;
  hideLabel?: boolean;
  className?: string;
  close?: () => void;
  tabIndex?: number;
  disabled?: boolean;
  ref?: React.RefObject<HTMLInputElement | null>;
}

export const SetFilename = ({
  tittel,
  setFilename,
  autoFocus,
  hideLabel,
  className,
  close,
  tabIndex,
  disabled,
  ref,
}: Props) => {
  const [isSaving, setIsSaving] = useState(false);
  const [localFilename, setLocalFilename] = useState(tittel ?? '');

  const save = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    await setFilename(localFilename);
    close?.();
    setIsSaving(false);

    if (localFilename === tittel) {
      return;
    }
  };

  return (
    <TextField
      className={`w-full ${className}`}
      autoFocus={autoFocus}
      size="small"
      value={localFilename}
      title="Trykk Enter for å lagre. Escape for å avbryte."
      label="Endre filnavn"
      hideLabel={hideLabel}
      data-testid="document-filename-input"
      onChange={({ target }) => setLocalFilename(target.value)}
      onBlur={save}
      onKeyDown={({ key }) => {
        if (key === Keys.Enter) {
          save();
        } else if (key === Keys.Escape) {
          setLocalFilename(tittel ?? '');
          close?.();
        }
      }}
      tabIndex={tabIndex}
      disabled={disabled}
      ref={ref}
      readOnly={isSaving}
    />
  );
};
