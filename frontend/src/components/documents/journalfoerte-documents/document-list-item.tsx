import React, { memo } from 'react';
import styled from 'styled-components';
import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { Document } from './document/document';

interface Props {
  document: IArkivertDocument;
  isSelected: boolean;
}

export const DocumentListItem = memo(
  ({ document, isSelected }: Props) => (
    <StyledDocumentListItem data-testid="oppgavebehandling-documents-all-list-item" data-documentname={document.tittel}>
      <Document document={document} isSelected={isSelected} />
    </StyledDocumentListItem>
  ),
  (prevProps, nextProps) =>
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.document.valgt === nextProps.document.valgt &&
    prevProps.document.tittel === nextProps.document.tittel &&
    prevProps.document.vedlegg.length === nextProps.document.vedlegg.length &&
    prevProps.document.vedlegg.every((v, index) => {
      const n = nextProps.document.vedlegg[index];

      if (n === undefined) {
        return false;
      }

      return v.valgt === n.valgt && v.tittel === n.tittel && v.dokumentInfoId === n.dokumentInfoId;
    })
);

DocumentListItem.displayName = 'DocumentListItem';

const StyledDocumentListItem = styled.li`
  display: block;
  margin-left: 2px;
  margin-right: 2px;
  border-radius: 4px;
`;
