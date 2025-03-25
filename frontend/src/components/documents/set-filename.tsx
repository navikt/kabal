import { Keys } from '@app/keys';
import { TextField } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  tittel: string;
  setFilename: (filename: string) => void;
  autoFocus?: boolean;
  hideLabel?: boolean;
  className?: string;
  close?: () => void;
  tabIndex?: number;
}

export const SetFilename = ({ tittel, setFilename, autoFocus, hideLabel, className, close, tabIndex }: Props) => {
  const [localFilename, setLocalFilename] = useState(tittel ?? '');

  const save = () => {
    close?.();

    if (localFilename === tittel) {
      return;
    }

    setFilename(localFilename);
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
        }

        if (key === Keys.Escape) {
          setLocalFilename(tittel ?? '');
          close?.();
        }
      }}
      tabIndex={tabIndex}
    />
  );
};
