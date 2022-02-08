import { Input } from 'nav-frontend-skjema';
import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (typeof localFilename === 'undefined' || localFilename === document.tittel) {
      return;
    }

    const timeout = setTimeout(() => {
      setFilename({ oppgaveId, dokumentId: document.id, title: localFilename });
    }, 250);
    return () => clearTimeout(timeout); // Clear existing timer every time it runs.
  }, [oppgaveId, document, setFilename, localFilename]);

  return (
    <StyledInput
      autoFocus
      bredde="fullbredde"
      mini
      value={localFilename}
      onChange={({ target }) => setLocalFilename(target.value)}
      onBlur={({ target }) => {
        setLocalFilename(target.value);
        setFilename({ oppgaveId, dokumentId: document.id, title: localFilename });
        onDone();
      }}
      onKeyDown={({ key }) => {
        if (key === 'Enter') {
          setFilename({ oppgaveId, dokumentId: document.id, title: localFilename });
          onDone();
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
