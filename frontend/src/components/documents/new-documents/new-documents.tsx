import { Loader } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { ListHeader } from '@app/components/documents/new-documents/header/header';
import { DocumentModal } from '@app/components/documents/new-documents/modal/modal';
import { ModalContextElement } from '@app/components/documents/new-documents/modal/modal-context';
import { commonStyles } from '@app/components/documents/styled-components/container';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { StyledDocumentList } from '../styled-components/document-list';
import { NewParentDocument } from './new-parent-document';

export const NewDocuments = () => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetDocumentsQuery(oppgaveId);

  if (isLoading || typeof data === 'undefined') {
    return <Loader size="xlarge" />;
  }

  const documents = data.filter(({ parentId }) => parentId === null);

  if (documents.length === 0) {
    return null;
  }

  return (
    <StyledDocumentsContainer data-testid="new-documents-section">
      <ModalContextElement>
        <ListHeader />
        <StyledDocumentList data-testid="new-documents-list">
          {documents.map((d) => (
            <NewParentDocument document={d} key={d.id} />
          ))}
        </StyledDocumentList>
        <DocumentModal />
      </ModalContextElement>
    </StyledDocumentsContainer>
  );
};

const StyledDocumentsContainer = styled.section`
  ${commonStyles}
  max-height: calc(50% - 100px);
`;
