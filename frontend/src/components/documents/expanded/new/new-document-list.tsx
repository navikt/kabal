import { Warning } from '@navikt/ds-icons';
import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useIsFullfoert } from '../../../../hooks/use-is-fullfoert';
import { useValidationError } from '../../../../hooks/use-validation-error';
import { useGetDocumentsQuery } from '../../../../redux-api/oppgaver/queries/documents';
import { StyledDocumentsContainer } from '../styled-components/container';
import { StyledDocumentList } from '../styled-components/document-list';
import { StyledListHeader, StyledListTitle } from '../styled-components/list-header';
import { NewParentDocument } from './new-parent-document';

export const NewDocumentList = () => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetDocumentsQuery(oppgaveId === skipToken ? skipToken : { oppgaveId });
  const isFullfoert = useIsFullfoert();

  if (isLoading || typeof data === 'undefined') {
    return <Loader size="xlarge" />;
  }

  const documents = data.filter(({ parent }) => parent === null);

  if (documents.length === 0) {
    return null;
  }

  return (
    <StyledDocumentsContainer data-testid="new-documents-section">
      <ListHeader isFullfoert={isFullfoert} />
      <StyledDocumentList data-testid="new-documents-list">
        {documents.map((document) => (
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
  const errorMessage = useValidationError('dokument');

  if (isFullfoert) {
    return null;
  }

  if (typeof errorMessage === 'string') {
    return (
      <StyledListHeader>
        <StyledListTitle>
          Dokumenter under arbeid
          <Warning title={errorMessage} color="#ba3a26" />
        </StyledListTitle>
      </StyledListHeader>
    );
  }

  return (
    <StyledListHeader>
      <StyledListTitle>Dokumenter under arbeid</StyledListTitle>
    </StyledListHeader>
  );
};
