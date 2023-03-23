import { Warning } from '@navikt/ds-icons';
import { Heading, Loader } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { StyledDocumentsContainer } from '../styled-components/container';
import { StyledDocumentList } from '../styled-components/document-list';
import { NewDocumentsStyledListHeader } from '../styled-components/list-header';
import { NewParentDocument } from './new-parent-document';

export const NewDocumentList = () => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetDocumentsQuery(oppgaveId);
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
  const errorMessage = useValidationError('underArbeid');

  if (isFullfoert) {
    return null;
  }

  if (typeof errorMessage === 'string') {
    return (
      <NewDocumentsStyledListHeader>
        <StyledHeading size="xsmall" level="2">
          Dokumenter under arbeid
          <Warning title={errorMessage} color="#ba3a26" />
        </StyledHeading>
      </NewDocumentsStyledListHeader>
    );
  }

  return (
    <NewDocumentsStyledListHeader>
      <Heading size="xsmall" level="2">
        Dokumenter under arbeid
      </Heading>
    </NewDocumentsStyledListHeader>
  );
};

const StyledHeading = styled(Heading)`
  display: flex;
  align-items: center;
  gap: 8px;
`;
