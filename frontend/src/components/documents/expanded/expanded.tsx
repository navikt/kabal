import { ChevronLeftIcon } from '@navikt/aksel-icons';
import React from 'react';
import styled from 'styled-components';
import { useDocumentsExpanded } from '@app/hooks/settings/use-setting';
import { DocumentsHeader, DocumentsTitle, ExpandCollapseButton } from '../styled-components/header';
import { JournalfoerteDocumentList } from './journalfoerte-documents/journalfoerte-document-list';
import { NewDocumentList } from './new/new-document-list';
import { UploadFileButton } from './upload-file/upload-file';

export const ExpandedDocuments = () => {
  const { value = false, setValue } = useDocumentsExpanded();

  return (
    <StyledExpandedDocumentsContainer>
      <DocumentsHeader>
        <DocumentsTitle>Dokumenter</DocumentsTitle>
        <UploadFileButton />
        <ExpandCollapseButton onClick={() => setValue(!value)} data-testid="documents-collapse-view-button">
          <ChevronLeftIcon />
        </ExpandCollapseButton>
      </DocumentsHeader>
      <NewDocumentList />
      <JournalfoerteDocumentList />
    </StyledExpandedDocumentsContainer>
  );
};

const StyledExpandedDocumentsContainer = styled.section`
  display: flex;
  flex-direction: column;
  width: 1024px;
  height: 100%;
  overflow-y: hidden;
`;
