import { FileContent, Notes } from '@navikt/ds-icons';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { IMainDocument } from '../../../../types/documents/documents';
import { DocumentTypeEnum } from '../../../show-document/types';
import { ShownDocumentContext } from '../../context';
import { StyledDocumentButton } from '../../styled-components/document-button';
import { StyledDocumentTitle } from '../styled-components/document';
import { EditButton } from './document-title-edit-button';
import { SetFilename } from './set-filename';

interface Props {
  document: IMainDocument;
}

export const DocumentTitle = ({ document }: Props) => {
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);
  const [editMode, setEditMode] = useState(false);

  const isActive =
    shownDocument !== null &&
    shownDocument.type !== DocumentTypeEnum.ARCHIVED &&
    shownDocument.documentId === document.id;

  useEffect(() => {
    if (isActive) {
      setShownDocument({
        title: document.tittel,
        type: document.isSmartDokument ? DocumentTypeEnum.SMART : DocumentTypeEnum.FILE,
        documentId: document.id,
      });
    }
  }, [isActive, document.tittel, document.id, setShownDocument, document.isSmartDokument]);

  if (editMode) {
    return (
      <StyledDocumentTitle>
        <SetFilename document={document} onDone={() => setEditMode(false)} />
        <EditButton isMarkertAvsluttet={document.isMarkertAvsluttet} editMode={editMode} setEditMode={setEditMode} />
      </StyledDocumentTitle>
    );
  }

  const onClick = () =>
    setShownDocument({
      title: document.tittel,
      type: document.isSmartDokument ? DocumentTypeEnum.SMART : DocumentTypeEnum.FILE,
      documentId: document.id,
    });

  const Icon = document.isSmartDokument ? StyledNotes : StyledFileContent;

  return (
    <StyledDocumentTitle>
      <StyledDocumentButton isActive={isActive} onClick={onClick} data-testid="document-open-button">
        <Icon />
        <EllipsisTitle>{document.tittel}</EllipsisTitle>
      </StyledDocumentButton>
      <EditButton isMarkertAvsluttet={document.isMarkertAvsluttet} editMode={editMode} setEditMode={setEditMode} />
    </StyledDocumentTitle>
  );
};

const StyledNotes = styled(Notes)`
  flex-shrink: 0;
`;

const StyledFileContent = styled(FileContent)`
  flex-shrink: 0;
`;

const EllipsisTitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;
