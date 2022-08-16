import { Warning } from '@navikt/ds-icons';
import { Heading, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useValidationError } from '../../../../hooks/use-validation-error';
import { useGetDocumentsQuery } from '../../../../redux-api/oppgaver/queries/documents';
import { Loading } from '../../loading';
import { ListContainer } from '../styled-components/container';
import { DocumentList } from '../styled-components/document-list';
import { NewDocument } from './new-document';

export const NewDocumentList = () => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading, isFetching } = useGetDocumentsQuery(oppgaveId === skipToken ? skipToken : { oppgaveId });

  if (isLoading || typeof data === 'undefined') {
    return <Loader size="xlarge" />;
  }

  const documents = data.filter(({ parent }) => parent === null);

  if (documents.length === 0) {
    return null;
  }

  return (
    <ListContainer data-testid="oppgavebehandling-documents-tilknyttede">
      <ListHeader />
      <Loading loading={isLoading || isFetching} />
      <DocumentList data-testid="oppgavebehandling-documents-tilknyttede-list">
        {documents.map((document) => (
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

const ListHeader = () => {
  const errorMessage = useValidationError('dokument');

  if (typeof errorMessage === 'string') {
    return (
      <Heading size="xsmall" level="2">
        Nye dokumenter
        <Warning title={errorMessage} color="#ba3a26" />
      </Heading>
    );
  }

  return (
    <Heading size="xsmall" level="2">
      Nye dokumenter
    </Heading>
  );
};
