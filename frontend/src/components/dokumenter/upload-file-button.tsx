import { Knapp } from 'nav-frontend-knapper';
import React, { useCallback, useRef } from 'react';
import { useCanEdit } from '../../hooks/use-can-edit';
import { useKlagebehandlingId } from '../../hooks/use-klagebehandling-id';
import { useUploadFileMutation } from '../../redux-api/oppgave';

interface UploadFileButtonProps {
  show: boolean;
}

export const UploadFileButton = ({ show }: UploadFileButtonProps) => {
  const [uploadFile, { isLoading }] = useUploadFileMutation();
  const klagebehandlingId = useKlagebehandlingId();
  const canEdit = useCanEdit(klagebehandlingId);

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

      const { files } = event.target;

      if (files === null || files.length !== 1) {
        console.error(`Wrong number of files ${files?.length}.`);
        return;
      }

      const [file] = files;

      uploadFile({
        file,
        klagebehandlingId,
      });

      event.currentTarget.value = '';
    },
    [klagebehandlingId, uploadFile]
  );

  if (!show || !canEdit) {
    return null;
  }

  return (
    <>
      <Knapp onClick={handleClick} disabled={isLoading} mini>
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
