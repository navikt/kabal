import { Loader } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { IMainDocument } from '@app/types/documents/documents';
import { DeleteDocumentButton } from './delete-document-button';
import { FinishDocument } from './finish-document/finish-document';
import { SetParentDocument } from './set-parent-document';

interface Props {
  document: IMainDocument;
}

export const DocumentOptions = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetDocumentsQuery(oppgaveId);

  if (isLoading || typeof data === 'undefined') {
    return (
      <Container>
        <Loader size="xlarge" />
      </Container>
    );
  }

  return (
    <Container data-testid="document-actions-container">
      <SetParentDocument document={document} />
      <FinishDocument document={document} />
      <DeleteDocumentButton document={document} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: absolute;
  z-index: 5;
  background-color: #c9c9c9;
  border: 1px solid rgba(201, 201, 201, 0.3);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 4px;
  right: 0;
  top: 100%;

  &::before {
    content: '';
    position: absolute;
    right: 11px;
    top: -7.5px;
    width: 15px;
    height: 15px;
    background-color: #c9c9c9;
    transform: rotate(45deg);
    border-left: 1px solid rgba(201, 201, 201, 0.3);
    border-top: 1px solid rgba(201, 201, 201, 0.3);
  }
`;
