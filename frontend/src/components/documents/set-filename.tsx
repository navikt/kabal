import { TextField } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { Keys } from '@/keys';

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
  const [localFilename, setLocalFilename] = useState(tittel);
  const cancelledRef = useRef(false);

  const save = async () => {
    if (isSaving) {
      return;
    }

    if (cancelledRef.current) {
      cancelledRef.current = false;
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
      onChange={({ target }) => setLocalFilename(target.value)}
      onBlur={save}
      onKeyDown={({ key }) => {
        if (key === Keys.Enter) {
          save();
        } else if (key === Keys.Escape) {
          cancelledRef.current = true;
          setLocalFilename(tittel);
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
