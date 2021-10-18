import { Knapp } from 'nav-frontend-knapper';
import React, { useCallback, useRef } from 'react';
import { useCanEdit } from '../../hooks/use-can-edit';
import { useKlagebehandlingId } from '../../hooks/use-klagebehandling-id';
import { useGetKlagebehandlingQuery, useUploadFileMutation } from '../../redux-api/oppgave';

interface UploadFileButtonProps {
  show: boolean;
}

export const UploadFileButton = ({ show }: UploadFileButtonProps) => {
  const [uploadFile, { isLoading }] = useUploadFileMutation();
  const klagebehandlingId = useKlagebehandlingId();
  const { data: klagebehandling } = useGetKlagebehandlingQuery(klagebehandlingId);
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

  if (!show || !canEdit || typeof klagebehandling === 'undefined') {
    return null;
  }

  const hasFile = klagebehandling.resultat.file !== null;

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
