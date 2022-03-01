import { Input } from 'nav-frontend-skjema';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useSetTitleMutation } from '../../../../redux-api/documents';
import { IMainDocument } from '../../../../types/documents';

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

    if (localFilename === document.tittel) {
      return;
    }

    setFilename({ oppgaveId, dokumentId: document.id, title: localFilename });
  };

  return (
    <StyledInput
      autoFocus
      bredde="fullbredde"
      mini
      value={localFilename}
      title="Trykk Enter for å lagre. Escape for å avbryte."
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

const StyledInput = styled(Input)`
  flex-grow: 1;
`;
