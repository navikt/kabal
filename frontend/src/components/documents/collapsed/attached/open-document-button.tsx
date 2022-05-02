import React, { useContext } from 'react';
import { DocumentTypeEnum } from '../../../show-document/types';
import { ShownDocumentContext } from '../../context';
import { ViewDocumentButton } from '../styled-components/document';

interface Props {
  title: string;
  journalpostId: string;
  dokumentInfoId: string;
  valgt: boolean;
}

export const OpenDocumentButton = ({ dokumentInfoId, journalpostId, title, valgt }: Props) => {
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);

  const onClick = () =>
    setShownDocument({
      title,
      dokumentInfoId,
      journalpostId,
      type: DocumentTypeEnum.ARCHIVED,
    });

  const isActive =
    shownDocument !== null &&
    shownDocument.type === DocumentTypeEnum.ARCHIVED &&
    shownDocument.dokumentInfoId === dokumentInfoId &&
    shownDocument.journalpostId === journalpostId;

  return (
    <ViewDocumentButton isActive={isActive} tilknyttet={valgt} onClick={onClick}>
      {title}
    </ViewDocumentButton>
  );
};
