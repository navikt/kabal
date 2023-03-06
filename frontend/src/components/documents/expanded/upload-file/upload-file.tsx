import { Upload } from '@navikt/ds-icons';
import { Button, ErrorMessage } from '@navikt/ds-react';
import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { useOppgave } from '../../../../hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useUploadFileDocumentMutation } from '../../../../redux-api/oppgaver/mutations/documents';
import { DocumentType } from '../../../../types/documents/documents';
import { SetDocumentType } from './document-type';

const MAX_SIZE_BYTES = 8388608;
const MEBI = 1024 * 1024;
const MAX_SIZE_MIB = MAX_SIZE_BYTES / MEBI;

export const UploadFileButton = () => {
  const [uploadFile, { isLoading }] = useUploadFileDocumentMutation();
  const { data: oppgave } = useOppgave();
  const canEdit = useCanEdit();
  const [dokumentTypeId, setDokumentTypeId] = useState<DocumentType | null>(null);
  const [documentTypeError, setDocumentTypeError] = useState<string>();
  const [uploadError, setUploadError] = useState<string>();

  const fileInput = useRef<HTMLInputElement>(null);
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (dokumentTypeId === null) {
        return setDocumentTypeError('Dokumenttype må velges.');
      }

      event.preventDefault();
      fileInput.current?.click();
    },
    [dokumentTypeId]
  );

  const uploadVedlegg = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();

      if (typeof oppgave === 'undefined' || dokumentTypeId === null) {
        return;
      }

      const { files } = event.target;

      if (files === null || files.length !== 1) {
        return setUploadError('Kun én fil kan lastes opp av gangen.');
      }

      const [file] = files;

      if (file === undefined) {
        return setUploadError('Ingen fil valgt.');
      }

      if (file.size > MAX_SIZE_BYTES) {
        return setUploadError(
          `Filstørrelsen (${(
            file.size / MEBI
          ).toLocaleString()} MiB) er større enn maksgrensen på ${MAX_SIZE_MIB.toLocaleString()} MiB.`
        );
      }

      setUploadError(undefined);

      uploadFile({ file, dokumentTypeId, oppgaveId: oppgave.id });

      event.currentTarget.value = '';
    },
    [oppgave, uploadFile, dokumentTypeId]
  );

  const onChangeDocumentType = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    if (isDocumentType(target.value)) {
      setDokumentTypeId(target.value);
      setDocumentTypeError(undefined);
    }
  };

  if (!canEdit || typeof oppgave === 'undefined') {
    return null;
  }

  return (
    <StyledUploadFile>
      <Inputs>
        <SetDocumentType
          dokumentTypeId={dokumentTypeId}
          setDokumentTypeId={onChangeDocumentType}
          error={documentTypeError}
        />

        <StyledUploadButton
          type="button"
          variant="secondary"
          size="small"
          onClick={handleClick}
          disabled={isLoading}
          loading={isLoading}
          data-testid="upload-document-button"
        >
          <Upload /> Last opp dokument
        </StyledUploadButton>

        <input
          data-testid="upload-document-input"
          type="file"
          accept="application/pdf, image/jpeg, image/png"
          ref={fileInput}
          onChange={uploadVedlegg}
          style={{ display: 'none' }}
          disabled={isLoading}
        />
      </Inputs>
      {typeof uploadError === 'undefined' ? null : <ErrorMessage>{uploadError}</ErrorMessage>}
    </StyledUploadFile>
  );
};

const StyledUploadButton = styled(Button)`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  height: fit-content;

  & > * {
    height: fit-content;
  }
`;

const StyledUploadFile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const isDocumentType = (type: string): type is DocumentType => Object.values(DocumentType).some((t) => t === type);
