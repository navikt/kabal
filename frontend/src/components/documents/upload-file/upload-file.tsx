import { UploadFileButton } from '@app/components/upload-file-button/upload-file-button';
import { useHasUploadAccess } from '@app/hooks/use-has-documents-access';
import { DISTRIBUSJONSTYPER, type DistribusjonsType } from '@app/types/documents/documents';
import { HStack } from '@navikt/ds-react';
import { useCallback, useState } from 'react';
import { SetDistributionType } from './distribution-type';

export const UploadFile = () => {
  const hasUploadAccess = useHasUploadAccess();
  const [distributionType, setDistributionType] = useState<DistribusjonsType | null>(null);

  const onChangeDocumentType = useCallback(({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    if (isDistributionType(target.value)) {
      setDistributionType(target.value);
    }
  }, []);

  if (!hasUploadAccess) {
    return null;
  }

  return (
    <HStack align="center" gap="2">
      <SetDistributionType distributionType={distributionType} setDistributionType={onChangeDocumentType} />

      <UploadFileButton
        variant="secondary"
        size="small"
        data-testid="upload-document"
        distributionType={distributionType}
      />
    </HStack>
  );
};

const isDistributionType = (type: string): type is DistribusjonsType => DISTRIBUSJONSTYPER.some((t) => t === type);
