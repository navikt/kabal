import { UploadFileButton } from '@app/components/upload-file-button/upload-file-button';
import { useHasUploadAccess } from '@app/hooks/use-has-documents-access';
import { DistribusjonsType } from '@app/types/documents/documents';
import { useCallback, useState } from 'react';
import { styled } from 'styled-components';
import { SetDocumentType } from './document-type';

export const UploadFile = () => {
  const hasUploadAccess = useHasUploadAccess();
  const [dokumentTypeId, setDokumentTypeId] = useState<DistribusjonsType | null>(null);

  const onChangeDocumentType = useCallback(({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    if (isDocumentType(target.value)) {
      setDokumentTypeId(target.value);
    }
  }, []);

  if (!hasUploadAccess) {
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
  gap: var(--a-spacing-2);
`;

const isDocumentType = (type: string): type is DistribusjonsType =>
  Object.values(DistribusjonsType).some((t) => t === type);
