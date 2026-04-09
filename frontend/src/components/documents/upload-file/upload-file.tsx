import { HStack } from '@navikt/ds-react';
import { useCallback, useState } from 'react';
import { SetDistributionType } from '@/components/documents/upload-file/distribution-type';
import { UploadFileButton } from '@/components/upload-file-button/upload-file-button';
import { DuaActionEnum } from '@/hooks/dua-access/access';
import { useCreatorRole } from '@/hooks/dua-access/use-creator-role';
import { useDuaAccess } from '@/hooks/dua-access/use-dua-access';
import { DISTRIBUSJONSTYPER, type DistribusjonsType, DocumentTypeEnum } from '@/types/documents/documents';

export const UploadFile = () => {
  const creatorRole = useCreatorRole();
  const uploadAccessError = useDuaAccess(
    { creator: { creatorRole }, type: DocumentTypeEnum.UPLOADED },
    DuaActionEnum.CREATE,
  );
  const [distributionType, setDistributionType] = useState<DistribusjonsType | null>(null);

  const onChangeDocumentType = useCallback(({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    if (isDistributionType(target.value)) {
      setDistributionType(target.value);
    }
  }, []);

  if (uploadAccessError !== null) {
    return null;
  }

  return (
    <HStack align="center" gap="space-8">
      <SetDistributionType distributionType={distributionType} setDistributionType={onChangeDocumentType} />

      <UploadFileButton
        variant="secondary-neutral"
        size="small"
        distributionType={distributionType}
      />
    </HStack>
  );
};

const isDistributionType = (type: string): type is DistribusjonsType => DISTRIBUSJONSTYPER.some((t) => t === type);
