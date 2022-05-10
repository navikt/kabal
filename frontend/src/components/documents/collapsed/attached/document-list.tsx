import React from 'react';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetTilknyttedeDokumenterQuery } from '../../../../redux-api/oppgaver/queries/documents';
import { Loading } from '../../loading';
import { ListContainer, StyledSubHeader } from '../styled-components/container';
import { DocumentList } from '../styled-components/document-list';
import { AttachedDocument } from './document';

export const AttachedDocumentList = () => {
  const oppgaveId = useOppgaveId();
  const { data: lagredeTilknyttedeDokumenter, isLoading, isFetching } = useGetTilknyttedeDokumenterQuery(oppgaveId);
  const documents = lagredeTilknyttedeDokumenter?.dokumenter ?? [];

  return (
    <ListContainer data-testid="oppgavebehandling-documents-tilknyttede">
      <Loading loading={isLoading || isFetching} />
      <StyledSubHeader>Journalførte dokumenter</StyledSubHeader>
      <DocumentList data-testid="oppgavebehandling-documents-tilknyttede-list">
        {documents.map((document) => (
          <AttachedDocument key={document.journalpostId + document.dokumentInfoId} document={document} />
        ))}
      </DocumentList>
    </ListContainer>
  );
};
