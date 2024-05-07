import { skipToken } from '@reduxjs/toolkit/query';
import React, { useCallback } from 'react';
import { EditLogiskVedlegg } from '@app/components/documents/journalfoerte-documents/document/logiske-vedlegg/editable/edit';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useAddLogiskVedleggMutation } from '@app/redux-api/logiske-vedlegg';
import { LogiskVedlegg } from '@app/types/arkiverte-documents';

interface Props {
  dokumentInfoId: string;
  logiskeVedlegg: LogiskVedlegg[];
  onClose: () => void;
  temaId: string | null;
}

export const CreateLogiskVedlegg = ({ dokumentInfoId, logiskeVedlegg, onClose, temaId }: Props) => {
  const oppgaveId = useOppgaveId();
  const [add, { isLoading }] = useAddLogiskVedleggMutation();

  const onAdd = useCallback(
    (tittel: string) => {
      if (oppgaveId !== skipToken) {
        add({ oppgaveId, dokumentInfoId, tittel });
      }
    },
    [add, dokumentInfoId, oppgaveId],
  );

  return (
    <EditLogiskVedlegg
      onClose={onClose}
      onDone={onAdd}
      logiskeVedlegg={logiskeVedlegg}
      isLoading={isLoading}
      placeholder="Legg til"
      temaId={temaId}
    />
  );
};
