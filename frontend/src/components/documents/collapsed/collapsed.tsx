import { Next } from '@navikt/ds-icons';
import React from 'react';
import styled from 'styled-components';
import { useDocumentsExpanded } from '@app/hooks/settings/use-setting';
import { DocumentsHeader, DocumentsTitle, ExpandCollapseButton } from '../styled-components/header';
import { AttachedDocumentList } from './attached/document-list';
import { NewDocumentList } from './new/new-document-list';

export const CollapsedDocuments = () => {
  const { value = false, setValue } = useDocumentsExpanded();

  return (
    <StyledCollapsedContainer>
      <DocumentsHeader>
        <DocumentsTitle>Dokumenter</DocumentsTitle>
        <ExpandCollapseButton onClick={() => setValue(!value)} data-testid="documents-expand-view-button">
          <Next />
        </ExpandCollapseButton>
      </DocumentsHeader>
      <NewDocumentList />
      <AttachedDocumentList />
    </StyledCollapsedContainer>
  );
};

const StyledCollapsedContainer = styled.section`
  position: relative;
  width: 300px;
`;
