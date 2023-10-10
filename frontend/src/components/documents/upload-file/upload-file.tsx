import React, { useState } from 'react';
import { styled } from 'styled-components';
import { UploadFileButton } from '@app/components/upload-file-button/upload-file-button';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { DistribusjonsType } from '@app/types/documents/documents';
import { SetDocumentType } from './document-type';

export const UploadFile = () => {
  const { data: oppgave } = useOppgave();
  const canEdit = useCanEdit();
  const [dokumentTypeId, setDokumentTypeId] = useState<DistribusjonsType | null>(null);
  const [documentTypeError, setDocumentTypeError] = useState<string>();

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

      <UploadFileButton
        variant="secondary"
        size="small"
        data-testid="upload-document"
        dokumentTypeId={dokumentTypeId}
        setDocumentTypeError={setDocumentTypeError}
      />
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
