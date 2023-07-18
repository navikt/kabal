import { UploadIcon } from '@navikt/aksel-icons';
import { Button, ErrorMessage } from '@navikt/ds-react';
import React, { useCallback, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useUploadFileDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DistribusjonsType } from '@app/types/documents/documents';
import { SetDocumentType } from './document-type';

const MEBI = 1024 * 1024;
const MAX_SIZE_MIB = 8;
// const MAX_SIZE_BYTES = MAX_SIZE_MIB * MEBI - 288;
const MAX_SIZE_BYTES = MAX_SIZE_MIB * MEBI;

export const UploadFileButton = () => {
  const [uploadFile, { isLoading }] = useUploadFileDocumentMutation();
  const { data: oppgave } = useOppgave();
  const canEdit = useCanEdit();
  const [dokumentTypeId, setDokumentTypeId] = useState<DistribusjonsType | null>(null);
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
    [dokumentTypeId],
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
          ).toLocaleString()} MiB) er større enn maksgrensen på ${MAX_SIZE_MIB.toLocaleString()} MiB.`,
        );
      }

      setUploadError(undefined);

      uploadFile({ file, dokumentTypeId, oppgaveId: oppgave.id });

      event.currentTarget.value = '';
    },
    [oppgave, uploadFile, dokumentTypeId],
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
    <Container>
      <SetDocumentType
        dokumentTypeId={dokumentTypeId}
        setDokumentTypeId={onChangeDocumentType}
        error={documentTypeError}
      />

      <Button
        type="button"
        variant="secondary"
        size="small"
        onClick={handleClick}
        disabled={isLoading}
        loading={isLoading}
        data-testid="upload-document-button"
      >
        <UploadIcon /> Last opp dokument
      </Button>

      <input
        data-testid="upload-document-input"
        type="file"
        accept="application/pdf, image/jpeg, image/png"
        ref={fileInput}
        onChange={uploadVedlegg}
        style={{ display: 'none' }}
        disabled={isLoading}
      />
      {typeof uploadError === 'undefined' ? null : <ErrorMessage>{uploadError}</ErrorMessage>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const isDocumentType = (type: string): type is DistribusjonsType =>
  Object.values(DistribusjonsType).some((t) => t === type);
