import React from 'react';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { DocumentTypeEnum } from '../../../show-document/types';
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
      type: isSmartDokument ? DocumentTypeEnum.SMART : DocumentTypeEnum.FILE,
      documentId: id,
    });

  const isActive = typeof value !== 'undefined' && value.type !== DocumentTypeEnum.ARCHIVED && value.documentId === id;

  return (
    <ViewDocumentButton isActive={isActive} tilknyttet={true} onClick={onClick}>
      {title}
    </ViewDocumentButton>
  );
};
