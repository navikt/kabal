import { TextField } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSetTitleMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { IMainDocument } from '@app/types/documents/documents';

interface Props {
  document: IMainDocument;
  onDone?: () => void;
  autoFocus?: boolean;
  className?: string;
  hideLabel?: boolean;
}

export const SetFilename = ({ document, onDone, autoFocus, className, hideLabel }: Props) => {
  const oppgaveId = useOppgaveId();
  const [localFilename, setLocalFilename] = useState(document.tittel);
  const [setFilename] = useSetTitleMutation();

  const save = () => {
    onDone?.();

    if (localFilename === document.tittel || typeof oppgaveId !== 'string') {
      return;
    }

    setFilename({ oppgaveId, dokumentId: document.id, title: localFilename });
  };

  return (
    <TextField
      autoFocus={autoFocus}
      className={className}
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
          setLocalFilename(document.tittel);
          onDone?.();
        }
      }}
    />
  );
};
