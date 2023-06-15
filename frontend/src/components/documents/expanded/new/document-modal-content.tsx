import { Heading, Loader } from '@navikt/ds-react';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { SetDocumentType } from '@app/components/documents/expanded/new/set-document-type/set-document-type';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { IMainDocument } from '@app/types/documents/documents';
import { DeleteDocumentButton } from './delete-document-button';
import { FinishDocument } from './finish-document/finish-document';
import { SetParentDocument } from './set-parent-document';

interface Props {
  document: IMainDocument;
  titleId: string;
}

export const DocumentModalContent = ({ document, titleId }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetDocumentsQuery(oppgaveId);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }, []);

  if (isLoading || typeof data === 'undefined') {
    return (
      <Container>
        <Loader size="xlarge" />
      </Container>
    );
  }

  return (
    <Container data-testid="document-actions-container" ref={ref}>
      <StyledHeading level="1" size="medium" spacing id={titleId}>
        Valg for {document.tittel}
      </StyledHeading>
      <SetDocumentType document={document} />
      <SetParentDocument document={document} />
      <FinishDocument document={document} />
      <DeleteDocumentButton document={document} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 640px;
`;

const StyledHeading = styled(Heading)`
  white-space: nowrap;
  margin-right: 64px;
`;
