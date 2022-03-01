import React from 'react';
import { IMainDocument } from '../../../../types/documents';
import { StyledDocumentListItem } from '../styled-components/document-list';
import { AttachmentList } from './attachment-list';
import { NewDocument } from './new-document';

interface Props {
  document: IMainDocument;
}

export const NewParentDocument = ({ document }: Props) => (
  <StyledDocumentListItem
    data-testid="new-documents-list-item"
    data-documentname={document.tittel}
    data-documentid={document.id}
    data-documenttype="parent"
  >
    <NewDocument document={document} />
    <AttachmentList parentId={document.id} />
  </StyledDocumentListItem>
);
