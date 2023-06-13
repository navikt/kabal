import React, { useMemo } from 'react';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { ViewDocumentButton } from '../styled-components/document';

interface Props {
  id: string;
  title: string;
  isSmartDokument: boolean;
}

export const OpenDocumentButton = ({ id, title, isSmartDokument }: Props) => {
  const { value, setValue } = useDocumentsPdfViewed();

  const onClick = () =>
    setValue({
      type: isSmartDokument ? DocumentTypeEnum.SMART : DocumentTypeEnum.UPLOADED,
      documentId: id,
    });

  const isActive = useMemo(
    () => value.some((v) => v.type !== DocumentTypeEnum.JOURNALFOERT && v.documentId === id),
    [id, value]
  );

  return (
    <ViewDocumentButton isActive={isActive} tilknyttet={true} onClick={onClick}>
      {title}
    </ViewDocumentButton>
  );
};
