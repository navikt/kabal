import React, { useContext } from 'react';
import { DocumentTypeEnum } from '../../../show-document/types';
import { ShownDocumentContext } from '../../context';
import { ViewDocumentButton } from '../styled-components/document';

interface Props {
  id: string;
  title: string;
  isSmartDokument: boolean;
}

export const OpenDocumentButton = ({ id, title, isSmartDokument }: Props) => {
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);

  const onClick = () =>
    setShownDocument({
      title,
      type: isSmartDokument ? DocumentTypeEnum.SMART : DocumentTypeEnum.FILE,
      documentId: id,
    });

  const isActive =
    shownDocument !== null && shownDocument.type !== DocumentTypeEnum.ARCHIVED && shownDocument.documentId === id;

  return (
    <ViewDocumentButton isActive={isActive} tilknyttet={true} onClick={onClick}>
      {title}
    </ViewDocumentButton>
  );
};
