import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentsQuery } from '../../../../redux-api/documents';
import { Loading } from '../../loading';
import { ListContainer, StyledSubHeader } from '../styled-components/container';
import { DocumentList } from '../styled-components/document-list';
import { NewDocument } from './new-document';

export const NewDocumentList = () => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading, isFetching } = useGetDocumentsQuery({ oppgaveId });

  if (isLoading || typeof data === 'undefined') {
    return <NavFrontendSpinner />;
  }

  return (
    <ListContainer data-testid="oppgavebehandling-documents-tilknyttede">
      <StyledSubHeader>Nye dokumenter</StyledSubHeader>
      <Loading loading={isLoading || isFetching} />
      <DocumentList data-testid="oppgavebehandling-documents-tilknyttede-list">
        {data
          .filter(({ parent }) => parent === null)
          .map((document) => (
            <NewDocument
              {...document}
              attachments={data.filter(({ parent }) => parent === document.id)}
              key={document.id}
            />
          ))}
      </DocumentList>
    </ListContainer>
  );
};
