import { Knapp } from 'nav-frontend-knapper';
import React, { useCallback, useRef } from 'react';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '../../hooks/use-can-edit';
import { useOppgaveId } from '../../hooks/use-oppgave-id';
import { useUploadFileMutation } from '../../redux-api/oppgavebehandling';

interface UploadFileButtonProps {
  show: boolean;
}

export const UploadFileButton = ({ show }: UploadFileButtonProps) => {
  const [uploadFile, { isLoading }] = useUploadFileMutation();
  const oppgaveId = useOppgaveId();
  const { data: oppgavebehandling } = useOppgave();
  const canEdit = useCanEdit();

  const fileInput = useRef<HTMLInputElement>(null);
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      fileInput.current?.click();
    },
    [fileInput]
  );

  const uploadVedlegg = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();

      if (typeof oppgavebehandling === 'undefined') {
        return;
      }

      const { files } = event.target;

      if (files === null || files.length !== 1) {
        console.error(`Wrong number of files ${files?.length}.`);
        return;
      }

      const [file] = files;

      uploadFile({
        file,
        oppgaveId,
        type: oppgavebehandling.type,
      });

      event.currentTarget.value = '';
    },
    [oppgaveId, uploadFile, oppgavebehandling]
  );

  if (!show || !canEdit || typeof oppgavebehandling === 'undefined') {
    return null;
  }

  const hasFile = oppgavebehandling.resultat.file !== null;

  return (
    <>
      <Knapp
        onClick={handleClick}
        disabled={isLoading || hasFile}
        mini
        data-testid="klagebehandling-documents-upload-button"
      >
        Last opp dokument
      </Knapp>
      <input
        type="file"
        accept=".pdf"
        ref={fileInput}
        onChange={uploadVedlegg}
        style={{ display: 'none' }}
        disabled={isLoading}
      />
    </>
  );
};
