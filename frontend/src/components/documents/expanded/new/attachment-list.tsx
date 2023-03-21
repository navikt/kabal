import React from 'react';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentsQuery } from '../../../../redux-api/oppgaver/queries/documents';
import { StyledAttachmentList, StyledAttachmentListItem } from '../styled-components/attachment-list';
import { NewDocument } from './new-document';

interface Props {
  parentId: string;
}

export const AttachmentList = ({ parentId }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetDocumentsQuery(oppgaveId);

  if (isLoading || typeof data === 'undefined') {
    return null;
  }

  return (
    <StyledAttachmentList data-testid="new-attachments-list">
      {data
        .filter(({ parent }) => parent === parentId)
        .map((attachment) => (
          <StyledAttachmentListItem
            key={attachment.id}
            data-testid="new-attachments-list-item"
            data-documentname={attachment.tittel}
            data-documentid={attachment.id}
            data-documenttype="attachment"
          >
            <NewDocument document={attachment} />
          </StyledAttachmentListItem>
        ))}
    </StyledAttachmentList>
  );
};
