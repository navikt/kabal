import { TextField } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useSetTitleMutation } from '../../../../redux-api/oppgaver/mutations/documents';
import { IMainDocument } from '../../../../types/documents/documents';

interface Props {
  document: IMainDocument;
  onDone: () => void;
}

export const SetFilename = ({ document, onDone }: Props) => {
  const oppgaveId = useOppgaveId();
  const [localFilename, setLocalFilename] = useState(document.tittel);
  const [setFilename] = useSetTitleMutation();

  const save = () => {
    onDone();

    if (localFilename === document.tittel || typeof oppgaveId !== 'string') {
      return;
    }

    setFilename({ oppgaveId, dokumentId: document.id, title: localFilename });
  };

  return (
    <TextField
      autoFocus
      size="small"
      value={localFilename}
      title="Trykk Enter for å lagre. Escape for å avbryte."
      label="Trykk Enter for å lagre. Escape for å avbryte."
      hideLabel
      data-testid="document-filename-input"
      onChange={({ target }) => setLocalFilename(target.value)}
      onBlur={save}
      onKeyDown={({ key }) => {
        if (key === 'Enter') {
          save();
        }

        if (key === 'Escape') {
          setLocalFilename(document.tittel);
          onDone();
        }
      }}
    />
  );
};
