import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useIsFullfoert } from '../../../../hooks/use-is-fullfoert';
import { useGetDocumentsQuery } from '../../../../redux-api/documents';
import { StyledDocumentsContainer } from '../styled-components/container';
import { StyledDocumentList } from '../styled-components/document-list';
import { StyledListHeader, StyledListTitle } from '../styled-components/list-header';
import { NewParentDocument } from './new-parent-document';

export const NewDocumentList = () => {
  const oppgaveId = useOppgaveId();

  const { data, isLoading } = useGetDocumentsQuery({ oppgaveId });

  const isFullfoert = useIsFullfoert();

  if (isLoading || typeof data === 'undefined') {
    return <NavFrontendSpinner />;
  }

  return (
    <StyledDocumentsContainer data-testid="oppgavebehandling-documents-new">
      <ListHeader isFullfoert={isFullfoert} />
      <StyledDocumentList data-testid="oppgavebehandling-documents-new-list">
        {data
          .filter(({ parent }) => parent === null)
          .map((document) => (
            <NewParentDocument document={document} key={document.id} />
          ))}
      </StyledDocumentList>
    </StyledDocumentsContainer>
  );
};

interface ListHeaderProps {
  isFullfoert: boolean;
}

const ListHeader = ({ isFullfoert }: ListHeaderProps) => {
  if (isFullfoert) {
    return null;
  }

  return (
    <StyledListHeader>
      <StyledListTitle>Dokumenter under arbeid</StyledListTitle>
    </StyledListHeader>
  );
};
