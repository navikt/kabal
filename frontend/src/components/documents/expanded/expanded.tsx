import { Back } from '@navikt/ds-icons';
import React from 'react';
import styled from 'styled-components';
import { DocumentsHeader, DocumentsTitle, ExpandCollapseButton } from '../styled-components/header';
import { JournalfoerteDocumentList } from './journalfoerte-documents/journalfoerte-document-list';
import { NewDocumentList } from './new/new-document-list';
import { UploadFileButton } from './upload-file-button';

interface Props {
  toggleExpanded: () => void;
}

export const ExpandedDocuments = ({ toggleExpanded }: Props) => (
  <StyledExpandedDocumentsContainer>
    <DocumentsHeader>
      <DocumentsTitle>Dokumenter</DocumentsTitle>
      <UploadFileButton />
      <ExpandCollapseButton onClick={toggleExpanded} data-testid="oppgavebehandling-documents-toggle-view-button">
        <Back />
      </ExpandCollapseButton>
    </DocumentsHeader>
    <NewDocumentList />
    <JournalfoerteDocumentList />
  </StyledExpandedDocumentsContainer>
);

const StyledExpandedDocumentsContainer = styled.section`
  display: flex;
  flex-direction: column;
  width: 760px;
`;
