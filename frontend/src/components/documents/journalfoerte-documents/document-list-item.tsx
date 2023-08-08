import React from 'react';
import { styled } from 'styled-components';
import { IJournalpostReference } from '@app/types/documents/documents';
import { Document } from './document/document';

interface Props {
  journalpostReference: IJournalpostReference;
  isSelected: boolean;
}

export const DocumentListItem = ({ journalpostReference, isSelected }: Props) => (
  <StyledDocumentListItem data-testid="oppgavebehandling-documents-all-list-item">
    <Document journalpostReference={journalpostReference} isSelected={isSelected} />
  </StyledDocumentListItem>
);

const StyledDocumentListItem = styled.li`
  display: block;
  margin-left: 2px;
  margin-right: 2px;
  border-radius: 4px;
`;
