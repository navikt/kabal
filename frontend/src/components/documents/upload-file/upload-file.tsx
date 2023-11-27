import React, { useState } from 'react';
import { styled } from 'styled-components';
import { UploadFileButton } from '@app/components/upload-file-button/upload-file-button';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { DistribusjonsType } from '@app/types/documents/documents';
import { SetDocumentType } from './document-type';

export const UploadFile = () => {
  const { data: oppgave } = useOppgave();
  const isFeilregistrert = useIsFeilregistrert();
  const hasDocumentsAccess = useHasDocumentsAccess();
  const [dokumentTypeId, setDokumentTypeId] = useState<DistribusjonsType>(DistribusjonsType.NOTAT);

  const onChangeDocumentType = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    if (isDocumentType(target.value)) {
      setDokumentTypeId(target.value);
    }
  };

  if (!hasDocumentsAccess || isFeilregistrert || typeof oppgave === 'undefined') {
    return null;
  }

  return (
    <Container>
      <SetDocumentType dokumentTypeId={dokumentTypeId} setDokumentTypeId={onChangeDocumentType} />

      <UploadFileButton
        variant="secondary"
        size="small"
        data-testid="upload-document"
        dokumentTypeId={dokumentTypeId}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const isDocumentType = (type: string): type is DistribusjonsType =>
  Object.values(DistribusjonsType).some((t) => t === type);
