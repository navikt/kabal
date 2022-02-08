import React from 'react';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentsQuery } from '../../../../redux-api/documents';
import { StyledAttachmentList, StyledAttachmentListItem } from '../styled-components/attachment-list';
import { NewDocument } from './new-document';

interface Props {
  parentId: string;
}

export const AttachmentList = ({ parentId }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetDocumentsQuery({ oppgaveId });

  if (isLoading || typeof data === 'undefined') {
    return null;
  }

  return (
    <StyledAttachmentList data-testid="oppgavebehandling-documents-new-attachment-list">
      {data
        .filter(({ parent }) => parent === parentId)
        .map((attachment) => (
          <StyledAttachmentListItem key={attachment.id}>
            <NewDocument document={attachment} />
          </StyledAttachmentListItem>
        ))}
    </StyledAttachmentList>
  );
};
