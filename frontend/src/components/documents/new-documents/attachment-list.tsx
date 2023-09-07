import React from 'react';
import { NewDocument } from '@app/components/documents/new-documents/new-document/new-document';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { IMainDocument } from '@app/types/documents/documents';
import { StyledAttachmentList, StyledAttachmentListItem } from '../styled-components/attachment-list';

interface Props {
  parentDocument: IMainDocument;
}

export const AttachmentList = ({ parentDocument }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetDocumentsQuery(oppgaveId);

  if (isLoading || typeof data === 'undefined') {
    return null;
  }

  return (
    <StyledAttachmentList data-testid="new-attachments-list">
      {data
        .filter((d) => d.parentId === parentDocument.id)
        .map((attachment) => (
          <StyledAttachmentListItem
            key={attachment.id}
            data-testid="new-attachments-list-item"
            data-documentname={attachment.tittel}
            data-documentid={attachment.id}
            data-documenttype="attachment"
          >
            <NewDocument document={attachment} parentDocument={parentDocument} />
          </StyledAttachmentListItem>
        ))}
    </StyledAttachmentList>
  );
};
