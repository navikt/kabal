import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Heading, Loader } from '@navikt/ds-react';
import React from 'react';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Loading } from '../../loading';
import { ListContainer } from '../styled-components/container';
import { DocumentList } from '../styled-components/document-list';
import { NewDocument } from './new-document';

export const NewDocumentList = () => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading, isFetching } = useGetDocumentsQuery(oppgaveId);

  if (isLoading || typeof data === 'undefined') {
    return <Loader size="xlarge" />;
  }

  const documents = data.filter(({ parentId }) => parentId === null);

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
            attachments={data.filter(({ parentId }) => parentId === document.id)}
            key={document.id}
          />
        ))}
      </DocumentList>
    </ListContainer>
  );
};

const ListHeader = () => {
  const errorMessage = useValidationError('underArbeid');

  if (typeof errorMessage === 'string') {
    return (
      <Heading size="xsmall" level="2">
        Nye dokumenter
        <ExclamationmarkTriangleIcon title={errorMessage} color="#ba3a26" />
      </Heading>
    );
  }

  return (
    <Heading size="xsmall" level="2">
      Nye dokumenter
    </Heading>
  );
};
