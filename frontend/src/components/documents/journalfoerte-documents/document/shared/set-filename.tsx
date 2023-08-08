import { TextField } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useState } from 'react';
import { styled } from 'styled-components';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSetTitleMutation } from '@app/redux-api/journalposter';
import { useGetJournalpostIdListQuery } from '@app/redux-api/oppgaver/queries/documents';

interface Props {
  journalpostId: string;
  dokumentInfoId: string;
  tittel: string;
  onDone: () => void;
}

export const SetFilename = ({ onDone, dokumentInfoId, journalpostId, tittel }: Props) => {
  const oppgaveId = useOppgaveId();
  const [localFilename, setLocalFilename] = useState(tittel ?? '');
  const [setFilename] = useSetTitleMutation();
  const { data } = useGetJournalpostIdListQuery(oppgaveId === skipToken ? skipToken : { oppgaveId });

  const save = () => {
    onDone();

    if (localFilename === tittel || oppgaveId === skipToken || data === undefined) {
      return;
    }

    setFilename({
      journalpostId,
      dokumentInfoId,
      tittel: localFilename,
      oppgaveId,
      journalpostList: data.journalpostList,
    });
  };

  return (
    <StyledTextField
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
          setLocalFilename(tittel ?? '');
          onDone();
        }
      }}
    />
  );
};

const StyledTextField = styled(TextField)`
  width: 100%;
`;
