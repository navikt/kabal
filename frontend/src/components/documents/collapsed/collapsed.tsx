import { Next } from '@navikt/ds-icons';
import React from 'react';
import styled from 'styled-components';
import { DocumentsHeader, DocumentsTitle, ExpandCollapseButton } from '../styled-components/header';
import { AttachedDocumentList } from './attached/document-list';
import { NewDocumentList } from './new/new-document-list';

interface Props {
  toggleExpanded: () => void;
}

export const CollapsedDocuments = ({ toggleExpanded }: Props) => (
  <StyledCollapsedContainer>
    <DocumentsHeader>
      <DocumentsTitle>Dokumenter</DocumentsTitle>
      <ExpandCollapseButton onClick={toggleExpanded} data-testid="documents-expand-view-button">
        <Next />
      </ExpandCollapseButton>
    </DocumentsHeader>
    <NewDocumentList />
    <AttachedDocumentList />
  </StyledCollapsedContainer>
);

const StyledCollapsedContainer = styled.section`
  position: relative;
  width: 300px;
`;
