import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { TextField } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  tittel: string;
  setFilename: (filename: string) => void;
  autoFocus?: boolean;
  hideLabel?: boolean;
  className?: string;
  close?: () => void;
  templateId?: TemplateIdEnum | undefined;
}

export const SetFilename = ({ tittel, setFilename, autoFocus, hideLabel, className, close, templateId }: Props) => {
  const [localFilename, setLocalFilename] = useState(defaultSuggestion(tittel, templateId));

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
        if (key === 'Enter') {
          save();
        }

        if (key === 'Escape') {
          setLocalFilename(tittel ?? '');
          close?.();
        }
      }}
    />
  );
};

const defaultSuggestion = (tittel: string, templateId: TemplateIdEnum | undefined) => {
  switch (templateId) {
    case TemplateIdEnum.KLAGEVEDTAK_V1:
    case TemplateIdEnum.KLAGEVEDTAK_V2:
      return 'Klagevedtak';
    case TemplateIdEnum.ANKEVEDTAK:
      return 'Omgjøring av klagevedtak';
    default:
      return tittel;
  }
};
